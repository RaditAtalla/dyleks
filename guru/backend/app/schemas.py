from pydantic import BaseModel, Field
from typing import Optional

class TeacherRegister(BaseModel):
    fullName: str
    schoolName: str
    city: str
    username: str
    password: str

class TeacherLogin(BaseModel):
    username: str
    password: str

class TeacherResponse(BaseModel):
    id: str
    fullName: str = Field(..., validation_alias="full_name", serialization_alias="fullName")
    schoolName: str = Field(..., validation_alias="school_name", serialization_alias="schoolName")
    city: str
    username: str

    class Config:
        from_attributes = True
        populate_by_name = True

class StudentSchema(BaseModel):
    id: str
    teacherId: str = Field(..., validation_alias="teacher_id", serialization_alias="teacherId")
    name: str
    class_: str = Field(..., validation_alias="class", serialization_alias="class")
    currentLevel: int = Field(1, validation_alias="current_level", serialization_alias="currentLevel")
    riskScore: int = Field(0, validation_alias="risk_score", serialization_alias="riskScore")
    riskClass: str = Field("low", validation_alias="risk_class", serialization_alias="riskClass")
    qrUrl: str = Field(..., validation_alias="qr_url", serialization_alias="qrUrl")
    age: Optional[int] = None
    gender: Optional[str] = None
    studyPlan: Optional[str] = Field(None, validation_alias="study_plan", serialization_alias="studyPlan")
    xp: int = Field(0, validation_alias="xp", serialization_alias="xp")

    class Config:
        from_attributes = True
        populate_by_name = True

class ActivityLogSchema(BaseModel):
    id: str
    teacherId: str = Field(..., validation_alias="teacher_id", serialization_alias="teacherId")
    studentName: str = Field(..., validation_alias="student_name", serialization_alias="studentName")
    action: str
    timestamp: str

    class Config:
        from_attributes = True
        populate_by_name = True

class LogCreate(BaseModel):
    teacherId: str
    studentName: str
    action: str

class QuestionResultSchema(BaseModel):
    questionNo: int = Field(..., serialization_alias="questionNo")
    type: str
    target: str
    answer: str
    isCorrect: bool = Field(..., serialization_alias="isCorrect")
    ocrAccuracy: Optional[float] = Field(None, serialization_alias="ocrAccuracy")

    class Config:
        populate_by_name = True

class GameSessionResponse(BaseModel):
    id: str
    level: int
    accuracy: int
    correctCount: int = Field(..., validation_alias="correct_count", serialization_alias="correctCount")
    totalCount: int = Field(..., validation_alias="total_count", serialization_alias="totalCount")
    date: str
    questions: list[QuestionResultSchema]

    class Config:
        from_attributes = True
        populate_by_name = True

class GameStatsResponse(BaseModel):
    accuracy: str
    commonWrong: str

    class Config:
        populate_by_name = True

class PsychologistRecommendationSchema(BaseModel):
    id: str
    name: str
    dateCreated: str = Field(..., validation_alias="date_created", serialization_alias="dateCreated")
    clinicalObservation: str = Field(..., validation_alias="clinical_observation", serialization_alias="clinicalObservation")
    therapyPlan: str = Field(..., validation_alias="therapy_plan", serialization_alias="therapyPlan")

    class Config:
        from_attributes = True
        populate_by_name = True

