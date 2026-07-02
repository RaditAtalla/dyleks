from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from db import get_db, Teacher
from app.schemas import TeacherRegister, TeacherLogin, TeacherResponse
from app.utils.security import verify_password, get_password_hash

router = APIRouter(prefix="/api/teachers", tags=["teachers"])

@router.post("/register", response_model=TeacherResponse)
def register_teacher(data: TeacherRegister, db: Session = Depends(get_db)):
    # Check if username exists
    existing = db.query(Teacher).filter(Teacher.username.like(data.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah digunakan oleh guru lain.")
    
    teacher_id = str(uuid.uuid4())[:8]  # unique random id
    password_hash = get_password_hash(data.password)
    
    new_teacher = Teacher(
        id=teacher_id,
        full_name=data.fullName,
        school_name=data.schoolName,
        city=data.city,
        username=data.username,
        password_hash=password_hash
    )
    
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher

@router.post("/login", response_model=TeacherResponse)
def login_teacher(data: TeacherLogin, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.username.like(data.username)).first()
    if not teacher:
        raise HTTPException(status_code=400, detail="Username tidak ditemukan.")
    
    if not verify_password(data.password, teacher.password_hash):
        raise HTTPException(status_code=400, detail="Password salah.")
        
    return teacher

@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: str, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Guru tidak ditemukan.")
    return teacher
