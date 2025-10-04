# PythonTaMère - Script de démarrage PowerShell
# Démarre le backend et le frontend automatiquement

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "PythonTaMère - Démarrage de l'application" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
$currentPath = Get-Location
if (-not (Test-Path "backend\main.py")) {
    Write-Host "Erreur: Veuillez exécuter ce script depuis le répertoire Python_Ta_Mere" -ForegroundColor Red
    exit 1
}

# Définir PYTHONPATH
$env:PYTHONPATH = "."

Write-Host "[1/2] Démarrage du Backend API..." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Docs API: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""

# Démarrer le backend en arrière-plan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentPath'; `$env:PYTHONPATH = '.'; py -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

# Attendre un peu que le backend démarre
Start-Sleep 3

Write-Host "[2/2] Démarrage du Frontend..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Démarrer le frontend en arrière-plan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentPath'; py -m http.server 3000 --directory frontend"

# Attendre un peu
Start-Sleep 2

Write-Host "✅ Application démarrée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Accès à l'application :" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   Docs API:    http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pour arrêter les serveurs, fermez les fenêtres PowerShell ouvertes" -ForegroundColor Yellow

# Ouvrir automatiquement le navigateur
Start-Process "http://localhost:3000"
