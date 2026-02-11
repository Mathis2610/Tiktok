# 🏗️ Architecture Technique Détaillée

## Vue d'Ensemble du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR                               │
│           (Ajoute tendances & analytics manuellement)        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard  │  Trends  │  Generator  │  Library      │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                    Axios API Client                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes REST:                                        │   │
│  │  - /api/trends     - /api/niches                    │   │
│  │  - /api/videos     - /api/analytics                 │   │
│  │  - /api/learning   - /api/dashboard                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌─────────────────────┴──────────────────────────────┐     │
│  │              SERVICES LAYER                        │     │
│  │                                                     │     │
│  │  ┌─────────────────┐  ┌────────────────────┐      │     │
│  │  │  AI Service     │  │  Video Service     │      │     │
│  │  │  - Script Gen   │  │  - FFmpeg Assembly │      │     │
│  │  │  - Images Gen   │  │  - MoviePy Edit    │      │     │
│  │  │  - Voice Gen    │  │  - Export MP4      │      │     │
│  │  │  - Virality     │  └────────────────────┘      │     │
│  │  └────────┬────────┘                              │     │
│  │           │                                        │     │
│  │  ┌────────▼───────────┐  ┌────────────────────┐  │     │
│  │  │  Niche Analyzer    │  │  Learning Service  │  │     │
│  │  │  - Trend Analysis  │  │  - Pattern Detect  │  │     │
│  │  │  - Profitability   │  │  - Optimization    │  │     │
│  │  │  - Recommendations │  │  - Insights        │  │     │
│  │  └────────────────────┘  └────────────────────┘  │     │
│  └─────────────────────────────────────────────────┘      │
└────────────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│   MongoDB    │  │  Emergent   │  │  FFmpeg      │
│   Database   │  │  LLM APIs   │  │  + MoviePy   │
│              │  │             │  │              │
│ - trends     │  │ - GPT-5.2   │  │ - Encode     │
│ - videos     │  │ - Gemini    │  │ - Merge      │
│ - analytics  │  │ - OpenAI TTS│  │ - Process    │
│ - niches     │  └─────────────┘  └──────────────┘
│ - learning   │
└──────────────┘
```

## 🔄 Flux de Données Complets

### 1. Ajout de Tendances

```
User Input
    │
    ├─→ Frontend (TrendManager)
    │     │
    │     └─→ POST /api/trends
    │           │
    │           └─→ MongoDB.trends.insert()
    │                 │
    │                 └─→ Trigger: NicheAnalyzer.analyze_niches()
    │                       │
    │                       └─→ Update MongoDB.niches
    │                             │
    │                             └─→ Return: Success + niche scores
```

### 2. Génération de Vidéo (Flux Complet)

```
User Request (niche, tone, voice, inspiration_url?)
    │
    ├─→ POST /api/videos/generate
    │     │
    │     ├─→ 1. AIService.generate_script()
    │     │     │
    │     │     ├─→ Emergent LLM (GPT-5.2)
    │     │     │     - Prompt engineering
    │     │     │     - Context injection
    │     │     │     - JSON response parsing
    │     │     │
    │     │     └─→ Script Object {
    │     │           title, script, hook,
    │     │           hashtags, description
    │     │         }
    │     │
    │     ├─→ 2. AIService.calculate_virality_score()
    │     │     │
    │     │     ├─→ Emergent LLM (GPT-5.2)
    │     │     │     - Multi-criteria analysis
    │     │     │     - Weighted scoring
    │     │     │
    │     │     └─→ Score: 0-100
    │     │
    │     ├─→ 3. AIService.generate_images(count=5)
    │     │     │
    │     │     ├─→ GPT-5.2: Analyze script → image prompts
    │     │     │
    │     │     └─→ Gemini Nano Banana
    │     │           │
    │     │           ├─→ Generate image 1 (base64)
    │     │           ├─→ Generate image 2 (base64)
    │     │           ├─→ Generate image 3 (base64)
    │     │           ├─→ Generate image 4 (base64)
    │     │           └─→ Generate image 5 (base64)
    │     │
    │     ├─→ 4. AIService.generate_voiceover()
    │     │     │
    │     │     └─→ OpenAI TTS (voice model)
    │     │           │
    │     │           └─→ Audio bytes (MP3)
    │     │
    │     ├─→ 5. VideoService.create_video()
    │     │     │
    │     │     ├─→ Save audio to temp
    │     │     │
    │     │     ├─→ Get audio duration
    │     │     │
    │     │     ├─→ Decode images (base64 → PNG)
    │     │     │
    │     │     ├─→ MoviePy:
    │     │     │     │
    │     │     │     ├─→ Create ImageClips (duration_per_image)
    │     │     │     ├─→ Apply zoom effects
    │     │     │     ├─→ Concatenate clips
    │     │     │     ├─→ Add audio track
    │     │     │     │
    │     │     │     └─→ FFmpeg: Export MP4
    │     │     │           - Codec: H.264
    │     │     │           - Audio: AAC
    │     │     │           - Resolution: 1080x1920 (9:16)
    │     │     │           - FPS: 30
    │     │     │
    │     │     └─→ video_path
    │     │
    │     ├─→ 6. Save to MongoDB.videos
    │     │
    │     ├─→ 7. LearningService.suggest_improvements()
    │     │
    │     └─→ Response: {
    │           video_id, script, score,
    │           video_url, suggestions
    │         }
```

### 3. Rétro-Apprentissage (Performance Feedback Loop)

```
User publishes video on TikTok
    │
    ├─→ Wait 24-48h for metrics
    │
    ├─→ User adds analytics via /api/analytics
    │     │
    │     └─→ LearningService.record_performance()
    │           │
    │           ├─→ Extract features:
    │           │     - niche
    │           │     - virality_score
    │           │     - duration_seconds
    │           │     - hook_length
    │           │     - hashtag_count
    │           │     - has_cta
    │           │
    │           ├─→ Store in MongoDB.learning_data {
    │           │     video_id,
    │           │     features,
    │           │     performance {views, likes, shares, revenue}
    │           │   }
    │           │
    │           └─→ Trigger: Re-analyze niches
    │
    └─→ Next video generation uses insights
          │
          └─→ LearningService.get_optimization_insights()
                │
                ├─→ Query recent learning_data (30 days)
                │
                ├─→ Identify high performers (views > 10k)
                │
                ├─→ Calculate correlations:
                │     - optimal_duration
                │     - virality_threshold
                │     - optimal_hashtags
                │
                └─→ Generate recommendations:
                      "La durée optimale est autour de 45 secondes"
                      "Viser un score de viralité supérieur à 75"
```

## 📦 Structure des Modèles de Données

### MongoDB Collections

#### `trends`
```javascript
{
  "_id": "uuid",
  "title": "Routine matinale millionnaire",
  "url": "https://tiktok.com/@user/video/123",
  "views": 250000,
  "engagement": 35000,
  "niche": "entrepreneuriat",
  "date_added": ISODate("2024-...")
}
```

#### `videos`
```javascript
{
  "_id": "uuid",
  "title": "Script viral généré",
  "niche": "motivation",
  "script_data": {
    "title": "...",
    "script": "...",
    "hook": "...",
    "duration_seconds": 45,
    "hashtags": ["#motivation", "#fyp"],
    "description": "...",
    "call_to_action": "..."
  },
  "virality_score": 78.5,
  "video_path": "/app/backend/generated_videos/uuid.mp4",
  "video_url": "/api/videos/uuid/download",
  "created_at": ISODate("..."),
  "status": "completed"
}
```

#### `analytics`
```javascript
{
  "_id": "uuid",
  "video_id": "video-uuid",
  "views": 50000,
  "likes": 5000,
  "shares": 500,
  "comments": 200,
  "revenue": 45.50,
  "date": ISODate("...")
}
```

#### `niches`
```javascript
{
  "_id": "ObjectId",
  "name": "entrepreneuriat",
  "profitability_score": 85.5,
  "trending": true,
  "trend_count": 15,
  "video_count": 8,
  "total_views": 1250000,
  "total_engagement": 180000,
  "total_revenue": 450.50,
  "avg_views": 83333.33,
  "avg_engagement": 12000,
  "avg_revenue": 56.31,
  "last_updated": ISODate("...")
}
```

#### `learning_data`
```javascript
{
  "_id": "ObjectId",
  "video_id": "video-uuid",
  "features": {
    "niche": "motivation",
    "virality_score": 78,
    "duration_seconds": 45,
    "hook_length": 85,
    "hashtag_count": 5,
    "has_cta": true
  },
  "performance": {
    "views": 50000,
    "likes": 5000,
    "shares": 500,
    "comments": 200,
    "revenue": 45.50
  },
  "timestamp": ISODate("...")
}
```

## 🔐 Sécurité et Authentification

### Variables d'Environnement Sensibles

**Backend (.env)**
```bash
EMERGENT_LLM_KEY=sk-emergent-...  # Clé API universelle
MONGO_URL=mongodb://localhost:27017/tiktok_automation
```

**Frontend (.env)**
```bash
REACT_APP_BACKEND_URL=http://localhost:8001
```

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ⚙️ Configuration Supervisor

```ini
[program:mongodb]
command=mongod --dbpath /data/db --bind_ip_all --quiet
priority=1

[program:backend]
command=python /app/backend/server.py
directory=/app/backend
environment=PATH="/root/.venv/bin:%(ENV_PATH)s"
priority=2

[program:frontend]
command=yarn start
directory=/app/frontend
environment=PORT="3000",BROWSER="none"
priority=3
```

## 📊 Algorithmes Clés

### Score de Profitabilité d'une Niche

```python
profitability_score = (
    min(50, (avg_views / 100000) * 50) +      # Vues: 0-50 points
    min(20, (avg_engagement / 10000) * 20) +  # Engagement: 0-20 points
    min(20, (avg_revenue / 100) * 20) +       # Revenus: 0-20 points
    (10 if trend_count >= 3 else 5)           # Trending: 5-10 points
)
# Total: 0-100 points
```

### Score de Viralité (IA-Driven)

Critères analysés par GPT-5.2:
1. **Hook impactant** (0-25 points)
   - Accroche des 3 premières secondes
   - Question / Statement fort
   - Curiosity gap

2. **Structure narrative** (0-25 points)
   - Introduction claire
   - Développement logique
   - Conclusion mémorable

3. **Timing et rythme** (0-20 points)
   - Durée optimale (30-60s)
   - Pas de temps mort
   - Rythme soutenu

4. **Déclencheurs émotionnels** (0-20 points)
   - Émotion ciblée
   - Storytelling
   - Relatabilité

5. **SEO et hashtags** (0-10 points)
   - Mots-clés pertinents
   - Hashtags tendance
   - Description optimisée

## 🚀 Optimisations de Performance

### Backend
- **Async/Await** partout pour non-blocking I/O
- **Motor** (MongoDB async driver)
- **Connection pooling** MongoDB
- **Caching** potentiel pour niches (future)

### Frontend
- **Code splitting** React
- **Lazy loading** des composants
- **Memoization** avec `useMemo`
- **Debouncing** sur recherches (future)

### Génération Vidéo
- **Batch processing** des images
- **Temp files cleanup** automatique
- **FFmpeg hardware acceleration** (si GPU disponible)
- **Parallel generation** (future: multi-workers)

## 🔄 Scalabilité Future

### Horizontal Scaling Options

1. **API Backend**
   - Load balancer (Nginx)
   - Multiple FastAPI instances
   - Redis pour session sharing

2. **MongoDB**
   - Replica sets
   - Sharding par niche
   - Read replicas

3. **Worker Queue**
   - Celery + Redis
   - Background video generation
   - Priority queue par score

4. **CDN pour Vidéos**
   - S3 / CloudFront
   - Streaming optimisé
   - Cache géographique

## 📈 Métriques de Monitoring

### À Surveiller en Production

1. **API Performance**
   - Response time par endpoint
   - Request rate
   - Error rate

2. **Génération de Vidéos**
   - Temps moyen de génération
   - Taux de succès
   - Crédits API consommés

3. **Base de Données**
   - Query performance
   - Storage growth
   - Connection pool usage

4. **Business Metrics**
   - Vidéos générées / jour
   - Score moyen de viralité
   - ROI par niche

---

**Cette architecture est conçue pour être extensible, maintenable et performante tout en restant simple pour un usage personnel. 🚀**
