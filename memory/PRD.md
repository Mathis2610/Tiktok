# TikTok Automation App - PRD

## Énoncé du problème original
Créer une application à usage personnel inspirée de `creatikk.io` pour automatiser et optimiser la création de contenu TikTok. L'objectif principal est de maximiser les revenus générés par les vidéos.

## Fonctionnalités principales

### 1. Génération de Contenu
- Générer des scripts, visuels (images/vidéos IA), sous-titres et descriptions optimisées
- S'inspirer d'un lien vidéo fourni ou trouver automatiquement des vidéos virales

### 2. Analyse et Stratégie
- Analyser les tendances et données analytiques (saisie manuelle)
- Identifier et recommander les niches rentables
- Analyser la viralité potentielle des contenus

### 3. Apprentissage et Optimisation
- Boucle de rétro-apprentissage pour analyser les performances
- Proposer de nouvelles niches si performances faibles

### 4. Exclusions
- Pas de pages marketing/pricing (usage personnel gratuit)

## Architecture technique
- **Frontend**: React.js + TailwindCSS v3.4.1
- **Backend**: FastAPI (Python) + Uvicorn
- **Database**: MongoDB (motor async driver)
- **AI**: emergentintegrations (OpenAI GPT-4o, TTS, Fal.ai)
- **Video**: moviepy, ffmpeg

## Ce qui est implémenté ✅

### Backend (100% fonctionnel)
- [x] API Health check
- [x] CRUD Tendances (POST/GET/DELETE /api/trends)
- [x] Niches recommandées (GET /api/niches/recommended)
- [x] Dashboard stats (GET /api/dashboard/stats)
- [x] Analytics (POST/GET /api/analytics)
- [x] Learning/Feedback endpoint
- [x] Sérialisation MongoDB (utils.py)

### Frontend (100% fonctionnel)
- [x] Dashboard avec statistiques et niches recommandées
- [x] Gestionnaire de tendances (formulaire + liste + suppression)
- [x] Navigation entre toutes les pages
- [x] Design moderne sombre avec TailwindCSS

## Backlog - À implémenter

### P1 - Priorité Haute
1. **Génération vidéo complète**
   - Implémentation de video_service.py
   - Script IA → TTS → Montage vidéo
   - Téléchargement des vidéos générées

2. **Boucle de rétro-apprentissage**
   - Intégration complète de learning_service.py
   - Analyse des performances
   - Ajustement des stratégies

### P2 - Priorité Moyenne
3. **Recherche automatique de vidéos virales**
   - API ou scraping pour trouver des tendances
   
4. **Gestion multi-comptes TikTok**
   - Stockage sécurisé des credentials
   
5. **Publication automatique**
   - Intégration API TikTok
   - Planification des publications

## Historique des corrections

### 11 Février 2026
- **Bug P0 résolu**: Ajout de tendance fonctionne correctement
- Tests automatisés créés: `/app/backend/tests/test_trends_api.py`
- Validation complète: Backend 100%, Frontend 100%

## Fichiers clés
- `/app/backend/server.py` - Routes API
- `/app/frontend/src/components/TrendManager.js` - Gestion tendances
- `/app/frontend/src/services/api.js` - Services API
- `/app/backend/services/` - Services métier (AI, video, niche, learning)

## Notes techniques importantes
- TailwindCSS v3.4.1 (ne pas upgrader vers v4)
- ObjectId MongoDB sérialisés via utils.py
- Emergent LLM Key requis pour les intégrations IA
