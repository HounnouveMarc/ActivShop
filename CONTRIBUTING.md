# Guide de Contribution - ActivShop Bénin

Merci de votre intérêt pour contribuer au projet ActivShop Bénin ! Ce document vous guide à travers le processus de contribution.

## 🚀 Comment Contribuer

### 1. Fork et Clone

1. Fork le repository sur GitHub
2. Clone votre fork localement :
   ```bash
   git clone https://github.com/votre-username/activshop-benin.git
   cd activshop-benin
   ```

### 2. Installation

```bash
npm install
```

### 3. Branche de Développement

Créez une branche pour votre fonctionnalité :
```bash
git checkout -b feature/nom-de-la-fonctionnalite
```

### 4. Développement

1. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez http://localhost:5173 dans votre navigateur

3. Développez votre fonctionnalité

### 5. Tests

Avant de soumettre votre contribution, assurez-vous que :

```bash
# Vérification du type TypeScript
npm run type-check

# Linting
npm run lint

# Build de production
npm run build
```

### 6. Commit et Push

```bash
git add .
git commit -m "feat: ajouter une nouvelle fonctionnalité"
git push origin feature/nom-de-la-fonctionnalite
```

### 7. Pull Request

1. Allez sur GitHub et créez une Pull Request
2. Remplissez le template de PR
3. Attendez la review

## 📋 Standards de Code

### TypeScript
- Utilisez TypeScript strictement
- Définissez des types pour toutes les interfaces
- Évitez `any` autant que possible

### React
- Utilisez des composants fonctionnels avec hooks
- Suivez les règles des hooks React
- Utilisez des props typées

### Styling
- Utilisez Tailwind CSS pour le styling
- Suivez les conventions de nommage BEM
- Utilisez les variables CSS pour les couleurs

### Structure des Fichiers
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   └── layout/         # Composants de mise en page
├── pages/              # Pages de l'application
├── lib/                # Services et utilitaires
├── assets/             # Images et ressources
└── styles/             # Styles globaux
```

## 🐛 Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec le template "Bug Report"
3. Incluez :
   - Description détaillée du bug
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Informations sur l'environnement

## 💡 Proposer une Fonctionnalité

1. Créez une issue avec le template "Feature Request"
2. Décrivez :
   - Le problème que cela résout
   - La solution proposée
   - Alternatives considérées
   - Mockups ou exemples si applicable

## 📝 Messages de Commit

Utilisez le format conventionnel :

```
type(scope): description

feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: tests
chore: tâches de maintenance
```

Exemples :
- `feat(shop): ajouter système de filtrage par prix`
- `fix(cart): corriger calcul du total`
- `docs(readme): mettre à jour instructions d'installation`

## 🔍 Review Process

1. **Code Review** : Toutes les PR sont revues
2. **Tests** : Assurez-vous que les tests passent
3. **Documentation** : Mettez à jour la documentation si nécessaire
4. **Merge** : Une fois approuvée, la PR sera mergée

## 🎯 Zones de Contribution

### Priorité Haute
- Corrections de bugs critiques
- Améliorations de performance
- Sécurité

### Priorité Moyenne
- Nouvelles fonctionnalités
- Améliorations UX/UI
- Optimisations

### Priorité Basse
- Documentation
- Refactorisation
- Tests

## 📞 Support

Si vous avez des questions :
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation

## 🙏 Remerciements

Merci de contribuer à ActivShop Bénin ! Votre contribution aide à améliorer l'expérience de nos utilisateurs.

---

**ActivShop Bénin** - Ensemble pour l'excellence 💪
