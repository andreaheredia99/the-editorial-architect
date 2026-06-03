from passlib.context import CryptContext
from jose import JWTError, jwt


from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User

# JWTError, captura tokens inválidos
# jwt, crear y leer tokens

# cómo se harán los hashes
# bcrypt, algoritmo hashing
# deprecated="auto", si cambiamos algoritmo passlib gestionará compatibilidad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# convierte password en hash
def hash_password(password: str):
    return pwd_context.hash(password)


# compara password con hash
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# configuración JWT
# SECRET_KEY, firma criptográfica JWT
# CLAVE NO DEBE SUBIRSE A GITHUB
SECRET_KEY = "mi_clave_secreta"

# ALGORITHM, algoritmo JWT más usado con FastAPI
ALGORITHM = "HS256"

# EXPIRE_MINUTES, cuánto dura el login
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# convierte datos usuario en JWT firmado
# recibe datos a guardar dentro del token
def create_access_token(data: dict):

    # copia datos originales
    to_encode = data.copy()

    # fecha expiración token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # para que caduque el token
    to_encode.update({"exp": expire})

    # crea JWT firmado
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # devuelve jwt encriptado
    return encoded_jwt


# leer JWT recibido del frontend
def decode_token(token: str):
    try:
        # verifica y decofica token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        return payload

    except JWTError:
        return None


# leer JWT desde Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# obtener usuario autenticado actual
def get_current_user(
    # FastAPI lee Authorization header, extrae JWT y lo guarda en token
    token: str = Depends(oauth2_scheme),
    # abrimos conexión mySQL
    db: Session = Depends(get_db),
):
    # decodificar JWT
    payload = decode_token(token)

    # token inválido
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    # obtener email ("sub"), subject (sujeto) guardado JWT
    email = payload.get("sub")

    # buscar usuario BBDD
    user = db.query(User).filter(User.email == email).first()

    # usuario no existe
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
