from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from db import get_db, Psychologist
from app.schemas import PsychologistRegister, PsychologistLogin, PsychologistResponse
from app.utils.security import verify_password, get_password_hash

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=PsychologistResponse)
def register_psychologist(data: PsychologistRegister, db: Session = Depends(get_db)):
    # Check if username exists in psychologists or teachers to avoid collision (optional, but definitely in psychologists)
    existing = db.query(Psychologist).filter(Psychologist.username.like(data.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah digunakan oleh psikolog lain.")
    
    psy_id = str(uuid.uuid4())[:8]  # unique random id
    password_hash = get_password_hash(data.password)
    
    new_psy = Psychologist(
        id=psy_id,
        full_name=data.fullName,
        username=data.username,
        str_number=data.strNumber,
        clinic=data.clinic,
        password_hash=password_hash
    )
    
    db.add(new_psy)
    db.commit()
    db.refresh(new_psy)
    return new_psy

@router.post("/login", response_model=PsychologistResponse)
def login_psychologist(data: PsychologistLogin, db: Session = Depends(get_db)):
    psy = db.query(Psychologist).filter(Psychologist.username.like(data.username)).first()
    if not psy:
        raise HTTPException(status_code=400, detail="Username tidak ditemukan.")
    
    if not verify_password(data.password, psy.password_hash):
        raise HTTPException(status_code=400, detail="Password salah.")
        
    return psy
