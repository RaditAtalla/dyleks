import sys
import os

# Ensure project root & shared-db are in the python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(os.path.join(ROOT_DIR, "shared-db"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import teachers, students, logs, events
from app.utils.notifier import watcher

app = FastAPI(title="DyLeks Guru Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(teachers.router)
app.include_router(students.router)
app.include_router(logs.router)
app.include_router(events.router)

@app.on_event("startup")
async def startup_event():
    await watcher.start()

@app.on_event("shutdown")
async def shutdown_event():
    await watcher.stop()

