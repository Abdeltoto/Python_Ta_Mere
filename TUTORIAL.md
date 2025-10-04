# Guide de Démarrage Rapide - PythonTaMère 🐍👵

Ce guide vous aidera à lancer PythonTaMère sur votre machine en quelques minutes.

## 🚀 Démarrage Rapide

### Option 1: Script automatique (Recommandé)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Démarrage manuel

1. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

2. **Initialiser la base de données**
```bash
python backend/init_db.py
```

3. **Démarrer le backend** (Terminal 1)
```bash
python backend/main.py
```

4. **Démarrer le frontend** (Terminal 2)
```bash
python -m http.server 3000 --directory frontend
```

5. **Ouvrir dans le navigateur**
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

### Option 3: Docker

```bash
docker-compose up
```

## 📚 Premiers Pas

### 1. Créer un compte

1. Cliquez sur "Connexion" dans la barre de navigation
2. Entrez votre email
3. En mode développement, un token s'affiche directement
4. Cliquez sur "Se connecter"

**Note:** En production, le token serait envoyé par email.

### 2. Explorer les leçons

1. Allez sur "Leçons"
2. Cliquez sur une leçon pour voir son contenu
3. Chaque leçon contient des exercices pratiques

### 3. Résoudre un exercice

1. Cliquez sur un exercice
2. Écrivez votre code dans l'éditeur (Monaco Editor)
3. Cliquez sur "Exécuter" pour tester votre code
4. Cliquez sur "Valider" pour lancer les tests automatiques
5. Si tous les tests passent, l'exercice est validé !

### 4. Suivre votre progression

Allez sur "Profil" pour voir:
- Nombre de leçons complétées
- Exercices réussis
- Historique des soumissions

## 🎯 Exemple: Premier Exercice

**Exercice: Hello World**

1. Aller à "Leçons" → "Les Bases de Python"
2. Cliquer sur l'exercice "Hello World"
3. Écrire dans l'éditeur:
```python
print("Hello, World!")
```
4. Cliquer sur "Valider"
5. ✅ Tous les tests passent !

## 🔧 Configuration Avancée

### Variables d'environnement

Créez un fichier `.env` à la racine:

```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./pylearn.db
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DEBUG=True
```

### Créer un compte admin

1. Se connecter normalement
2. Ouvrir la base de données SQLite:
```bash
sqlite3 pylearn.db
```
3. Mettre à jour votre utilisateur:
```sql
UPDATE users SET is_admin = 1 WHERE email = 'votre@email.com';
```

### Ajouter du contenu

Les administrateurs peuvent créer des leçons et exercices via l'API:

**Documentation API:** http://localhost:8000/docs

## 🐛 Résolution de Problèmes

### Port déjà utilisé

Si le port 8000 ou 3000 est déjà utilisé:

```bash
# Trouver le processus
netstat -ano | findstr :8000

# Tuer le processus (Windows)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Erreur de dépendances

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Réinstaller les dépendances
pip install -r requirements.txt
```

### Base de données corrompue

```bash
# Supprimer et recréer
rm pylearn.db
python backend/init_db.py
```

## 📖 Ressources

- **Documentation API**: http://localhost:8000/docs
- **Code source**: Consultez le README.md
- **Structure du projet**: Voir l'arborescence dans README.md

## 🎓 Créer sa Première Leçon (Admin)

### Via API (curl)

```bash
# 1. Se connecter et récupérer le token
TOKEN="votre-jwt-token"

# 2. Créer une leçon
curl -X POST http://localhost:8000/lessons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ma-lecon",
    "title": "Ma Première Leçon",
    "body_md": "# Contenu en Markdown\n\nVoici ma leçon...",
    "module": "Mon Module",
    "order": 1
  }'

# 3. Créer un exercice
curl -X POST http://localhost:8000/exercises \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_id": 1,
    "title": "Mon Exercice",
    "prompt_md": "## Énoncé\n\nFaites ceci...",
    "difficulty": 1,
    "starter_code": "# Votre code ici\n",
    "order": 1
  }'

# 4. Ajouter un test
curl -X POST http://localhost:8000/exercises/testcases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exercise_id": 1,
    "name": "Test basique",
    "visibility": "public",
    "code_snippet": "assert 1 + 1 == 2",
    "timeout_ms": 5000,
    "order": 1
  }'
```

### Via Python

```python
import requests

# Token JWT
token = "votre-jwt-token"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Créer une leçon
lesson_data = {
    "slug": "python-advanced",
    "title": "Python Avancé",
    "body_md": "# Python Avancé\n\nApprenons des concepts avancés...",
    "module": "Avancé",
    "order": 10
}
response = requests.post(
    "http://localhost:8000/lessons",
    json=lesson_data,
    headers=headers
)
lesson = response.json()
print(f"Leçon créée: {lesson['id']}")
```

## 🎉 Prêt !

Vous êtes maintenant prêt à utiliser PythonTaMère ! Bon apprentissage ! 🐍👵

