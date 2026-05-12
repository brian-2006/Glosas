from sqlmodel import SQLModel, Field

class CatalogoProcedimiento(SQLModel, table=True):
    __tablename__= "catalogoprocedimiento"
    id: int| None = Field(default=None, primary_key=True)
    codigocatalogo: str = Field(unique=True)
    nombre: str
    descripcion: str