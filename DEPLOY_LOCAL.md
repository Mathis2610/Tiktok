# 🚀 Guide de Déploiement Local via GitHub

Ce guide vous explique comment cloner et déployer l'application TikTok Automation en local sur votre machine.

## 📋 Prérequis

### Option 1 : Avec Docker (Recommandé) ⭐

**Avantages** :
- Installation simple et rapide
- Pas de configuration système
- Tout fonctionne dans des conteneurs isolés
- Compatible Windows, Mac, Linux

**Requis** :
- [Docker Desktop](https://docs.docker.com/get-docker/) (inclut Docker Compose)
- Git
- 4 GB RAM minimum
- 5 GB d'espace disque

### Option 2 : Installation Native

**Requis** :
- Python 3.11+
- Node.js 18+
- MongoDB 7.0+
- FFmpeg
- Yarn (`npm install -g yarn`)
- Git

## 🔧 Installation avec Docker (Méthode Simple)

### 1. Cloner le Repository

```bash
git clone https://github.com/VOTRE_USERNAME/tiktok-automation.git
cd tiktok-automation
```

### 2. Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example backend/.env

# Éditer le fichier et ajouter votre clé Emergent
nano backend/.env  # ou vim, ou votre éditeur préféré
```

**Dans `backend/.env`, modifiez** :
```bash
EMERGENT_LLM_KEY=sk-emergent-VOTRE_VRAIE_CLE_ICI
```

> 🔑 **Obtenir votre clé Emergent** :
> 1. Connectez-vous sur https://app.emergent.ai
> 2. Allez dans Profil → Universal Key
> 3. Copiez votre clé

### 3. Démarrer l'Application

```bash
# Rendre le script exécutable
chmod +x start.sh

# Lancer l'application
./start.sh
```

Le script va :
- ✅ Vérifier Docker
- ✅ Créer les fichiers .env si nécessaire
- ✅ Construire les images Docker
- ✅ Démarrer MongoDB, Backend, Frontend
- ✅ Afficher l'état des services

### 4. Accéder à l'Application

Après 30 secondes, ouvrez :
- **Application** : http://localhost:3000
- **API Backend** : http://localhost:8001
- **Documentation API** : http://localhost:8001/docs

## 🔨 Installation Native (Sans Docker)

### 1. Cloner et Préparer

```bash
git clone https://github.com/VOTRE_USERNAME/tiktok-automation.git
cd tiktok-automation
```

### 2. Installer MongoDB

**Ubuntu/Debian** :
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**macOS** :
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows** :
Téléchargez depuis https://www.mongodb.com/try/download/community

### 3. Configurer Backend

```bash
cd backend

# Copier .env
cp ../.env.example .env
# Éditer .env et ajouter EMERGENT_LLM_KEY

# Créer environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Installer FFmpeg
# Ubuntu/Debian: sudo apt-get install ffmpeg
# macOS: brew install ffmpeg
# Windows: https://ffmpeg.org/download.html

# Créer dossier vidéos
mkdir -p generated_videos
```

### 4. Configurer Frontend

```bash
cd ../frontend

# Créer .env
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Installer dépendances
yarn install
```

### 5. Démarrer les Services

**Terminal 1 - Backend** :
```bash
cd backend
source venv/bin/activate
python server.py
```

**Terminal 2 - Frontend** :
```bash
cd frontend
yarn start
```

L'application s'ouvrira automatiquement sur http://localhost:3000

## 📊 Commandes Utiles

### Avec Docker

```bash
# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend

# Arrêter l'application
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d

# État des conteneurs
docker-compose ps
```

### Sans Docker

```bash
# Redémarrer MongoDB
sudo systemctl restart mongodb  # Linux
brew services restart mongodb-community  # macOS

# Vérifier MongoDB
mongosh --eval "db.adminCommand('ping')"

# Logs backend (si vous utilisez nohup)
tail -f backend/nohup.out
```

## 🧪 Tester l'Installation

### Test Backend API

```bash
# Test santé
curl http://localhost:8001/api/health

# Ajouter une tendance test
curl -X POST http://localhost:8001/api/trends \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test vidéo",
    "views": 10000,
    "engagement": 1000,
    "niche": "test"
  }'

# Vérifier les niches
curl http://localhost:8001/api/niches/recommended
```

### Test Frontend

1. Ouvrez http://localhost:3000
2. Vérifiez que le dashboard se charge
3. Naviguez entre les sections
4. Essayez d'ajouter une tendance

### Test Génération Vidéo (Consomme des crédits)

1. Allez dans "Tendances" → Ajoutez 2-3 tendances
2. Allez dans "Générer Vidéo"
3. Sélectionnez une niche
4. Cliquez "Générer la Vidéo"
5. Attendez 1-2 minutes
6. Téléchargez la vidéo générée

## 🔧 Dépannage

### Port déjà utilisé

**Erreur** : `port is already allocated`

**Solution** :
```bash
# Trouver le processus
sudo lsof -i :3000  # ou :8001, :27017

# Tuer le processus
kill -9 <PID>

# Ou changer les ports dans docker-compose.yml
```

### MongoDB ne démarre pas

**Docker** :
```bash
docker-compose logs mongodb
docker-compose restart mongodb
```

**Native** :
```bash
# Vérifier le service
sudo systemctl status mongodb

# Redémarrer
sudo systemctl restart mongodb

# Vérifier les logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Erreur "EMERGENT_LLM_KEY not found"

1. Vérifiez que `backend/.env` existe
2. Vérifiez que la clé est bien définie :
```bash
cat backend/.env | grep EMERGENT_LLM_KEY
```
3. Redémarrez le backend

### Frontend ne se connecte pas au Backend

1. Vérifiez `frontend/.env` :
```bash
cat frontend/.env
# Doit contenir: REACT_APP_BACKEND_URL=http://localhost:8001
```

2. Vérifiez que le backend répond :
```bash
curl http://localhost:8001/api/health
```

3. Ouvrez la console navigateur (F12) pour voir les erreurs

### Génération vidéo échoue

1. **Vérifiez FFmpeg** :
```bash
ffmpeg -version
```

2. **Vérifiez les crédits Emergent** :
   - Connectez-vous sur https://app.emergent.ai
   - Profil → Universal Key → Vérifiez le solde

3. **Vérifiez les logs backend** :
```bash
# Docker
docker-compose logs backend | tail -50

# Native
tail -50 backend/logs.txt
```

## 🔄 Mise à Jour de l'Application

```bash
# Récupérer les dernières modifications
git pull origin main

# Avec Docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Sans Docker
cd backend && pip install -r requirements.txt
cd ../frontend && yarn install
```

## 📦 Sauvegarde des Données

### Avec Docker

```bash
# Sauvegarder MongoDB
docker exec tiktok-mongodb mongodump --out /tmp/backup
docker cp tiktok-mongodb:/tmp/backup ./mongodb_backup

# Restaurer
docker cp ./mongodb_backup tiktok-mongodb:/tmp/backup
docker exec tiktok-mongodb mongorestore /tmp/backup
```

### Sans Docker

```bash
# Sauvegarder
mongodump --db tiktok_automation --out ./mongodb_backup

# Restaurer
mongorestore --db tiktok_automation ./mongodb_backup/tiktok_automation
```

## 🌐 Déploiement sur Serveur (Production)

### Sur VPS/Serveur Cloud

1. **Installer Docker sur le serveur**
2. **Cloner le repo**
3. **Configurer les variables d'environnement**
4. **Modifier docker-compose.yml** pour la production :

```yaml
# Exemple de modifications pour production
services:
  backend:
    environment:
      - MONGO_URL=mongodb://mongodb:27017/tiktok_automation
      - BACKEND_HOST=0.0.0.0
  
  frontend:
    environment:
      - REACT_APP_BACKEND_URL=https://votre-domaine.com/api
```

5. **Utiliser un reverse proxy (Nginx)** :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8001;
    }
}
```

6. **Configurer SSL avec Let's Encrypt**

## 💡 Conseils d'Utilisation

1. **Commencez avec Docker** : Plus simple et moins de problèmes
2. **Sauvegardez régulièrement** : Les vidéos et la base de données
3. **Surveillez les crédits Emergent** : La génération consomme des crédits
4. **Testez d'abord avec peu de tendances** : Validez le fonctionnement
5. **Lisez les logs** : En cas d'erreur, les logs sont votre ami

## 📚 Documentation Complémentaire

- [README.md](README.md) - Guide d'utilisation complet
- [TESTING.md](TESTING.md) - Guide de tests
- [ARCHITECTURE.md](ARCHITECTURE.md) - Documentation technique

## 🆘 Support

En cas de problème :
1. Consultez la section Dépannage ci-dessus
2. Vérifiez les logs : `docker-compose logs`
3. Consultez la documentation API : http://localhost:8001/docs
4. Vérifiez les issues GitHub du projet

---

**Prêt à générer des vidéos TikTok virales avec l'IA ! 🚀🎥**
