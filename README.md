# Bibliothèque de Prompts

Une application web simple pour sauvegarder et gérer vos prompts préférés.

## Fonctionnalités

- Création de prompts avec titre et contenu
- Sauvegarde automatique dans le localStorage
- Affichage des prompts sous forme de cartes
- Suppression de prompts
- Interface moderne avec thème développeur
- Responsive design

## Structure du Projet

```
prompt-library/
├── index.html
├── css/
│   ├── style.css
│   ├── rating.css
│   ├── notes.css
│   └── metadata.css
├── js/
│   ├── app.js
│   └── metadata.js
└── README.md
```

## Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Remplissez le formulaire avec le titre et le contenu de votre prompt
3. Cliquez sur "Sauvegarder" pour ajouter le prompt à votre bibliothèque
4. Les prompts sont affichés sous forme de cartes avec un aperçu du contenu
5. Utilisez le bouton "Supprimer" pour retirer un prompt de la bibliothèque

## Technologies Utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- localStorage pour la persistance des données

## Design

L'interface propose deux thèmes :

- Un thème clair par défaut pour une utilisation confortable en journée
- Un thème sombre inspiré des éditeurs de code pour une utilisation nocturne

Caractéristiques du design :

- Une palette de couleurs adaptée et harmonieuse
- Une mise en page responsive
- Des ombres et contrastes pour une meilleure lisibilité
- Un bouton de basculement entre les thèmes
