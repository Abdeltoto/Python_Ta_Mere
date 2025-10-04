#!/usr/bin/env python3
"""
Script d'initialisation de la base de données PythonTaMère
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire courant au PYTHONPATH
current_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(current_dir))

# Changer vers le répertoire du projet
os.chdir(current_dir)

# Définir PYTHONPATH
os.environ['PYTHONPATH'] = str(current_dir)

if __name__ == "__main__":
    try:
        print("Initialisation de la base de donnees PythonTaMere...")
        
        # Importer les modules backend
        from backend.database import engine, Base, SessionLocal
        from backend.models import User, Lesson, Exercise, TestCase, Progress, Submission, MagicToken
        
        # Créer toutes les tables
        print("Creation des tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables creees!")
        
        # Créer une session
        db = SessionLocal()
        
        try:
            # Vérifier si des données existent déjà
            existing_lessons = db.query(Lesson).count()
            if existing_lessons > 0:
                print(f"Base de donnees deja initialisee ({existing_lessons} lecons existantes)")
                print("Voulez-vous reinitialiser? (y/N)")
                response = input().lower()
                if response != 'y':
                    print("Initialisation annulee")
                    sys.exit(0)
                else:
                    # Supprimer les données existantes
                    db.query(Submission).delete()
                    db.query(Progress).delete()
                    db.query(TestCase).delete()
                    db.query(Exercise).delete()
                    db.query(Lesson).delete()
                    db.query(User).delete()
                    db.commit()
                    print("Donnees existantes supprimees")
            
            # Créer l'utilisateur admin
            print("Creation de l'utilisateur admin...")
            admin_user = User(
                email="admin@pylearn.local",
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Utilisateur admin cree: admin@pylearn.local")
            
            # Créer les leçons d'exemple
            print("Creation des lecons d'exemple...")
            
            # Leçon 1: Les Bases
            lesson1 = Lesson(
                slug="les-bases",
                title="Les Bases de Python",
                body_md="""# Les Bases de Python

Bienvenue dans votre premier cours Python ! 

## Qu'est-ce que Python ?

Python est un langage de programmation puissant et facile à apprendre. Il est utilisé pour :
- Développement web
- Science des données
- Intelligence artificielle
- Automatisation

## Votre premier programme

En Python, vous pouvez afficher du texte avec la fonction `print()` :

```python
print("Hello World!")
```

## Variables

Les variables permettent de stocker des informations :

```python
nom = "Alice"
age = 25
print(f"Je m'appelle {nom} et j'ai {age} ans")
```

## Types de données

Python reconnaît automatiquement le type de vos données :
- **Texte** : `"Bonjour"`
- **Nombre entier** : `42`
- **Nombre décimal** : `3.14`
- **Booléen** : `True` ou `False`

Maintenant, passons aux exercices pour pratiquer !""",
                module="Les Bases",
                order=1
            )
            db.add(lesson1)
            db.commit()
            
            # Exercice 1
            exercise1 = Exercise(
                lesson_id=lesson1.id,
                title="Hello World",
                prompt_md="""# Exercice : Hello World

Écrivez un programme qui affiche "Hello World!" à l'écran.

## Instructions
Utilisez la fonction `print()` pour afficher le message.""",
                difficulty=1,
                starter_code="",
                order=1
            )
            db.add(exercise1)
            db.commit()
            
            # Test pour l'exercice 1
            test1 = TestCase(
                exercise_id=exercise1.id,
                name="Affichage Hello World",
                visibility="public",
                code_snippet="""# Test que le programme affiche "Hello World!"
import sys
from io import StringIO

# Capturer la sortie
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()

# Exécuter le code utilisateur
exec(user_code)

# Récupérer la sortie
output = captured_output.getvalue()
sys.stdout = old_stdout

# Vérifier
assert "Hello World!" in output, f"Attendu 'Hello World!' mais obtenu: {output.strip()}"
assert output.strip() == "Hello World!", f"Sortie exacte attendue 'Hello World!' mais obtenu: {output.strip()}" """,
                order=1
            )
            db.add(test1)
            
            # Leçon 2: Variables et Types
            lesson2 = Lesson(
                slug="variables-et-types",
                title="Variables et Types de Données",
                body_md="""# Variables et Types de Données

## Qu'est-ce qu'une variable ?

Une variable est comme une boîte où vous pouvez stocker des informations. En Python, vous pouvez créer une variable simplement en lui donnant un nom et une valeur.

```python
nom = "Alice"
age = 25
taille = 1.65
est_etudiant = True
```

## Types de données en Python

### 1. Texte (str)
```python
prenom = "Alice"
message = 'Bonjour le monde!'
```

### 2. Nombres entiers (int)
```python
age = 25
nombre_enfants = 2
```

### 3. Nombres décimaux (float)
```python
prix = 19.99
temperature = 23.5
```

### 4. Booléens (bool)
```python
est_majeur = True
est_etudiant = False
```

## Opérations avec les variables

Vous pouvez utiliser les variables dans des calculs :

```python
a = 10
b = 5
somme = a + b
print(somme)  # Affiche 15
```

## Concaténation de texte

Pour combiner du texte, utilisez `+` :

```python
prenom = "Alice"
nom = "Martin"
nom_complet = prenom + " " + nom
print(nom_complet)  # Affiche "Alice Martin"
```

## F-strings (recommandé)

Une façon moderne de formater du texte :

```python
nom = "Alice"
age = 25
print(f"Je m'appelle {nom} et j'ai {age} ans")
```""",
                module="Les Bases",
                order=2
            )
            db.add(lesson2)
            db.commit()
            
            # Exercice 2
            exercise2 = Exercise(
                lesson_id=lesson2.id,
                title="Variables et Calculs",
                prompt_md="""# Exercice : Variables et Calculs

Créez un programme qui :
1. Déclare deux variables `a` et `b` avec les valeurs 15 et 3
2. Calcule leur somme, différence, produit et quotient
3. Affiche les résultats

## Instructions
- Utilisez des variables pour stocker les valeurs
- Affichez chaque résultat avec `print()`
- Format : "Somme: X", "Difference: Y", etc.""",
                difficulty=2,
                starter_code="",
                order=1
            )
            db.add(exercise2)
            db.commit()
            
            # Test pour l'exercice 2
            test2 = TestCase(
                exercise_id=exercise2.id,
                name="Calculs corrects",
                visibility="public",
                code_snippet="""# Test des calculs
import sys
from io import StringIO

# Capturer la sortie
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()

# Exécuter le code utilisateur
exec(user_code)

# Récupérer la sortie
output = captured_output.getvalue()
sys.stdout = old_stdout

# Vérifier que tous les calculs sont présents
assert "Somme: 18" in output, "Somme incorrecte"
assert "Difference: 12" in output, "Différence incorrecte"  
assert "Produit: 45" in output, "Produit incorrect"
assert "Quotient: 5" in output, "Quotient incorrect" """,
                order=1
            )
            db.add(test2)
            
            db.commit()
            
            print("Base de donnees initialisee avec succes!")
            print(f"- 2 lecons creees")
            print(f"- 2 exercices creees")
            print(f"- 2 tests creees")
            print(f"- Utilisateur admin: admin@pylearn.local")
            
        except Exception as e:
            db.rollback()
            print(f"Erreur lors de l'initialisation: {e}")
            raise
        finally:
            db.close()
            
    except Exception as e:
        print(f"Erreur: {e}")
        sys.exit(1)
