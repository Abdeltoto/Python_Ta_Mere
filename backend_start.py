#!/usr/bin/env python3
"""
Script de démarrage simple pour PythonTaMère
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
current_dir = Path(__file__).parent.absolute()
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

# Changer vers le répertoire du projet
os.chdir(parent_dir)

# Maintenant importer et lancer le backend
if __name__ == "__main__":
    try:
        from backend.main import app
        import uvicorn
        
        print("Démarrage du backend PythonTaMère...")
        print("Backend: http://localhost:8000")
        print("Docs API: http://localhost:8000/docs")
        print("Appuyez sur Ctrl+C pour arrêter")
        
        uvicorn.run(app, host="0.0.0.0", port=8000)
        
    except Exception as e:
        print(f"Erreur: {e}")
        sys.exit(1)
