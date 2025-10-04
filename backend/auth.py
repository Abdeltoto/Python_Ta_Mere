"""Système d'authentification par magic link."""
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import os

from backend.database import get_db
from backend.models import User, MagicToken

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 jours

security = HTTPBearer()


def create_magic_token(email: str, db: Session) -> str:
    """Crée un token magique pour l'authentification."""
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    magic_token = MagicToken(
        email=email,
        token=token,
        expires_at=expires_at
    )
    db.add(magic_token)
    db.commit()
    
    return token


def verify_magic_token(token: str, db: Session) -> Optional[str]:
    """Vérifie un token magique et retourne l'email si valide."""
    magic_token = db.query(MagicToken).filter(
        MagicToken.token == token,
        MagicToken.used == False,
        MagicToken.expires_at > datetime.utcnow()
    ).first()
    
    if not magic_token:
        return None
    
    # Marquer le token comme utilisé
    magic_token.used = True
    db.commit()
    
    return magic_token.email


def create_access_token(data: dict) -> str:
    """Crée un JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(email: str, db: Session) -> Optional[User]:
    """Récupère un utilisateur par email."""
    return db.query(User).filter(User.email == email).first()


def create_user(email: str, db: Session) -> User:
    """Crée un nouvel utilisateur."""
    user = User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Récupère l'utilisateur courant depuis le JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_email(email=email, db=db)
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Vérifie que l'utilisateur courant est admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


# Fonction optionnelle: récupère l'utilisateur courant ou None (pour mode invité)
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Récupère l'utilisateur courant ou None si non authentifié."""
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        user = get_user_by_email(email=email, db=db)
        return user
    except JWTError:
        return None

