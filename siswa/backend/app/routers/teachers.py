from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db, Teacher
from app.schemas import TeacherResponse

router = APIRouter(prefix="/api/teachers", tags=["teachers"])

@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: str, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Guru tidak ditemukan.")
    return teacher
