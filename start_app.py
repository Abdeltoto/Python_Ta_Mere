#!/usr/bin/env python3
"""
Script de démarrage pour PythonTaMère
Résout les problèmes de PYTHONPATH et démarre l'application
"""

import sys
import os
import subprocess
import time
import webbrowser
from pathlib import Path

def main():
    # S'assurer qu'on est dans le bon répertoire
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    
    print("PythonTaMere - Demarrage de l'application")
    print("=" * 50)
    
    # Ajouter le répertoire courant au PYTHONPATH
    if str(script_dir) not in sys.path:
        sys.path.insert(0, str(script_dir))
    
    print(f"Repertoire de travail: {script_dir}")
    print(f"Python path: {sys.path[0]}")
    
    # Vérifier que les fichiers existent
    backend_file = script_dir / "backend" / "main.py"
    frontend_dir = script_dir / "frontend"
    
    if not backend_file.exists():
        print(f"ERREUR: {backend_file} introuvable")
        return 1
    
    if not frontend_dir.exists():
        print(f"ERREUR: {frontend_dir} introuvable")
        return 1
    
    print("Fichiers trouves")
    
    try:
        print("\nDemarrage du Backend API...")
        print("   Backend: http://localhost:8000")
        print("   Docs API: http://localhost:8000/docs")
        
        # Démarrer le backend
        backend_cmd = [sys.executable, str(backend_file)]
        backend_process = subprocess.Popen(
            backend_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Attendre que le backend démarre
        time.sleep(3)
        
        # Vérifier si le backend fonctionne
        try:
            import requests
            response = requests.get("http://localhost:8000/health", timeout=5)
            if response.status_code == 200:
                print("Backend demarre avec succes!")
            else:
                print("Backend demarre mais reponse inattendue")
        except ImportError:
            print("Module requests non disponible, impossible de verifier le backend")
        except Exception as e:
            print(f"Impossible de verifier le backend: {e}")
        
        print("\nDemarrage du Frontend...")
        print("   Frontend: http://localhost:3000")
        
        # Démarrer le frontend
        frontend_cmd = [
            sys.executable, "-m", "http.server", "3000", 
            "--directory", str(frontend_dir)
        ]
        frontend_process = subprocess.Popen(frontend_cmd)
        
        # Attendre un peu
        time.sleep(2)
        
        print("\nApplication demarree avec succes!")
        print("\nAcces a l'application:")
        print("   Frontend:    http://localhost:3000")
        print("   Backend API: http://localhost:8000")
        print("   Docs API:    http://localhost:8000/docs")
        print("\nPour arreter l'application, appuyez sur Ctrl+C")
        
        # Ouvrir le navigateur
        try:
            webbrowser.open("http://localhost:3000")
            print("Navigateur ouvert automatiquement")
        except Exception as e:
            print(f"Impossible d'ouvrir le navigateur: {e}")
        
        # Attendre que l'utilisateur arrête
        try:
            backend_process.wait()
        except KeyboardInterrupt:
            print("\nArret de l'application...")
            backend_process.terminate()
            frontend_process.terminate()
            print("Application arretee")
        
        return 0
        
    except Exception as e:
        print(f"Erreur lors du demarrage: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())