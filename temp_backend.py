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
