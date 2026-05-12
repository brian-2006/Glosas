from pydantic import BaseModel
from enum import Enum

class RolUsuarioEnum(str, Enum):
    admin = "admin"
    aseguradora = "aseguradora"

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    id: int
    nombre: str
    email: str
    rol: RolUsuarioEnum
    token: str
    id_aseguradora: int | None = None

class CreateUserRequest(BaseModel):
    name: str
    email: str
    password: str
    rol: RolUsuarioEnum
    id_aseguradora: int | None = None

