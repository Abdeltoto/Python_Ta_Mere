"""Routes pour les exercices."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import Exercise, TestCase, TestVisibility, User
from backend.schemas import (
    Exercise as ExerciseSchema,
    ExerciseDetail,
    ExerciseCreate,
    ExerciseUpdate,
    TestCase as TestCaseSchema,
    TestCaseCreate,
    TestCaseUpdate
)
from backend.auth import get_current_user_optional, get_current_admin_user

router = APIRouter(prefix="/exercises", tags=["exercises"])


@router.get("/{exercise_id}", response_model=ExerciseDetail)
async def get_exercise(
    exercise_id: int,
    current_user = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Récupère un exercice avec ses tests publics."""
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # Ne retourner que les tests publics (sauf si admin)
    is_admin = current_user and current_user.is_admin if current_user else False
    
    if is_admin:
        testcases = exercise.testcases
    else:
        testcases = [tc for tc in exercise.testcases if tc.visibility == TestVisibility.PUBLIC]
    
    public_test_count = len([tc for tc in exercise.testcases if tc.visibility == TestVisibility.PUBLIC])
    
    return ExerciseDetail(
        id=exercise.id,
        lesson_id=exercise.lesson_id,
        title=exercise.title,
        prompt_md=exercise.prompt_md,
        difficulty=exercise.difficulty,
        starter_code=exercise.starter_code,
        order=exercise.order,
        created_at=exercise.created_at,
        public_test_count=public_test_count,
        testcases=[TestCaseSchema(
            id=tc.id,
            exercise_id=tc.exercise_id,
            name=tc.name,
            visibility=tc.visibility,
            code_snippet=tc.code_snippet,
            timeout_ms=tc.timeout_ms,
            order=tc.order
        ) for tc in sorted(testcases, key=lambda t: t.order)]
    )


@router.post("", response_model=ExerciseSchema, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise: ExerciseCreate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Crée un nouvel exercice (admin seulement)."""
    db_exercise = Exercise(**exercise.model_dump())
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    
    return ExerciseSchema(
        id=db_exercise.id,
        lesson_id=db_exercise.lesson_id,
        title=db_exercise.title,
        prompt_md=db_exercise.prompt_md,
        difficulty=db_exercise.difficulty,
        starter_code=db_exercise.starter_code,
        order=db_exercise.order,
        created_at=db_exercise.created_at,
        public_test_count=0
    )


@router.patch("/{exercise_id}", response_model=ExerciseSchema)
async def update_exercise(
    exercise_id: int,
    exercise_update: ExerciseUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Met à jour un exercice (admin seulement)."""
    db_exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not db_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    update_data = exercise_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_exercise, field, value)
    
    db.commit()
    db.refresh(db_exercise)
    
    public_test_count = len([tc for tc in db_exercise.testcases if tc.visibility == TestVisibility.PUBLIC])
    
    return ExerciseSchema(
        id=db_exercise.id,
        lesson_id=db_exercise.lesson_id,
        title=db_exercise.title,
        prompt_md=db_exercise.prompt_md,
        difficulty=db_exercise.difficulty,
        starter_code=db_exercise.starter_code,
        order=db_exercise.order,
        created_at=db_exercise.created_at,
        public_test_count=public_test_count
    )


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise(
    exercise_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Supprime un exercice (admin seulement)."""
    db_exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not db_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    db.delete(db_exercise)
    db.commit()
    
    return None


# Routes pour les TestCases
@router.post("/testcases", response_model=TestCaseSchema, status_code=status.HTTP_201_CREATED)
async def create_testcase(
    testcase: TestCaseCreate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Crée un nouveau test case (admin seulement)."""
    db_testcase = TestCase(**testcase.model_dump())
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    
    return db_testcase


@router.patch("/testcases/{testcase_id}", response_model=TestCaseSchema)
async def update_testcase(
    testcase_id: int,
    testcase_update: TestCaseUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Met à jour un test case (admin seulement)."""
    db_testcase = db.query(TestCase).filter(TestCase.id == testcase_id).first()
    if not db_testcase:
        raise HTTPException(status_code=404, detail="TestCase not found")
    
    update_data = testcase_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_testcase, field, value)
    
    db.commit()
    db.refresh(db_testcase)
    
    return db_testcase


@router.delete("/testcases/{testcase_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testcase(
    testcase_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Supprime un test case (admin seulement)."""
    db_testcase = db.query(TestCase).filter(TestCase.id == testcase_id).first()
    if not db_testcase:
        raise HTTPException(status_code=404, detail="TestCase not found")
    
    db.delete(db_testcase)
    db.commit()
    
    return None

