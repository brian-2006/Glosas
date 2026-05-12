from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import List

from app.models.glosa import EstadoGlosa
from app.models.procedimiento import EstadoProcedimiento


class ResponseProcedimientoGlosaDTO(BaseModel):
    nombre_procedimiento: str
    valor: float
    estado: EstadoProcedimiento


class ResponseGlosaDTO(BaseModel):
    id_glosa: int
    id_cuentamedica: int
    estado: EstadoGlosa
    valoraprobado: Decimal

    paciente: str
    aseguradora: str

    fecha: datetime

    procedimientos: List[ResponseProcedimientoGlosaDTO]
