from app.models.procedimiento import Procedimiento
from app.models.glosa import Glosa
from app.models.procedimiento import EstadoProcedimiento
from sqlmodel import Session, select

from decimal import Decimal
#importamos conexiion a base de datos
from app.database.connection import get_db

def calcular_valor(procedimiento: Procedimiento, glosa: Glosa)-> Decimal:

    glosa.valoraprobado += Decimal(str(procedimiento.valor))
    return glosa.valoraprobado

def procedimiento_en_glosa(procedimiento: Procedimiento, db: Session):
    consulta = select(Glosa).where(Glosa.id_cuentamedica == procedimiento.id_cuentamedica)
    glosa = db.exec(consulta).first()

    if not glosa:
        raise ValueError("Glosa no encontrada para la cuenta médica")
    
    return glosa

