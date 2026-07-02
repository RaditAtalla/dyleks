from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
import datetime

from db import get_db, Student, ActivityLog
from app.schemas import StudentResponse, StudentUpdate

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    return student

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: str, update_data: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        if not update_data.teacherId:
            raise HTTPException(status_code=400, detail="Teacher ID is required for registration.")
        
        qr_url = f"http://localhost:8001?student_id={student_id}"
        
        student = Student(
            id=student_id,
            teacher_id=update_data.teacherId,
            name=update_data.name,
            class_=update_data.class_,
            current_level=1,
            risk_score=0,
            risk_class="low",
            qr_url=qr_url,
            age=update_data.age,
            gender=update_data.gender
        )
        db.add(student)
    else:
        student.name = update_data.name
        student.age = update_data.age
        student.gender = update_data.gender
        student.class_ = update_data.class_
    
    db.commit()
    db.refresh(student)
    
    # Log the profile completion event to the teacher activity log
    log_id = str(uuid.uuid4())[:8]
    timestamp = datetime.datetime.now().strftime("%H:%M") + " - Hari ini"
    
    new_log = ActivityLog(
        id=log_id,
        teacher_id=student.teacher_id,
        student_name=student.name,
        action="telah melengkapi pendaftaran akun siswa",
        timestamp=timestamp
    )
    db.add(new_log)
    db.commit()
    
    return student
