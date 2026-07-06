import os
from sqlalchemy import create_engine, Column, String, Integer, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker

# Determine database path relative to this file
# This file is in d:/dev/dyleks-new/shared-db/db.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR = os.path.join(BASE_DIR, "shared-db")
DB_PATH = os.path.join(DB_DIR, "dyleks.db")

# Create directory if it doesn't exist
os.makedirs(DB_DIR, exist_ok=True)

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    school_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    teacher_id = Column(String, ForeignKey("teachers.id"), nullable=False)
    name = Column(String, nullable=False)
    class_ = Column("class", String, nullable=False)  # Map "class" column specifically
    current_level = Column(Integer, default=1)
    risk_score = Column(Integer, default=0)
    risk_class = Column(String, default="low")
    qr_url = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    study_plan = Column(String, nullable=True)
    xp = Column(Integer, default=0)

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    level = Column(Integer, nullable=False)
    accuracy = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    total_count = Column(Integer, nullable=False)
    date = Column(String, nullable=False)
    questions_json = Column(String, nullable=False)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, index=True)
    teacher_id = Column(String, ForeignKey("teachers.id"), nullable=False)
    student_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)

class Psychologist(Base):
    __tablename__ = "psychologists"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    str_number = Column(String, nullable=False)
    clinic = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

class PsychologistRecommendation(Base):
    __tablename__ = "psychologist_recommendations"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    name = Column(String, nullable=False)
    date_created = Column(String, nullable=False)
    clinical_observation = Column(String, nullable=False)
    therapy_plan = Column(String, nullable=False)
    psychologist_id = Column(String, ForeignKey("psychologists.id"), nullable=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

