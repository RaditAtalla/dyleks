import sys
import os
import bcrypt

# Ensure the root of the project is in the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import db components relative to project root
from db import engine, Base, SessionLocal, Teacher, Student, ActivityLog, GameSession, PsychologistRecommendation
import json

def init():
    # 1. Create tables
    print("Creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # 2. Add mock data
    db = SessionLocal()
    try:

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
                qr_url="student.dyleks?student_id=412",
                xp=48
            ),
            Student(
                id="283",
                teacher_id="teacher-1",
                name="Ani Wijaya",
                class_="3-A",
                current_level=4,
                risk_score=48,
                risk_class="medium",
                qr_url="student.dyleks?student_id=283",
                xp=70
            ),
            Student(
                id="719",
                teacher_id="teacher-1",
                name="Siti Aminah",
                class_="3-B",
                current_level=2,
                risk_score=12,
                risk_class="low",
                qr_url="student.dyleks?student_id=719",
                xp=25
            ),
            Student(
                id="542",
                teacher_id="teacher-1",
                name="Rian Hidayat",
                class_="3-B",
                current_level=5,
                risk_score=68,
                risk_class="high",
                qr_url="student.dyleks?student_id=542",
                xp=95
            )
        ]
        
        for student in mock_students:
            db.add(student)
        db.commit()

        print("Seeding initial mock game sessions...")
        q_set1 = json.dumps([
            {"questionNo": 1, "type": "choice", "target": "A", "answer": "A", "isCorrect": True},
            {"questionNo": 2, "type": "choice", "target": "I", "answer": "I", "isCorrect": True},
            {"questionNo": 3, "type": "choice", "target": "U", "answer": "U", "isCorrect": True},
            {"questionNo": 4, "type": "choice", "target": "E", "answer": "A", "isCorrect": False},
            {"questionNo": 5, "type": "choice", "target": "O", "answer": "O", "isCorrect": True},
            {"questionNo": 6, "type": "choice", "target": "A", "answer": "A", "isCorrect": True},
            {"questionNo": 7, "type": "choice", "target": "I", "answer": "I", "isCorrect": True},
            {"questionNo": 8, "type": "choice", "target": "U", "answer": "O", "isCorrect": False},
            {"questionNo": 9, "type": "handwriting", "target": "E", "answer": "I", "isCorrect": False, "ocrAccuracy": 44},
            {"questionNo": 10, "type": "handwriting", "target": "O", "answer": "O", "isCorrect": True, "ocrAccuracy": 91}
        ])

        q_set2 = json.dumps([
            {"questionNo": 1, "type": "choice", "target": "A", "answer": "A", "isCorrect": True},
            {"questionNo": 2, "type": "choice", "target": "I", "answer": "I", "isCorrect": True},
            {"questionNo": 3, "type": "choice", "target": "U", "answer": "U", "isCorrect": True},
            {"questionNo": 4, "type": "choice", "target": "E", "answer": "E", "isCorrect": True},
            {"questionNo": 5, "type": "choice", "target": "O", "answer": "O", "isCorrect": True},
            {"questionNo": 6, "type": "choice", "target": "A", "answer": "A", "isCorrect": True},
            {"questionNo": 7, "type": "choice", "target": "I", "answer": "E", "isCorrect": False},
            {"questionNo": 8, "type": "choice", "target": "U", "answer": "U", "isCorrect": True},
            {"questionNo": 9, "type": "handwriting", "target": "A", "answer": "A", "isCorrect": True, "ocrAccuracy": 86},
            {"questionNo": 10, "type": "handwriting", "target": "U", "answer": "O", "isCorrect": False, "ocrAccuracy": 38}
        ])

        q_set3 = json.dumps([
            {"questionNo": 1, "type": "choice", "target": "A", "answer": "A", "isCorrect": True},
            {"questionNo": 2, "type": "choice", "target": "I", "answer": "I", "isCorrect": True},
            {"questionNo": 3, "type": "choice", "target": "U", "answer": "U", "isCorrect": True},
            {"questionNo": 4, "type": "choice", "target": "E", "answer": "E", "isCorrect": True},
            {"questionNo": 5, "type": "choice", "target": "O", "answer": "O", "isCorrect": True},
            {"questionNo": 6, "type": "choice", "target": "A", "answer": "A", "isCorrect": True},
            {"questionNo": 7, "type": "choice", "target": "I", "answer": "I", "isCorrect": True},
            {"questionNo": 8, "type": "choice", "target": "U", "answer": "U", "isCorrect": True},
            {"questionNo": 9, "type": "handwriting", "target": "E", "answer": "E", "isCorrect": True, "ocrAccuracy": 95},
            {"questionNo": 10, "type": "handwriting", "target": "O", "answer": "O", "isCorrect": True, "ocrAccuracy": 91}
        ])

        mock_sessions = [
            GameSession(id="sess-1", student_id="412", level=3, accuracy=70, correct_count=7, total_count=10, date="Hari ini, 10:15", questions_json=q_set1),
            GameSession(id="sess-2", student_id="412", level=2, accuracy=60, correct_count=6, total_count=10, date="Kemarin, 14:30", questions_json=q_set2),
            GameSession(id="sess-3", student_id="283", level=4, accuracy=80, correct_count=8, total_count=10, date="Hari ini, 09:40", questions_json=q_set1),
            GameSession(id="sess-4", student_id="283", level=4, accuracy=80, correct_count=8, total_count=10, date="3 hari yang lalu, 11:10", questions_json=q_set2),
            GameSession(id="sess-5", student_id="719", level=2, accuracy=100, correct_count=10, total_count=10, date="Kemarin, 08:50", questions_json=q_set3)
        ]

        for sess in mock_sessions:
            db.add(sess)
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

        print("Seeding initial mock psychologist recommendations...")
        mock_recommendations = [
            PsychologistRecommendation(
                id="rec-1",
                student_id="412",
                name="Dr. Diana Prasetyo, M.Psi., Psikolog",
                date_created="20 Juni 2026",
                clinical_observation="Siswa menunjukkan hambatan besar pada diskriminasi fonem vokal 'E dan O'. Terdapat kecenderungan disorientasi arah penulisan huruf simetris (b/d). Kognisi verbal normal namun respon tertunda akibat beban kerja memori yang berat.",
                therapy_plan="Lakukan sesi individual multisensori (VAKT) selama 15 menit setiap pagi sebelum kelas dimulai. Fokus pada tracing taktil huruf-huruf berpasangan. Rujuk ke terapis okupasi untuk memperkuat koordinasi visual-motorik."
            ),
            PsychologistRecommendation(
                id="rec-2",
                student_id="412",
                name="Bambang Irawan, S.Psi., M.Psi.",
                date_created="02 Juli 2026",
                clinical_observation="Kecemasan akademik sedang karena sering mengalami kegagalan membaca di depan kelas. Menolak tugas membaca bersuara berparagraf panjang.",
                therapy_plan="Hindari meminta siswa membaca bersuara di depan kelas tanpa persiapan. Berikan bahan bacaan terstruktur pendek dengan visualisasi yang mendukung konteks cerita."
            ),
            PsychologistRecommendation(
                id="rec-3",
                student_id="283",
                name="Dr. Diana Prasetyo, M.Psi., Psikolog",
                date_created="15 Juni 2026",
                clinical_observation="Hambatan membaca ringan. Kadang melakukan fonem pengganti (substitusi) pada kata dasar level 4. Membaca masih tersendat-sendat namun pemahaman bacaan cukup baik.",
                therapy_plan="Berikan latihan kartu suku kata terstruktur. Mainkan game mencocokkan kartu memori huruf 3x seminggu untuk membangun kelancaran ejaan dasar."
            ),
            PsychologistRecommendation(
                id="rec-4",
                student_id="719",
                name="Rian Hermawan, S.Psi., M.Psi.",
                date_created="28 Juni 2026",
                clinical_observation="Tidak ada hambatan klinis disleksia yang signifikan. Kesalahan minor hanya akibat konsentrasi yang beralih saat tes.",
                therapy_plan="Pertahankan metode pembelajaran biasa. Lakukan tinjauan berkala 3 bulan sekali melalui game bertahap untuk memastikan perkembangan konsisten."
            ),
            PsychologistRecommendation(
                id="rec-5",
                student_id="542",
                name="Dr. Diana Prasetyo, M.Psi., Psikolog",
                date_created="20 Juni 2026",
                clinical_observation="Siswa menunjukkan hambatan besar pada diskriminasi fonem vokal 'U dan I'. Terdapat kecenderungan disorientasi arah penulisan huruf simetris (p/q). Kognisi verbal normal namun respon tertunda akibat beban kerja memori yang berat.",
                therapy_plan="Lakukan sesi individual multisensori (VAKT) selama 15 menit setiap pagi sebelum kelas dimulai. Fokus pada tracing taktil huruf-huruf berpasangan. Rujuk ke terapis okupasi untuk memperkuat koordinasi visual-motorik."
            ),
            PsychologistRecommendation(
                id="rec-6",
                student_id="542",
                name="Bambang Irawan, S.Psi., M.Psi.",
                date_created="02 Juli 2026",
                clinical_observation="Kecemasan akademik sedang karena sering mengalami kegagalan membaca di depan kelas. Menolak tugas membaca bersuara berparagraf panjang.",
                therapy_plan="Hindari meminta siswa membaca bersuara di depan kelas tanpa persiapan. Berikan bahan bacaan terstruktur pendek dengan visualisasi yang mendukung konteks cerita."
            )
        ]

        for rec in mock_recommendations:
            db.add(rec)
        db.commit()

        print("Initialization completed successfully!")
        
    except Exception as e:
        print(f"Error during initialization: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init()
