# Guide de Configuration - Système de Commandes ActivShop Bénin

## 🎯 Objectif
Ce guide vous aide à configurer le système de commandes qui :
- Sauvegarde les commandes dans Google Sheets
- Envoie les commandes via WhatsApp, Facebook et Instagram
- Affiche des confirmations à l'utilisateur

## 📋 Prérequis
- Un compte Google (pour Google Sheets et Apps Script)
- Un numéro WhatsApp Business ou personnel
- Une page Facebook (optionnel)
- Un compte Instagram (optionnel)

## 🚀 Configuration Étape par Étape

### 1. Configuration Google Sheets

#### 1.1 Créer le Google Sheet
1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau document
3. Nommez-le "ActivShop Commandes"
4. Copiez l'ID du document depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

#### 1.2 Créer le Google Apps Script
1. Allez sur [Google Apps Script](https://script.google.com)
2. Cliquez sur "Nouveau projet"
3. Nommez-le "ActivShop Order Service"
4. Remplacez le code par le contenu du fichier `google-apps-script.js`
5. Modifiez les variables de configuration :
   ```javascript
   const SPREADSHEET_ID = 'VOTRE_SPREADSHEET_ID';
   const adminEmail = 'votre-email@gmail.com';
   ```

#### 1.3 Déployer le Script
1. Cliquez sur "Déployer" > "Nouveau déploiement"
2. Choisissez "Application web"
3. Configurez :
   - **Exécuter en tant que** : Vous-même
   - **Qui a accès** : Tout le monde
4. Cliquez sur "Déployer"
5. Copiez l'URL du script déployé

### 2. Configuration de l'Application

#### 2.1 Mettre à jour la configuration
Dans `src/lib/config.ts`, remplacez les valeurs :

```typescript
export const ORDER_CONFIG = {
  GOOGLE_SHEETS: {
    SCRIPT_URL: 'https://script.google.com/macros/s/VOTRE_SCRIPT_ID/exec',
    SPREADSHEET_ID: 'VOTRE_SPREADSHEET_ID',
    SHEET_NAME: 'Commandes'
  },
  WHATSAPP: {
    BUSINESS_NUMBER: '+229 VOTRE_NUMERO',
    API_URL: 'https://api.whatsapp.com/send'
  },
  FACEBOOK: {
    PAGE_ID: 'VOTRE_PAGE_ID',
    ACCESS_TOKEN: 'VOTRE_TOKEN', // Optionnel
    PAGE_URL: 'https://www.facebook.com/VOTRE_PAGE'
  },
  INSTAGRAM: {
    USERNAME: 'votre_username',
    PROFILE_URL: 'https://www.instagram.com/votre_username'
  },
  EMAIL: {
    ADMIN_EMAIL: 'votre-email@gmail.com',
    NOTIFICATIONS_ENABLED: true
  }
};
```

#### 2.2 Mettre à jour le service de commandes
Dans `src/lib/orderService.ts`, remplacez les URLs :

```typescript
private readonly GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/VOTRE_SCRIPT_ID/exec';
private readonly WHATSAPP_API_URL = 'https://api.whatsapp.com/send';
private readonly FACEBOOK_PAGE_ID = 'VOTRE_PAGE_ID';
private readonly FACEBOOK_ACCESS_TOKEN = 'VOTRE_ACCESS_TOKEN';
```

### 3. Configuration WhatsApp

#### 3.1 Numéro WhatsApp Business
1. Utilisez votre numéro WhatsApp Business
2. Ou votre numéro personnel pour les tests
3. Format : `+229 771234567`

#### 3.2 Test WhatsApp
1. Ouvrez WhatsApp Web ou l'app
2. Testez l'envoi d'un message via l'URL :
   ```
   https://api.whatsapp.com/send?phone=229771234567&text=Test
   ```

### 4. Configuration Facebook (Optionnel)

#### 4.1 Créer une Page Facebook
1. Allez sur [Facebook Pages](https://facebook.com/pages)
2. Créez une page pour votre business
3. Notez l'ID de la page

#### 4.2 Obtenir un Access Token (Optionnel)
1. Allez sur [Facebook Developers](https://developers.facebook.com)
2. Créez une app
3. Obtenez un access token
4. Ou utilisez la redirection simple vers la page

### 5. Configuration Instagram

#### 5.1 Compte Instagram
1. Utilisez votre nom d'utilisateur Instagram
2. Pas d'API publique disponible
3. Le système redirigera vers l'app Instagram

## 🧪 Test du Système

### 1. Test Google Sheets
1. Ouvrez votre Google Sheet
2. Vérifiez que l'onglet "Commandes" existe
3. Les en-têtes doivent être présents

### 2. Test de Commande
1. Lancez l'application
2. Ajoutez des produits au panier
3. Remplissez le formulaire de contact
4. Soumettez la commande
5. Vérifiez :
   - La confirmation dans l'app
   - L'enregistrement dans Google Sheets
   - L'ouverture de WhatsApp/Facebook/Instagram

### 3. Test des Notifications
1. Vérifiez votre email pour les notifications
2. Vérifiez les messages dans Google Sheets

## 🔧 Dépannage

### Problème : Erreur Google Sheets
- Vérifiez l'ID du spreadsheet
- Vérifiez les permissions du script
- Vérifiez que le script est déployé

### Problème : WhatsApp ne s'ouvre pas
- Vérifiez le format du numéro
- Testez l'URL WhatsApp manuellement
- Vérifiez que WhatsApp est installé

### Problème : Facebook ne fonctionne pas
- Utilisez la redirection simple vers la page
- Vérifiez l'URL de la page
- Testez manuellement

### Problème : Pas de notifications email
- Vérifiez l'adresse email dans la config
- Vérifiez les permissions du script
- Désactivez si non nécessaire

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs dans Google Apps Script
3. Testez chaque composant séparément
4. Contactez le support technique

## 🎉 Félicitations !

Votre système de commandes est maintenant configuré et fonctionnel. Les commandes seront :
- Sauvegardées dans Google Sheets
- Envoyées via les plateformes choisies
- Confirmées à l'utilisateur
- Notifiées par email (optionnel)
