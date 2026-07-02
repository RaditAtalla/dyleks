from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
import uuid
import datetime

from db import get_db, ActivityLog
from app.schemas import ActivityLogSchema, LogCreate

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.get("", response_model=List[ActivityLogSchema])
def get_logs(teacher_id: str = Query(...), db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).filter(ActivityLog.teacher_id == teacher_id).order_by(ActivityLog.id.desc()).all()
    return logs

@router.post("", response_model=ActivityLogSchema)
def create_log(log_data: LogCreate, db: Session = Depends(get_db)):
    log_id = str(uuid.uuid4())[:8]
    timestamp = datetime.datetime.now().strftime("%H:%M") + " - Hari ini"
    
    new_log = ActivityLog(
        id=log_id,
        teacher_id=log_data.teacherId,
        student_name=log_data.studentName,
        action=log_data.action,
        timestamp=timestamp
    )
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log
