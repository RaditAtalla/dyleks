from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import json
import uuid
import datetime

from db import get_db, Student, Teacher, GameSession, PsychologistRecommendation, Psychologist
from app.schemas import StudentResponse, GameSessionResponse, PsychologistRecommendationCreate, PsychologistRecommendationResponse

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("", response_model=List[StudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    # Query students and join with teachers, filtering out drafts
    results = db.query(Student, Teacher).join(
        Teacher, Student.teacher_id == Teacher.id
    ).filter(
        (Student.name != "Siswa Baru") | (Student.class_ != "-")
    ).all()
    
    students_list = []
    for student, teacher in results:
        students_list.append(StudentResponse(
            id=student.id,
            teacherId=student.teacher_id,
            name=student.name,
            class_=student.class_,
            currentLevel=student.current_level,
            riskScore=student.risk_score,
            riskClass=student.risk_class,
            teacherName=teacher.full_name,
            schoolName=teacher.school_name,
            age=student.age,
            gender=student.gender,
            studyPlan=student.study_plan,
            xp=student.xp
        ))
        
    return students_list

@router.get("/{student_id}", response_model=StudentResponse)
def get_student_detail(student_id: str, db: Session = Depends(get_db)):
    result = db.query(Student, Teacher).join(
        Teacher, Student.teacher_id == Teacher.id
    ).filter(
        Student.id == student_id
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
        
    student, teacher = result
    return StudentResponse(
        id=student.id,
        teacherId=student.teacher_id,
        name=student.name,
        class_=student.class_,
        currentLevel=student.current_level,
        riskScore=student.risk_score,
        riskClass=student.risk_class,
        teacherName=teacher.full_name,
        schoolName=teacher.school_name,
        age=student.age,
        gender=student.gender,
        studyPlan=student.study_plan,
        xp=student.xp
    )

@router.get("/{student_id}/sessions", response_model=List[GameSessionResponse])
def get_student_sessions(student_id: str, db: Session = Depends(get_db)):
    sessions = db.query(GameSession).filter(GameSession.student_id == student_id).all()
    # Reverse to show latest sessions first
    sessions.reverse()
    
    result = []
    for s in sessions:
        try:
            questions = json.loads(s.questions_json)
        except Exception:
            questions = []
        result.append({
            "id": s.id,
            "level": s.level,
            "accuracy": s.accuracy,
            "correct_count": s.correct_count,
            "total_count": s.total_count,
            "date": s.date,
            "questions": questions
        })
    return result

@router.post("/{student_id}/recommendations", response_model=PsychologistRecommendationResponse)
def create_recommendation(
    student_id: str,
    data: PsychologistRecommendationCreate,
    psychologist_id: str = Query(...),
    db: Session = Depends(get_db)
):
    # Verify psychologist
    psy = db.query(Psychologist).filter(Psychologist.id == psychologist_id).first()
    if not psy:
        raise HTTPException(status_code=404, detail="Psikolog tidak ditemukan.")
        
    # Verify student
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
        
    rec_id = "rec-" + str(uuid.uuid4())[:8]
    
    # Format Indonesian date, e.g. "6 Juli 2026"
    months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]
    now = datetime.datetime.now()
    date_str = f"{now.day} {months[now.month - 1]} {now.year}"
    
    new_rec = PsychologistRecommendation(
        id=rec_id,
        student_id=student_id,
        name=psy.full_name,
        date_created=date_str,
        clinical_observation=data.clinicalObservation,
        therapy_plan=data.therapyPlan,
        psychologist_id=psychologist_id
    )
    
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)
    
    return new_rec

@router.get("/{student_id}/recommendations", response_model=List[PsychologistRecommendationResponse])
def get_student_recommendations(student_id: str, db: Session = Depends(get_db)):
    recommendations = db.query(PsychologistRecommendation).filter(
        PsychologistRecommendation.student_id == student_id
    ).all()
    # Sort: newest first
    recommendations.reverse()
    return recommendations
