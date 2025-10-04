# 🚀 PythonTaMère - Démarrage Rapide

## Installation en 3 commandes

```bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Initialiser la base de données avec des données d'exemple
python backend/init_db.py

# 3. Lancer l'application
python backend/main.py
```

Puis dans un autre terminal :

```bash
python -m http.server 3000 --directory frontend
```

**Accéder à l'application :**
- Frontend: http://localhost:3000
- API Backend: http://localhost:8000
- Documentation API: http://localhost:8000/docs

## 🎯 Test Rapide

### 1. Tester en mode invité
1. Ouvrir http://localhost:3000
2. Cliquer sur "Leçons"
3. Ouvrir "Les Bases de Python"
4. Faire l'exercice "Hello World"

### 2. Se connecter
1. Cliquer sur "Connexion"
2. Entrer un email (ex: `user@test.com`)
3. Copier le token affiché (mode dev)
4. Cliquer sur "Se connecter"

### 3. Mode Admin
1. Se connecter avec : `admin@pylearn.local`
2. Demander un magic link
3. Le token s'affiche en mode dev
4. Après connexion, un onglet "Admin" apparaît
5. Créer des leçons, exercices et tests !

## 📁 Structure Créée

```
PythonTaMère/
├── backend/               # API FastAPI
│   ├── main.py           # Point d'entrée
│   ├── database.py       # Config DB
│   ├── models.py         # Modèles SQLAlchemy
│   ├── schemas.py        # Schémas Pydantic
│   ├── auth.py           # Authentification
│   ├── init_db.py        # Script d'init + données exemple
│   └── routes/           # Endpoints API
│       ├── auth_routes.py
│       ├── lessons_routes.py
│       ├── exercises_routes.py
│       └── submissions_routes.py
│
├── frontend/             # Application Web
│   ├── index.html        # Page principale
│   ├── css/
│   │   └── style.css     # Styles
│   └── js/
│       ├── app.js        # Application principale
│       ├── api.js        # Client API
│       ├── editor.js     # Monaco Editor
│       └── runner.js     # Pyodide (Python en WASM)
│
├── requirements.txt      # Dépendances Python
├── README.md            # Documentation complète
├── TUTORIAL.md          # Guide détaillé
├── QUICKSTART.md        # Ce fichier
├── start.bat            # Script Windows
└── start.sh             # Script Linux/Mac
```

## ⚡ Fonctionnalités Implémentées

### ✅ Backend (API)
- [x] Authentification par magic link (OTP)
- [x] CRUD complet pour leçons, exercices, tests
- [x] Système de soumissions avec validation
- [x] Suivi de progression par utilisateur
- [x] Base de données SQLite avec données d'exemple
- [x] Documentation API auto-générée (FastAPI/Swagger)

### ✅ Frontend
- [x] Interface responsive et moderne
- [x] Navigation entre pages (Home, Leçons, Exercices, Profil, Admin)
- [x] Éditeur de code Monaco Editor (comme VS Code)
- [x] Exécution Python dans le navigateur (Pyodide/WebAssembly)
- [x] Tests automatiques avec feedback visuel
- [x] Suivi de progression temps réel
- [x] Interface admin pour créer du contenu

### ✅ Sécurité
- [x] JWT pour l'authentification
- [x] CORS configuré
- [x] Rate limiting
- [x] Sandbox Python côté client (pas d'exécution serveur)

## 🎓 Données d'Exemple Incluses

La base de données est pré-remplie avec :
- **3 leçons** : Les Bases, Opérations & Conditions, Les Boucles
- **5 exercices** progressifs avec tests
- **1 compte admin** : `admin@pylearn.local`

## 🔧 Configuration

### Modifier le port du backend
Éditer `backend/main.py` ligne finale :
```python
uvicorn.run(..., port=8000)  # Changer 8000
```

### Modifier le port du frontend
```bash
python -m http.server 3001 --directory frontend  # Changer 3000
```

Puis mettre à jour `frontend/js/api.js` :
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## 📚 Prochaines Étapes

1. **Créer plus de contenu** : Utiliser l'interface admin
2. **Personnaliser** : Modifier les styles CSS
3. **Déployer** : Utiliser Docker (voir `docker-compose.yml`)
4. **Améliorer** : Ajouter plus de fonctionnalités (voir TODO dans README.md)

## 🐛 Problèmes Courants

### Port déjà utilisé
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill
```

### Pyodide ne charge pas
- Vérifier la connexion internet (Pyodide est chargé depuis CDN)
- Ouvrir la console navigateur (F12) pour voir les erreurs

### Tests ne passent pas
- Les tests sont exécutés côté client
- Vérifier que le code respecte exactement la consigne
- Voir les messages d'erreur dans l'onglet "Tests"

## 💡 Astuces

- **Mode Dev** : Le token magic link s'affiche directement (pas besoin d'email)
- **Admin** : Se connecter avec `admin@pylearn.local` pour accéder à l'admin
- **API Docs** : Explorer http://localhost:8000/docs pour tester l'API
- **Console Python** : Utiliser `print()` dans le code pour déboguer

## 🎉 C'est Parti !

Vous êtes prêt à utiliser PythonTaMère ! Bon apprentissage Python ! 🐍

Pour plus de détails, consultez :
- `README.md` : Documentation complète
- `TUTORIAL.md` : Guide pas à pas détaillé

