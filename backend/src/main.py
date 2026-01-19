from fastapi import FastAPI
from fastapi.security import APIKeyHeader
from contextlib import asynccontextmanager
from backend.src.database import create_db_and_tables
from backend.src.routers import squad

# The modern way to handle startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when the app starts
    create_db_and_tables()
    yield
    # Code here runs when the app stops (e.g., closing connections)

app = FastAPI(lifespan=lifespan)

# Include the squad routes
app.include_router(squad.router)

@app.get("/")
def health_check():
    return {"status": "Mortar API Online"}