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

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, index=True)
    teacher_id = Column(String, ForeignKey("teachers.id"), nullable=False)
    student_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
