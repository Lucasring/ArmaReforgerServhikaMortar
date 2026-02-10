from sqlmodel import Field, Relationship, SQLModel, create_engine, select, UniqueConstraint
from pydantic import BaseModel
from typing import Optional

class SquadSession(SQLModel, table=True):
    id : int | None = Field(default=None, primary_key=True)
    session_name : str = Field(unique=True, index=True)
    users : list["User"] = Relationship(back_populates="session")
    targets: list["Target"] = Relationship(back_populates="session")

class SquadSessionUpdateRequest(BaseModel):
    session_name : str
    targets : list["Target"]
    users : list["User"]

class TargetCreateRequest(BaseModel):
    user_id : int = Field(default=None, foreign_key="user.id")
    x : float
    y : float

class TargetRemoveRequest(BaseModel):
    user_id : int = Field(default=None, foreign_key="user.id")

class Target(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    x: float
    y: float
    
    # Session Connection
    session_id : int = Field(default=None, foreign_key="squadsession.id")
    session: SquadSession = Relationship(back_populates="targets")

    # User Connection
    user_id : int = Field(default=None, foreign_key="user.id", unique=True, ondelete="CASCADE")
    user : "User" = Relationship(back_populates="target")

class User(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("session_id", "name", name="unique_user_in_session"),
    )

    id : int | None = Field(default=None, primary_key=True)
    name : str
    is_active : bool
    last_request_time : float | None = None

    # Mortar Session Details
    target : Optional["Target"] = Relationship(back_populates="user", sa_relationship_kwargs={"passive_deletes": True})

    # Session Connection
    session_id : int = Field(default=None, foreign_key="squadsession.id")
    session : SquadSession = Relationship(back_populates="users")