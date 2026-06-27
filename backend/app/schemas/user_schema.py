from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    class Config: 
        # permite leer datos directamente de los atributos, en ves de acceder uno por uno
        from_attributes = True