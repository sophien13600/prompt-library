# Déploiement de l'application sur Render

## 1. Préparation

L'application est une simple app HTML/CSS/JS utilisant le localStorage.
Aucune base de données ou backend n'est nécessaire.
L'application est deployée sur la plateforme Render, un service d'hebergement en ligne gratuit permettant de publier des sites statiques directement depuis un depot Github

Structure du projet :

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

**Remarques :**

* Le fichier `index.html` est à la racine du projet ; Render l’utilisera comme point d’entrée.
* Les fichiers CSS et JS sont liés avec des **chemins relatifs** afin d’assurer la portabilité lors du déploiement.

Exemple :

```html
<link rel="stylesheet" href="./style.css">
<script src="./script.js" defer></script>
```

---

## 3. Mise en ligne via GitHub

Render déploie directement depuis un dépôt Git.
Il est donc nécessaire de publier le projet sur **GitHub**.

### Étapes :

1. Créer un nouveau dépôt sur GitHub, par exemple `mon-app`.

2. Initialiser le dépôt localement et y ajouter le projet :

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<utilisateur>/mon-app.git
   git push -u origin main
   ```

3. Vérifier que le projet est bien visible sur GitHub.

---

## 4. Déploiement sur Render

### 4.1 Création du site statique

1. Se rendre sur [https://render.com](https://render.com)
2. Créer un compte (il est possible de se connecter avec GitHub)
3. Cliquer sur **“New +” → “Static Site”**
4. Sélectionner le dépôt GitHub correspondant (`mon-app`)

### 4.2 Configuration du déploiement

| Champ                 | Valeur à renseigner          |
| --------------------- | ---------------------------- |
| **Name**              | mon-app (ou un nom au choix) |
| **Build Command**     | *(laisser vide)*             |
| **Publish Directory** | `./` (répertoire racine)      |

Enfin, cliquer sur **Create Static Site**.

Render va automatiquement :

* cloner le dépôt GitHub ;
* héberger les fichiers statiques ;
* générer une URL publique du type :
  `https://mon-app.onrender.com`

---

## 5. Vérification du déploiement

Une fois le déploiement terminé :

* Accéder à l’URL générée par Render ;
* Vérifier que les fichiers HTML, CSS et JS se chargent correctement ;
* Tester les fonctionnalités dépendant du **LocalStorage** ;
* Ouvrir la console du navigateur (F12 → Console) pour s’assurer qu’aucune erreur n’est signalée.

---

## 6. Mise à jour du site

Chaque modification apportée localement peut être redéployée automatiquement via Git :

```bash
git add .
git commit -m "Mise à jour du site"
git push
```

Render détectera le nouveau commit sur la branche `main` et relancera le déploiement automatiquement.

---

## 7. Conclusion

Ce processus de déploiement permet d’héberger rapidement et gratuitement une application web statique sans serveur ni base de données.
Render offre une intégration continue avec GitHub, garantissant que chaque mise à jour du code source est immédiatement reflétée en ligne.
Cette méthode est adaptée pour les projets pédagogiques, les démonstrations de prototypes ou les applications légères basées sur le navigateur.

---

**Technologies utilisées :** HTML5, CSS3, JavaScript, LocalStorage
**Plateforme d’hébergement :** [Render](https://render.com)
