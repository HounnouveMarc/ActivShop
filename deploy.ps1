# Script de déploiement ActivShop sur GitHub
# Exécutez ce script après avoir créé le repository sur GitHub

Write-Host "🚀 Déploiement ActivShop sur GitHub" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Demander le nom d'utilisateur GitHub
$username = Read-Host "Entrez votre nom d'utilisateur GitHub"
if (-not $username) {
    Write-Host "❌ Nom d'utilisateur requis" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Préparation du déploiement..." -ForegroundColor Yellow

# Vérifier le statut Git
Write-Host "📊 Statut Git actuel:" -ForegroundColor Cyan
git status

# Ajouter tous les fichiers
Write-Host "📁 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit initial
Write-Host "💾 Création du commit initial..." -ForegroundColor Yellow
$commitMessage = @"
feat: initial commit - ActivShop Bénin

- Boutique en ligne moderne avec React/TypeScript
- Système de commandes intégré (WhatsApp, Facebook, Instagram)
- Interface responsive et animations fluides
- Sauvegarde locale des commandes avec export CSV
- Configuration CI/CD avec GitHub Actions
- Documentation complète et professionnelle
"@

git commit -m $commitMessage

# Ajouter le remote GitHub
Write-Host "🔗 Configuration du remote GitHub..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$username/ActivShop.git"

# Supprimer le remote existant s'il existe
git remote remove origin 2>$null

# Ajouter le nouveau remote
git remote add origin $remoteUrl

# Pousser vers GitHub
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Déploiement réussi !" -ForegroundColor Green
    Write-Host "🌐 Votre projet est maintenant disponible sur: https://github.com/$username/ActivShop" -ForegroundColor Cyan
    
    Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Allez sur https://github.com/$username/ActivShop" -ForegroundColor White
    Write-Host "2. Vérifiez que tous les fichiers sont présents" -ForegroundColor White
    Write-Host "3. Activez GitHub Pages si nécessaire (Settings > Pages)" -ForegroundColor White
    Write-Host "4. Configurez les variables d'environnement si besoin" -ForegroundColor White
} else {
    Write-Host "❌ Erreur lors du push vers GitHub" -ForegroundColor Red
    Write-Host "Vérifiez que:" -ForegroundColor Yellow
    Write-Host "- Le repository 'ActivShop' existe sur GitHub" -ForegroundColor White
    Write-Host "- Vous avez les permissions nécessaires" -ForegroundColor White
    Write-Host "- Vous êtes connecté à GitHub" -ForegroundColor White
}

Write-Host "`n🎉 Script terminé !" -ForegroundColor Green
