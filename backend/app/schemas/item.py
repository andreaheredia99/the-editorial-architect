from pydantic import BaseModel


# datos que llegan desde frontend (para crear items nuevos)
class ItemCreate(BaseModel):
    title: str
    description: str
    category: str


# datos que devuelve backend (respuesta backend)
class ItemResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    owner_id: int

    class Config:
        # permite a pydantic convertir objetos SQLAlchemy automáticamente, sino daría error
        from_attributes = True
