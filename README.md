# 🚀 Plateforme d'Automatisation TikTok avec IA

Une application complète qui automatise la création de contenu viral pour TikTok en utilisant l'intelligence artificielle. Le système analyse les tendances, recommande des niches rentables, génère des vidéos optimisées et s'améliore grâce au rétro-apprentissage.

## ✨ Fonctionnalités Principales

### 🎯 Analyse et Recommandation de Niches
- **Ajout manuel de tendances** : Alimentez le système avec les vidéos virales que vous identifiez
- **Analyse automatique** : Le système calcule un score de profitabilité pour chaque niche
- **Recommandations intelligentes** : Obtenez les meilleures niches basées sur :
  - Vues moyennes
  - Engagement moyen
  - Revenus potentiels
  - Tendances actuelles

### 🎬 Génération de Vidéos IA
- **Scripts viraux** : Génération automatique avec GPT-5.2 (Emergent LLM Key)
- **Score de viralité** : Évaluation sur 100 points du potentiel viral
- **Images IA** : Génération d'images avec Gemini Nano Banana
- **Voix-off professionnelle** : OpenAI TTS avec choix de voix
- **Assemblage vidéo** : Création automatique avec FFmpeg + MoviePy
  - Format vertical optimisé (9:16)
  - Transitions fluides
  - Synchronisation audio/visuel
  - Export MP4 haute qualité

### 📊 Analytics et Performance
- **Suivi des performances** : Vues, likes, partages, commentaires, revenus
- **Rétro-apprentissage** : Le système s'améliore en analysant vos résultats
- **Optimisation continue** : Suggestions basées sur les meilleures performances
- **Dashboard complet** : Vue d'ensemble de toutes vos métriques

### 🧠 Système de Rétro-Apprentissage
- Analyse des corrélations entre features et performances
- Suggestions d'amélioration personnalisées par niche
- Identification des patterns de succès
- Ajustement automatique des stratégies

## 🛠️ Stack Technique

### Backend
- **FastAPI** : API REST rapide et moderne
- **MongoDB** : Base de données NoSQL pour flexibilité
- **Emergentintegrations** : Accès aux modèles IA via clé universelle
  - OpenAI GPT-5.2 pour génération de texte
  - Gemini Nano Banana pour génération d'images
  - OpenAI TTS pour voix-off
- **MoviePy + FFmpeg** : Assemblage et traitement vidéo

### Frontend
- **React** : Interface utilisateur moderne et réactive
- **Tailwind CSS** : Design moderne et responsive
- **Axios** : Communication API
- **Recharts** : Visualisation de données
- **Lucide React** : Icônes élégantes

## 📋 Architecture de l'Application

```
/app/
├── backend/
│   ├── server.py              # API principale FastAPI
│   ├── services/
│   │   ├── ai_service.py      # Services IA (GPT, Gemini, TTS)
│   │   ├── video_service.py   # Assemblage vidéo
│   │   ├── niche_analyzer.py  # Analyse et recommandation
│   │   └── learning_service.py # Rétro-apprentissage
│   ├── requirements.txt
│   └── .env                   # Configuration (Emergent LLM Key)
│
├── frontend/
│   ├── src/
│   │   ├── App.js            # Composant principal
│   │   ├── components/
│   │   │   ├── Dashboard.js           # Tableau de bord
│   │   │   ├── TrendManager.js        # Gestion tendances
│   │   │   ├── VideoGenerator.js      # Génération vidéo
│   │   │   ├── VideoLibrary.js        # Bibliothèque vidéos
│   │   │   └── AnalyticsManager.js    # Gestion analytics
│   │   └── services/
│   │       └── api.js        # Client API
│   ├── package.json
│   └── .env                  # URL backend
│
└── README.md
```

## 🚀 Démarrage Rapide

### Prérequis
Les services sont déjà configurés et démarrés automatiquement via Supervisor :
- MongoDB sur port 27017
- Backend API sur port 8001
- Frontend React sur port 3000

### Vérification des Services
```bash
sudo supervisorctl status
```

Vous devriez voir :
- ✅ mongodb: RUNNING
- ✅ backend: RUNNING
- ✅ frontend: RUNNING

### Accès à l'Application
- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:8001/api
- **Documentation API** : http://localhost:8001/docs

## 📖 Guide d'Utilisation

### 1. Ajouter des Tendances
1. Allez dans **"Tendances"**
2. Cliquez sur **"Ajouter Tendance"**
3. Remplissez :
   - Titre de la vidéo
   - Niche (ex: motivation, fitness, finance)
   - URL TikTok (optionnel)
   - Nombre de vues
   - Engagement (likes + comments + shares)
4. Le système analysera automatiquement les niches

### 2. Générer une Vidéo
1. Allez dans **"Générer Vidéo"**
2. Sélectionnez une niche recommandée
3. (Optionnel) Fournissez une URL d'inspiration
4. Choisissez le ton et la voix
5. Cliquez sur **"Générer la Vidéo"**
6. Attendez 1-2 minutes pendant la génération :
   - ✅ Script avec GPT-5.2
   - ✅ Score de viralité calculé
   - ✅ Images générées avec Gemini
   - ✅ Voix-off créée avec OpenAI TTS
   - ✅ Vidéo assemblée avec MoviePy
7. Téléchargez la vidéo générée

### 3. Publier et Suivre les Performances
1. Publiez manuellement la vidéo sur TikTok
2. Attendez que les performances s'accumulent (24-48h)
3. Allez dans **"Analytics"**
4. Ajoutez les métriques de performance :
   - Sélectionnez la vidéo
   - Entrez vues, likes, partages, commentaires
   - Entrez les revenus générés
5. Le système apprendra automatiquement

### 4. Consulter les Insights
1. Retournez au **Dashboard**
2. Voyez les niches les plus rentables
3. Consultez vos meilleures vidéos
4. Obtenez des recommandations d'optimisation

## 🔑 Configuration de la Clé API

La **clé universelle Emergent** est déjà configurée dans `/app/backend/.env` :
```
EMERGENT_LLM_KEY=sk-emergent-f96E008A4Ec4c6185E
```

Cette clé unique donne accès à :
- ✅ OpenAI GPT-5.2 (génération de scripts)
- ✅ Gemini Nano Banana (génération d'images)
- ✅ OpenAI TTS (voix-off)

**Note** : Des crédits sont déduits de votre balance à chaque utilisation. Rechargez dans votre profil Emergent si nécessaire.

## 🎨 Options de Personnalisation

### Voix Disponibles (OpenAI TTS)
- **Alloy** : Neutre et équilibré
- **Nova** : Énergique et dynamique (recommandé)
- **Shimmer** : Joyeux et lumineux
- **Echo** : Calme et posé
- **Fable** : Storytelling expressif
- **Onyx** : Profond et autoritaire

### Tons de Script
- **Engageant** : Capte l'attention
- **Motivant** : Inspire et pousse à l'action
- **Informatif** : Éducatif et clair
- **Drôle** : Humour et divertissement
- **Inspirant** : Émotionnel et impactant

## 📊 API Endpoints

### Tendances
- `POST /api/trends` - Ajouter une tendance
- `GET /api/trends` - Lister les tendances
- `DELETE /api/trends/{id}` - Supprimer une tendance

### Niches
- `GET /api/niches/recommended` - Niches recommandées
- `GET /api/niches/all` - Toutes les niches
- `GET /api/niches/{niche}/trends` - Tendances d'une niche

### Vidéos
- `POST /api/videos/generate` - Générer une vidéo
- `GET /api/videos` - Lister les vidéos
- `GET /api/videos/{id}` - Détails d'une vidéo
- `GET /api/videos/{id}/download` - Télécharger une vidéo
- `DELETE /api/videos/{id}` - Supprimer une vidéo

### Analytics
- `POST /api/analytics` - Ajouter des analytics
- `GET /api/analytics` - Lister les analytics

### Learning
- `POST /api/learning/feedback` - Feedback pour apprentissage
- `GET /api/learning/insights` - Insights d'optimisation

### Dashboard
- `GET /api/dashboard/stats` - Statistiques globales

## 🔧 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier les logs
tail -50 /var/log/supervisor/backend.err.log

# Redémarrer le backend
sudo supervisorctl restart backend
```

### Le frontend ne charge pas
```bash
# Vérifier les logs
tail -50 /var/log/supervisor/frontend.err.log

# Redémarrer le frontend
sudo supervisorctl restart frontend
```

### MongoDB ne démarre pas
```bash
# Vérifier les logs
tail -50 /var/log/supervisor/mongodb.err.log

# Créer le répertoire de données
mkdir -p /data/db

# Redémarrer MongoDB
sudo supervisorctl restart mongodb
```

### Erreur de génération vidéo
- Vérifiez que vous avez des crédits Emergent LLM
- Vérifiez que FFmpeg est installé : `ffmpeg -version`
- Consultez les logs backend pour plus de détails

## 💡 Conseils d'Utilisation

### Pour Maximiser les Performances

1. **Alimentez régulièrement les tendances**
   - Ajoutez 10-20 vidéos virales par semaine
   - Variez les niches pour avoir plus d'insights

2. **Testez plusieurs niches**
   - Ne vous limitez pas à une seule niche
   - Le système identifiera les plus rentables

3. **Suivez vos analytics précisément**
   - Entrez les vraies métriques
   - Plus vous avez de données, meilleur est l'apprentissage

4. **Utilisez les suggestions**
   - Le système vous donne des recommandations basées sur vos résultats
   - Ajustez durée, hashtags, tone selon les insights

5. **Publiez régulièrement**
   - Cohérence = algorithme TikTok favorise votre contenu
   - Utilisez les heures optimales (insights communauté)

## 🎯 Roadmap Future

- [ ] Publication automatique directe sur TikTok (API)
- [ ] Génération de sous-titres automatiques
- [ ] Templates de motion design
- [ ] Planificateur de publications
- [ ] Multi-comptes TikTok
- [ ] Analytics en temps réel via TikTok API
- [ ] Export multi-formats (Reels, Shorts)
- [ ] Bibliothèque de musiques tendance
- [ ] A/B testing automatique

## 📝 Notes Importantes

### Utilisation Personnelle
Cette application est conçue pour un **usage personnel gratuit**. Toutes les fonctionnalités de pricing et marketing ont été retirées comme demandé.

### Crédits IA
La génération de contenu consomme des crédits de votre **clé universelle Emergent**. Surveillez votre balance et rechargez si nécessaire dans votre profil.

### Conformité TikTok
- Respectez les directives communautaires TikTok
- Ne publiez pas de contenu inapproprié
- Créditez les sources si vous vous inspirez de vidéos existantes

### Performance
- La génération d'une vidéo complète prend 1-2 minutes
- Temps décomposé :
  - Script : 10-15s
  - Images (5x) : 30-40s
  - Voix-off : 15-20s
  - Assemblage vidéo : 20-30s

## 🤝 Support

Pour toute question ou problème :
1. Consultez les logs : `/var/log/supervisor/`
2. Vérifiez la documentation API : `http://localhost:8001/docs`
3. Examinez les messages d'erreur dans l'interface

## 📄 Licence

Usage personnel uniquement. Tous droits réservés.

---

**Fait avec ❤️ et IA pour automatiser votre succès TikTok ! 🚀**
