from sqlmodel import SQLModel, Field

class Paciente(SQLModel, table=True):
    __tablename__ = "paciente"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    documento: int = Field(unique=True)
    