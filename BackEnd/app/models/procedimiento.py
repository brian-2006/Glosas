from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cuentaMedica import CuentaMedica
    from app.models.catalogoProcedimiento import CatalogoProcedimiento

class EstadoProcedimiento(str, Enum):
    pendiente = "pendiente"
    aprobado = "aprobado"
    rechazado = "rechazado"


class Procedimiento(SQLModel, table=True):
    __tablename__ = "procedimiento"
    id: int | None = Field(default=None, primary_key=True)
    id_cuentamedica: int = Field(foreign_key="cuentamedica.id")
    id_catalogoprocedimiento: int = Field(foreign_key="catalogoprocedimiento.id")
    estado: EstadoProcedimiento = Field(default=EstadoProcedimiento.pendiente)
    valor: float

    cuenta_medica: "CuentaMedica" = Relationship(
        back_populates="procedimientos"
    )

    catalogo_procedimiento: "CatalogoProcedimiento" = Relationship()

