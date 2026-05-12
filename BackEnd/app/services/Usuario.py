from sqlmodel import Session, select
from app.models.usuario import Usuario
from app.database.connection import get_db
from fastapi import Depends
from sqlalchemy.exc import IntegrityError
from app.utils.auth import verify_password, create_access_token
from datetime import timedelta
from app.schema.Usuario import RolUsuarioEnum

class UsuarioService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
    
    def login(self, email: str, password: str):
        """
        Autentica un usuario y retorna un token JWT junto con sus datos
        """
        # Buscar usuario por email
        statement = select(Usuario).where(Usuario.email == email)
        usuario = self.db.exec(statement).first()
        
        if not usuario:
            raise ValueError("Email o contraseña incorrectos")
        
        # Verificar contraseña
        if not verify_password(password, usuario.password):
            raise ValueError("Email o contraseña incorrectos")
        
        # Crear token
        access_token_expires = timedelta(minutes=24 * 60)
        access_token = create_access_token(
            data={"sub": usuario.email, "id": usuario.id, "rol": usuario.rol},
            expires_delta=access_token_expires
        )
        
        return {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
            "id_aseguradora": usuario.id_aseguradora,
            "token": access_token
        }

    def create_usuario(self, name: str, email: str, password: str, rol: RolUsuarioEnum, id_aseguradora: int | None = None):
        if rol == RolUsuarioEnum.aseguradora and not id_aseguradora:
            raise ValueError("El usuario aseguradora debe tener una aseguradora asociada")

        if rol == RolUsuarioEnum.admin:
            id_aseguradora = None

        nuevo_usuario = Usuario(
            nombre=name,
            email=email,
            password=password,
            rol=rol,
            id_aseguradora=id_aseguradora
        )

        try:
            self.db.add(nuevo_usuario)
            self.db.commit()
            self.db.refresh(nuevo_usuario)
            return nuevo_usuario
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Ya existe un usuario con ese email")
