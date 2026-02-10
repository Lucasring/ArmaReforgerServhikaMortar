from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from time import time

from ..security import session_key
from ..database import get_session
from ..datamodel import SquadSession, Target, TargetCreateRequest, TargetRemoveRequest, User

session_router = APIRouter(
    prefix="/api",
    tags=["squad"]
)

# ----- Session Routes -----

@session_router.post("/join-session")
def join_session(
    session_name : str, 
    user_name : str,
    db: Session = Depends(get_session)
):
    # Search to see if session_name already exists - return session if exists
    session_statement = select(SquadSession).where(SquadSession.session_name == session_name)
    session_obj = db.exec(session_statement).first()

    # Create a SquadSession if the session does not exist
    if not session_obj:
        session_obj = SquadSession(session_name=session_name)
        db.add(session_obj)
        db.commit()
        db.refresh(session_obj)

    # Check to see if the request user already exists
    existing_user = db.exec(
        select(User).where(User.name == user_name, User.session_id == session_obj.id)
    ).first()

    if existing_user:
        return {
            "user": existing_user,
            "session": session_obj,
        }

    # Create a New User for the session
    new_user = User(
        name=user_name, 
        session=session_obj,
        is_active=True
    )

    # Commit the User to the database
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        db.refresh(session_obj)
        return {
            'user' : new_user,
            'session' : session_obj,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed join session")

@session_router.get('/get-session', response_model=SquadSession)
def get_squad_session(
    session_name : str = Security(session_key),
    db : Session = Depends(get_session)
):
    statement = select(SquadSession).where(SquadSession.session_name == session_name)
    session = db.exec(statement).first()
    return session

@session_router.get('/leave-session')
def leave_squad_session(
    user_id : int,
    session_name : str = Security(session_key),
    db : Session = Depends(get_session)
):
    statement = select(User).where(User.id == user_id)
    user = db.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {'status' : 'success'}