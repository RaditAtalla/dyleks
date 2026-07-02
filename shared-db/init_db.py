import sys
import os
import bcrypt

# Ensure the root of the project is in the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import db components relative to project root
from db import engine, Base, SessionLocal, Teacher, Student, ActivityLog

def init():
    # 1. Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Add mock data
    db = SessionLocal()
    try:
        # Check if already initialized
        teacher_exists = db.query(Teacher).filter(Teacher.id == "teacher-1").first()
        if teacher_exists:
            print("Database already initialized.")
            return

        print("Seeding default teacher 'teacher-1' (username: bu_siti)...")
        # Hash default password
        hashed_password = bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode("utf-8")
        
        default_teacher = Teacher(
            id="teacher-1",
            full_name="Siti Rahma, S.Pd.",
            school_name="SD Merdeka Belajar",
            city="Jakarta",
            username="bu_siti",
            password_hash=hashed_password
        )
        db.add(default_teacher)
        db.commit()

        print("Seeding initial mock students...")
        mock_students = [
            Student(
                id="412",
                teacher_id="teacher-1",
                name="Budi Santoso",
                class_="3-A",
                current_level=3,
                risk_score=84,
                risk_class="high",
                qr_url="student.dyleks?student_id=412"
            ),
            Student(
                id="283",
                teacher_id="teacher-1",
                name="Ani Wijaya",
                class_="3-A",
                current_level=4,
                risk_score=48,
                risk_class="medium",
                qr_url="student.dyleks?student_id=283"
            ),
            Student(
                id="719",
                teacher_id="teacher-1",
                name="Siti Aminah",
                class_="3-B",
                current_level=2,
                risk_score=12,
                risk_class="low",
                qr_url="student.dyleks?student_id=719"
            ),
            Student(
                id="542",
                teacher_id="teacher-1",
                name="Rian Hidayat",
                class_="3-B",
                current_level=5,
                risk_score=68,
                risk_class="high",
                qr_url="student.dyleks?student_id=542"
            )
        ]
        
        for student in mock_students:
            db.add(student)
        db.commit()

        print("Seeding initial logs...")
        mock_logs = [
            ActivityLog(
                id="log-1",
                teacher_id="teacher-1",
                student_name="Budi Santoso",
                action="menyelesaikan latihan level 2",
                timestamp="10:15 - Hari ini"
            ),
            ActivityLog(
                id="log-2",
                teacher_id="teacher-1",
                student_name="Ani Wijaya",
                action="meningkat ke level 4",
                timestamp="09:42 - Hari ini"
            ),
            ActivityLog(
                id="log-3",
                teacher_id="teacher-1",
                student_name="Siti Aminah",
                action="terdaftar sebagai siswa baru",
                timestamp="08:30 - Kemarin"
            ),
            ActivityLog(
                id="log-4",
                teacher_id="teacher-1",
                student_name="Rian Hidayat",
                action="menyelesaikan latihan level 4",
                timestamp="15:20 - Kemarin"
            )
        ]
        
        for log in mock_logs:
            db.add(log)
        db.commit()
        
        print("Initialization completed successfully!")
        
    except Exception as e:
        print(f"Error during initialization: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init()
