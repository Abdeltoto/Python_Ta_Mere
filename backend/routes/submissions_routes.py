"""Routes pour les soumissions."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from backend.database import get_db
from backend.models import Submission, Exercise, User, Progress, LessonStatus
from backend.schemas import (
    SubmissionCreate,
    Submission as SubmissionSchema,
    SubmissionResponse,
    ProgressSummary
)
from backend.auth import get_current_user

router = APIRouter(prefix="/submissions", tags=["submissions"])


@router.post("", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_solution(
    submission: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Soumet une solution pour un exercice."""
    # Vérifier que l'exercice existe
    exercise = db.query(Exercise).filter(Exercise.id == submission.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # Créer la soumission
    db_submission = Submission(
        user_id=current_user.id,
        exercise_id=submission.exercise_id,
        code=submission.code,
        passed=submission.passed,
        passed_count=submission.passed_count,
        total_count=submission.total_count,
        runtime_ms=submission.runtime_ms,
        error_message=submission.error_message
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Si l'exercice est réussi, mettre à jour la progression de la leçon
    if submission.passed:
        lesson_id = exercise.lesson_id
        
        # Vérifier si tous les exercices de la leçon sont réussis
        lesson_exercises = db.query(Exercise).filter(Exercise.lesson_id == lesson_id).all()
        all_completed = True
        
        for ex in lesson_exercises:
            successful = db.query(Submission).filter(
                Submission.user_id == current_user.id,
                Submission.exercise_id == ex.id,
                Submission.passed == True
            ).first()
            if not successful:
                all_completed = False
                break
        
        # Mettre à jour le statut de la leçon
        if all_completed:
            progress = db.query(Progress).filter(
                Progress.user_id == current_user.id,
                Progress.lesson_id == lesson_id
            ).first()
            
            if progress:
                progress.status = LessonStatus.COMPLETED
            else:
                progress = Progress(
                    user_id=current_user.id,
                    lesson_id=lesson_id,
                    status=LessonStatus.COMPLETED
                )
                db.add(progress)
            
            db.commit()
    
    message = "Solution accepted!" if submission.passed else "Some tests failed. Keep trying!"
    
    return SubmissionResponse(
        accepted=submission.passed,
        message=message,
        submission_id=db_submission.id
    )


@router.get("/me", response_model=List[SubmissionSchema])
async def get_my_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20
):
    """Récupère les soumissions de l'utilisateur courant."""
    submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).order_by(Submission.created_at.desc()).limit(limit).all()
    
    return submissions


@router.get("/exercise/{exercise_id}", response_model=List[SubmissionSchema])
async def get_exercise_submissions(
    exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère les soumissions pour un exercice spécifique."""
    submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.exercise_id == exercise_id
    ).order_by(Submission.created_at.desc()).all()
    
    return submissions


@router.get("/me/progress", response_model=ProgressSummary)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère un résumé de la progression de l'utilisateur."""
    from backend.models import Lesson
    
    # Total de leçons
    total_lessons = db.query(func.count(Lesson.id)).scalar()
    
    # Leçons complétées
    completed_lessons = db.query(func.count(Progress.id)).filter(
        Progress.user_id == current_user.id,
        Progress.status == LessonStatus.COMPLETED
    ).scalar()
    
    # Total d'exercices
    total_exercises = db.query(func.count(Exercise.id)).scalar()
    
    # Exercices réussis (au moins une soumission passée)
    completed_exercises = db.query(func.count(func.distinct(Submission.exercise_id))).filter(
        Submission.user_id == current_user.id,
        Submission.passed == True
    ).scalar()
    
    # Soumissions récentes
    recent_submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).order_by(Submission.created_at.desc()).limit(10).all()
    
    return ProgressSummary(
        total_lessons=total_lessons or 0,
        completed_lessons=completed_lessons or 0,
        total_exercises=total_exercises or 0,
        completed_exercises=completed_exercises or 0,
        recent_submissions=recent_submissions
    )

