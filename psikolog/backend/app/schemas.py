from pydantic import BaseModel, Field
from typing import Optional, List

class PsychologistRegister(BaseModel):
    fullName: str
    username: str
    strNumber: str
    clinic: str
    password: str

class PsychologistLogin(BaseModel):
    username: str
    password: str

class PsychologistResponse(BaseModel):
    id: str
    fullName: str = Field(..., validation_alias="full_name", serialization_alias="fullName")
    username: str
    strNumber: str = Field(..., validation_alias="str_number", serialization_alias="strNumber")
    clinic: str

    class Config:
        from_attributes = True
        populate_by_name = True

class StudentResponse(BaseModel):
    id: str
    teacherId: str = Field(..., validation_alias="teacher_id", serialization_alias="teacherId")
    name: str
    class_: str = Field(..., validation_alias="class", serialization_alias="class")
    currentLevel: int = Field(1, validation_alias="current_level", serialization_alias="currentLevel")
    riskScore: int = Field(0, validation_alias="risk_score", serialization_alias="riskScore")
    riskClass: str = Field("low", validation_alias="risk_class", serialization_alias="riskClass")
    teacherName: str = Field(..., serialization_alias="teacherName")
    schoolName: str = Field(..., serialization_alias="schoolName")
    age: Optional[int] = None
    gender: Optional[str] = None
    studyPlan: Optional[str] = Field(None, validation_alias="study_plan", serialization_alias="studyPlan")
    xp: int = Field(0, validation_alias="xp", serialization_alias="xp")

    class Config:
        from_attributes = True
        populate_by_name = True

class PsychologistRecommendationCreate(BaseModel):
    clinicalObservation: str
    therapyPlan: str

class PsychologistRecommendationResponse(BaseModel):
    id: str
    studentId: str = Field(..., validation_alias="student_id", serialization_alias="studentId")
    name: str
    dateCreated: str = Field(..., validation_alias="date_created", serialization_alias="dateCreated")
    clinicalObservation: str = Field(..., validation_alias="clinical_observation", serialization_alias="clinicalObservation")
    therapyPlan: str = Field(..., validation_alias="therapy_plan", serialization_alias="therapyPlan")
    psychologistId: Optional[str] = Field(None, validation_alias="psychologist_id", serialization_alias="psychologistId")

    class Config:
        from_attributes = True
        populate_by_name = True

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
    questions: List[QuestionResultSchema]

    class Config:
        from_attributes = True
        populate_by_name = True
