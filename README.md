# Louis Subtil - Portfolio Développeur

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222?logo=github)](https://lounol72.github.io/Lounol72/)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE)

Portfolio professionnel développé en HTML, CSS et JavaScript vanilla. Site statique hébergé sur GitHub Pages avec mise à jour automatique des projets depuis l'API GitHub.

## Aperçu

- **Démo live** : [https://lounol72.github.io/Lounol72/](https://lounol72.github.io/Lounol72/)


## Stack technique

| Technologie | Usage |
|-------------|-------|
| HTML5 | Structure sémantique, accessibilité |
| CSS3 | Variables CSS, design responsive, animations |
| TypeScript | Interactions, chargement dynamique du portfolio (compilé en JS) |
| GitHub Pages | Hébergement statique |
| GitHub Actions | Déploiement automatique, mise à jour hebdomadaire des données |
| Formspree | Formulaire de contact sans backend |

## Fonctionnalités

- **Portfolio dynamique** : Projets chargés depuis `data/portfolio.json`, généré automatiquement depuis l'API GitHub
- **Mise à jour automatique** : Workflow GitHub Actions exécuté chaque dimanche pour récupérer les derniers repos
- **Filtrage par catégorie** : Université, Personnel, GameJam
- **Statistiques GitHub** : Repositories, étoiles, followers affichés dynamiquement
- **Design responsive** : Mobile-first, menu hamburger sur petits écrans
- **Formulaire de contact** : Intégration Formspree opérationnelle
- **SEO et accessibilité** : Meta Open Graph, Twitter Card, ARIA labels, navigation clavier

## Installation

**Prérequis** : Node.js 18+

```bash
git clone https://github.com/Lounol72/Lounol72.git
cd Lounol72
npm install
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run build` | Compile le TypeScript vers JavaScript |
| `npm run build:watch` | Compilation en mode watch |
| `npm run update-github-stats` | Récupère les statistiques et repos depuis l'API GitHub |
| `npm run generate-portfolio` | Génère `data/portfolio.json` à partir de `data/github.json` |
| `npm run update-portfolio` | Pipeline complet : stats + génération |

## Premier déploiement

Avant le premier déploiement, exécuter une fois les scripts pour peupler les données :

```bash
npm run build
npm run update-portfolio
git add data/ assets/js/
git commit -m "Initialisation des données portfolio et build"
git push
```

## Structure du projet

```
Lounol72/
├── index.html              # Page d'accueil
├── contact.html            # Page de contact
├── 404.html                # Page d'erreur
├── data/
│   ├── portfolio.json      # Projets générés (par generate-portfolio.js)
│   └── github.json         # Données brutes API (par fetch-github-stats.js)
├── src/
│   ├── ts/                 # Source TypeScript
│   │   ├── main.ts
│   │   ├── portfolio.ts
│   │   └── github-integration.ts
│   └── types/
│       └── portfolio.d.ts  # Interfaces TypeScript
├── assets/
│   ├── css/                # Styles modulaires
│   ├── js/                 # JavaScript compilé (généré par npm run build)
│   └── images/
├── .github/
│   ├── workflows/          # Déploiement, mise à jour portfolio
│   └── scripts/            # fetch-github-stats.js, generate-portfolio.js
└── package.json
```

## Développement local

Servir le site avec un serveur HTTP local (pour éviter les erreurs CORS sur `fetch` des JSON) :

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

## Déploiement

Le site se déploie automatiquement sur GitHub Pages à chaque push sur la branche `main` via le workflow `deploy-static.yml`. Aucune action manuelle requise.

## Personnalisation

- **Couleurs** : Variables dans `assets/css/01-variables.css` (--color-primary, --color-heading, etc.)
- **Contenu** : Éditer `index.html` et `contact.html`
- **Catégories** : Modifier `CATEGORIES` dans `.github/scripts/generate-portfolio.js`

## Contact

- **Email** : louis.subtil@etu.univ-lemans.fr
- **GitHub** : [Lounol72](https://github.com/Lounol72)
- **Localisation** : Le Mans, France

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
