from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import uuid
import datetime

from db import get_db, Student, ActivityLog
from app.schemas import StudentSchema

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/{student_id}", response_model=StudentSchema)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    return student

@router.get("", response_model=List[StudentSchema])
def get_students(teacher_id: str = Query(...), db: Session = Depends(get_db)):
    # Retrieve students, filtering out drafts (where name = 'Siswa Baru' and class = '-')
    students = db.query(Student).filter(
        Student.teacher_id == teacher_id
    ).filter(
        (Student.name != "Siswa Baru") | (Student.class_ != "-")
    ).all()
            
    return students

@router.post("", response_model=StudentSchema)
def add_student(student_data: StudentSchema, db: Session = Depends(get_db)):
    # Check if student exists
    existing = db.query(Student).filter(Student.id == student_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Siswa dengan ID tersebut sudah terdaftar.")
    
    new_student = Student(
        id=student_data.id,
        teacher_id=student_data.teacherId,
        name=student_data.name,
        class_=student_data.class_,
        current_level=student_data.currentLevel,
        risk_score=student_data.riskScore,
        risk_class=student_data.riskClass,
        qr_url=student_data.qrUrl,
        age=student_data.age,
        gender=student_data.gender
    )
    
    db.add(new_student)
    db.commit()
    
    return new_student

@router.delete("/{student_id}")
def delete_student(student_id: str, teacher_id: str = Query(...), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id, Student.teacher_id == teacher_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    student_name = student.name
    db.delete(student)
    db.commit()
    
    # Add activity log for deletion
    log_id = str(uuid.uuid4())[:8]
    timestamp = datetime.datetime.now().strftime("%H:%M") + " - Hari ini"
    
    new_log = ActivityLog(
        id=log_id,
        teacher_id=teacher_id,
        student_name=student_name,
        action="telah dihapus dari daftar siswa",
        timestamp=timestamp
    )
    db.add(new_log)
    db.commit()
    
    return {"message": "Siswa berhasil dihapus."}
