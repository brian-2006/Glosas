from app.models.paciente import Paciente
from app.database.connection import get_db
from fastapi import Depends
from sqlmodel import Session, select

class PacienteService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def  create_paciente(self, nombre: str, documento: int):
        paciente = Paciente(nombre=nombre, documento=documento)
        self.db.add(paciente)
        self.db.commit(paciente)
        self.db.refresh(paciente)
        return paciente

    def list_pacientes(self):
        consulta = select(Paciente)
        pacientes = self.db.exec(consulta).all()
        return pacientes
    
    def get_paciente_by_id(self, id: int):
        paciente = self.db.get(Paciente, id)
        return paciente