#!/usr/bin/env python3
"""
Script pour ajouter 10 nouvelles leçons à PythonTaMère
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire courant au PYTHONPATH
current_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(current_dir))
os.chdir(current_dir)
os.environ['PYTHONPATH'] = str(current_dir)

if __name__ == "__main__":
    try:
        print("Ajout de 10 nouvelles leçons à PythonTaMère...")
        
        from backend.database import SessionLocal
        from backend.models import Lesson, Exercise, TestCase
        
        db = SessionLocal()
        
        try:
            # Vérifier le nombre de leçons existantes
            existing_count = db.query(Lesson).count()
            print(f"Leçons existantes: {existing_count}")
            
            # Leçon 3: Les Conditions
            lesson3 = Lesson(
                slug="conditions-if-else",
                title="Les Conditions (if/else)",
                body_md="""# Les Conditions (if/else)

Les conditions permettent à votre programme de prendre des décisions !

## Structure de base

```python
if condition:
    # Code exécuté si la condition est vraie
    print("La condition est vraie!")
else:
    # Code exécuté si la condition est fausse
    print("La condition est fausse!")
```

## Opérateurs de comparaison

- `==` : égal à
- `!=` : différent de
- `>` : plus grand que
- `<` : plus petit que
- `>=` : plus grand ou égal
- `<=` : plus petit ou égal

## Exemples

```python
age = 18

if age >= 18:
    print("Vous êtes majeur!")
else:
    print("Vous êtes mineur!")

# Avec elif (else if)
note = 15

if note >= 16:
    print("Excellent!")
elif note >= 14:
    print("Très bien!")
elif note >= 12:
    print("Bien!")
else:
    print("À améliorer!")
```

## Conditions multiples

```python
age = 20
permis = True

if age >= 18 and permis:
    print("Vous pouvez conduire!")
elif age >= 18 and not permis:
    print("Vous devez passer le permis!")
else:
    print("Vous êtes trop jeune!")
```""",
                module="Contrôle de Flux",
                order=3
            )
            db.add(lesson3)
            db.commit()
            
            # Exercice 3
            exercise3 = Exercise(
                lesson_id=lesson3.id,
                title="Vérificateur d'Âge",
                prompt_md="""# Exercice : Vérificateur d'Âge

Créez un programme qui demande l'âge de l'utilisateur et affiche :
- "Mineur" si l'âge est inférieur à 18
- "Majeur" si l'âge est supérieur ou égal à 18

## Instructions
- Utilisez `input()` pour demander l'âge
- Convertissez en entier avec `int()`
- Utilisez `if/else` pour la condition""",
                difficulty=2,
                starter_code="",
                order=1
            )
            db.add(exercise3)
            db.commit()
            
            test3 = TestCase(
                exercise_id=exercise3.id,
                name="Test mineur",
                visibility="public",
                code_snippet="""# Test pour un mineur
import sys
from io import StringIO

# Simuler input pour un mineur
def mock_input(prompt):
    return "16"

# Remplacer input par notre mock
original_input = __builtins__['input']
__builtins__['input'] = mock_input

# Capturer la sortie
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()

# Exécuter le code utilisateur
exec(user_code)

# Récupérer la sortie
output = captured_output.getvalue()
sys.stdout = old_stdout

# Restaurer input original
__builtins__['input'] = original_input

# Vérifier
assert "Mineur" in output, f"Attendu 'Mineur' mais obtenu: {output.strip()}" """,
                order=1
            )
            db.add(test3)
            
            # Leçon 4: Les Boucles For
            lesson4 = Lesson(
                slug="boucles-for",
                title="Les Boucles For",
                body_md="""# Les Boucles For

Les boucles permettent de répéter du code plusieurs fois !

## Boucle for avec range()

```python
# Compter de 0 à 4
for i in range(5):
    print(i)

# Compter de 1 à 5
for i in range(1, 6):
    print(i)

# Compter de 0 à 10 par pas de 2
for i in range(0, 11, 2):
    print(i)
```

## Boucle for avec des listes

```python
fruits = ["pomme", "banane", "orange"]

for fruit in fruits:
    print(f"J'aime les {fruit}s")
```

## Boucle for avec des chaînes

```python
mot = "Python"

for lettre in mot:
    print(lettre)
```

## Fonction range() détaillée

- `range(5)` : 0, 1, 2, 3, 4
- `range(1, 5)` : 1, 2, 3, 4
- `range(0, 10, 2)` : 0, 2, 4, 6, 8

## Exemples pratiques

```python
# Calculer la somme de 1 à 10
somme = 0
for i in range(1, 11):
    somme += i
print(f"Somme: {somme}")

# Afficher une table de multiplication
nombre = 5
for i in range(1, 11):
    resultat = nombre * i
    print(f"{nombre} x {i} = {resultat}")
```""",
                module="Contrôle de Flux",
                order=4
            )
            db.add(lesson4)
            db.commit()
            
            exercise4 = Exercise(
                lesson_id=lesson4.id,
                title="Calculatrice de Somme",
                prompt_md="""# Exercice : Calculatrice de Somme

Créez un programme qui calcule la somme des nombres de 1 à 100.

## Instructions
- Utilisez une boucle `for` avec `range()`
- Initialisez une variable `somme` à 0
- Ajoutez chaque nombre à la somme
- Affichez le résultat final""",
                difficulty=2,
                starter_code="",
                order=1
            )
            db.add(exercise4)
            db.commit()
            
            test4 = TestCase(
                exercise_id=exercise4.id,
                name="Somme correcte",
                visibility="public",
                code_snippet="""# Test de la somme
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

# Vérifier que la somme est correcte (5050)
assert "5050" in output, f"Somme attendue 5050 mais obtenu: {output.strip()}" """,
                order=1
            )
            db.add(test4)
            
            # Leçon 5: Les Boucles While
            lesson5 = Lesson(
                slug="boucles-while",
                title="Les Boucles While",
                body_md="""# Les Boucles While

Les boucles `while` répètent du code tant qu'une condition est vraie.

## Structure de base

```python
while condition:
    # Code répété tant que la condition est vraie
    print("La condition est vraie!")
```

## Exemple simple

```python
compteur = 0

while compteur < 5:
    print(f"Compteur: {compteur}")
    compteur += 1
```

## Attention aux boucles infinies !

```python
# ❌ DANGEREUX - boucle infinie
# while True:
#     print("Infini!")

# ✅ CORRECT - avec condition d'arrêt
compteur = 0
while compteur < 10:
    print(compteur)
    compteur += 1
```

## Exemples pratiques

```python
# Deviner un nombre
nombre_secret = 7
tentative = 0

while tentative != nombre_secret:
    tentative = int(input("Devinez le nombre (1-10): "))
    if tentative < nombre_secret:
        print("Trop petit!")
    elif tentative > nombre_secret:
        print("Trop grand!")
    else:
        print("Bravo! Vous avez trouvé!")

# Calculer la factorielle
n = 5
factorial = 1
i = 1

while i <= n:
    factorial *= i
    i += 1

print(f"5! = {factorial}")
```

## break et continue

```python
# break : sortir de la boucle
for i in range(10):
    if i == 5:
        break  # Sort de la boucle
    print(i)

# continue : passer à l'itération suivante
for i in range(5):
    if i == 2:
        continue  # Passe au suivant
    print(i)
```""",
                module="Contrôle de Flux",
                order=5
            )
            db.add(lesson5)
            db.commit()
            
            exercise5 = Exercise(
                lesson_id=lesson5.id,
                title="Calculatrice de Factorielle",
                prompt_md="""# Exercice : Calculatrice de Factorielle

Créez un programme qui calcule la factorielle d'un nombre.

La factorielle de n (notée n!) est le produit de tous les entiers de 1 à n.
Exemple : 5! = 1 × 2 × 3 × 4 × 5 = 120

## Instructions
- Utilisez une boucle `while`
- Calculez la factorielle de 6
- Affichez le résultat""",
                difficulty=3,
                starter_code="",
                order=1
            )
            db.add(exercise5)
            db.commit()
            
            test5 = TestCase(
                exercise_id=exercise5.id,
                name="Factorielle correcte",
                visibility="public",
                code_snippet="""# Test de la factorielle
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

# Vérifier que la factorielle de 6 est correcte (720)
assert "720" in output, f"Factorielle de 6 attendue 720 mais obtenu: {output.strip()}" """,
                order=1
            )
            db.add(test5)
            
            # Leçon 6: Les Listes
            lesson6 = Lesson(
                slug="listes",
                title="Les Listes",
                body_md="""# Les Listes

Les listes permettent de stocker plusieurs éléments dans une seule variable.

## Créer une liste

```python
# Liste vide
ma_liste = []

# Liste avec des éléments
fruits = ["pomme", "banane", "orange"]
nombres = [1, 2, 3, 4, 5]
melange = ["texte", 42, True, 3.14]
```

## Accéder aux éléments

```python
fruits = ["pomme", "banane", "orange"]

# Premier élément (index 0)
print(fruits[0])  # "pomme"

# Dernier élément
print(fruits[-1])  # "orange"

# Élément par index
print(fruits[1])  # "banane"
```

## Modifier une liste

```python
fruits = ["pomme", "banane", "orange"]

# Modifier un élément
fruits[1] = "kiwi"
print(fruits)  # ["pomme", "kiwi", "orange"]

# Ajouter un élément
fruits.append("raisin")
print(fruits)  # ["pomme", "kiwi", "orange", "raisin"]

# Insérer un élément
fruits.insert(1, "fraise")
print(fruits)  # ["pomme", "fraise", "kiwi", "orange", "raisin"]
```

## Méthodes utiles

```python
nombres = [3, 1, 4, 1, 5]

# Longueur
print(len(nombres))  # 5

# Trier
nombres.sort()
print(nombres)  # [1, 1, 3, 4, 5]

# Compter les occurrences
print(nombres.count(1))  # 2

# Supprimer un élément
nombres.remove(1)
print(nombres)  # [1, 3, 4, 5]
```

## Parcourir une liste

```python
fruits = ["pomme", "banane", "orange"]

# Avec for
for fruit in fruits:
    print(fruit)

# Avec index
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")
```""",
                module="Structures de Données",
                order=6
            )
            db.add(lesson6)
            db.commit()
            
            exercise6 = Exercise(
                lesson_id=lesson6.id,
                title="Gestionnaire de Liste",
                prompt_md="""# Exercice : Gestionnaire de Liste

Créez un programme qui :
1. Crée une liste avec les nombres [5, 2, 8, 1, 9]
2. Affiche la liste
3. Trouve et affiche le plus grand nombre
4. Calcule et affiche la moyenne

## Instructions
- Utilisez `max()` pour le maximum
- Utilisez `sum()` et `len()` pour la moyenne
- Affichez chaque résultat""",
                difficulty=3,
                starter_code="",
                order=1
            )
            db.add(exercise6)
            db.commit()
            
            test6 = TestCase(
                exercise_id=exercise6.id,
                name="Calculs corrects",
                visibility="public",
                code_snippet="""# Test des calculs sur liste
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

# Vérifier les résultats
assert "9" in output, "Maximum attendu 9"
assert "5.0" in output or "5" in output, "Moyenne attendue 5.0" """,
                order=1
            )
            db.add(test6)
            
            # Leçon 7: Les Fonctions
            lesson7 = Lesson(
                slug="fonctions",
                title="Les Fonctions",
                body_md="""# Les Fonctions

Les fonctions permettent de regrouper du code réutilisable.

## Définir une fonction

```python
def dire_bonjour():
    print("Bonjour!")

# Appeler la fonction
dire_bonjour()
```

## Fonction avec paramètres

```python
def dire_bonjour(nom):
    print(f"Bonjour {nom}!")

dire_bonjour("Alice")
dire_bonjour("Bob")
```

## Fonction avec retour

```python
def addition(a, b):
    resultat = a + b
    return resultat

somme = addition(5, 3)
print(somme)  # 8
```

## Fonction avec plusieurs paramètres

```python
def calculer_rectangle(longueur, largeur):
    perimetre = 2 * (longueur + largeur)
    aire = longueur * largeur
    return perimetre, aire

p, a = calculer_rectangle(5, 3)
print(f"Périmètre: {p}, Aire: {a}")
```

## Paramètres par défaut

```python
def saluer(nom, message="Bonjour"):
    print(f"{message} {nom}!")

saluer("Alice")  # "Bonjour Alice!"
saluer("Bob", "Salut")  # "Salut Bob!"
```

## Exemples pratiques

```python
def est_pair(nombre):
    return nombre % 2 == 0

def calculer_moyenne(liste):
    return sum(liste) / len(liste)

def afficher_table_multiplication(n):
    for i in range(1, 11):
        print(f"{n} x {i} = {n * i}")

# Utilisation
print(est_pair(4))  # True
print(calculer_moyenne([1, 2, 3, 4, 5]))  # 3.0
afficher_table_multiplication(7)
```""",
                module="Programmation Modulaire",
                order=7
            )
            db.add(lesson7)
            db.commit()
            
            exercise7 = Exercise(
                lesson_id=lesson7.id,
                title="Calculatrice de Fonctions",
                prompt_md="""# Exercice : Calculatrice de Fonctions

Créez deux fonctions :
1. `calculer_cercle(rayon)` qui retourne la circonférence et l'aire d'un cercle
2. `est_premier(nombre)` qui retourne True si le nombre est premier, False sinon

## Instructions
- Circonférence = 2 × π × rayon
- Aire = π × rayon²
- Utilisez π = 3.14159
- Testez avec le rayon 5 et le nombre 17""",
                difficulty=4,
                starter_code="",
                order=1
            )
            db.add(exercise7)
            db.commit()
            
            test7 = TestCase(
                exercise_id=exercise7.id,
                name="Fonctions correctes",
                visibility="public",
                code_snippet="""# Test des fonctions
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

# Vérifier les résultats
assert "31.4159" in output or "31.4" in output, "Circonférence attendue ~31.4"
assert "78.5" in output or "78.54" in output, "Aire attendue ~78.5"
assert "True" in output, "17 devrait être premier" """,
                order=1
            )
            db.add(test7)
            
            # Leçon 8: Les Dictionnaires
            lesson8 = Lesson(
                slug="dictionnaires",
                title="Les Dictionnaires",
                body_md="""# Les Dictionnaires

Les dictionnaires stockent des données sous forme de paires clé-valeur.

## Créer un dictionnaire

```python
# Dictionnaire vide
mon_dict = {}

# Dictionnaire avec des données
personne = {
    "nom": "Alice",
    "age": 25,
    "ville": "Paris"
}
```

## Accéder aux valeurs

```python
personne = {"nom": "Alice", "age": 25, "ville": "Paris"}

# Avec les crochets
print(personne["nom"])  # "Alice"

# Avec get() (plus sûr)
print(personne.get("age"))  # 25
print(personne.get("profession", "Non renseigné"))  # "Non renseigné"
```

## Modifier un dictionnaire

```python
personne = {"nom": "Alice", "age": 25}

# Ajouter/modifier une clé
personne["ville"] = "Lyon"
personne["age"] = 26

print(personne)  # {"nom": "Alice", "age": 26, "ville": "Lyon"}
```

## Méthodes utiles

```python
personne = {"nom": "Alice", "age": 25, "ville": "Paris"}

# Obtenir toutes les clés
print(personne.keys())  # dict_keys(['nom', 'age', 'ville'])

# Obtenir toutes les valeurs
print(personne.values())  # dict_values(['Alice', 25, 'Paris'])

# Obtenir les paires clé-valeur
print(personne.items())  # dict_items([('nom', 'Alice'), ('age', 25), ('ville', 'Paris')])

# Supprimer une clé
del personne["ville"]
# ou
personne.pop("age")
```

## Parcourir un dictionnaire

```python
personne = {"nom": "Alice", "age": 25, "ville": "Paris"}

# Parcourir les clés
for cle in personne:
    print(f"{cle}: {personne[cle]}")

# Parcourir les paires
for cle, valeur in personne.items():
    print(f"{cle}: {valeur}")
```

## Exemples pratiques

```python
# Annuaire téléphonique
annuaire = {
    "Alice": "0123456789",
    "Bob": "0987654321",
    "Charlie": "0555123456"
}

# Ajouter un contact
annuaire["David"] = "0666123456"

# Chercher un numéro
nom = "Alice"
if nom in annuaire:
    print(f"Le numéro de {nom} est {annuaire[nom]}")
else:
    print(f"{nom} n'est pas dans l'annuaire")
```""",
                module="Structures de Données",
                order=8
            )
            db.add(lesson8)
            db.commit()
            
            exercise8 = Exercise(
                lesson_id=lesson8.id,
                title="Gestionnaire de Contacts",
                prompt_md="""# Exercice : Gestionnaire de Contacts

Créez un programme qui :
1. Crée un dictionnaire de contacts avec 3 personnes
2. Affiche tous les contacts
3. Ajoute un nouveau contact
4. Recherche le numéro d'une personne

## Instructions
- Utilisez des noms et numéros fictifs
- Affichez chaque étape
- Utilisez `in` pour vérifier si une clé existe""",
                difficulty=3,
                starter_code="",
                order=1
            )
            db.add(exercise8)
            db.commit()
            
            test8 = TestCase(
                exercise_id=exercise8.id,
                name="Gestion contacts",
                visibility="public",
                code_snippet="""# Test du gestionnaire de contacts
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

# Vérifier que le programme fonctionne
assert len(output) > 50, "Le programme devrait afficher plusieurs informations" """,
                order=1
            )
            db.add(test8)
            
            # Leçon 9: Gestion des Erreurs
            lesson9 = Lesson(
                slug="gestion-erreurs",
                title="Gestion des Erreurs",
                body_md="""# Gestion des Erreurs

Les erreurs sont inévitables en programmation. Python offre des outils pour les gérer.

## try/except de base

```python
try:
    nombre = int(input("Entrez un nombre: "))
    print(f"Vous avez entré: {nombre}")
except ValueError:
    print("Ce n'est pas un nombre valide!")
```

## Types d'erreurs courantes

```python
# ValueError : conversion impossible
try:
    int("abc")
except ValueError as e:
    print(f"Erreur de valeur: {e}")

# ZeroDivisionError : division par zéro
try:
    resultat = 10 / 0
except ZeroDivisionError as e:
    print(f"Division par zéro: {e}")

# IndexError : index hors limites
try:
    liste = [1, 2, 3]
    print(liste[10])
except IndexError as e:
    print(f"Index invalide: {e}")

# KeyError : clé inexistante
try:
    dict = {"a": 1}
    print(dict["b"])
except KeyError as e:
    print(f"Clé inexistante: {e}")
```

## Gestion de plusieurs erreurs

```python
try:
    nombre = int(input("Entrez un nombre: "))
    resultat = 100 / nombre
    print(f"Résultat: {resultat}")
except ValueError:
    print("Ce n'est pas un nombre!")
except ZeroDivisionError:
    print("Impossible de diviser par zéro!")
except Exception as e:
    print(f"Erreur inattendue: {e}")
```

## else et finally

```python
try:
    fichier = open("donnees.txt", "r")
    contenu = fichier.read()
except FileNotFoundError:
    print("Fichier introuvable!")
except Exception as e:
    print(f"Erreur: {e}")
else:
    print("Fichier lu avec succès!")
    print(contenu)
finally:
    print("Nettoyage terminé")
```

## Exemples pratiques

```python
def diviser(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Impossible de diviser par zéro"
    except TypeError:
        return "Veuillez entrer des nombres"

def lire_fichier(nom_fichier):
    try:
        with open(nom_fichier, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return "Fichier introuvable"
    except PermissionError:
        return "Permission refusée"
    except Exception as e:
        return f"Erreur: {e}"
```""",
                module="Programmation Avancée",
                order=9
            )
            db.add(lesson9)
            db.commit()
            
            exercise9 = Exercise(
                lesson_id=lesson9.id,
                title="Calculatrice Sécurisée",
                prompt_md="""# Exercice : Calculatrice Sécurisée

Créez une calculatrice qui :
1. Demande deux nombres à l'utilisateur
2. Demande l'opération (+, -, *, /)
3. Effectue le calcul avec gestion d'erreurs

## Instructions
- Gérez les erreurs de conversion (ValueError)
- Gérez la division par zéro (ZeroDivisionError)
- Affichez un message d'erreur approprié pour chaque cas""",
                difficulty=4,
                starter_code="",
                order=1
            )
            db.add(exercise9)
            db.commit()
            
            test9 = TestCase(
                exercise_id=exercise9.id,
                name="Gestion erreurs",
                visibility="public",
                code_snippet="""# Test de la gestion d'erreurs
import sys
from io import StringIO

# Test avec division par zéro
def mock_input_zero(prompt):
    if "premier" in prompt.lower():
        return "10"
    elif "deuxième" in prompt.lower():
        return "0"
    else:
        return "/"

# Remplacer input
original_input = __builtins__['input']
__builtins__['input'] = mock_input_zero

# Capturer la sortie
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()

try:
    exec(user_code)
    output = captured_output.getvalue()
finally:
    sys.stdout = old_stdout
    __builtins__['input'] = original_input

# Vérifier la gestion d'erreur
assert "zéro" in output.lower() or "zero" in output.lower() or "division" in output.lower(), "Devrait gérer la division par zéro" """,
                order=1
            )
            db.add(test9)
            
            # Leçon 10: Modules et Bibliothèques
            lesson10 = Lesson(
                slug="modules-bibliotheques",
                title="Modules et Bibliothèques",
                body_md="""# Modules et Bibliothèques

Python vient avec de nombreux modules intégrés et vous pouvez en installer d'autres.

## Modules intégrés

```python
import math
import random
import datetime

# Mathématiques
print(math.pi)  # 3.141592653589793
print(math.sqrt(16))  # 4.0
print(math.pow(2, 3))  # 8.0

# Nombres aléatoires
print(random.randint(1, 10))  # Nombre entre 1 et 10
print(random.choice(["a", "b", "c"]))  # Choix aléatoire

# Date et heure
maintenant = datetime.datetime.now()
print(maintenant)  # Date et heure actuelles
```

## Importer de différentes façons

```python
# Import complet
import math
print(math.sqrt(16))

# Import spécifique
from math import sqrt, pi
print(sqrt(16))
print(pi)

# Import avec alias
import datetime as dt
print(dt.datetime.now())

# Import tout
from math import *
print(sqrt(16))  # Pas besoin de math.
```

## Modules utiles

```python
import os
import sys

# Système d'exploitation
print(os.getcwd())  # Répertoire courant
print(os.listdir())  # Fichiers du répertoire

# Système
print(sys.version)  # Version de Python
print(sys.platform)  # Plateforme (windows, linux, etc.)
```

## Créer votre propre module

```python
# fichier: mon_module.py
def dire_bonjour(nom):
    return f"Bonjour {nom}!"

def calculer_carre(nombre):
    return nombre ** 2

# Dans un autre fichier
import mon_module

print(mon_module.dire_bonjour("Alice"))
print(mon_module.calculer_carre(5))
```

## Installer des modules externes

```bash
# Avec pip
pip install requests
pip install numpy
pip install matplotlib
```

```python
# Utiliser un module installé
import requests

response = requests.get("https://api.github.com")
print(response.status_code)
```

## Exemples pratiques

```python
import random
import datetime

# Générateur de mot de passe
def generer_mot_de_passe(longueur=8):
    caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    mot_de_passe = ""
    for _ in range(longueur):
        mot_de_passe += random.choice(caracteres)
    return mot_de_passe

# Horodatage
def horodater():
    maintenant = datetime.datetime.now()
    return maintenant.strftime("%Y-%m-%d %H:%M:%S")

print(f"Mot de passe: {generer_mot_de_passe(12)}")
print(f"Horodatage: {horodater()}")
```""",
                module="Programmation Avancée",
                order=10
            )
            db.add(lesson10)
            db.commit()
            
            exercise10 = Exercise(
                lesson_id=lesson10.id,
                title="Générateur de Données",
                prompt_md="""# Exercice : Générateur de Données

Créez un programme qui :
1. Génère 5 nombres aléatoires entre 1 et 100
2. Calcule leur moyenne
3. Trouve le plus grand et le plus petit
4. Affiche la date et l'heure actuelles

## Instructions
- Utilisez `random.randint()` pour les nombres aléatoires
- Utilisez `datetime.datetime.now()` pour la date
- Affichez tous les résultats""",
                difficulty=3,
                starter_code="",
                order=1
            )
            db.add(exercise10)
            db.commit()
            
            test10 = TestCase(
                exercise_id=exercise10.id,
                name="Génération données",
                visibility="public",
                code_snippet="""# Test du générateur de données
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

# Vérifier que le programme fonctionne
assert len(output) > 30, "Le programme devrait afficher plusieurs informations"
assert "2025" in output or "2024" in output, "Devrait afficher l'année actuelle" """,
                order=1
            )
            db.add(test10)
            
            db.commit()
            
            print(f"\n10 nouvelles lecons ajoutees avec succes!")
            print(f"- Total lecons: {db.query(Lesson).count()}")
            print(f"- Total exercices: {db.query(Exercise).count()}")
            print(f"- Total tests: {db.query(TestCase).count()}")
            
            print(f"\nNouvelles lecons ajoutees:")
            print(f"3. Les Conditions (if/else)")
            print(f"4. Les Boucles For")
            print(f"5. Les Boucles While")
            print(f"6. Les Listes")
            print(f"7. Les Fonctions")
            print(f"8. Les Dictionnaires")
            print(f"9. Gestion des Erreurs")
            print(f"10. Modules et Bibliothèques")
            
        except Exception as e:
            db.rollback()
            print(f"Erreur lors de l'ajout: {e}")
            raise
        finally:
            db.close()
            
    except Exception as e:
        print(f"Erreur: {e}")
        sys.exit(1)
