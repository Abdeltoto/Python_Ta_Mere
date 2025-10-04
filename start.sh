#!/bin/bash

echo "===================================="
echo "PythonTaMère - Démarrage de l'application"
echo "===================================="
echo ""

echo "[1/3] Installation des dépendances..."
pip install -r requirements.txt

echo ""
echo "[2/3] Initialisation de la base de données..."
python backend/init_db.py

echo ""
echo "[3/3] Démarrage du serveur..."
echo ""
echo "Backend API: http://localhost:8000"
echo "Frontend:    http://localhost:3000"
echo "Documentation API: http://localhost:8000/docs"
echo ""

# Démarrer le frontend en arrière-plan
python -m http.server 3000 --directory frontend &
FRONTEND_PID=$!

# Démarrer le backend
python backend/main.py

# Nettoyer au exit
trap "kill $FRONTEND_PID" EXIT

