from fastapi import Depends
from fastapi.security import APIKeyHeader
from fastapi_utils.tasks import repeat_every
from sqlmodel import Session, select, delete, col
from typing import List
from time import time
from loguru import logger

from backend.src.database import get_session, engine
from backend.src.datamodel import SquadSession, Target, User

@repeat_every(seconds=5)
async def cleanup_inactive_users():
    # Use the Session directly as a context manager
    with Session(engine) as session:
        invalid_time = time() - 10.0
        
        query = (
            delete(User)
            .where(col(User.last_request_time) <= invalid_time)
            .returning(col(User.id), col(User.name))
        )
        
        # Now execution will work because 'session' is an actual Session object
        results = session.exec(query).all()
        session.commit() 

        if results:
            logger.info(f"Cleanup: Found {len(results)} users to remove.")
            for r in results:
                logger.info(f"Removed user: {r.name} (ID: {r.id})")
        