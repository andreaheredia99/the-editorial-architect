from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models.user import User
from app.models.item import Item
from app.routers.items import router as items_router

from app.routers.auth import router as auth_router

# crear app FastAPI
app = FastAPI()

# SQL crea todas las tablas que no existan, NO las modifica
Base.metadata.create_all(bind=engine)

# CORS (no confia en la conexion, bloquea)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# conecta auth.py con FastAPI
app.include_router(auth_router)

# conectamos ruta items
app.include_router(items_router, prefix="/items", tags=["Items"])
