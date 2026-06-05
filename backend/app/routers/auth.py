from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin

from fastapi import HTTPException

from app.utils.security import hash_password, verify_password, create_access_token

# crea grupo de rutas/endpoints
router = APIRouter()


# ENDPOINT crear usuario
@router.post("/register")
def register(user: UserCreate):
    # abre conexión con mysql
    db: Session = SessionLocal()
    # creamos objeto
    new_user = User(email=user.email, password=hash_password(user.password))
    # prepara insert SQL
    db.add(new_user)
    # guarda en MYSQL
    db.commit()
    # actualiza con datos reales de BD
    db.refresh(new_user)

    return {"message": "User create", "email": new_user.email}


# ENDPOINT login usuario
@router.post("/login")
def login(user: UserLogin):
    db: Session = SessionLocal()

    # busca email en BD devuelve primer resultado o none
    existing_user = db.query(User).filter(User.email == user.email).first()

    # usuario no existe en BD
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # usuario existe, contraseña incorrecta
    if not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # usuario existe, contraseña correcta
    access_token = create_access_token(data={"sub": existing_user.email})

    return {"access_token": access_token, "token_type": "bearer"}
