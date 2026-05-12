from fastapi import Depends, APIRouter

from enum import Enum

from app.services.Procedimiento import ProcedimientoService


class ProcedimientoStatus(str, Enum):
    PENDIENTE = "pendiente"
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"


router = APIRouter(prefix="/procedimiento", tags=["Procedimiento"])

@router.put("/cambiar-estado/{procedimiento_id}/{nuevo_estado}")
def change_procedimiento_status(
        procedimiento_id: int, 
        nuevo_estado: ProcedimientoStatus, 
        procedimiento: ProcedimientoService = Depends()
):
    proc = procedimiento.change_state(procedimiento_id, nuevo_estado)
    return proc

@router.get("/list")
def get_list_procedimientos(service: ProcedimientoService = Depends()):
    procedimientos = service.get_catalogo_procedimiento()
    return procedimientos