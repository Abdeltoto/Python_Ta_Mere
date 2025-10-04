"""Modèles de base de données SQLAlchemy."""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from backend.database import Base


class LessonStatus(str, enum.Enum):
    """Statut d'une leçon pour un utilisateur."""
    NOT_STARTED = "not_started"
    SEEN = "seen"
    COMPLETED = "completed"


class TestVisibility(str, enum.Enum):
    """Visibilité d'un test."""
    PUBLIC = "public"
    HIDDEN = "hidden"


class User(Base):
    """Utilisateur de la plateforme."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    submissions = relationship("Submission", back_populates="user")
    progress = relationship("Progress", back_populates="user")


class Lesson(Base):
    """Leçon/Module d'apprentissage."""
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    body_md = Column(Text, nullable=False)  # Contenu en Markdown
    module = Column(String, nullable=False)  # Ex: "Bases", "Contrôle de flux"
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="lesson")


class Exercise(Base):
    """Exercice de programmation."""
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    title = Column(String, nullable=False)
    prompt_md = Column(Text, nullable=False)  # Énoncé en Markdown
    difficulty = Column(Integer, default=1)  # 1-5
    starter_code = Column(Text, default="")  # Code de départ
    solution = Column(Text, default="")  # Solution de référence (admin)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    lesson = relationship("Lesson", back_populates="exercises")
    testcases = relationship("TestCase", back_populates="exercise", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="exercise")


class TestCase(Base):
    """Test unitaire pour un exercice."""
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    name = Column(String, nullable=False)  # Nom descriptif du test
    visibility = Column(SQLEnum(TestVisibility), default=TestVisibility.PUBLIC)
    code_snippet = Column(Text, nullable=False)  # Code Python du test
    timeout_ms = Column(Integer, default=5000)  # Timeout en millisecondes
    order = Column(Integer, default=0)
    
    # Relations
    exercise = relationship("Exercise", back_populates="testcases")


class Submission(Base):
    """Soumission de code par un utilisateur."""
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    code = Column(Text, nullable=False)
    passed = Column(Boolean, default=False)
    passed_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    runtime_ms = Column(Float, default=0.0)
    error_message = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    user = relationship("User", back_populates="submissions")
    exercise = relationship("Exercise", back_populates="submissions")


class Progress(Base):
    """Progression d'un utilisateur dans une leçon."""
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    status = Column(SQLEnum(LessonStatus), default=LessonStatus.NOT_STARTED)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")


class MagicToken(Base):
    """Token pour authentification par lien magique."""
    __tablename__ = "magic_tokens"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

