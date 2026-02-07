from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from typing import List

from ..database import get_session
from ..datamodel import SquadSession, Target, TargetCreate, User

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

# ----- Target Routes -----

@router.get("/targets", response_model=List[Target])
def get_session_targets(
    session_name: str = Security(session_key), 
    db: Session = Depends(get_session)
):
    statement = select(Target).join(SquadSession).where(SquadSession.session_name == session_name)
    return db.exec(statement).all()


@router.delete("/targets", response_model=Target)
def remove_session_target(
    target_key : int,
    session_name: str = Security(session_key),
    db : Session = Depends(get_session),
):
    # 1. Fetch the target
    target = db.get(Target, target_key)
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    
    # 2. Security Check: Verify this target belongs to the requester's squad
    statement = (
        select(SquadSession)
        .where(SquadSession.id == target.session_id)
        .where(SquadSession.session_name == session_name)
    )

    authorized_session = db.exec(statement).first()
    if not authorized_session:
        raise HTTPException(
            status_code=403, 
            detail="You do not have permission to delete this target"
        )
    
    # 3. Delete the target
    db.delete(target)
    db.commit()
    return target


@router.post("/targets", response_model=Target)
def add_session_target(
    base_target: TargetCreate, 
    session_name : str = Security(session_key),
    db: Session = Depends(get_session)
):
    # 1. Verify the current_session exists
    squad_session = db.exec(select(SquadSession).where(SquadSession.session_name == session_name)).first()
    if not squad_session or squad_session.id is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Assign the squad_session ID to the target
    target = Target(
        label = base_target.label,
        x = base_target.x,
        y = base_target.y,
        timestamp = base_target.timestamp,
        session_id = squad_session.id
    )
    
    # 3. Add the target to the Database
    db.add(target)
    db.commit()
    db.refresh(target)

    return target

# ----- User Routes -----

@router.get("/users", response_model=List[User])
def get_session_users(
    session_name : str = Security(session_key),
    db : Session = Depends(get_session)
):
    statement = select(SquadSession).where(SquadSession.session_name == session_name)
    session = db.exec(statement).first()

    if not session:
        return HTTPException(status_code=404, detail="Session not found")

    return session.users