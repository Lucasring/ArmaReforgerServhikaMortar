from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from typing import List

from ..database import get_session
from ..datamodel import SquadSession, Target, TargetCreate

session_key = APIKeyHeader(name='X-SESSION-KEY')

router = APIRouter(
    prefix="/squad",
    tags=["squad"]
)

@router.post("/sessions", response_model=SquadSession)
def get_or_create_session(
    session_name: str, 
    db: Session = Depends(get_session)
):
    # 1. Search to see if session_name already exists - return session if exists
    statement = select(SquadSession).where(SquadSession.name == session_name)
    found_session = db.exec(statement).first()

    if found_session:
        return found_session

    # 2. Create a new session
    new_session = SquadSession(name=session_name)

    # 3. Commit the session to the database
    try:
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return new_session
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create or join session")


@router.get("/targets", response_model=List[Target])
def get_targets(
    session_name: str = Security(session_key), 
    db: Session = Depends(get_session)
):
    statement = select(Target).join(SquadSession).where(SquadSession.name == session_name)
    return db.exec(statement).all()


@router.delete("/targets", response_model=Target)
def remove_target(
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
        .where(SquadSession.name == session_name)
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
def add_targets(
    base_target: TargetCreate, 
    session_name : str = Security(session_key),
    db: Session = Depends(get_session)
):
    # 1. Verify the current_session exists
    squad_session = db.exec(select(SquadSession).where(SquadSession.name == session_name)).first()
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