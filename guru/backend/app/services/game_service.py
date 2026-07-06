import json
from collections import Counter
from sqlalchemy.orm import Session
from db import GameSession

def get_game_sessions(db: Session, student_id: str):
    sessions = db.query(GameSession).filter(GameSession.student_id == student_id).all()
    # Return reversed to show latest first
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

def calculate_game_stats(db: Session, student_id: str):
    sessions = db.query(GameSession).filter(GameSession.student_id == student_id).all()
    if not sessions:
        return {"accuracy": "0%", "commonWrong": "Tidak ada data"}

    total_accuracy = sum(s.accuracy for s in sessions)
    avg_accuracy = round(total_accuracy / len(sessions))

    # Calculate common wrong
    wrong_elements = []
    for s in sessions:
        try:
            questions = json.loads(s.questions_json)
            for q in questions:
                if not q.get("isCorrect", True):
                    target = q.get("target")
                    if target:
                        wrong_elements.append(target)
        except Exception:
            pass

    if not wrong_elements:
        common_wrong = "Tidak ada kesalahan dominan"
    else:
        counter = Counter(wrong_elements)
        most_common = counter.most_common(3) # Get top 3
        items_str = ", ".join(f"'{item}'" for item, count in most_common)
        common_wrong = f"Vokal {items_str}"

    return {
        "accuracy": f"{avg_accuracy}%",
        "commonWrong": common_wrong
    }
