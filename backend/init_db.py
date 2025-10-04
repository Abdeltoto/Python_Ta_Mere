"""Script d'initialisation de la base de données avec des données d'exemple."""
from sqlalchemy.orm import Session
from backend.database import engine, Base, SessionLocal
from backend.models import User, Lesson, Exercise, TestCase, TestVisibility


def create_sample_data(db: Session):
    """Crée des données d'exemple."""
    
    # Créer un admin
    admin = User(email="admin@pylearn.local", is_admin=True)
    db.add(admin)
    
    # Leçon 1: Les Bases
    lesson1 = Lesson(
        slug="python-basics",
        title="Les Bases de Python",
        body_md="""# Les Bases de Python

Bienvenue dans votre première leçon ! Nous allons découvrir les fondamentaux de Python.

## Variables et Types

En Python, vous pouvez créer des variables sans déclarer leur type :

```python
name = "Alice"
age = 25
height = 1.75
is_student = True
```

## Affichage avec print()

La fonction `print()` permet d'afficher des informations :

```python
print("Bonjour, monde !")
print("J'ai", age, "ans")
```

## À vous de jouer !

Passez aux exercices pour mettre en pratique ces concepts.
""",
        module="Bases",
        order=1
    )
    db.add(lesson1)
    db.flush()
    
    # Exercice 1.1: Hello World
    ex1 = Exercise(
        lesson_id=lesson1.id,
        title="Hello World",
        prompt_md="""Écrivez un programme qui affiche "Hello, World!" à l'écran.

**Objectif**: Utiliser la fonction `print()` pour afficher du texte.

**Exemple de sortie**:
```
Hello, World!
```
""",
        difficulty=1,
        starter_code='# Écrivez votre code ici\nprint("...")',
        solution='print("Hello, World!")',
        order=1
    )
    db.add(ex1)
    db.flush()
    
    # Tests pour exercice 1.1
    test1_1 = TestCase(
        exercise_id=ex1.id,
        name="Test basique",
        visibility=TestVisibility.PUBLIC,
        code_snippet="""
# Code de l'étudiant sera inséré ici
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = StringIO()

# Exécuter le code
exec(user_code)

output = sys.stdout.getvalue()
sys.stdout = old_stdout

assert "Hello, World!" in output, f"Attendu 'Hello, World!' mais obtenu: {output}"
""",
        timeout_ms=3000,
        order=1
    )
    db.add(test1_1)
    
    # Exercice 1.2: Variables
    ex2 = Exercise(
        lesson_id=lesson1.id,
        title="Utiliser des variables",
        prompt_md="""Créez deux variables `nom` et `age`, puis affichez-les dans une phrase.

**Objectif**: Créer des variables et les utiliser avec `print()`.

**Exemple**: Si `nom = "Alice"` et `age = 25`, afficher:
```
Je m'appelle Alice et j'ai 25 ans
```
""",
        difficulty=1,
        starter_code='''# Créez vos variables
nom = "Votre nom"
age = 0

# Affichez la phrase
print("...")''',
        solution='''nom = "Alice"
age = 25
print(f"Je m'appelle {nom} et j'ai {age} ans")''',
        order=2
    )
    db.add(ex2)
    db.flush()
    
    test2_1 = TestCase(
        exercise_id=ex2.id,
        name="Test avec variables",
        visibility=TestVisibility.PUBLIC,
        code_snippet="""
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = StringIO()

exec(user_code)

output = sys.stdout.getvalue()
sys.stdout = old_stdout

# Vérifier que les variables sont définies
assert 'nom' in dir(), "La variable 'nom' doit être définie"
assert 'age' in dir(), "La variable 'age' doit être définie"
assert len(output) > 0, "Vous devez afficher quelque chose"
""",
        timeout_ms=3000,
        order=1
    )
    db.add(test2_1)
    
    # Leçon 2: Opérations et Conditions
    lesson2 = Lesson(
        slug="operations-conditions",
        title="Opérations et Conditions",
        body_md="""# Opérations et Conditions

## Opérations arithmétiques

Python supporte toutes les opérations mathématiques de base :

```python
a = 10 + 5   # Addition
b = 10 - 5   # Soustraction
c = 10 * 5   # Multiplication
d = 10 / 5   # Division
e = 10 // 3  # Division entière
f = 10 % 3   # Modulo (reste)
g = 2 ** 3   # Puissance
```

## Conditions avec if

Les conditions permettent d'exécuter du code selon certaines conditions :

```python
age = 18

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")
```

## Opérateurs de comparaison

- `==` : égal à
- `!=` : différent de
- `<` : inférieur à
- `>` : supérieur à
- `<=` : inférieur ou égal
- `>=` : supérieur ou égal
""",
        module="Bases",
        order=2
    )
    db.add(lesson2)
    db.flush()
    
    # Exercice 2.1: Calculs
    ex3 = Exercise(
        lesson_id=lesson2.id,
        title="Calculatrice simple",
        prompt_md="""Créez une fonction `addition(a, b)` qui retourne la somme de deux nombres.

**Exemple**:
```python
addition(5, 3)  # Doit retourner 8
addition(10, -2)  # Doit retourner 8
```
""",
        difficulty=1,
        starter_code='''def addition(a, b):
    # Complétez cette fonction
    pass
''',
        solution='''def addition(a, b):
    return a + b
''',
        order=1
    )
    db.add(ex3)
    db.flush()
    
    test3_1 = TestCase(
        exercise_id=ex3.id,
        name="Test addition basique",
        visibility=TestVisibility.PUBLIC,
        code_snippet="""
exec(user_code)

assert addition(5, 3) == 8, "addition(5, 3) devrait retourner 8"
assert addition(10, -2) == 8, "addition(10, -2) devrait retourner 8"
assert addition(0, 0) == 0, "addition(0, 0) devrait retourner 0"
""",
        timeout_ms=3000,
        order=1
    )
    db.add(test3_1)
    
    test3_2 = TestCase(
        exercise_id=ex3.id,
        name="Test avec grands nombres",
        visibility=TestVisibility.HIDDEN,
        code_snippet="""
exec(user_code)

assert addition(1000, 2000) == 3000, "addition(1000, 2000) devrait retourner 3000"
assert addition(-50, 50) == 0, "addition(-50, 50) devrait retourner 0"
""",
        timeout_ms=3000,
        order=2
    )
    db.add(test3_2)
    
    # Exercice 2.2: Pair ou impair
    ex4 = Exercise(
        lesson_id=lesson2.id,
        title="Pair ou impair ?",
        prompt_md="""Créez une fonction `est_pair(n)` qui retourne `True` si le nombre est pair, `False` sinon.

**Astuce**: Un nombre est pair si le reste de sa division par 2 est 0 (utilisez l'opérateur `%`).

**Exemple**:
```python
est_pair(4)   # True
est_pair(7)   # False
est_pair(0)   # True
```
""",
        difficulty=2,
        starter_code='''def est_pair(n):
    # Complétez cette fonction
    pass
''',
        solution='''def est_pair(n):
    return n % 2 == 0
''',
        order=2
    )
    db.add(ex4)
    db.flush()
    
    test4_1 = TestCase(
        exercise_id=ex4.id,
        name="Test nombres pairs",
        visibility=TestVisibility.PUBLIC,
        code_snippet="""
exec(user_code)

assert est_pair(4) == True, "4 est pair"
assert est_pair(0) == True, "0 est pair"
assert est_pair(2) == True, "2 est pair"
""",
        timeout_ms=3000,
        order=1
    )
    db.add(test4_1)
    
    test4_2 = TestCase(
        exercise_id=ex4.id,
        name="Test nombres impairs",
        visibility=TestVisibility.PUBLIC,
        code_snippet="""
exec(user_code)

assert est_pair(7) == False, "7 est impair"
assert est_pair(1) == False, "1 est impair"
assert est_pair(99) == False, "99 est impair"
""",
        timeout_ms=3000,
        order=2
    )
    db.add(test4_2)
    
    # Leçon 3: Boucles
    lesson3 = Lesson(
        slug="loops",
        title="Les Boucles",
        body_md="""# Les Boucles

Les boucles permettent de répéter des actions.

## Boucle for

La boucle `for` permet de parcourir une séquence :

```python
# Compter de 0 à 4
for i in range(5):
    print(i)

# Parcourir une liste
fruits = ["pomme", "banane", "orange"]
for fruit in fruits:
    print(fruit)
```

## Boucle while

La boucle `while` s'exécute tant qu'une condition est vraie :

```python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
```

## La fonction range()

- `range(5)` : 0, 1, 2, 3, 4
- `range(2, 8)` : 2, 3, 4, 5, 6, 7
- `range(0, 10, 2)` : 0, 2, 4, 6, 8
""",
        module="Contrôle de flux",
        order=3
    )
    db.add(lesson3)
    db.flush()
    
    # Exercice 3.1: Somme
    ex5 = Exercise(
        lesson_id=lesson3.id,
        title="Somme des nombres",
        prompt_md="""Créez une fonction `somme_jusqua(n)` qui calcule la somme de tous les nombres de 1 à n (inclus).

**Exemple**:
```python
somme_jusqua(5)   # 1+2+3+4+5 = 15
somme_jusqua(10)  # 1+2+3+...+10 = 55
```
""",
        difficulty=2,
        starter_code='''def somme_jusqua(n):
    # Utilisez une boucle for
    total = 0
    # Votre code ici
    return total
''',
        solution='''def somme_jusqua(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
''',
        order=1
    )
    db.add(ex5)
    db.flush()
    
    test5_1 = TestCase(
        exercise_id=ex5.id,
        name="Test somme basique",
        visibility=TestVisibility.PUBLIC,
        code_snippet="""
exec(user_code)

assert somme_jusqua(5) == 15, "somme_jusqua(5) devrait retourner 15"
assert somme_jusqua(10) == 55, "somme_jusqua(10) devrait retourner 55"
assert somme_jusqua(1) == 1, "somme_jusqua(1) devrait retourner 1"
""",
        timeout_ms=3000,
        order=1
    )
    db.add(test5_1)
    
    db.commit()
    print("✅ Base de données initialisée avec des données d'exemple !")


def init_db():
    """Initialise la base de données."""
    print("Création des tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables créées !")
    
    db = SessionLocal()
    try:
        # Vérifier si des données existent déjà
        from backend.models import User
        existing_users = db.query(User).count()
        
        if existing_users == 0:
            print("Création des données d'exemple...")
            create_sample_data(db)
        else:
            print("⚠️ Des données existent déjà. Aucune donnée d'exemple ajoutée.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

