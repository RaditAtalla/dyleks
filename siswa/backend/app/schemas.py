from pydantic import BaseModel, Field
from typing import Optional

class StudentUpdate(BaseModel):
    name: str
    age: int
    gender: str
    class_: str = Field(..., alias="class")
    teacherId: Optional[str] = None

    class Config:
        populate_by_name = True

class StudentResponse(BaseModel):
    id: str
    teacherId: str = Field(..., validation_alias="teacher_id", serialization_alias="teacherId")
    name: str
    class_: str = Field(..., validation_alias="class", serialization_alias="class")
    currentLevel: int = Field(..., validation_alias="current_level", serialization_alias="currentLevel")
    riskScore: int = Field(..., validation_alias="risk_score", serialization_alias="riskScore")
    riskClass: str = Field(..., validation_alias="risk_class", serialization_alias="riskClass")
    qrUrl: str = Field(..., validation_alias="qr_url", serialization_alias="qrUrl")
    age: Optional[int] = None
    gender: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class TeacherResponse(BaseModel):
    id: str
    fullName: str = Field(..., validation_alias="full_name", serialization_alias="fullName")
    schoolName: str = Field(..., validation_alias="school_name", serialization_alias="schoolName")
    city: str
    username: str

    class Config:
        from_attributes = True
        populate_by_name = True
