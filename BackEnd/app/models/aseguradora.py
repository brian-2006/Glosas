from sqlmodel import SQLModel, Field, Relationship

class Aseguradora(SQLModel, table=True):
    __tablename__ = "aseguradora"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
