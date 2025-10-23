# Portfolio Louis Subtil

Portfolio professionnel développé avec Jekyll et déployé sur GitHub Pages.

## 🚀 Fonctionnalités

- **Design responsive** et moderne
- **Formulaire de contact fonctionnel** avec Formspree
- **Optimisé SEO** avec jekyll-seo-tag
- **Performance optimisée** avec SASS compilé
- **Compatible GitHub Pages** natif
- **Structure modulaire** et maintenable

## 🛠️ Technologies utilisées

- **Jekyll** - Générateur de site statique
- **SASS** - Préprocesseur CSS
- **Formspree** - Traitement des formulaires
- **GitHub Pages** - Hébergement
- **Font Awesome** - Icônes
- **Inter** - Police de caractères

## 📁 Structure du projet

```
├── _config.yml          # Configuration Jekyll
├── _layouts/            # Templates de pages
│   └── default.html
├── _includes/           # Composants réutilisables
│   └── contact-form.html
├── _sass/               # Styles SASS
│   ├── _variables.scss
│   └── _mixins.scss
├── assets/              # Assets statiques
│   ├── css/
│   ├── js/
│   └── images/
├── contact.md           # Page de contact
├── contact-success.md   # Page de succès
├── index.html           # Page d'accueil
└── 404.html            # Page d'erreur
```

## 🚀 Déploiement

Le site se déploie automatiquement sur GitHub Pages via GitHub Actions.

### Configuration requise

1. **Formspree** : Créez un compte sur [formspree.io](https://formspree.io) et remplacez `YOUR_FORM_ID` dans `_includes/contact-form.html`

2. **GitHub Pages** : Activez GitHub Pages dans les paramètres du repository

### Déploiement local

```bash
# Installation des dépendances
bundle install

# Serveur de développement
bundle exec jekyll serve

# Build de production
bundle exec jekyll build
```

## 📝 Configuration

### Variables principales (`_config.yml`)

```yaml
# Informations personnelles
title: "Louis Subtil | Portfolio"
email: "louis.subtil@etu.univ-lemans.fr"
github_username: louno172
university: "Université du Mans"

# Configuration GitHub Pages
url: "https://louno172.github.io"
baseurl: "/Louno172"
```

### Formulaire de contact

Le formulaire utilise Formspree pour le traitement des emails. Configuration dans `_includes/contact-form.html` :

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## 🎨 Personnalisation

### Couleurs et styles

Modifiez les variables SASS dans `_sass/_variables.scss` :

```scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$font-family-primary: 'Inter', sans-serif;
```

### Contenu

- **Page d'accueil** : `index.html`
- **Page de contact** : `contact.md`
- **Informations personnelles** : `_config.yml`

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints optimisés :

- Mobile : < 576px
- Tablet : 576px - 768px
- Desktop : > 768px

## 🔧 Maintenance

### Mise à jour des dépendances

```bash
bundle update
```

### Ajout de nouveaux projets

Créez un fichier dans `_projects/` avec le front matter Jekyll.

### Optimisation des images

Utilisez des formats modernes (WebP) et optimisez les tailles pour de meilleures performances.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Contact

- **Email** : louis.subtil@etu.univ-lemans.fr
- **GitHub** : [@louno172](https://github.com/louno172)
- **Portfolio** : [louno172.github.io/Louno172](https://louno172.github.io/Louno172)