from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from typing import List
from time import time

from ..security import session_key
from ..database import get_session
from ..datamodel import SquadSession, User

user_router = APIRouter(
    prefix="/api",
    tags=["user"]
)

@user_router.get("/user", response_model=List[User])
def get_session_users(
    user_id : int,
    session_name : str = Security(session_key),
    db : Session = Depends(get_session)
):
    # Get the Session
    statement = select(SquadSession).where(SquadSession.session_name == session_name)
    session = db.exec(statement).first()
    if not session:
        return HTTPException(status_code=404, detail="Session not found")

    return session.users