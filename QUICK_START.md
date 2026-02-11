# 🎯 Guide Rapide : Sauvegarder sur GitHub et Déployer en Local

## ✅ Statut Actuel

Votre projet est **prêt pour GitHub** ! Tous les fichiers nécessaires ont été créés :

```
✅ .gitignore              - Ignore les fichiers sensibles
✅ .env.example            - Template de configuration
✅ docker-compose.yml      - Configuration Docker
✅ Dockerfiles             - Images Docker backend/frontend
✅ start.sh                - Script de démarrage automatique
✅ LICENSE                 - Licence MIT
✅ README_GITHUB.md        - README complet pour GitHub
✅ DEPLOY_LOCAL.md         - Guide de déploiement détaillé
✅ TESTING.md              - Guide de tests
✅ ARCHITECTURE.md         - Documentation technique
```

## 📤 Étape 1 : Sauvegarder sur GitHub

### Option A : Via Interface Emergent (Recommandé)

1. **Cliquez sur "Save to GitHub"** dans l'interface de chat
2. **Sélectionnez ou créez une branche** (ex: `main` ou `tiktok-automation`)
3. **Cliquez "PUSH TO GITHUB"**
4. ✅ Votre code est maintenant sur GitHub !

### Option B : Manuellement (Si vous avez accès terminal)

```bash
# Initialiser git (si pas déjà fait)
cd /app
git init

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "Initial commit - TikTok Automation Platform with AI"

# Ajouter votre repository distant
git remote add origin https://github.com/VOTRE_USERNAME/tiktok-automation.git

# Push vers GitHub
git push -u origin main
```

## 💻 Étape 2 : Déployer en Local sur Votre Machine

### Prérequis

Installez sur votre machine locale :
- **[Docker Desktop](https://docs.docker.com/get-docker/)** (recommandé)
- **Git**

### Installation Simple (3 commandes)

```bash
# 1. Cloner le repository
git clone https://github.com/VOTRE_USERNAME/tiktok-automation.git
cd tiktok-automation

# 2. Configurer la clé Emergent
cp .env.example backend/.env
nano backend/.env  # ou notepad backend/.env sur Windows

# Dans backend/.env, remplacez :
# EMERGENT_LLM_KEY=sk-emergent-VOTRE_VRAIE_CLE_ICI

# 3. Démarrer l'application
./start.sh  # ou: bash start.sh
```

**C'est tout !** 🎉

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:8001

## 🔑 Obtenir Votre Clé Emergent

1. Allez sur https://app.emergent.ai
2. Connectez-vous
3. Cliquez sur **Profil** (coin supérieur droit)
4. Allez dans **Universal Key**
5. Copiez votre clé (commence par `sk-emergent-`)

## 🎬 Tester l'Application

### Test Rapide (5 minutes)

1. **Ouvrez** http://localhost:3000 dans votre navigateur
2. **Allez dans "Tendances"** → Cliquez "Ajouter Tendance"
3. **Remplissez** :
   - Titre : "Routine matinale millionnaire"
   - Niche : "entrepreneuriat"
   - Vues : 250000
   - Engagement : 35000
4. **Ajoutez** 2-3 autres tendances
5. **Allez au Dashboard** → Voyez les niches recommandées
6. **Allez dans "Générer Vidéo"**
7. **Sélectionnez** une niche recommandée
8. **Cliquez** "Générer la Vidéo"
9. **Attendez** 1-2 minutes
10. **Téléchargez** votre vidéo TikTok !

## 📚 Documentation

Tout est documenté dans le repository :

- **[README_GITHUB.md](README_GITHUB.md)** : Vue d'ensemble complète
- **[DEPLOY_LOCAL.md](DEPLOY_LOCAL.md)** : Guide de déploiement détaillé (Docker et sans Docker)
- **[TESTING.md](TESTING.md)** : Comment tester chaque fonctionnalité
- **[ARCHITECTURE.md](ARCHITECTURE.md)** : Documentation technique

## 🔧 Commandes Utiles

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter l'application
docker-compose down

# Voir l'état des conteneurs
docker-compose ps
```

## ❓ Problèmes Courants

### "Port déjà utilisé"
```bash
docker-compose down
docker-compose up -d
```

### "EMERGENT_LLM_KEY not found"
Vérifiez que `backend/.env` contient votre clé :
```bash
cat backend/.env | grep EMERGENT_LLM_KEY
```

### Génération vidéo échoue
1. Vérifiez vos crédits Emergent sur https://app.emergent.ai
2. Consultez les logs : `docker-compose logs backend`

## 🌟 Prochaines Étapes

1. ✅ Sauvegardez sur GitHub
2. ✅ Clonez sur votre machine locale
3. ✅ Configurez la clé Emergent
4. ✅ Démarrez avec `./start.sh`
5. ✅ Testez la génération de vidéo
6. ✅ Publiez sur TikTok
7. ✅ Ajoutez les analytics
8. ✅ Laissez le système apprendre et s'améliorer !

## 💡 Conseils

- **Commencez petit** : Ajoutez 5-10 tendances pour tester
- **Surveillez les crédits** : La génération consomme des crédits Emergent
- **Sauvegardez régulièrement** : `docker-compose exec mongodb mongodump`
- **Lisez les docs** : Tout est expliqué en détail

## 🎯 Résumé Ultra-Rapide

```bash
# Sur Emergent : Cliquez "Save to GitHub"
# Sur votre machine :

git clone https://github.com/VOTRE_USERNAME/tiktok-automation.git
cd tiktok-automation
cp .env.example backend/.env
# Ajoutez votre EMERGENT_LLM_KEY dans backend/.env
./start.sh
# Ouvrez http://localhost:3000
```

**Vous êtes prêt à générer des vidéos TikTok virales avec l'IA ! 🚀**

---

📧 **Besoin d'aide ?**
- Consultez [DEPLOY_LOCAL.md](DEPLOY_LOCAL.md) pour le guide complet
- Vérifiez les logs : `docker-compose logs`
- Ouvrez une issue sur GitHub

**Bon déploiement ! 🎉**
