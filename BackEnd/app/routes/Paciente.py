from app.database.connection import get_db
from fastapi import Depends
from sqlmodel import Session, select
from app.models.paciente import Paciente
from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/paciente", tags=["Paciente"])

@router.get("/list")
def list_pacientes(db: Session = Depends(get_db)):
    consulta = select(Paciente)
    resultado = db.exec(consulta).all()
    return resultado

@router.post("/create")
def create_paciente(paciente: Paciente, db: Session = Depends(get_db)):
    try:
        db.add(paciente)
        db.commit()
        db.refresh(paciente)
        return paciente
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Ya existe un paciente con ese documento")
