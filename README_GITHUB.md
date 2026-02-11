# TikTok Automation Platform

**Plateforme d'automatisation de création de contenu viral TikTok avec IA et rétro-apprentissage**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](docker-compose.yml)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](backend/requirements.txt)
[![React](https://img.shields.io/badge/react-18.2-blue.svg)](frontend/package.json)

## 📖 Table des Matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Contribution](#contribution)
- [Licence](#licence)

## 🎯 Présentation

Cette application automatise la création de contenu viral pour TikTok en utilisant l'intelligence artificielle. Elle analyse les tendances, recommande des niches rentables, génère des vidéos optimisées et s'améliore grâce au rétro-apprentissage.

### Démonstration

![Dashboard](docs/images/dashboard.png)
*Dashboard avec recommandations de niches*

![Generator](docs/images/generator.png)
*Interface de génération de vidéos*

## ✨ Fonctionnalités

### 🎬 Génération de Contenu IA
- **Scripts viraux** automatiques avec GPT-5.2
- **Images optimisées** avec Gemini Nano Banana
- **Voix-off professionnelle** avec OpenAI TTS
- **Assemblage vidéo** automatique (FFmpeg + MoviePy)
- **Score de viralité** calculé sur 100 points

### 📊 Analyse & Recommandations
- **Analyse automatique** des tendances par niche
- **Score de profitabilité** (vues, engagement, revenus)
- **Recommandations intelligentes** de niches
- **Recherche de vidéos virales** par niche

### 🧠 Rétro-Apprentissage
- **Enregistrement des performances** réelles
- **Analyse des patterns** de succès
- **Suggestions d'optimisation** personnalisées
- **Amélioration continue** des stratégies

### 📈 Analytics
- **Tracking complet** (vues, likes, partages, revenus)
- **Dashboard interactif** avec graphiques
- **Historique des performances** par vidéo
- **Top vidéos** les plus performantes

## 🚀 Installation

### Avec Docker (Recommandé)

**Prérequis** :
- [Docker Desktop](https://docs.docker.com/get-docker/)
- Git

**Installation** :
```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/tiktok-automation.git
cd tiktok-automation

# Configurer les variables d'environnement
cp .env.example backend/.env
# Éditer backend/.env et ajouter votre EMERGENT_LLM_KEY

# Démarrer l'application
./start.sh
```

### Sans Docker

Consultez le guide détaillé : **[DEPLOY_LOCAL.md](DEPLOY_LOCAL.md)**

## ⚙️ Configuration

### Variables d'Environnement

**Backend** (`backend/.env`) :
```bash
# Clé universelle Emergent (obligatoire)
EMERGENT_LLM_KEY=sk-emergent-VOTRE_CLE_ICI

# MongoDB
MONGO_URL=mongodb://localhost:27017/tiktok_automation
```

**Frontend** (`frontend/.env`) :
```bash
# URL du backend
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Obtenir une Clé Emergent

1. Créez un compte sur https://app.emergent.ai
2. Allez dans **Profil** → **Universal Key**
3. Copiez votre clé
4. Ajoutez-la dans `backend/.env`

La clé universelle donne accès à :
- OpenAI GPT-5.2
- Gemini Nano Banana
- OpenAI TTS

## 📖 Utilisation

### 1. Ajouter des Tendances

Allez dans **Tendances** et ajoutez des vidéos virales TikTok :
- Titre de la vidéo
- Niche (motivation, fitness, finance, etc.)
- Vues et engagement
- URL TikTok (optionnel)

### 2. Consulter les Niches Recommandées

Le **Dashboard** affiche automatiquement les niches les plus rentables basées sur vos tendances.

### 3. Générer une Vidéo

Allez dans **Générer Vidéo** :
1. Sélectionnez une niche
2. (Optionnel) Fournissez une URL d'inspiration
3. Choisissez le ton (engageant, motivant, drôle, etc.)
4. Choisissez la voix (Nova, Alloy, Shimmer, etc.)
5. Cliquez sur **Générer**
6. Attendez 1-2 minutes
7. Téléchargez la vidéo MP4

### 4. Suivre les Performances

Après publication sur TikTok :
1. Allez dans **Analytics**
2. Ajoutez les métriques de votre vidéo
3. Le système apprend et améliore ses recommandations

## 📚 Documentation

- **[README.md](README.md)** - Ce fichier
- **[DEPLOY_LOCAL.md](DEPLOY_LOCAL.md)** - Guide de déploiement local détaillé
- **[TESTING.md](TESTING.md)** - Guide de tests et validation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Documentation technique complète
- **[API Docs](http://localhost:8001/docs)** - Documentation API interactive (après démarrage)

## 🏗️ Architecture

```
TikTok Automation Platform
│
├── Frontend (React + Tailwind)
│   ├── Dashboard
│   ├── Trend Manager
│   ├── Video Generator
│   ├── Video Library
│   └── Analytics Manager
│
├── Backend (FastAPI)
│   ├── REST API (15+ endpoints)
│   ├── AI Service (GPT, Gemini, TTS)
│   ├── Video Service (FFmpeg, MoviePy)
│   ├── Niche Analyzer
│   └── Learning Service
│
└── Database (MongoDB)
    ├── Trends
    ├── Videos
    ├── Analytics
    ├── Niches
    └── Learning Data
```

### Stack Technique

**Backend** :
- Python 3.11+
- FastAPI
- MongoDB (Motor)
- Emergentintegrations
- MoviePy + FFmpeg

**Frontend** :
- React 18
- Tailwind CSS
- Axios
- Recharts
- Lucide React

**IA & Médias** :
- OpenAI GPT-5.2 (scripts)
- Gemini Nano Banana (images)
- OpenAI TTS (voix-off)
- FFmpeg (vidéo)

## 🧪 Tests

Consultez **[TESTING.md](TESTING.md)** pour :
- Tests de validation rapides
- Tests API
- Tests de génération
- Debugging
- Checklist complète

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📊 Roadmap

- [x] Génération de scripts viraux
- [x] Génération d'images IA
- [x] Génération de voix-off
- [x] Assemblage vidéo automatique
- [x] Système de rétro-apprentissage
- [x] Analytics et dashboard
- [ ] Publication automatique sur TikTok (API)
- [ ] Génération de sous-titres automatiques
- [ ] Templates de motion design
- [ ] Planificateur de publications
- [ ] Support multi-comptes
- [ ] Export Reels/Shorts
- [ ] Bibliothèque de musiques

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Emergent AI](https://emergent.ai) pour la clé universelle LLM
- [FastAPI](https://fastapi.tiangolo.com/) pour le framework backend
- [React](https://react.dev/) pour le framework frontend
- [MoviePy](https://zulko.github.io/moviepy/) pour le traitement vidéo
- [FFmpeg](https://ffmpeg.org/) pour l'encodage vidéo

## 📞 Support

Pour toute question ou problème :
- Consultez la [documentation](DEPLOY_LOCAL.md)
- Ouvrez une [issue](https://github.com/VOTRE_USERNAME/tiktok-automation/issues)
- Consultez les [logs](TESTING.md#debugging-et-logs)

---

**Fait avec ❤️ et IA pour automatiser votre succès TikTok ! 🚀🎥**

⭐ **N'oubliez pas de star le projet si vous le trouvez utile !**