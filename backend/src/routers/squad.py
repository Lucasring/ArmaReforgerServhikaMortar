from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from typing import List
from time import time

from ..database import get_session
from ..datamodel import SquadSession, Target, TargetCreateRequest, TargetRemoveRequest, User

session_key = APIKeyHeader(name='X-SESSION-KEY')

router = APIRouter(
    prefix="/squad",
    tags=["squad"]
)

# ----- Session Routes -----

@router.post("/join-session")
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

@router.get('/get-session', response_model=SquadSession)
def get_squad_session(
    session_name : str = Security(session_key),
    db : Session = Depends(get_session)
):
    statement = select(SquadSession).where(SquadSession.session_name == session_name)
    session = db.exec(statement).first()
    return session

@router.get('/leave-session')
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

# ----- Target Routes -----

@router.get("/targets", response_model=List[Target])
def get_session_targets(
    session_name: str = Security(session_key), 
    db: Session = Depends(get_session)
):
    statement = select(Target).join(SquadSession).where(SquadSession.session_name == session_name)
    return db.exec(statement).all()


@router.delete("/targets")
def remove_session_user_target(
    target_request: TargetRemoveRequest, 
    session_name: str = Security(session_key),
    db : Session = Depends(get_session),
):
    target_statement = (
        select(Target)
        .join(SquadSession)
        .where(SquadSession.session_name == session_name)
        .where(Target.user_id == target_request.user_id)
    )

    target = db.exec(target_statement).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    
    db.delete(target)
    db.commit()
    return {"status" : "success"}


@router.post("/targets", response_model=Target)
def add_session_user_target(
    target_request: TargetCreateRequest, 
    session_name : str = Security(session_key),
    db: Session = Depends(get_session)
):
    # Verify the current_session exists
    squad_session = db.exec(select(SquadSession).where(SquadSession.session_name == session_name)).first()
    if not squad_session or squad_session.id is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Verify the User who sent the target exists
    target_user = db.get(User, target_request.user_id)
    if not target_user or target_user.id is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Create or Update the Target
    if target_user.target:
        target_user.target.x = target_request.x
        target_user.target.y = target_request.y
        target = target_user.target
    else:
        # Create a brand new target object
        target = Target(
            x=target_request.x,
            y=target_request.y,
            user_id=target_user.id,
            session_id=squad_session.id
        )
        db.add(target)

    db.commit()
    db.refresh(target)
    return target

# ----- User Routes -----

@router.get("/users", response_model=List[User])
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

    # Record Requesting User Timestamp
    current_user = db.get(User, user_id)
    if current_user:
        current_user.last_request_time = time()
        db.add(current_user)
        db.commit()

    return session.users