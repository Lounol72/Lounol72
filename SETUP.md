# 🚀 Configuration du Portfolio Automatisé

Ce guide vous explique comment configurer et utiliser le système de portfolio automatisé avec GitHub Actions.

## 📋 Prérequis

- Un compte GitHub
- Un repository GitHub (fork ou clone de ce projet)
- Des projets publics sur GitHub

## ⚡ Configuration rapide

### 1. Forker le repository

1. Cliquez sur "Fork" en haut à droite de ce repository
2. Clonez votre fork localement :
   ```bash
   git clone https://github.com/VOTRE-USERNAME/Lounol72.git
   cd Lounol72
   ```

### 2. Modifier la configuration

Éditez `.github/workflows/update-portfolio.yml` :

```yaml
env:
  GITHUB_USERNAME: votre-nom-utilisateur  # ← Remplacez par votre nom d'utilisateur GitHub
```

### 3. Personnaliser les catégories (optionnel)

Éditez `scripts/portfolio-config.js` pour personnaliser :

```javascript
// Ajouter des mots-clés pour vos catégories
categorizationRules: {
  'Université': {
    topics: ['university', 'school', 'student', 'academic', 'vos-mots-cles'],
    keywords: ['université', 'école', 'étudiant', 'académique', 'vos-mots-cles']
  }
}

// Forcer des projets dans des catégories spécifiques
forcedCategories: {
  'mon-projet-special': 'Université',
  'autre-projet': 'GameJam'
}

// Exclure des projets
excludedProjects: [
  'votre-username',  // Repository principal
  '.github',         // Configuration GitHub
  'README'           // Fichiers README
]
```

### 4. Activer GitHub Actions

1. Allez dans l'onglet "Actions" de votre repository
2. Cliquez sur "I understand my workflows, go ahead and enable them"
3. Attendez le premier déclenchement (dimanche suivant à 2h UTC)

## 🧪 Tester le système

### Test local (optionnel)

```bash
# Installer les dépendances
npm install

# Tester le système
npm test

# Tester manuellement la mise à jour
npm run update-portfolio
```

### Test sur GitHub

1. Allez dans l'onglet "Actions"
2. Cliquez sur "Update Portfolio Data"
3. Cliquez sur "Run workflow"
4. Attendez la fin de l'exécution
5. Vérifiez le fichier `data/portfolio.json`

## 📊 Résultats attendus

Après la première exécution, vous devriez voir :

- **Fichier `data/portfolio.json`** mis à jour avec vos projets
- **Catégorisation automatique** : Université, Personnel, GameJam
- **Images placeholder** générées automatiquement
- **Statistiques** : étoiles, forks, dates de mise à jour

## 🔧 Personnalisation avancée

### Modifier les couleurs des langages

```javascript
// Dans scripts/portfolio-config.js
languageColors: {
  'JavaScript': '#F7DF1E',
  'Python': '#3776AB',
  'Votre-Langage': '#VOTRE-COULEUR'
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

### Modifier la fréquence de mise à jour

```yaml
# Dans .github/workflows/update-portfolio.yml
on:
  schedule:
    - cron: '0 2 * * 0'  # Chaque dimanche à 2h UTC
    # - cron: '0 2 * * *'  # Tous les jours à 2h UTC
    # - cron: '0 2 1 * *'  # Le 1er de chaque mois à 2h UTC
```

## 🚨 Dépannage

### Problèmes courants

1. **Action ne se déclenche pas**
   - Vérifiez que GitHub Actions est activé
   - Vérifiez la syntaxe du cron
   - Attendez le prochain déclenchement

2. **Erreur d'authentification**
   - Le `GITHUB_TOKEN` est automatiquement fourni
   - Vérifiez que vos repositories sont publics

3. **Projets mal catégorisés**
   - Modifiez `portfolio-config.js`
   - Ajoutez des mots-clés spécifiques
   - Utilisez `forcedCategories`

4. **Projets manquants**
   - Vérifiez qu'ils ne sont pas dans `excludedProjects`
   - Vérifiez qu'ils sont publics sur GitHub

### Logs et débogage

- Consultez les logs dans l'onglet "Actions"
- Les erreurs sont affichées dans les logs
- Utilisez le déclenchement manuel pour tester

## 📈 Monitoring

- **Historique** : Onglet "Actions" → "Update Portfolio Data"
- **Statistiques** : Fichier `data/portfolio.json`
- **Notifications** : Configurez les notifications GitHub

## 🔒 Sécurité

- **Données publiques uniquement** : Seules les informations publiques GitHub sont utilisées
- **Token sécurisé** : Le `GITHUB_TOKEN` est automatiquement fourni par GitHub
- **Permissions minimales** : Seules les permissions nécessaires sont utilisées

## 🎯 Prochaines étapes

1. **Attendez le premier déclenchement** (dimanche suivant)
2. **Vérifiez les résultats** dans `data/portfolio.json`
3. **Personnalisez** selon vos besoins
4. **Partagez** votre portfolio mis à jour automatiquement !

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les logs dans l'onglet "Actions"
2. Vérifiez la configuration dans `scripts/portfolio-config.js`
3. Testez localement avec `npm test`
4. Créez une issue sur GitHub si nécessaire

---

🎉 **Félicitations !** Votre portfolio sera maintenant mis à jour automatiquement chaque semaine avec vos derniers projets GitHub !
