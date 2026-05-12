from app.database.connection import get_db
from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel

from app.services.Aseguradora import AseguradoraService


class AseguradoraDTO(BaseModel):
    nombre: str

router = APIRouter(prefix="/aseguradora", tags=["Aseguradora"])

@router.get("/aseguradoras")
def get_aseguradoras(aseguradora: AseguradoraService = Depends()):
    aseguradoras = aseguradora.list_aseguradoras()
    return aseguradoras

@router.post("/crear-aseguradora")
def create_aseguradora(data: AseguradoraDTO, aseguradora: AseguradoraService = Depends()):
    try:
        nueva = aseguradora.create_aseguradora(data.nombre)
        return {"message": f"Aseguradora {nueva.nombre} creada exitosamente"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
