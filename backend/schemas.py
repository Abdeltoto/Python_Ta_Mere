"""Schémas Pydantic pour validation et sérialisation."""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from backend.models import LessonStatus, TestVisibility


# Auth schemas
class MagicLinkRequest(BaseModel):
    email: EmailStr


class VerifyTokenRequest(BaseModel):
    token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# User schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Lesson schemas
class LessonBase(BaseModel):
    slug: str
    title: str
    body_md: str
    module: str
    order: int = 0


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    body_md: Optional[str] = None
    module: Optional[str] = None
    order: Optional[int] = None


class LessonSummary(BaseModel):
    id: int
    slug: str
    title: str
    module: str
    order: int
    exercise_count: int
    status: LessonStatus = LessonStatus.NOT_STARTED

    class Config:
        from_attributes = True


class Lesson(LessonBase):
    id: int
    created_at: datetime
    exercises: List['ExerciseSummary'] = []

    class Config:
        from_attributes = True


# Exercise schemas
class ExerciseBase(BaseModel):
    title: str
    prompt_md: str
    difficulty: int = Field(ge=1, le=5)
    starter_code: str = ""
    order: int = 0


class ExerciseCreate(ExerciseBase):
    lesson_id: int


class ExerciseUpdate(BaseModel):
    title: Optional[str] = None
    prompt_md: Optional[str] = None
    difficulty: Optional[int] = Field(None, ge=1, le=5)
    starter_code: Optional[str] = None
    solution: Optional[str] = None
    order: Optional[int] = None


class ExerciseSummary(BaseModel):
    id: int
    title: str
    difficulty: int
    order: int
    completed: bool = False

    class Config:
        from_attributes = True


class Exercise(ExerciseBase):
    id: int
    lesson_id: int
    created_at: datetime
    public_test_count: int = 0

    class Config:
        from_attributes = True


class ExerciseDetail(Exercise):
    testcases: List['TestCase'] = []


# TestCase schemas
class TestCaseBase(BaseModel):
    name: str
    visibility: TestVisibility = TestVisibility.PUBLIC
    code_snippet: str
    timeout_ms: int = 5000
    order: int = 0


class TestCaseCreate(TestCaseBase):
    exercise_id: int


class TestCaseUpdate(BaseModel):
    name: Optional[str] = None
    visibility: Optional[TestVisibility] = None
    code_snippet: Optional[str] = None
    timeout_ms: Optional[int] = None
    order: Optional[int] = None


class TestCase(TestCaseBase):
    id: int
    exercise_id: int

    class Config:
        from_attributes = True


# Submission schemas
class SubmissionCreate(BaseModel):
    exercise_id: int
    code: str
    passed: bool
    passed_count: int
    total_count: int
    runtime_ms: float
    error_message: str = ""


class Submission(BaseModel):
    id: int
    user_id: int
    exercise_id: int
    code: str
    passed: bool
    passed_count: int
    total_count: int
    runtime_ms: float
    error_message: str
    created_at: datetime

    class Config:
        from_attributes = True


class SubmissionResponse(BaseModel):
    accepted: bool
    message: str
    submission_id: int


# Progress schemas
class ProgressUpdate(BaseModel):
    lesson_id: int
    status: LessonStatus


class ProgressSummary(BaseModel):
    total_lessons: int
    completed_lessons: int
    total_exercises: int
    completed_exercises: int
    recent_submissions: List[Submission] = []


# Update forward references
Lesson.model_rebuild()
ExerciseDetail.model_rebuild()

