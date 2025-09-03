// Configuration pour le service de commandes ActivShop Bénin

export const ORDER_CONFIG = {
  // Google Sheets Configuration
  GOOGLE_SHEETS: {
    SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
    SHEET_NAME: 'Commandes'
  },

  // WhatsApp Configuration
  WHATSAPP: {
    BUSINESS_NUMBER: '+229 771234567', // Votre numéro WhatsApp Business
    API_URL: 'https://api.whatsapp.com/send'
  },

  // Facebook Configuration
  FACEBOOK: {
    PAGE_ID: 'YOUR_FACEBOOK_PAGE_ID',
    ACCESS_TOKEN: 'YOUR_FACEBOOK_ACCESS_TOKEN',
    PAGE_URL: 'https://www.facebook.com/ActivShopBenin'
  },

  // Instagram Configuration
  INSTAGRAM: {
    USERNAME: 'activshop_benin',
    PROFILE_URL: 'https://www.instagram.com/activshop_benin'
  },

  // Email Configuration
  EMAIL: {
    ADMIN_EMAIL: 'votre-email@gmail.com',
    NOTIFICATIONS_ENABLED: true
  },

  // Application Configuration
  APP: {
    NAME: 'ActivShop Bénin',
    CURRENCY: 'FCFA',
    COUNTRY: 'Bénin'
  }
};

// Instructions de configuration :
/*
1. GOOGLE SHEETS SETUP:
   - Créez un Google Sheet
   - Copiez l'ID du sheet depuis l'URL
   - Créez un Google Apps Script avec le code fourni
   - Déployez comme web app
   - Copiez l'URL du script déployé

2. WHATSAPP SETUP:
   - Utilisez votre numéro WhatsApp Business
   - Ou un numéro personnel pour les tests

3. FACEBOOK SETUP:
   - Créez une page Facebook pour votre business
   - Obtenez l'ID de la page
   - Créez un token d'accès (optionnel pour les tests)

4. INSTAGRAM SETUP:
   - Utilisez votre nom d'utilisateur Instagram
   - Pas d'API publique disponible, redirection vers l'app

5. EMAIL SETUP:
   - Configurez votre email pour recevoir les notifications
   - Désactivez si non nécessaire
*/
