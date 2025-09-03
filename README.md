# ActivShop Bénin - Boutique en Ligne

Une boutique en ligne moderne et responsive pour ActivShop Bénin, spécialisée dans la vente de produits de fitness et de nutrition.

## 🚀 Fonctionnalités

- **Catalogue de produits** avec filtrage par catégorie
- **Système de panier** avec gestion des quantités
- **Recherche de produits** en temps réel
- **Système de commandes** intégré avec WhatsApp, Facebook et Instagram
- **Interface responsive** optimisée mobile et desktop
- **Animations fluides** et expérience utilisateur moderne
- **Sauvegarde locale** des commandes avec export CSV

## 🛠️ Technologies

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants
- **React Router** pour la navigation
- **Lucide React** pour les icônes

## 📦 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/activshop-benin.git
   cd activshop-benin
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

## 🏗️ Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI (Shadcn)
│   └── layout/         # Composants de mise en page
├── pages/              # Pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── Shop.tsx        # Page boutique
│   └── Product.tsx     # Page produit détaillé
├── lib/                # Services et utilitaires
│   ├── simpleOrderService.ts  # Service de commandes
│   └── config.ts       # Configuration
├── assets/             # Images et ressources
└── styles/             # Styles globaux
```

## 🛍️ Système de Commandes

Le projet inclut un système de commandes complet :

### Configuration Simple (Recommandé)
- Sauvegarde locale dans localStorage
- Export CSV des commandes
- Redirection directe vers WhatsApp/Facebook/Instagram

### Configuration Avancée (Google Sheets)
- Intégration Google Sheets pour la sauvegarde
- Notifications email automatiques
- API Facebook Messenger

## 📱 Plateformes Supportées

- **WhatsApp** : Envoi direct via API WhatsApp
- **Facebook** : Redirection vers la page Facebook
- **Instagram** : Redirection vers le profil Instagram

## 🎨 Personnalisation

### Couleurs et Thème
Modifiez les variables CSS dans `src/index.css` :
```css
:root {
  --primary: #FF6B35;
  --secondary: #1E3A8A;
  --accent: #F59E0B;
}
```

### Configuration des Plateformes
Modifiez `src/lib/simpleOrderService.ts` :
```typescript
private readonly WHATSAPP_NUMBER = '+229 VOTRE_NUMERO';
private readonly FACEBOOK_PAGE = 'VOTRE_PAGE_FACEBOOK';
private readonly INSTAGRAM_USERNAME = 'votre_username';
```

## 📊 Gestion des Commandes

### Export CSV
```javascript
import { simpleOrderService } from '@/lib/simpleOrderService';

// Télécharger toutes les commandes
simpleOrderService.downloadOrdersCSV();
```

### Récupération des Commandes
```javascript
// Récupérer toutes les commandes
const orders = simpleOrderService.getLocalOrders();

// Mettre à jour le statut d'une commande
simpleOrderService.updateOrderStatus('CMD-123', 'confirmed');
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement sur Vercel
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement si nécessaire
3. Déployez automatiquement

### Déploiement sur Netlify
1. Connectez votre repository GitHub à Netlify
2. Configurez le build command : `npm run build`
3. Configurez le publish directory : `dist`

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez-nous via email : contact@activshop-benin.com

## 🙏 Remerciements

- [Shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [Lucide](https://lucide.dev/) pour les icônes
- [Vite](https://vitejs.dev/) pour l'outil de build

---

**ActivShop Bénin** - Votre partenaire fitness au Bénin 💪 
