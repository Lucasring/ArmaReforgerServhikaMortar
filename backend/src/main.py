from fastapi import FastAPI
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import create_db_and_tables
from .cleanup import cleanup_inactive_users
from .routers import session
from .routers import target
from .routers import user

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when the app starts
    create_db_and_tables()
    await cleanup_inactive_users()
    yield
    # Code here runs when the app stops (e.g., closing connections)

app = FastAPI(lifespan=lifespan)

# Define the origins that are allowed to talk to your API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# 2. Add the middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows SvelteKit to access the API
    allow_credentials=True, # Allows cookies (if you use them later)
    allow_methods=["*"],    # Allows GET, POST, DELETE, etc.
    allow_headers=["*"],
)

# Include the squad routes
app.include_router(session.session_router)
app.include_router(target.target_router)
app.include_router(user.user_router)

@app.get("/")
def health_check():
    return {"status": "Mortar API Online"}