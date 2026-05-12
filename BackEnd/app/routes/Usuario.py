from fastapi import APIRouter, Depends, HTTPException
from app.services.Usuario import UsuarioService
from app.schema.Usuario import LoginRequest, LoginResponse, CreateUserRequest

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=LoginResponse)
def login(
    credentials: LoginRequest,
    usuario_service: UsuarioService = Depends()
):

    try:
        result = usuario_service.login(credentials.email, credentials.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/create-user")
def create_user(
    data: CreateUserRequest,
    usuario_service: UsuarioService = Depends()
):
    try:
        usuario = usuario_service.create_usuario(
            data.name,
            data.email,
            data.password,
            data.rol,
            data.id_aseguradora
        )
        return usuario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
