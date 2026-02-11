# 🧪 Guide de Test et Validation

## ✅ Tests de Validation Rapides

### 1. Vérifier que tous les services fonctionnent

```bash
sudo supervisorctl status
```

**Résultat attendu** : Tous les services doivent être en état `RUNNING`
- ✅ mongodb: RUNNING
- ✅ backend: RUNNING  
- ✅ frontend: RUNNING

### 2. Tester l'API Backend

```bash
# Test de santé
curl http://localhost:8001/api/health

# Ajouter une tendance
curl -X POST http://localhost:8001/api/trends \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Routine matinale millionnaire",
    "url": "https://www.tiktok.com/@example/video/123",
    "views": 250000,
    "engagement": 35000,
    "niche": "entrepreneuriat"
  }'

# Récupérer les tendances
curl http://localhost:8001/api/trends

# Obtenir les niches recommandées
curl http://localhost:8001/api/niches/recommended

# Statistiques du dashboard
curl http://localhost:8001/api/dashboard/stats
```

### 3. Tester le Frontend

Ouvrez votre navigateur et accédez à : `http://localhost:3000`

Vérifiez que :
- ✅ La page se charge correctement
- ✅ Le menu de navigation fonctionne
- ✅ Vous pouvez naviguer entre les sections

### 4. Test de Génération de Script (Sans Vidéo Complète)

Pour tester uniquement la génération de script sans créer la vidéo complète (qui prend du temps) :

```python
# Créer un fichier test_script.py
import asyncio
import os
from dotenv import load_dotenv
from services.ai_service import AIService

load_dotenv()

async def test_script_generation():
    ai_service = AIService()
    
    # Génère un script
    script = await ai_service.generate_script(
        niche="motivation",
        tone="inspirant"
    )
    
    print("✅ Script généré:")
    print(f"Titre: {script['title']}")
    print(f"Hook: {script['hook']}")
    print(f"Hashtags: {', '.join(script['hashtags'])}")
    
    # Calcule le score de viralité
    score = await ai_service.calculate_virality_score(script)
    print(f"\n✅ Score de viralité: {score}/100")

asyncio.run(test_script_generation())
```

Exécutez :
```bash
cd /app/backend
python test_script.py
```

### 5. Test de Génération d'Image (Rapide)

```python
# test_image.py
import asyncio
import os
from dotenv import load_dotenv
from services.ai_service import AIService

load_dotenv()

async def test_image_generation():
    ai_service = AIService()
    
    images = await ai_service.generate_images(
        "Une personne motivée qui court au lever du soleil",
        count=1
    )
    
    print(f"✅ {len(images)} image(s) générée(s)")

asyncio.run(test_image_generation())
```

### 6. Test de Génération Voix-Off

```python
# test_voice.py
import asyncio
import os
from dotenv import load_dotenv
from services.ai_service import AIService

load_dotenv()

async def test_voice():
    ai_service = AIService()
    
    audio = await ai_service.generate_voiceover(
        "Bonjour, ceci est un test de génération de voix.",
        voice="nova"
    )
    
    # Sauvegarde pour vérification
    with open("test_voice.mp3", "wb") as f:
        f.write(audio)
    
    print("✅ Voix-off générée : test_voice.mp3")

asyncio.run(test_voice())
```

## 🎥 Test de Génération Vidéo Complète

**⚠️ ATTENTION** : Ce test consomme des crédits Emergent LLM et prend 1-2 minutes.

### Via l'Interface Web (Recommandé)

1. Ouvrez `http://localhost:3000`
2. Allez dans **"Tendances"** et ajoutez quelques tendances
3. Allez dans **"Générer Vidéo"**
4. Sélectionnez une niche
5. Cliquez sur **"Générer la Vidéo"**
6. Attendez la génération (1-2 min)
7. Téléchargez la vidéo générée

### Via l'API (Pour Tests Automatisés)

```bash
curl -X POST http://localhost:8001/api/videos/generate \
  -H "Content-Type: application/json" \
  -d '{
    "niche": "motivation",
    "tone": "inspirant",
    "voice": "nova"
  }'
```

**Sortie attendue** :
```json
{
  "video_id": "uuid-de-la-video",
  "script": {
    "title": "...",
    "script": "...",
    "hashtags": [...]
  },
  "virality_score": 75.5,
  "video_url": "/api/videos/{id}/download",
  "suggestions": [...]
}
```

Téléchargez la vidéo :
```bash
curl -o video_test.mp4 http://localhost:8001/api/videos/{video_id}/download
```

## 📊 Test du Système de Rétro-Apprentissage

### 1. Créer une vidéo de test
```bash
# Utilisez l'interface ou l'API pour générer une vidéo
```

### 2. Ajouter des analytics
```bash
curl -X POST http://localhost:8001/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "votre-video-id",
    "views": 50000,
    "likes": 5000,
    "shares": 500,
    "comments": 200,
    "revenue": 45.50
  }'
```

### 3. Obtenir les insights
```bash
curl http://localhost:8001/api/learning/insights
```

**Résultat attendu** :
```json
{
  "total_videos": 1,
  "high_performers": 1,
  "recommendations": [
    "La durée optimale est autour de 45 secondes",
    "Viser un score de viralité supérieur à 75"
  ]
}
```

## 🔍 Debugging et Logs

### Vérifier les logs en temps réel

```bash
# Backend
tail -f /var/log/supervisor/backend.err.log

# Frontend
tail -f /var/log/supervisor/frontend.out.log

# MongoDB
tail -f /var/log/supervisor/mongodb.err.log
```

### Vérifier l'utilisation MongoDB

```bash
mongo tiktok_automation --eval "db.stats()"
```

### Vérifier l'espace disque des vidéos

```bash
du -sh /app/backend/generated_videos/
ls -lh /app/backend/generated_videos/
```

## 🧹 Nettoyage des Données de Test

```bash
# Supprimer toutes les vidéos générées
rm -rf /app/backend/generated_videos/*

# Réinitialiser la base de données
mongo tiktok_automation --eval "
  db.trends.deleteMany({});
  db.videos.deleteMany({});
  db.analytics.deleteMany({});
  db.niches.deleteMany({});
  db.learning_data.deleteMany({});
"
```

## ⚡ Tests de Performance

### Test de charge API

```bash
# Installer Apache Bench si nécessaire
apt-get install apache2-utils

# Test 100 requêtes, 10 concurrentes
ab -n 100 -c 10 http://localhost:8001/api/health

# Test de récupération des tendances
ab -n 50 -c 5 http://localhost:8001/api/trends
```

### Mesurer le temps de génération

```python
import time
import requests

start = time.time()

response = requests.post(
    "http://localhost:8001/api/videos/generate",
    json={
        "niche": "motivation",
        "tone": "inspirant",
        "voice": "nova"
    }
)

end = time.time()
print(f"Temps de génération: {end - start:.2f} secondes")
```

## 🎯 Checklist de Validation Complète

Avant de considérer le système comme prêt en production :

- [ ] Tous les services démarrent correctement
- [ ] L'API backend répond à tous les endpoints
- [ ] Le frontend se charge et est navigable
- [ ] On peut ajouter des tendances
- [ ] Les niches sont correctement analysées et recommandées
- [ ] La génération de script fonctionne
- [ ] La génération d'images fonctionne
- [ ] La génération de voix-off fonctionne
- [ ] L'assemblage vidéo produit un fichier MP4 valide
- [ ] On peut télécharger les vidéos générées
- [ ] Les analytics s'enregistrent correctement
- [ ] Le système de rétro-apprentissage produit des insights
- [ ] Les suggestions d'amélioration sont pertinentes
- [ ] Les logs ne montrent pas d'erreurs critiques
- [ ] La clé Emergent LLM est valide et a des crédits

## 🆘 Problèmes Courants et Solutions

### "EMERGENT_LLM_KEY not found"
```bash
# Vérifier que la clé est dans .env
cat /app/backend/.env | grep EMERGENT_LLM_KEY

# Si absente, l'ajouter
echo "EMERGENT_LLM_KEY=sk-emergent-f96E008A4Ec4c6185E" >> /app/backend/.env
sudo supervisorctl restart backend
```

### "Module not found" ou erreurs d'import
```bash
cd /app/backend
pip install -r requirements.txt
sudo supervisorctl restart backend
```

### MongoDB ne démarre pas
```bash
# Créer le répertoire
mkdir -p /data/db

# Vérifier les permissions
chown -R mongodb:mongodb /data/db

# Redémarrer
sudo supervisorctl restart mongodb
```

### Génération vidéo échoue
```bash
# Vérifier FFmpeg
ffmpeg -version

# Vérifier les crédits Emergent
# (consultez votre profil Emergent)

# Vérifier les logs détaillés
tail -100 /var/log/supervisor/backend.err.log
```

### Frontend ne se charge pas
```bash
# Réinstaller les dépendances
cd /app/frontend
yarn install

# Redémarrer
sudo supervisorctl restart frontend
```

---

**💡 Conseil** : Testez d'abord chaque composant individuellement avant de tester le flux complet de génération vidéo. Cela permet d'identifier rapidement où se situent les problèmes éventuels.
