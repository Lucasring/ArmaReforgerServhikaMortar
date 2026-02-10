from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from sqlmodel import Session, select
from typing import List
from time import time

from ..security import session_key
from ..database import get_session
from ..datamodel import SquadSession, User, Target, TargetCreateRequest, TargetRemoveRequest

target_router = APIRouter(
    prefix="/api",
    tags=["target"]
)

@target_router.get("/target", response_model=List[Target])
def get_session_targets(
    session_name: str = Security(session_key), 
    db: Session = Depends(get_session)
):
    statement = select(Target).join(SquadSession).where(SquadSession.session_name == session_name)
    return db.exec(statement).all()


@target_router.delete("/target")
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


@target_router.post("/target", response_model=Target)
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