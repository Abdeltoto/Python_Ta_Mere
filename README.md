# 🐍👵 PythonTaMère - Code Python Comme un BOSS! 💥

> **"Si tu peux jouer à un jeu vidéo, tu peux apprendre Python!"** - Abdel (véto/pharmacien/dev de ouf)

Application web **ULTRA STYLÉE** pour apprendre Python avec des exercices qui claquent, exécutables direct dans ton navigateur ! Zéro install, maximum de fun ! 🚀

---

## 🔥 Pourquoi PythonTaMère Déchire Tout?

- 🚀 **Exécution INSTANT** : Python tourne dans ton navigateur (WASM magic!)
- ✅ **Feedback IMMÉDIAT** : Les tests te disent si t'as tout pété ou pas
- 📊 **Track ta Prog** : Deviens un Python Master et regarde tes stats monter!
- 🎮 **Style Gaming** : Apprends en t'amusant comme si tu rush un level
- 💪 **Zéro Galère** : Pas d'install, pas de config, juste du CODE!

---

## 🎯 Stack Technique (Pour les Curieux)

### Backend - Le Cerveau 🧠
- **FastAPI** : API REST qui déchire
- **SQLite** : Base de données simple mais efficace
- **JWT** : Auth sécurisée par magic link
- **Python 3.10+** : Parce qu'on est des warriors modernes

### Frontend - Le Visage 🎨
- **HTML/CSS/JS** : Vanilla, pas de framework qui ralentit
- **Monaco Editor** : L'éditeur de VS Code dans le browser!
- **Pyodide** : Python en WebAssembly (c'est DE LA FOLIE!)
- **Marked.js** : Pour rendre le Markdown stylé

---

## 🚀 Installation ULTRA RAPIDE

### Prérequis
- Python 3.10+ (si t'as pas, télécharge!)
- Un navigateur (Chrome, Firefox, Safari... pas IE hein!)

### Let's Go! (3 commandes, c'est tout!)

```bash
# 1️⃣ Clone le repo
git clone <ton-repo>
cd Python\ project

# 2️⃣ Install les deps
pip install -r requirements.txt

# 3️⃣ Init la DB avec des données d'exemple
python -m backend.init_db
```

### Lance les Serveurs! 🎮

**Terminal 1 - Backend:**
```bash
python -m backend.main
```
Tu devrais voir: `Uvicorn running on http://0.0.0.0:8000` ✅

**Terminal 2 - Frontend:**
```bash
python -m http.server 8080 --directory frontend
```

**Puis GO!** → http://localhost:8080 🚀

---

## 🎮 Comment Utiliser?

### Mode Invité (Test Rapide)
1. Ouvre http://localhost:8080
2. Clique sur **"LET'S GO!"**
3. Choisis une leçon
4. DESTROY les exercices! 💪

### Mode Warrior (Avec Compte)
1. Clique sur **"GO!"** (connexion)
2. Entre ton email
3. Copie le token (mode dev = il s'affiche direct)
4. BOOM! T'es connecté, ta prog est sauvée! 🎉

### Mode Admin (Créer du Contenu)
1. Connecte-toi avec `admin@pylearn.local`
2. L'onglet **"Admin"** apparaît
3. Crée tes propres leçons/exercices!

---

## 📚 Structure du Projet

```
PythonTaMère/
├── 🔧 backend/              # API FastAPI
│   ├── main.py             # Point d'entrée
│   ├── models.py           # DB models
│   ├── auth.py             # Magic link auth
│   └── routes/             # Tous les endpoints
│
├── 🎨 frontend/             # Interface web
│   ├── index.html          # Page principale
│   ├── css/                
│   │   ├── style.css       # Style PUNCHY
│   │   └── markdown-style.css  # Style des leçons
│   └── js/
│       ├── app.js          # App principale
│       ├── runner.js       # Pyodide runner
│       ├── editor.js       # Monaco Editor
│       ├── i18n.js         # FR/EN
│       └── messages.js     # Messages fun
│
├── 📄 *.md                 # Docs (tu lis ça là!)
├── requirements.txt        # Dépendances Python
└── pylearn.db             # Base SQLite (auto-créée)
```

---

## 🎓 Données d'Exemple Incluses

Le script `init_db.py` crée automatiquement:
- ✅ **8 leçons** progressives (Bases → Avancé)
- ✅ **15+ exercices** avec tests
- ✅ **1 admin** : `admin@pylearn.local`

---

## 🌍 Features Incluses

- [x] 🐍 Exécution Python dans le navigateur
- [x] ✅ Tests automatiques avec feedback
- [x] 📊 Système de progression
- [x] 🔐 Auth par magic link (JWT)
- [x] 🌍 Multi-langue (FR/EN)
- [x] 🎨 Interface gaming STYLÉE
- [x] 💻 Monaco Editor intégré
- [x] 🛡️ Mode admin pour gérer contenu
- [x] 📱 Responsive (mobile OK)

---

## 🔥 API Endpoints (Pour les Devs)

Accède à la doc interactive: **http://localhost:8000/docs**

### Auth
- `POST /auth/magic-link` - Demander un lien
- `POST /auth/verify` - Se connecter avec token
- `GET /auth/me` - Infos utilisateur

### Contenu
- `GET /lessons` - Liste des leçons
- `GET /lessons/{id}` - Détail leçon
- `GET /exercises/{id}` - Détail exercice

### Progression
- `POST /submissions` - Soumettre une solution
- `GET /submissions/me/progress` - Voir sa prog

---

## 🛡️ Sécurité

- ✅ **Exécution client** : Python tourne dans ton browser (sandbox)
- ✅ **JWT sécurisé** : Auth par token avec expiration
- ✅ **CORS configuré** : Pas d'accès non autorisé
- ✅ **Rate limiting** : Protection contre le spam
- ✅ **Validation Pydantic** : Données vérifiées

---

## 🚀 Pour Aller Plus Loin

### Ajouter 5 Nouvelles Leçons
```bash
python -m backend.add_lessons
```

### Créer un Admin
```bash
# Connecte-toi avec ton email d'abord
# Puis:
sqlite3 pylearn.db
UPDATE users SET is_admin = 1 WHERE email = 'ton@email.com';
```

### Déployer en Prod
```bash
# Utilise Docker
docker-compose up -d
```

---

## 👨‍⚕️ À Propos du Créateur

**Abdel ATIA** - Un mix de:
- 🩺 **Véto** qui soigne les animaux
- 💊 **Pharmacien** qui concocte des potions
- 🐍 **Python Dev** passionné d'IA
- 🤖 **IA Enthusiast** qui code des trucs de ouf

> *"Si je peux passer de soigner des chats à coder de l'IA, TOI aussi tu peux apprendre Python!"* 😎

---

## 📞 Support & Communauté

- 🐛 **Bug trouvé?** → Ouvre une issue (ou fix-le et PR!)
- 💡 **Idée de feature?** → Partage-la!
- 🎓 **Besoin d'aide?** → Check les autres `.md` docs

---

## 📜 License

MIT - Fais-en ce que tu veux! (mais cite-moi si t'es sympa 😉)

---

## 🎉 Let's Code!

```python
def devenir_python_warrior():
    while not tu_es_un_boss:
        apprendre()
        pratiquer()
        repeat()
    
    return "🏆 GG BRO!"

devenir_python_warrior()  # Let's GO! 🚀
```

**Rejoins PythonTaMère et deviens un Python Master!** 🐍👵💪

---

Made with 💖 and lots of ☕ by **Abdel ATIA**
