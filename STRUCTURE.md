# 📁 Structure du Projet PythonTaMère

```
PythonTaMère/
│
├── 📄 README.md                    # Documentation principale
├── 📄 QUICKSTART.md                # Guide de démarrage rapide
├── 📄 TUTORIAL.md                  # Tutoriel détaillé
├── 📄 PROJECT_SUMMARY.md           # Résumé du projet
├── 📄 STRUCTURE.md                 # Ce fichier
│
├── 📄 requirements.txt             # Dépendances Python
├── 📄 .gitignore                   # Fichiers à ignorer par Git
│
├── 🐳 docker-compose.yml           # Configuration Docker Compose
├── 🐳 Dockerfile.backend           # Image Docker backend
│
├── 🚀 start.sh                     # Script de démarrage (Linux/Mac)
├── 🚀 start.bat                    # Script de démarrage (Windows)
│
├── 🔧 backend/                     # API Backend (FastAPI)
│   ├── __init__.py
│   ├── 🎯 main.py                  # Point d'entrée de l'API
│   ├── 💾 database.py              # Configuration SQLAlchemy
│   ├── 📊 models.py                # Modèles de données (ORM)
│   ├── 📋 schemas.py               # Schémas Pydantic (validation)
│   ├── 🔐 auth.py                  # Système d'authentification
│   ├── 🔧 init_db.py               # Initialisation DB + données exemple
│   │
│   └── 🛣️ routes/                  # Endpoints de l'API
│       ├── __init__.py
│       ├── auth_routes.py          # Routes d'authentification
│       ├── lessons_routes.py       # Routes des leçons
│       ├── exercises_routes.py     # Routes des exercices
│       └── submissions_routes.py   # Routes des soumissions
│
└── 🌐 frontend/                    # Application Web
    ├── 📄 index.html               # Page HTML principale
    │
    ├── 🎨 css/
    │   └── style.css               # Styles CSS (responsive)
    │
    └── 💻 js/                      # Scripts JavaScript
        ├── api.js                  # Client API REST
        ├── app.js                  # Application principale
        ├── editor.js               # Monaco Editor (éditeur de code)
        └── runner.js               # Pyodide (exécution Python)
```

## 📊 Fichiers Générés au Runtime

```
PythonTaMère/
├── 💾 pylearn.db                   # Base de données SQLite (auto-créée)
└── 🔧 .env                         # Variables d'environnement (optionnel)
```

## 🔍 Détails des Composants

### Backend (8 fichiers Python)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `main.py` | ~80 | API FastAPI, CORS, routes |
| `database.py` | ~25 | Config SQLAlchemy, session DB |
| `models.py` | ~150 | 7 modèles (User, Lesson, Exercise, etc.) |
| `schemas.py` | ~180 | Schémas Pydantic pour validation |
| `auth.py` | ~120 | JWT, magic tokens, permissions |
| `init_db.py` | ~300 | Création tables + données exemple |
| `routes/*.py` | ~500 | Endpoints API (CRUD complet) |

**Total Backend: ~1355 lignes**

### Frontend (4 fichiers)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `index.html` | ~290 | Structure HTML, modals |
| `style.css` | ~710 | Styles complets, responsive |
| `api.js` | ~120 | Client API, authentification |
| `runner.js` | ~140 | Pyodide, exécution Python + tests |
| `editor.js` | ~60 | Monaco Editor wrapper |
| `app.js` | ~600 | Logique app, navigation, UI |

**Total Frontend: ~1920 lignes**

### Documentation (5 fichiers)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `README.md` | ~200 | Doc technique complète |
| `TUTORIAL.md` | ~350 | Guide pas à pas |
| `QUICKSTART.md` | ~200 | Démarrage rapide |
| `PROJECT_SUMMARY.md` | ~250 | Vue d'ensemble projet |
| `STRUCTURE.md` | ~150 | Arborescence (ce fichier) |

**Total Documentation: ~1150 lignes**

## 🗄️ Schéma de Base de Données

```sql
┌─────────────┐
│    users    │
├─────────────┤
│ id          │◄───┐
│ email       │    │
│ is_admin    │    │
│ created_at  │    │
└─────────────┘    │
                   │
     ┌─────────────┼─────────────┐
     │             │             │
     ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌─────────────┐
│ progress │  │submissions│  │magic_tokens │
├──────────┤  ├──────────┤  ├─────────────┤
│ user_id  │  │ user_id  │  │ email       │
│ lesson_id│  │exercise_id│  │ token       │
│ status   │  │ code     │  │ expires_at  │
└──────────┘  │ passed   │  │ used        │
     ▲        └──────────┘  └─────────────┘
     │             ▲
     │             │
┌────┴────┐   ┌────┴────┐
│ lessons │   │exercises│
├─────────┤   ├─────────┤
│ id      │◄──┤ id      │
│ slug    │   │lesson_id│◄───┐
│ title   │   │ title   │    │
│ body_md │   │prompt_md│    │
│ module  │   │starter  │    │
└─────────┘   └─────────┘    │
                              │
                         ┌────┴────┐
                         │testcases│
                         ├─────────┤
                         │ id      │
                         │exercise_id
                         │ name    │
                         │ code    │
                         │visibility│
                         └─────────┘
```

## 🔄 Flux de l'Application

### 1. Authentification
```
User → Email → Backend → Magic Token → User → Token → Backend → JWT
```

### 2. Chargement de Leçon
```
Frontend → GET /lessons → Backend → SQLite → JSON → Frontend → Render
```

### 3. Exercice
```
Frontend → GET /exercises/:id → Backend → (Lesson + Exercise + Tests) → Frontend
    ↓
Monaco Editor (code)
    ↓
Pyodide (exécute Python en WASM)
    ↓
Tests locaux
    ↓
POST /submissions → Backend → Save → Update Progress
```

## 📦 Dépendances

### Backend (Python)
- `fastapi` : Framework API REST
- `uvicorn` : Serveur ASGI
- `sqlalchemy` : ORM base de données
- `pydantic` : Validation de données
- `python-jose` : JWT
- `slowapi` : Rate limiting
- **Total: 13 packages**

### Frontend (CDN)
- `Monaco Editor` : Éditeur de code
- `Pyodide` : Python WebAssembly
- `Marked` : Rendu Markdown
- `Font Awesome` : Icônes
- **Tout chargé via CDN (pas de build)**

## 🎯 Points d'Entrée

### Démarrage Manuel
1. **Backend**: `python backend/main.py` → Port 8000
2. **Frontend**: `python -m http.server 3000 --directory frontend` → Port 3000

### Scripts
- **Windows**: `start.bat`
- **Linux/Mac**: `./start.sh`

### Docker
```bash
docker-compose up
```

## 📊 Métriques du Projet

| Catégorie | Valeur |
|-----------|--------|
| **Fichiers Python** | 12 |
| **Fichiers JS** | 4 |
| **Fichiers CSS** | 1 |
| **Fichiers HTML** | 1 |
| **Fichiers Config** | 5 |
| **Fichiers Doc** | 5 |
| **Total Fichiers** | 28 |
| **Lignes de Code** | ~3300 |
| **Lignes Doc** | ~1150 |
| **Modèles DB** | 7 |
| **Endpoints API** | 20+ |
| **Pages Frontend** | 6 |

## 🚀 Pour Aller Plus Loin

### Ajouter une Leçon
1. Se connecter en tant qu'admin
2. Aller sur "Admin"
3. Créer Leçon → Créer Exercice → Créer Tests

### Modifier les Styles
Éditer `frontend/css/style.css` (CSS moderne, variables CSS)

### Ajouter un Endpoint API
1. Créer route dans `backend/routes/`
2. Ajouter au router dans `backend/main.py`
3. Ajouter méthode dans `frontend/js/api.js`

### Déployer en Production
1. Configurer `.env` avec vraies valeurs
2. Migrer vers PostgreSQL si besoin
3. Utiliser `docker-compose.yml`
4. Setup reverse proxy (nginx)
5. Activer HTTPS (Let's Encrypt)

## 📝 Notes

- **Zéro Build**: Pas de webpack, pas de npm, juste du JS vanilla
- **Progressive**: Pyodide se charge en arrière-plan
- **Offline-ready**: Base pour une PWA
- **Scalable**: Architecture modulaire facile à étendre
- **Documenté**: Chaque fichier a des commentaires

---

**Structure créée le**: 2025-10-04  
**Version**: 1.0.0 (MVP)  
**License**: MIT

