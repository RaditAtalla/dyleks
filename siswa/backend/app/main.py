import sys
import os

# Ensure project root & shared-db are in the python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(os.path.join(ROOT_DIR, "shared-db"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import students, teachers, ocr

app = FastAPI(title="DyLeks Siswa Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8001",
        "http://localhost:8003",
        "http://127.0.0.1:8001",
        "http://127.0.0.1:8003",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(ocr.router)
