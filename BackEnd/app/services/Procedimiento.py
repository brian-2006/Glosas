from app.models.procedimiento import Procedimiento
from app.models.catalogoProcedimiento import CatalogoProcedimiento
from app.database.connection import get_db
from fastapi import Depends
from sqlmodel import Session, select, SQLModel
from pydantic import BaseModel
from typing import List

from app.models.procedimiento import EstadoProcedimiento

#importamos funciones utilitarias
from app.utils.helpers import calcular_valor, procedimiento_en_glosa

#importamos servicios
from app.services.Glosa import GlosaService



# DTO para recibir los procedimientos a agregar a una cuenta médica
class ProcedimientoDTO(BaseModel):
    id_catalogoprocedimiento: int
    valor: float

class ResponseProcedimientoDTO(BaseModel):
    id: int
    id_catalogoprocedimiento: int
    nombre_procedimiento: str
    valor: float
    estado: EstadoProcedimiento


class ProcedimientoService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
        self.glosa_service = GlosaService(db)
    
    def get_catalogo_procedimiento(self):
        nombres_procedimientos = self.db.exec(
            select(CatalogoProcedimiento)
        ).all()

        return nombres_procedimientos
        
    def add_procedimiento(self, id_cuentamedica: int, procedimientos: List[ProcedimientoDTO]):

        nuevos_procedimientos = []

        for proc in procedimientos:
            nuevo_procedimiento = Procedimiento(id_cuentamedica=id_cuentamedica, id_catalogoprocedimiento=proc.id_catalogoprocedimiento, valor=proc.valor)
            nuevos_procedimientos.append(nuevo_procedimiento)
            
        self.db.add_all(nuevos_procedimientos)


    
    def change_state(self, procedimiento_id: int, nuevo_estado: EstadoProcedimiento):
        procedimiento = self.db.get(Procedimiento, procedimiento_id)
        if procedimiento is None:
            raise ValueError("Procedimiento no encontrado")

        if nuevo_estado not in EstadoProcedimiento:
            raise ValueError("Estado no válido")

        procedimiento.estado = nuevo_estado

        if procedimiento.estado == EstadoProcedimiento.aprobado:
            glosa = procedimiento_en_glosa(procedimiento, self.db)
            if glosa is None:
                raise ValueError("No se pudo generar la glosa")

            glosa.valoraprobado = calcular_valor(procedimiento, glosa)
            self.db.add(glosa)
            

        self.db.add(procedimiento)
        
        # Actualizar el estado de la glosa basado en los cambios de procedimientos
        self.glosa_service.update_glosa_state(procedimiento.id_cuentamedica)

        cuenta_medica = procedimiento.cuenta_medica
        cuenta_medica.update_estado_from_procedimientos()
        self.db.add(cuenta_medica)
        
        self.db.commit()
        self.db.refresh(procedimiento)
        return procedimiento

