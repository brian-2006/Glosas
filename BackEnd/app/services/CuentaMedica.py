from fastapi import Depends
from sqlmodel import Session, select
from app.database.connection import get_db
from app.models.cuentaMedica import CuentaMedica
from app.models.procedimiento import Procedimiento
from app.services.Procedimiento import ProcedimientoService
from app.services.Aseguradora import AseguradoraService
from app.services.Glosa import GlosaService
from app.services.Procedimiento import ProcedimientoDTO
from app.services.Procedimiento import ResponseProcedimientoDTO
#importamos funcion utilitaria


from typing import List
from datetime import datetime

from pydantic import BaseModel

class CuentaMedicaDTO(BaseModel):
    id_paciente: int
    id_aseguradora: int
    historiaclinica: str
    procedimientos: List[ProcedimientoDTO]

class ResponseCuentaMedicaDTO(BaseModel):
    id: int
    id_paciente: int
    id_aseguradora: int
    paciente: str
    aseguradora: str
    historiaclinica: str
    estado: str
    fecha: datetime
    procedimientos: List[ResponseProcedimientoDTO]
    


class CuentaMedicaService:
    def __init__ (
        self, db: Session = Depends(get_db), 
        procedimiento_service: ProcedimientoService = Depends(), 
        glosa_service: GlosaService = Depends(),
        aseguradora_service: AseguradoraService = Depends(),
    ):
        self.db = db
        self.procedimiento_service = procedimiento_service
        self.glosa_service = glosa_service
        self.aseguradora_service = aseguradora_service

    def build_response_cuentas(
        self,
        cuentas: List[CuentaMedica]
    ) -> List[ResponseCuentaMedicaDTO]:

        response = []

        for cuenta in cuentas:
            cuenta.update_estado_from_procedimientos()
            self.db.add(cuenta)

            procedimientos = []

            for proc in cuenta.procedimientos:

                procedimientos.append(
                    ResponseProcedimientoDTO(
                        id=proc.id,
                        id_catalogoprocedimiento=proc.id_catalogoprocedimiento,
                        nombre_procedimiento=proc.catalogo_procedimiento.nombre,
                        valor=proc.valor,
                        estado=proc.estado
                    )
                )

            response.append(
                ResponseCuentaMedicaDTO(
                    id=cuenta.id,
                    id_paciente=cuenta.id_paciente,
                    id_aseguradora=cuenta.id_aseguradora,
                    paciente=cuenta.paciente.nombre,
                    aseguradora=cuenta.aseguradora.nombre,
                    historiaclinica=cuenta.historiaclinica,
                    estado=cuenta.estado,
                    fecha=cuenta.fecha,
                    procedimientos=procedimientos
                )
            )

        self.db.commit()

        return response 

    def create_cuenta_medica(self, data: CuentaMedicaDTO):
        try:
            cuenta = CuentaMedica(
                id_paciente=data.id_paciente,
                id_aseguradora=data.id_aseguradora,
                historiaclinica=data.historiaclinica
            )

            self.db.add(cuenta)
            self.db.flush()

            self.procedimiento_service.add_procedimiento(
                id_cuentamedica=cuenta.id,
                procedimientos=data.procedimientos
            )

            self.db.commit()
            self.db.refresh(cuenta)

            #creamos glosa asociada a la cuenta medica
            glosa = self.glosa_service.create_glosa(id_cuentamedica=cuenta.id)
            return cuenta
        
        except Exception:
            self.db.rollback()
            raise
    
    def list_cuenta_medica_by_aseguradora(
            self, 
            id_aseguradora: int, 
            
    ) -> List[ResponseCuentaMedicaDTO]:

        aseguradora = self.aseguradora_service.get_aseguradora_by_id(id_aseguradora)
        cuentas = self.db.exec(
            select(CuentaMedica).where(
                CuentaMedica.id_aseguradora == aseguradora.id
            )
        ).all()
        
        resultados = self.build_response_cuentas(cuentas)

        return resultados

    def list_cuenta_medica(
            self
    )-> List[ResponseCuentaMedicaDTO]:
        
        cuentas = self.db.exec(
            select(CuentaMedica)
        ).all()

        resultados = self.build_response_cuentas(cuentas)
        return resultados
