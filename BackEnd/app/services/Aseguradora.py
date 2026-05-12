from fastapi import Depends
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from app.database.connection import get_db
from app.models.aseguradora import Aseguradora



class AseguradoraService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def create_aseguradora(self, nombre: str):
        nueva_aseguradora = Aseguradora(nombre=nombre)
        try:
            self.db.add(nueva_aseguradora)
            self.db.commit()
            self.db.refresh(nueva_aseguradora)
            return nueva_aseguradora
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Ya existe una aseguradora con ese nombre")
    
    def get_aseguradora_by_id(self, id: int):
        aseguradora = self.db.get(Aseguradora, id)
        return aseguradora
    
    def list_aseguradoras(self):
        consulta = select(Aseguradora)
        aseguradoras = self.db.exec(consulta).all()
        return aseguradoras

    
