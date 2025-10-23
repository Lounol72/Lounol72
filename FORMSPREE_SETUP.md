# Configuration Formspree pour le formulaire de contact

## Étapes de configuration

### 1. Créer un compte Formspree
1. Allez sur [formspree.io](https://formspree.io)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Créer un nouveau formulaire
1. Dans votre dashboard Formspree, cliquez sur "New Form"
2. Donnez un nom à votre formulaire (ex: "Portfolio Contact")
3. Copiez l'ID du formulaire (format: `xqwerty123`)

### 3. Mettre à jour le formulaire
Remplacez `YOUR_FORM_ID` dans le fichier `_includes/contact-form.html` par votre ID Formspree :

```html
<!-- Ligne 3 du fichier _includes/contact-form.html -->
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
```

### 4. Configuration avancée (optionnel)
Dans votre dashboard Formspree, vous pouvez :
- Configurer les notifications email
- Ajouter des règles de validation
- Personnaliser les messages de succès/erreur
- Intégrer avec d'autres services (Slack, Zapier, etc.)

### 5. Test du formulaire
1. Déployez votre site
2. Testez l'envoi d'un message
3. Vérifiez que vous recevez l'email

## Limites du plan gratuit
- 50 soumissions par mois
- Pas de webhooks
- Support email uniquement

## Alternative : Netlify Forms
Si vous préférez, vous pouvez utiliser Netlify Forms (gratuit, 100 soumissions/mois) :
1. Changez l'action du formulaire vers `#`
2. Ajoutez `data-netlify="true"` à la balise form
3. Ajoutez un champ caché : `<input type="hidden" name="form-name" value="contact">`
