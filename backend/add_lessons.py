"""Script pour ajouter 5 nouvelles leçons PUNCHY! 🔥"""
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Lesson, Exercise, TestCase, TestVisibility


def add_new_lessons():
    db = SessionLocal()
    
    try:
        # Leçon 4: Les Listes - Collections qui déchirent
        lesson4 = Lesson(
            slug="python-lists",
            title="Les Listes - Ta Collection qui Déchire! 🎯",
            body_md="""# Les Listes - Ta Collection qui Déchire! 🎯

Les listes c'est LA structure de données la plus badass en Python!

## Créer une Liste

```python
fruits = ["pomme", "banane", "orange"]
nombres = [1, 2, 3, 4, 5]
mixte = [42, "Python", True, 3.14]
```

## Accéder aux Éléments

```python
fruits = ["pomme", "banane", "orange"]
print(fruits[0])   # "pomme" (premier élément)
print(fruits[-1])  # "orange" (dernier élément)
print(fruits[1:3]) # ["banane", "orange"] (slicing)
```

## Méthodes Qui Déchirent

```python
# Ajouter
fruits.append("kiwi")        # Ajoute à la fin
fruits.insert(0, "fraise")   # Insère à l'index

# Supprimer
fruits.remove("banane")      # Supprime par valeur
fruits.pop()                 # Supprime et retourne le dernier

# Autres
len(fruits)                  # Nombre d'éléments
fruits.sort()                # Trie la liste
fruits.reverse()             # Inverse l'ordre
```

## List Comprehension - Le Truc de OUF! 💥

```python
# Au lieu de:
carres = []
for i in range(5):
    carres.append(i ** 2)

# Fais ça:
carres = [i ** 2 for i in range(5)]  # [0, 1, 4, 9, 16]
```

À toi de jouer warrior! 🚀
""",
            module="Collections",
            order=4
        )
        db.add(lesson4)
        db.flush()
        
        # Exercice 4.1: Manipulation de liste
        ex6 = Exercise(
            lesson_id=lesson4.id,
            title="Liste de Champions 🏆",
            prompt_md="""Crée une fonction `top_3(nombres)` qui retourne les 3 plus grands nombres d'une liste.

**Exemple**:
```python
top_3([10, 5, 8, 20, 15, 3])  # [20, 15, 10]
top_3([1, 2, 3])               # [3, 2, 1]
```

**Astuce**: Utilise `sorted()` avec `reverse=True` !
""",
            difficulty=2,
            starter_code='''def top_3(nombres):
    # Ton code de warrior ici!
    pass
''',
            solution='''def top_3(nombres):
    return sorted(nombres, reverse=True)[:3]
''',
            order=1
        )
        db.add(ex6)
        db.flush()
        
        test6_1 = TestCase(
            exercise_id=ex6.id,
            name="Test basique",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
result = top_3([10, 5, 8, 20, 15, 3])
assert result == [20, 15, 10], f"Attendu [20, 15, 10] mais obtenu {result}"
""",
            timeout_ms=3000,
            order=1
        )
        db.add(test6_1)
        
        # Exercice 4.2: List comprehension
        ex7 = Exercise(
            lesson_id=lesson4.id,
            title="Pairs de Ouf 💪",
            prompt_md="""Crée une fonction `nombres_pairs(n)` qui retourne une liste des nombres pairs de 0 à n.

**Utilise une list comprehension!**

**Exemple**:
```python
nombres_pairs(10)  # [0, 2, 4, 6, 8, 10]
nombres_pairs(5)   # [0, 2, 4]
```
""",
            difficulty=2,
            starter_code='''def nombres_pairs(n):
    # Use list comprehension!
    pass
''',
            solution='''def nombres_pairs(n):
    return [i for i in range(n + 1) if i % 2 == 0]
''',
            order=2
        )
        db.add(ex7)
        db.flush()
        
        test7_1 = TestCase(
            exercise_id=ex7.id,
            name="Test pairs jusqu'à 10",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
result = nombres_pairs(10)
assert result == [0, 2, 4, 6, 8, 10], f"Attendu [0, 2, 4, 6, 8, 10] mais obtenu {result}"
""",
            timeout_ms=3000,
            order=1
        )
        db.add(test7_1)
        
        # Leçon 5: Les Dictionnaires - Key-Value de Warrior
        lesson5 = Lesson(
            slug="python-dicts",
            title="Les Dictionnaires - Ton Data Store! 📦",
            body_md="""# Les Dictionnaires - Ton Data Store! 📦

Les dicts = clé-valeur = PUISSANCE!

## Créer un Dictionnaire

```python
player = {
    "name": "Python_Master",
    "level": 42,
    "hp": 100,
    "skills": ["code", "debug", "deploy"]
}
```

## Accéder et Modifier

```python
print(player["name"])        # "Python_Master"
print(player.get("level"))   # 42

player["level"] = 43         # Modifier
player["xp"] = 5000          # Ajouter
del player["hp"]             # Supprimer
```

## Méthodes Qui Claquent

```python
player.keys()      # Toutes les clés
player.values()    # Toutes les valeurs
player.items()     # Paires clé-valeur

# Boucler comme un boss
for key, value in player.items():
    print(f"{key}: {value}")
```

## Dict Comprehension 💥

```python
# Créer un dict des carrés
carres = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

Go code! 🔥
""",
            module="Collections",
            order=5
        )
        db.add(lesson5)
        db.flush()
        
        # Exercice 5.1: Manipulation de dict
        ex8 = Exercise(
            lesson_id=lesson5.id,
            title="Inventaire de Warrior 🎮",
            prompt_md="""Crée une fonction `compter_items(items)` qui compte combien de fois chaque item apparaît dans une liste.

**Exemple**:
```python
compter_items(["épée", "bouclier", "épée", "potion", "épée"])
# {"épée": 3, "bouclier": 1, "potion": 1}
```
""",
            difficulty=3,
            starter_code='''def compter_items(items):
    # Utilise un dict pour compter!
    pass
''',
            solution='''def compter_items(items):
    compte = {}
    for item in items:
        compte[item] = compte.get(item, 0) + 1
    return compte
''',
            order=1
        )
        db.add(ex8)
        db.flush()
        
        test8_1 = TestCase(
            exercise_id=ex8.id,
            name="Test comptage",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
result = compter_items(["épée", "bouclier", "épée", "potion", "épée"])
assert result == {"épée": 3, "bouclier": 1, "potion": 1}, f"Erreur de comptage: {result}"
""",
            timeout_ms=3000,
            order=1
        )
        db.add(test8_1)
        
        # Leçon 6: Les Strings - Manipulation de Texte
        lesson6 = Lesson(
            slug="python-strings",
            title="Les Strings - Manipule le Texte! ✍️",
            body_md="""# Les Strings - Manipule le Texte! ✍️

Les strings en Python = SUPER PUISSANT!

## Méthodes de Base

```python
texte = "Python Ta Mère"

texte.upper()      # "PYTHON TA MÈRE"
texte.lower()      # "python ta mère"
texte.replace("Mère", "Warrior")  # "Python Ta Warrior"
texte.split()      # ["Python", "Ta", "Mère"]
```

## F-Strings - La Méthode de OUF! 💥

```python
name = "Warrior"
level = 42
hp = 100

# Old school (pas cool)
print("Salut " + name + "! Level: " + str(level))

# F-strings (STYLÉ!)
print(f"Salut {name}! Level: {level}, HP: {hp}")
print(f"XP: {level * 100}")  # Calculs inside!
```

## Slicing de Warrior

```python
mot = "Python"
mot[0]      # "P"
mot[-1]     # "n"
mot[0:3]    # "Pyt"
mot[::-1]   # "nohtyP" (inversé!)
```

## Méthodes Utiles

```python
texte.startswith("Py")   # True
texte.endswith("re")     # True
texte.count("a")         # Compte les "a"
texte.strip()            # Enlève espaces début/fin
```

Code comme un boss! 🚀
""",
            module="Bases Avancées",
            order=6
        )
        db.add(lesson6)
        db.flush()
        
        # Exercice 6.1: Manipulation strings
        ex9 = Exercise(
            lesson_id=lesson6.id,
            title="Reverse de Fou 🔄",
            prompt_md="""Crée une fonction `est_palindrome(mot)` qui vérifie si un mot est un palindrome (se lit pareil dans les 2 sens).

**Exemple**:
```python
est_palindrome("radar")  # True
est_palindrome("python") # False
est_palindrome("kayak")  # True
```

**Astuce**: Compare le mot avec lui-même inversé!
""",
            difficulty=2,
            starter_code='''def est_palindrome(mot):
    # Check si palindrome!
    pass
''',
            solution='''def est_palindrome(mot):
    return mot == mot[::-1]
''',
            order=1
        )
        db.add(ex9)
        db.flush()
        
        test9_1 = TestCase(
            exercise_id=ex9.id,
            name="Test palindromes",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
assert est_palindrome("radar") == True, "radar est un palindrome!"
assert est_palindrome("python") == False, "python n'est pas un palindrome"
assert est_palindrome("kayak") == True, "kayak est un palindrome!"
""",
            timeout_ms=3000,
            order=1
        )
        db.add(test9_1)
        
        # Leçon 7: Fonctions Avancées
        lesson7 = Lesson(
            slug="python-functions-advanced",
            title="Fonctions Avancées - Level Up! 🚀",
            body_md="""# Fonctions Avancées - Level Up! 🚀

## Arguments par Défaut

```python
def saluer(nom, message="Salut"):
    return f"{message} {nom}!"

saluer("Warrior")              # "Salut Warrior!"
saluer("Boss", "Hey")          # "Hey Boss!"
```

## Args Multiples (*args)

```python
def additionner_tout(*nombres):
    return sum(nombres)

additionner_tout(1, 2, 3)      # 6
additionner_tout(10, 20)       # 30
```

## Kwargs (**kwargs)

```python
def creer_player(**stats):
    return stats

player = creer_player(name="Warrior", level=42, hp=100)
# {"name": "Warrior", "level": 42, "hp": 100}
```

## Lambda - Fonctions Anonymes 💥

```python
# Au lieu de:
def double(x):
    return x * 2

# Fais ça:
double = lambda x: x * 2

# Super avec map, filter
nombres = [1, 2, 3, 4, 5]
doubles = list(map(lambda x: x * 2, nombres))  # [2, 4, 6, 8, 10]
pairs = list(filter(lambda x: x % 2 == 0, nombres))  # [2, 4]
```

Go code warrior! 💪
""",
            module="Bases Avancées",
            order=7
        )
        db.add(lesson7)
        db.flush()
        
        # Exercice 7.1: Lambda et map
        ex10 = Exercise(
            lesson_id=lesson7.id,
            title="Lambda Power 💪",
            prompt_md="""Crée une fonction `tripler_liste(nombres)` qui triple tous les nombres d'une liste.

**Utilise map() et lambda!**

**Exemple**:
```python
tripler_liste([1, 2, 3])  # [3, 6, 9]
tripler_liste([5, 10])    # [15, 30]
```
""",
            difficulty=3,
            starter_code='''def tripler_liste(nombres):
    # Use lambda + map!
    pass
''',
            solution='''def tripler_liste(nombres):
    return list(map(lambda x: x * 3, nombres))
''',
            order=1
        )
        db.add(ex10)
        db.flush()
        
        test10_1 = TestCase(
            exercise_id=ex10.id,
            name="Test tripler",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
result = tripler_liste([1, 2, 3])
assert result == [3, 6, 9], f"Attendu [3, 6, 9] mais obtenu {result}"
""",
            timeout_ms=3000,
            order=1
        )
        db.add(test10_1)
        
        # Leçon 8: Try/Except - Gestion d'Erreurs
        lesson8 = Lesson(
            slug="python-error-handling",
            title="Try/Except - Gère les Erreurs comme un Boss! 🛡️",
            body_md="""# Try/Except - Gère les Erreurs comme un Boss! 🛡️

Les erreurs ça arrive! Gère-les comme un warrior!

## Syntaxe de Base

```python
try:
    nombre = int("abc")  # Erreur!
except ValueError:
    print("Ça marche pas frère!")
```

## Plusieurs Exceptions

```python
try:
    result = 10 / 0
    liste = [1, 2, 3]
    print(liste[10])
except ZeroDivisionError:
    print("Division par zéro = interdit!")
except IndexError:
    print("Index trop grand!")
```

## Finally - Toujours Exécuté

```python
try:
    fichier = open("data.txt")
    # Traitement...
except FileNotFoundError:
    print("Fichier introuvable!")
finally:
    print("Ce message s'affiche TOUJOURS")
```

## Raise - Lever une Exception

```python
def check_age(age):
    if age < 0:
        raise ValueError("L'âge ne peut pas être négatif!")
    return age
```

## Exceptions Courantes

- `ValueError`: Valeur incorrecte
- `TypeError`: Type incorrect
- `IndexError`: Index hors limites
- `KeyError`: Clé inexistante dans dict
- `ZeroDivisionError`: Division par zéro
- `FileNotFoundError`: Fichier introuvable

Code safe warrior! 🛡️
""",
            module="Bases Avancées",
            order=8
        )
        db.add(lesson8)
        db.flush()
        
        # Exercice 8.1: Try/Except
        ex11 = Exercise(
            lesson_id=lesson8.id,
            title="Safe Division 🛡️",
            prompt_md="""Crée une fonction `diviser_safe(a, b)` qui divise a par b.

Si b est 0, retourne "Erreur: division par zéro" au lieu de crasher!

**Exemple**:
```python
diviser_safe(10, 2)   # 5.0
diviser_safe(10, 0)   # "Erreur: division par zéro"
```

**Utilise try/except!**
""",
            difficulty=2,
            starter_code='''def diviser_safe(a, b):
    # Gère l'erreur!
    pass
''',
            solution='''def diviser_safe(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Erreur: division par zéro"
''',
            order=1
        )
        db.add(ex11)
        db.flush()
        
        test11_1 = TestCase(
            exercise_id=ex11.id,
            name="Test division normale",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
result = diviser_safe(10, 2)
assert result == 5.0, f"10/2 devrait donner 5.0 mais obtenu {result}"
""",
            timeout_ms=3000,
            order=1
        )
        db.add(test11_1)
        
        test11_2 = TestCase(
            exercise_id=ex11.id,
            name="Test division par zéro",
            visibility=TestVisibility.PUBLIC,
            code_snippet="""
exec(user_code)
result = diviser_safe(10, 0)
assert result == "Erreur: division par zéro", f"Devrait gérer l'erreur mais obtenu {result}"
""",
            timeout_ms=3000,
            order=2
        )
        db.add(test11_2)
        
        db.commit()
        print("✅ 5 NOUVELLES LEÇONS AJOUTÉES! 🔥")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("📚 Leçon 4: Les Listes (2 exercices)")
        print("📦 Leçon 5: Les Dictionnaires (1 exercice)")
        print("✍️ Leçon 6: Les Strings (1 exercice)")
        print("🚀 Leçon 7: Fonctions Avancées (1 exercice)")
        print("🛡️ Leçon 8: Try/Except (1 exercice)")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("🎉 TOTAL: 6 NOUVEAUX EXERCICES!")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    add_new_lessons()

