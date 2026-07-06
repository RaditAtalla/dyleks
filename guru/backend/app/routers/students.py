from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
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

class StudyPlanUpdate(BaseModel):
    studyPlan: str

@router.put("/{student_id}/study-plan", response_model=StudentSchema)
def update_study_plan(student_id: str, update_data: StudyPlanUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    student.study_plan = update_data.studyPlan
    db.commit()
    db.refresh(student)
    return student

@router.post("/{student_id}/study-plan/generate")
def generate_study_plan(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    # Generate structured lesson plan based on level and risk
    level = student.current_level or 1
    risk_class = student.risk_class or "low"
    risk_score = student.risk_score or 0
    name = student.name
    
    plan = f"""# RENCANA BELAJAR ORTON-GILLINGHAM (AI-GENERATED)
**Nama Siswa:** {name} (Level {level} | Risiko: {risk_class.upper()} - {risk_score}%)

## 1. Fokus Pembelajaran (Metode Multisensori VAKT)
* **Visual (Melihat):** Pengenalan bentuk huruf dengan flashcard berkode warna untuk membedakan huruf berpasangan (misal: merah untuk 'b', biru untuk 'd').
* **Auditori (Mendengar):** Latihan segmentasi fonik. Guru melafalkan bunyi huruf dan siswa mengulangi serta menuliskan bunyinya.
* **Kinestetik & Taktil (Gerak & Sentuh):** Tracing huruf pada media bertekstur (pasir/layar sentuh) sembari melafalkan suaranya secara keras.

## 2. Rencana Sesi Latihan Harian (15-20 Menit)
* **Menit 1-5:** Pemanasan bunyi huruf (Grapheme-Phoneme Card Drill).
* **Menit 5-12:** Tracing visual dan tebak huruf kinestetik (tracer layar).
* **Menit 12-18:** Latihan membaca suku kata terstruktur tingkat kesulitan Level {level}.
* **Menit 18-20:** Dikte kata sederhana (dikte ejaan multisensori).

## 3. Strategi Pengajaran Guru
* Gunakan instruksi yang singkat, jelas, dan satu-satu.
* Jangan terburu-buru menaikkan level sebelum siswa mencapai akurasi >80% di sesi saat ini.
* Berikan pujian spesifik pada proses belajar anak, bukan hanya hasil akhir."""

    return {"studyPlan": plan}

