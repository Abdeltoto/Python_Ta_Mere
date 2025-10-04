"""Routes d'authentification."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import MagicLinkRequest, VerifyTokenRequest, TokenResponse, User as UserSchema
from backend.auth import (
    create_magic_token,
    verify_magic_token,
    create_access_token,
    get_user_by_email,
    create_user,
    get_current_user
)
import logging

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


@router.post("/magic-link")
async def request_magic_link(request: MagicLinkRequest, db: Session = Depends(get_db)):
    """Demande un lien magique pour l'authentification."""
    token = create_magic_token(request.email, db)
    
    # En production, envoyer par email
    # Pour le MVP/dev, retourner le token (à retirer en prod!)
    logger.info(f"Magic link requested for {request.email}: {token}")
    
    return {
        "message": "Magic link sent to your email",
        "dev_token": token  # RETIRER EN PRODUCTION!
    }


@router.post("/verify", response_model=TokenResponse)
async def verify_token(request: VerifyTokenRequest, db: Session = Depends(get_db)):
    """Vérifie le token magique et retourne un JWT."""
    email = verify_magic_token(request.token, db)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Créer l'utilisateur s'il n'existe pas
    user = get_user_by_email(email, db)
    if not user:
        user = create_user(email, db)
    
    # Créer le JWT
    access_token = create_access_token(data={"sub": user.email})
    
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Récupère les informations de l'utilisateur courant."""
    return current_user

