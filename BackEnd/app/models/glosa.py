from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from decimal import Decimal
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from app.models.cuentaMedica import CuentaMedica

class EstadoGlosa(str, Enum):
    aceptado = "aceptado"
    objetado = "objetado"
    pendiente = "pendiente"
    en_proceso = "en_proceso"


class Glosa(SQLModel, table=True):
    __tablename__ = "glosa"
    id: int | None = Field(default=None, primary_key=True)
    id_cuentamedica: int =Field(foreign_key="cuentamedica.id")
    estado: EstadoGlosa = Field(default=EstadoGlosa.pendiente)
    valoraprobado: Decimal = Field(
        default=0.00, 
        ge=0,             
    )
    motivo: str | None = Field(default=None)

    cuenta_medica: "CuentaMedica" = Relationship(
        back_populates="glosa"
    )