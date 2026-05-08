from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Item(Base):

    # nombre tabla MySQL
    __tablename__ = "items"

    # id único
    id = Column(Integer, primary_key=True, index=True)

    # título obligatorio
    title = Column(String(255), nullable=False)

    # descripción opcional
    description = Column(String(1000))

    # id del usuario propietario
    owner_id = Column(Integer, ForeignKey("users.id"))

    # conectamos owner con la tabla User
    owner = relationship("User")
