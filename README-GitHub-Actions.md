# 🤖 Portfolio Automatisé avec GitHub Actions

Ce système automatise la mise à jour de votre portfolio en récupérant vos projets GitHub et en les catégorisant automatiquement.

## 🚀 Fonctionnalités

- **Mise à jour automatique** : Chaque dimanche à 2h UTC
- **Catégorisation intelligente** : Université, Personnel, GameJam
- **Images automatiques** : Placeholders basés sur les langages
- **Statistiques en temps réel** : Étoiles, forks, dates
- **Configuration flexible** : Règles personnalisables

## 📁 Structure des fichiers

```
.github/workflows/
├── update-portfolio.yml          # GitHub Action principale

scripts/
├── fetch-github-data.js          # Script de récupération des données
├── portfolio-config.js           # Configuration de catégorisation

data/
├── portfolio.json                # Données générées automatiquement
└── README.md                     # Documentation des données

package.json                      # Dépendances Node.js
```

## ⚙️ Configuration

### 1. Configuration GitHub

1. **Forkez ce repository** ou clonez-le
2. **Activez GitHub Actions** dans les paramètres du repository
3. **Configurez les secrets** (optionnel) :
   - `GITHUB_TOKEN` : Token d'accès pour l'API GitHub

### 2. Personnalisation des catégories

Éditez `scripts/portfolio-config.js` pour personnaliser :

```javascript
// Ajouter des mots-clés pour une catégorie
categorizationRules: {
  'Université': {
    topics: ['university', 'school', 'student', 'academic'],
    keywords: ['université', 'école', 'étudiant', 'académique']
  }
}

// Forcer un projet dans une catégorie
forcedCategories: {
  'mon-projet-special': 'Université'
}

// Exclure des projets
excludedProjects: [
  'louno172', '.github', 'README'
]
```

### 3. Configuration de l'utilisateur GitHub

Dans `.github/workflows/update-portfolio.yml`, modifiez :

```yaml
env:
  GITHUB_USERNAME: votre-nom-utilisateur  # Remplacez par votre nom d'utilisateur
```

## 🎯 Comment ça marche

### 1. Déclenchement automatique
- **Quand** : Chaque dimanche à 2h UTC
- **Déclenchement manuel** : Possible via l'interface GitHub

### 2. Récupération des données
- Utilise l'API GitHub pour récupérer vos repositories publics
- Récupère les statistiques utilisateur (étoiles, followers, etc.)
- Analyse les topics et descriptions pour la catégorisation

### 3. Catégorisation intelligente
- **Université** : Projets avec topics/keywords académiques
- **GameJam** : Projets liés aux événements de développement de jeux
- **Personnel** : Tous les autres projets

### 4. Génération des images
- Placeholders SVG automatiques
- Couleurs basées sur le langage principal
- Design cohérent avec votre thème

### 5. Mise à jour du portfolio
- Génère le fichier `data/portfolio.json`
- Commit automatique avec message descriptif
- Push automatique vers le repository

## 📊 Données générées

Le fichier `portfolio.json` contient :

```json
{
  "projects": [
    {
      "id": "github-nom-projet",
      "title": "Nom Du Projet",
      "description": "Description du projet",
      "category": "Université|Personnel|GameJam",
      "image": "data:image/svg+xml;base64...",
      "technologies": ["JavaScript", "React"],
      "github": "https://github.com/username/repo",
      "demo": "https://demo-url.com",
      "stars": 5,
      "forks": 2,
      "lastUpdated": "2024-01-15",
      "status": "active|archived|fork",
      "year": 2024,
      "topics": ["react", "javascript"],
      "language": "JavaScript"
    }
  ],
  "categories": { /* Configuration des catégories */ },
  "stats": {
    "totalProjects": 10,
    "byCategory": { "Université": 3, "Personnel": 5, "GameJam": 2 },
    "totalStars": 25,
    "totalForks": 8,
    "lastUpdated": "2024-01-15"
  },
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "generatedBy": "GitHub Action",
    "source": "GitHub API",
    "username": "votre-username"
  }
}
```

## 🔧 Dépannage

### Problèmes courants

1. **Action ne se déclenche pas**
   - Vérifiez que GitHub Actions est activé
   - Vérifiez la syntaxe du cron dans le workflow

2. **Erreur d'authentification**
   - Vérifiez que `GITHUB_TOKEN` est configuré
   - Le token doit avoir les permissions `repo` et `user`

3. **Projets mal catégorisés**
   - Modifiez `portfolio-config.js`
   - Ajoutez des mots-clés spécifiques
   - Utilisez `forcedCategories` pour forcer une catégorie

4. **Projets manquants**
   - Vérifiez qu'ils ne sont pas dans `excludedProjects`
   - Vérifiez qu'ils sont publics sur GitHub

### Logs et débogage

- Consultez les logs dans l'onglet "Actions" de GitHub
- Les erreurs sont affichées dans les logs de l'action
- Utilisez le déclenchement manuel pour tester

## 🎨 Personnalisation avancée

### Modifier les couleurs des langages

```javascript
// Dans portfolio-config.js
languageColors: {
  'JavaScript': '#F7DF1E',
  'Python': '#3776AB',
  // Ajoutez vos couleurs préférées
}
```

### Modifier le design des placeholders

```javascript
placeholderConfig: {
  width: 350,
  height: 250,
  backgroundColor: '#F3F4F6',
  textColor: '#6B7280',
  fontSize: 14,
  fontFamily: 'Arial, sans-serif'
}
```

### Ajouter de nouvelles catégories

```javascript
categorizationRules: {
  'Nouvelle Catégorie': {
    topics: ['mot-clé1', 'mot-clé2'],
    keywords: ['keyword1', 'keyword2'],
    description: 'Description de la nouvelle catégorie',
    icon: 'fas fa-icon',
    color: '#COULEUR'
  }
}
```

## 📈 Monitoring

- **Historique** : Consultez l'onglet "Actions" pour voir l'historique
- **Statistiques** : Les métriques sont mises à jour automatiquement
- **Notifications** : Configurez les notifications GitHub pour être alerté des échecs

## 🔒 Sécurité

- **Pas d'informations sensibles** : Seules les données publiques GitHub sont utilisées
- **Token sécurisé** : Le `GITHUB_TOKEN` est automatiquement fourni par GitHub
- **Permissions minimales** : Seules les permissions nécessaires sont utilisées

## 🚀 Déploiement

1. **Forkez le repository**
2. **Modifiez la configuration** selon vos besoins
3. **Activez GitHub Actions**
4. **Attendez le premier déclenchement** (dimanche suivant)
5. **Vérifiez les résultats** dans `data/portfolio.json`

Votre portfolio sera automatiquement mis à jour chaque semaine ! 🎉
