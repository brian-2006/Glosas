
from app.database.connection import get_db
from fastapi import Depends, APIRouter
from sqlmodel import Session, select, SQLModel

from typing import List
#servicios
from app.services.CuentaMedica import CuentaMedicaService
from app.services.Procedimiento import ProcedimientoDTO
from app.services.CuentaMedica import CuentaMedicaDTO
#modelos
from app.models.cuentaMedica import CuentaMedica



router = APIRouter(prefix="/cuenta-medica", tags=["Cuenta Medica"])



@router.post("/crear-cuenta-medica")
def create_cuenta_medica(data: CuentaMedicaDTO, service: CuentaMedicaService = Depends()):
    
    cuenta = service.create_cuenta_medica(data)
    return cuenta


@router.get("/by-aseguradora/{aseguradora_id}")
def get_cuenta_medica_by_aseguradora(aseguradora_id: int, service: CuentaMedicaService = Depends()):
    cuentas = service.list_cuenta_medica_by_aseguradora(aseguradora_id)
    return cuentas

@router.get("/list")
def get_list(service: CuentaMedicaService = Depends()):
    cuentas = service.list_cuenta_medica()
    return cuentas





