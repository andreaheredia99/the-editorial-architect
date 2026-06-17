from sqlalchemy import Column, Integer, String
from app.database import Base

# importamos modelo base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(20), default="editor", nullable=False) # Admin los creamos manualmente
