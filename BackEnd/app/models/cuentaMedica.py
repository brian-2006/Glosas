from sqlmodel import SQLModel, Field, Relationship

from enum import Enum
from typing import List, TYPE_CHECKING, Optional
from datetime import datetime, timezone

if TYPE_CHECKING:
    from app.models.procedimiento import Procedimiento
    from app.models.paciente import Paciente
    from app.models.aseguradora import Aseguradora
    from app.models.glosa import Glosa


class EstadoCuenta(str, Enum):
    pendiente = "pendiente"
    revisado = "revisado"


class CuentaMedica(SQLModel, table=True):
    __tablename__ = "cuentamedica"
    id: int | None = Field(default=None, primary_key=True)
    id_paciente: int = Field(foreign_key="paciente.id")
    id_aseguradora: int = Field(foreign_key="aseguradora.id")
    historiaclinica: str
    estado: EstadoCuenta = Field(default=EstadoCuenta.pendiente)
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    procedimientos: List["Procedimiento"] = Relationship(
        back_populates="cuenta_medica"
    )
    glosa: Optional["Glosa"] = Relationship(
         back_populates="cuenta_medica"
    )
    paciente: "Paciente" = Relationship()

    aseguradora: "Aseguradora" = Relationship()

    def update_estado_from_procedimientos(self):
        from app.models.procedimiento import EstadoProcedimiento

        has_pending = any(
            procedimiento.estado == EstadoProcedimiento.pendiente
            for procedimiento in self.procedimientos
        )

        self.estado = EstadoCuenta.pendiente if has_pending else EstadoCuenta.revisado
