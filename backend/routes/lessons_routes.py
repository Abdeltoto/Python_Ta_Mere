"""Routes pour les leçons."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from backend.database import get_db
from backend.models import Lesson, Exercise, Progress, Submission, LessonStatus, User
from backend.schemas import (
    LessonSummary,
    Lesson as LessonSchema,
    LessonCreate,
    LessonUpdate
)
from backend.auth import get_current_user_optional, get_current_admin_user

router = APIRouter(prefix="/lessons", tags=["lessons"])


@router.get("", response_model=List[LessonSummary])
async def get_lessons(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Liste toutes les leçons avec progression."""
    lessons = db.query(Lesson).order_by(Lesson.module, Lesson.order).all()
    
    result = []
    for lesson in lessons:
        # Compter les exercices
        exercise_count = db.query(func.count(Exercise.id)).filter(
            Exercise.lesson_id == lesson.id
        ).scalar()
        
        # Récupérer le statut si utilisateur connecté
        status = LessonStatus.NOT_STARTED
        if current_user:
            progress = db.query(Progress).filter(
                Progress.user_id == current_user.id,
                Progress.lesson_id == lesson.id
            ).first()
            if progress:
                status = progress.status
        
        result.append(LessonSummary(
            id=lesson.id,
            slug=lesson.slug,
            title=lesson.title,
            module=lesson.module,
            order=lesson.order,
            exercise_count=exercise_count,
            status=status
        ))
    
    return result


@router.get("/{lesson_id}", response_model=LessonSchema)
async def get_lesson(
    lesson_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Récupère une leçon avec ses exercices."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Marquer comme vue si utilisateur connecté
    if current_user:
        progress = db.query(Progress).filter(
            Progress.user_id == current_user.id,
            Progress.lesson_id == lesson.id
        ).first()
        
        if not progress:
            progress = Progress(
                user_id=current_user.id,
                lesson_id=lesson.id,
                status=LessonStatus.SEEN
            )
            db.add(progress)
            db.commit()
        elif progress.status == LessonStatus.NOT_STARTED:
            progress.status = LessonStatus.SEEN
            db.commit()
    
    # Récupérer les exercices avec leur statut
    exercises = []
    for exercise in lesson.exercises:
        completed = False
        if current_user:
            # Vérifier si l'exercice a été réussi
            successful_submission = db.query(Submission).filter(
                Submission.user_id == current_user.id,
                Submission.exercise_id == exercise.id,
                Submission.passed == True
            ).first()
            completed = successful_submission is not None
        
        from backend.schemas import ExerciseSummary
        exercises.append(ExerciseSummary(
            id=exercise.id,
            title=exercise.title,
            difficulty=exercise.difficulty,
            order=exercise.order,
            completed=completed
        ))
    
    return LessonSchema(
        id=lesson.id,
        slug=lesson.slug,
        title=lesson.title,
        body_md=lesson.body_md,
        module=lesson.module,
        order=lesson.order,
        created_at=lesson.created_at,
        exercises=sorted(exercises, key=lambda e: e.order)
    )


@router.post("", response_model=LessonSchema, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    lesson: LessonCreate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle leçon (admin seulement)."""
    # Vérifier que le slug est unique
    existing = db.query(Lesson).filter(Lesson.slug == lesson.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db_lesson = Lesson(**lesson.model_dump())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    
    return LessonSchema(
        id=db_lesson.id,
        slug=db_lesson.slug,
        title=db_lesson.title,
        body_md=db_lesson.body_md,
        module=db_lesson.module,
        order=db_lesson.order,
        created_at=db_lesson.created_at,
        exercises=[]
    )


@router.patch("/{lesson_id}", response_model=LessonSchema)
async def update_lesson(
    lesson_id: int,
    lesson_update: LessonUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Met à jour une leçon (admin seulement)."""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    update_data = lesson_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_lesson, field, value)
    
    db.commit()
    db.refresh(db_lesson)
    
    return get_lesson(lesson_id, None, db)


@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(
    lesson_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Supprime une leçon (admin seulement)."""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    db.delete(db_lesson)
    db.commit()
    
    return None

