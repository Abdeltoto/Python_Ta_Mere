@echo off
echo ====================================
echo PythonTaMère - Demarrage de l'application
echo ====================================
echo.

echo [1/3] Installation des dependances...
pip install -r requirements.txt

echo.
echo [2/3] Initialisation de la base de donnees...
python backend/init_db.py

echo.
echo [3/3] Demarrage du serveur...
echo.
echo Backend API: http://localhost:8000
echo Frontend:    http://localhost:3000
echo Documentation API: http://localhost:8000/docs
echo.

start http://localhost:3000
start python -m http.server 3000 --directory frontend
python backend/main.py

