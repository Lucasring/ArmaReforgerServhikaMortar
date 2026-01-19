from sqlmodel import Field, Relationship, SQLModel, create_engine, select
from pydantic import BaseModel

class SquadSession(SQLModel, table=True):
    id : int | None = Field(default=None, primary_key=True)
    name : str = Field(unique=True, index=True)
    targets: list["Target"] = Relationship(back_populates="session")

class TargetCreate(BaseModel):
    label : str
    x : float
    y : float
    timestamp : float | None = None

class Target(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    label: str
    x: float
    y: float
    timestamp: float | None = None
    
    session_id : int = Field(default=None, foreign_key="squadsession.id")
    session: SquadSession = Relationship(back_populates="targets")