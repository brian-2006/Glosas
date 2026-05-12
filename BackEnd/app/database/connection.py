#from sqlalchemy import create_engine
#from sqlalchemy.ext.declarative import declarative_base
#from sqlalchemy.orm import sessionmaker
from sqlmodel import create_engine, Session, SQLModel
import os
from dotenv import load_dotenv
#importo modelos para crear las tablas
#from app.models import aseguradora, cuentaMedica, glosa, procemiento, usuario, paciente, catalogoProcedimiento

load_dotenv()

host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

DATABASE_URL = f"postgresql://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DATABASE_URL, echo=True)

#base = declarative_base()

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

def create_db_and_tables():

    SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine) as session: 
        yield session