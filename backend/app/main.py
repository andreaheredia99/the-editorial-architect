from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models.user import User

from app.routers.auth import router as auth_router

app = FastAPI()

# conecta auth.py con FastAPI
app.include_router(auth_router)

# SQL crea todas las tablas que no existan
Base.metadata.create_all(bind=engine)

# CORS (no confia en la conexion, bloquea)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Endpoint
@app.get("/items")
def get_items():
    return [{"id": 1, "title": "First article"}, {"id": 2, "title": "Second article"}]


# Usuario prueba
test_user = {"email": "test@gmail.com", "password": "1234"}


# LOGIN
@app.post("/login")
def login(user: dict):
    if (
        user["email"] == test_user["email"]
        and user["password"] == test_user["password"]
    ):
        return {"access_token": "test-jwt-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
