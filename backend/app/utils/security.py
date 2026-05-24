from passlib.context import CryptContext
from jose import JWTError, jwt

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
