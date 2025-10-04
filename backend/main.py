"""Point d'entrée principal de l'API FastAPI."""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.database import engine, Base
from backend.routes import auth_routes, lessons_routes, exercises_routes, submissions_routes

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Créer les tables
Base.metadata.create_all(bind=engine)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Créer l'application
app = FastAPI(
    title="PythonTaMère API 🐍👵",
    description="API pour la plateforme d'auto-formation Python la plus crunchy et punchy!",
    version="1.0.0"
)

# Ajouter le rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configuration CORS - Autoriser tous les ports pour le développement
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En développement, autoriser toutes les origines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth_routes.router)
app.include_router(lessons_routes.router)
app.include_router(exercises_routes.router)
app.include_router(submissions_routes.router)


@app.get("/")
async def root():
    """Route racine."""
    return {
        "message": "Welcome to PythonTaMère API 🐍👵 - Let's code like warriors!",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
