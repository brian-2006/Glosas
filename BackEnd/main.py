from fastapi import FastAPI, Depends
from sqlmodel import Session, text, select
from app.database.connection import get_db
from pydantic import BaseModel
#from sqlmodel import Session

#importamos rutas
from app.routes.CuentaMedica import router as cuenta_medica_router
from app.routes.Procedimiento import router as procedimiento_router
from app.routes.Aseguradora import router as aseguradora_router
from app.routes.Paciente import router as paciente_router
from app.routes.Glosa import router as glosa_router
from app.routes.Usuario import router as usuario_router


#importamos modelos para crear las tablas
from app.models.usuario import Usuario
from app.models.aseguradora import Aseguradora
from app.models.paciente import Paciente
from app.models.cuentaMedica import CuentaMedica
from app.models.catalogoProcedimiento import CatalogoProcedimiento
from app.models.procedimiento import Procedimiento
from app.models.glosa import Glosa

from app.database.connection import create_db_and_tables
from contextlib import asynccontextmanager

#importamos modulo para crear permiso de peticiones
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#agrego rutas a la aplicacion
app.include_router(cuenta_medica_router)
app.include_router(procedimiento_router)
app.include_router(aseguradora_router)
app.include_router(paciente_router)
app.include_router(glosa_router)
app.include_router(usuario_router)

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None


@app.get("/")
def read_root():
    return {"hello": "world"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_price": item.price, "item_id": item_id}



@app.get("/usuarios")
def get_users(db: Session = Depends(get_db)):

    consulta = select(Usuario)
    usuarios = db.exec(consulta).all()
    return usuarios