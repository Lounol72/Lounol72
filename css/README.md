# 🎨 Architecture CSS - Portfolio Louis Subtil

## 📁 Structure des fichiers CSS

```
css/
├── main.css              # Fichier principal (imports tous les modules)
├── 01-variables.css      # Variables CSS et système de thème
├── 02-reset.css          # Reset CSS et styles de base
├── 03-layout.css         # Système de grille et layout
├── 04-components.css     # Composants réutilisables
├── 05-navigation.css     # Navigation et header
├── 06-sections.css       # Sections de page
├── 07-portfolio.css      # Portfolio et projets
├── 08-github.css         # Statistiques GitHub
├── 09-footer.css         # Footer et back-to-top
├── 10-responsive.css     # Media queries et responsive
├── 11-utilities.css      # Classes utilitaires
├── style.css             # Ancien fichier (à supprimer)
├── react-components.css  # Ancien fichier (à supprimer)
└── README.md             # Cette documentation
```

## 🎯 Principes de l'architecture

### **1. Modularité**
- Chaque fichier a une responsabilité spécifique
- Facile à maintenir et à déboguer
- Réutilisable et extensible

### **2. Performance**
- CSS optimisé et minifié
- Variables CSS pour la cohérence
- Animations performantes

### **3. Accessibilité**
- Support des préférences utilisateur
- Contraste élevé
- Navigation au clavier

### **4. Responsive**
- Mobile-first approach
- Breakpoints cohérents
- Container queries (futur)

## 🔧 Variables CSS disponibles

### **Couleurs**
```css
--background-color: #090706;
--text-color: #ebe5e2;
--primary-color: #c6b2ab;
--secondary-color: #5d5a3f;
--accent-color: #a4ac85;
```

### **Espacement**
```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 3rem;
--spacing-3xl: 4rem;
```

### **Transitions**
```css
--transition-fast: 0.15s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

## 🎨 Composants disponibles

### **Boutons**
```html
<button class="btn btn--primary">Primary</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--accent">Accent</button>
```

### **Cartes**
```html
<div class="card">Contenu de la carte</div>
<div class="card card--elevated">Carte élevée</div>
```

### **Badges**
```html
<span class="badge">Technologie</span>
```

### **Alertes**
```html
<div class="alert alert--success">Succès</div>
<div class="alert alert--error">Erreur</div>
<div class="alert alert--warning">Attention</div>
<div class="alert alert--info">Information</div>
```

## 🎭 Animations disponibles

### **Classes d'animation**
```html
<div class="animate-fade-in">Fade in</div>
<div class="animate-fade-in-up">Fade in up</div>
<div class="animate-slide-in-left">Slide in left</div>
<div class="animate-scale-in">Scale in</div>
<div class="animate-pulse">Pulse</div>
```

### **Délais**
```html
<div class="animate-fade-in delay-200">Délai 200ms</div>
<div class="animate-fade-in delay-500">Délai 500ms</div>
```

## 📱 Responsive Design

### **Breakpoints**
- **Mobile** : < 576px
- **Tablet** : < 768px
- **Desktop** : < 992px
- **Large** : < 1200px
- **Ultra Wide** : > 1600px

### **Approche Mobile-First**
Tous les styles commencent par mobile, puis s'étendent vers les écrans plus grands.

## ♿ Accessibilité

### **Préférences utilisateur**
- `prefers-reduced-motion` : Désactive les animations
- `prefers-contrast` : Mode contraste élevé
- `prefers-color-scheme` : Thème sombre/clair

### **Focus Management**
- Indicateurs de focus visibles
- Navigation au clavier
- Screen reader friendly

## 🚀 Performance

### **Optimisations**
- CSS modulaire et optimisé
- Variables CSS pour la cohérence
- Animations GPU-accelerated
- Lazy loading des images

### **Will-change**
Utilisé uniquement quand nécessaire pour optimiser les performances.

## 🎨 Thèmes

### **Thème sombre (par défaut)**
```css
[data-theme="dark"] {
  --background-color: #090706;
  --text-color: #ebe5e2;
  --primary-color: #c6b2ab;
}
```

### **Thème clair**
```css
[data-theme="light"] {
  --background-color: #f8f9fa;
  --text-color: #212529;
  --primary-color: #6c757d;
}
```

## 🔧 Utilisation

### **Import dans HTML**
```html
<link rel="stylesheet" href="css/main.css">
```

### **Classes utilitaires**
```html
<div class="flex flex--center mb-4">
  <span class="text-primary">Texte primaire</span>
</div>
```

### **Animations au scroll**
```html
<div class="animate-on-scroll">
  Contenu qui s'anime au scroll
</div>
```

## 📝 Maintenance

### **Ajouter un nouveau composant**
1. Créer le fichier CSS
2. L'importer dans `main.css`
3. Documenter dans ce README

### **Modifier les variables**
Éditer `01-variables.css` pour changer les couleurs, espacements, etc.

### **Ajouter des animations**
Utiliser les classes dans `11-utilities.css` ou créer de nouvelles dans le même fichier.

## 🎯 Bonnes pratiques

1. **Utiliser les variables CSS** pour la cohérence
2. **Mobile-first** pour le responsive
3. **Composants réutilisables** plutôt que du CSS dupliqué
4. **Performance** : éviter les animations coûteuses
5. **Accessibilité** : tester avec les lecteurs d'écran

---

**Architecture CSS moderne et maintenable pour un portfolio professionnel !** 🎨✨
