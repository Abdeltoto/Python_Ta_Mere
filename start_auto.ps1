# PythonTaMere - Script de demarrage automatique
# Resout les problemes de PYTHONPATH et demarre l'application

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "PythonTaMere - Demarrage automatique" -ForegroundColor Cyan  
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Verifier qu'on est dans le bon repertoire
$currentPath = Get-Location
if (-not (Test-Path "backend\main.py")) {
    Write-Host "ERREUR: Veuillez executer ce script depuis le repertoire Python_Ta_Mere" -ForegroundColor Red
    Write-Host "Repertoire actuel: $currentPath" -ForegroundColor Yellow
    Write-Host "Repertoire attendu: C:\Users\biena\Documents\Python ta mere\Python_Ta_Mere" -ForegroundColor Yellow
    exit 1
}

Write-Host "Repertoire de travail: $currentPath" -ForegroundColor Green
Write-Host ""

# Definir PYTHONPATH
$env:PYTHONPATH = "."
Write-Host "PYTHONPATH defini: $env:PYTHONPATH" -ForegroundColor Green

# Tuer les processus existants
Write-Host "Arret des processus existants..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*8000*" -or $_.CommandLine -like "*3000*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep 2

Write-Host ""
Write-Host "[1/2] Demarrage du Backend API..." -ForegroundColor Green
Write-Host "   Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "   Docs API: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""

# Demarrer le backend
$backendScript = @"
import sys
import os
sys.path.insert(0, os.getcwd())
os.environ['PYTHONPATH'] = os.getcwd()

try:
    from backend.main import app
    import uvicorn
    print('Backend PythonTaMere demarre...')
    print('Backend: http://localhost:8000')
    print('Docs API: http://localhost:8000/docs')
    print('Appuyez sur Ctrl+C pour arreter')
    uvicorn.run(app, host='0.0.0.0', port=8000)
except Exception as e:
    print(f'Erreur backend: {e}')
    input('Appuyez sur Entree pour continuer...')
"@

$backendScript | Out-File -FilePath "temp_backend.py" -Encoding UTF8

# Demarrer le backend en arriere-plan
$backendProcess = Start-Process -FilePath "py" -ArgumentList "temp_backend.py" -PassThru -WindowStyle Normal

# Attendre que le backend demarre
Write-Host "Attente du demarrage du backend..." -ForegroundColor Yellow
Start-Sleep 5

# Verifier si le backend fonctionne
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "Backend demarre avec succes!" -ForegroundColor Green
    } else {
        Write-Host "Backend demarre mais reponse inattendue" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Impossible de verifier le backend, mais il devrait fonctionner" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/2] Demarrage du Frontend..." -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Demarrer le frontend
$frontendProcess = Start-Process -FilePath "py" -ArgumentList "-m", "http.server", "3000", "--directory", "frontend" -PassThru -WindowStyle Normal

# Attendre un peu
Start-Sleep 2

Write-Host ""
Write-Host "Application demarree avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Acces a l'application:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   Docs API:    http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Pour arreter l'application, fermez les fenetres PowerShell ouvertes" -ForegroundColor Yellow
Write-Host "ou appuyez sur Ctrl+C dans chaque terminal" -ForegroundColor Yellow

# Ouvrir automatiquement le navigateur
try {
    Start-Process "http://localhost:3000"
    Write-Host ""
    Write-Host "Navigateur ouvert automatiquement sur http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Ouvrez manuellement votre navigateur sur http://localhost:3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur Entree pour continuer (les serveurs continuent de tourner)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Nettoyer le fichier temporaire
Remove-Item "temp_backend.py" -ErrorAction SilentlyContinue
