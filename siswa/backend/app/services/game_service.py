import uuid
import json
import datetime
from sqlalchemy.orm import Session
from db import Student, GameSession, ActivityLog
from app.schemas import GameSessionCreate

def create_game_session(db: Session, student_id: str, data: GameSessionCreate) -> Student:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise ValueError("Student not found")

    # Generate a unique ID for the session
    session_id = f"sess-{str(uuid.uuid4())[:8]}"
    
    # Formatted date
    now = datetime.datetime.now()
    date_str = f"Hari ini, {now.strftime('%H:%M')}"

    # Serialize questions list
    questions_list = []
    for q in data.questions:
        q_dict = {
            "questionNo": q.questionNo,
            "type": q.type,
            "target": q.target,
            "answer": q.answer,
            "isCorrect": q.isCorrect
        }
        if q.ocrAccuracy is not None:
            q_dict["ocrAccuracy"] = q.ocrAccuracy
        questions_list.append(q_dict)

    # Insert Game Session
    new_session = GameSession(
        id=session_id,
        student_id=student.id,
        level=data.level,
        accuracy=data.accuracy,
        correct_count=data.correctCount,
        total_count=data.totalCount,
        date=date_str,
        questions_json=json.dumps(questions_list)
    )
    db.add(new_session)

    # Calculate XP and level-up logic
    earned_xp = data.correctCount * 10
    current_xp = student.xp or 0
    new_xp = current_xp + earned_xp

    level_up = False
    old_level = student.current_level or 1
    new_level = old_level

    if new_xp >= 100:
        level_up = True
        new_level = old_level + 1
        student.current_level = new_level
        student.xp = new_xp % 100
    else:
        student.xp = new_xp

    # Flush the new session to the transaction so it is visible to the query below.
    # Without this, autoflush=False means new_session is not yet written, causing the
    # first-ever game session of a student to return an empty list and skip risk recalculation.
    db.flush()

    # Recalculate dyslexia risk level dynamically based on actual game session accuracy
    sessions = db.query(GameSession).filter(GameSession.student_id == student.id).all()
    if sessions:
        total_accuracy = sum(s.accuracy for s in sessions)
        avg_accuracy = total_accuracy / len(sessions)
        risk_score = max(0, min(100, round(100 - avg_accuracy)))
        
        if risk_score >= 50:
            risk_class = "high"
        elif risk_score >= 20:
            risk_class = "medium"
        else:
            risk_class = "low"
            
        student.risk_score = risk_score
        student.risk_class = risk_class

    db.commit()
    db.refresh(student)

    # Generate activity logs
    # 1. Completion log
    log1_id = str(uuid.uuid4())[:8]
    log1_timestamp = now.strftime("%H:%M") + " - Hari ini"
    log1 = ActivityLog(
        id=log1_id,
        teacher_id=student.teacher_id,
        student_name=student.name,
        action=f"menyelesaikan latihan level {data.level} dengan akurasi {data.accuracy}%",
        timestamp=log1_timestamp
    )
    db.add(log1)

    # 2. Level up log if applicable
    if level_up:
        log2_id = str(uuid.uuid4())[:8]
        log2_timestamp = now.strftime("%H:%M") + " - Hari ini"
        log2 = ActivityLog(
            id=log2_id,
            teacher_id=student.teacher_id,
            student_name=student.name,
            action=f"meningkat ke level {new_level}",
            timestamp=log2_timestamp
        )
        db.add(log2)

    db.commit()
    db.refresh(student)
    
    return student
