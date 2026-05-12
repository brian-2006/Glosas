from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum
from app.models.aseguradora import Aseguradora


class RolUsuario(str, Enum):
    admin = "admin"
    aseguradora = "aseguradora"


class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str 
    email: str = Field(unique=True)
    password: str
    rol: RolUsuario
    id_aseguradora: Optional[int] = Field(default=None, foreign_key="aseguradora.id")
