from sqlmodel import SQLModel, Session, select
from app.database.connection import get_db
from fastapi import Depends
from typing import List

#importamos modelos
from app.models.glosa import Glosa, EstadoGlosa
from app.models.cuentaMedica import CuentaMedica
from app.models.procedimiento import Procedimiento, EstadoProcedimiento

from app.schema.Glosa import ResponseGlosaDTO
from app.schema.Glosa import ResponseProcedimientoGlosaDTO

class GlosaService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get_glosas(self) -> list[ResponseGlosaDTO]:
        glosas = self.db.exec(
            select(Glosa)
        ).all()

        response = []

        for glosa in glosas:

            cuenta = glosa.cuenta_medica

            procedimientos_response = []

            for proc in cuenta.procedimientos:

                procedimientos_response.append(
                    ResponseProcedimientoGlosaDTO(
                        nombre_procedimiento=proc.catalogo_procedimiento.nombre,
                        valor=proc.valor,
                        estado=proc.estado
                    )
                )

            response.append(
                ResponseGlosaDTO(
                    id_glosa=glosa.id,
                    id_cuentamedica=glosa.id_cuentamedica,
                    estado=glosa.estado,
                    valoraprobado=glosa.valoraprobado,

                    paciente=cuenta.paciente.nombre,
                    aseguradora=cuenta.aseguradora.nombre,

                    fecha=cuenta.fecha,

                    procedimientos=procedimientos_response
                )
            )

        return response


    def create_glosa(self, id_cuentamedica: int):
        nueva_glosa = Glosa(id_cuentamedica=id_cuentamedica)
        self.db.add(nueva_glosa)
        self.db.commit()
        self.db.refresh(nueva_glosa)
        return nueva_glosa

    def update_glosa_state(self, id_cuentamedica: int):
        """
        Actualiza el estado de la glosa basado en el estado de los procedimientos asociados.
        
        Lógica de estados:
        - PENDIENTE: Todos los procedimientos están en pendiente
        - EN_PROCESO: Al menos uno está evaluado (aprobado/rechazado) pero hay aún pendientes
        - OBJETADA: Todos están evaluados y al menos uno es rechazado
        - ACEPTADA: Todos los procedimientos están aprobados
        """
        
        cuenta_medica = self.db.get(CuentaMedica, id_cuentamedica)
        if cuenta_medica is None:
            raise ValueError("Cuenta médica no encontrada")
        
        glosa = cuenta_medica.glosa
        if glosa is None:
            raise ValueError("Glosa no encontrada para la cuenta médica")
        
        
        procedimientos = cuenta_medica.procedimientos
        
        if not procedimientos:
            raise ValueError("No hay procedimientos asociados")
        
        
        total_procedimientos = len(procedimientos)
        pendientes = sum(1 for p in procedimientos if p.estado == EstadoProcedimiento.pendiente)
        aprobados = sum(1 for p in procedimientos if p.estado == EstadoProcedimiento.aprobado)
        rechazados = sum(1 for p in procedimientos if p.estado == EstadoProcedimiento.rechazado)
        
       
        if pendientes == total_procedimientos:
            
            nuevo_estado = EstadoGlosa.pendiente
        elif pendientes == 0:
            
            if rechazados > 0:
                
                nuevo_estado = EstadoGlosa.objetado
            else:
                
                nuevo_estado = EstadoGlosa.aceptado
        else:
            
            nuevo_estado = EstadoGlosa.en_proceso
        
        glosa.estado = nuevo_estado
        self.db.add(glosa)
    
