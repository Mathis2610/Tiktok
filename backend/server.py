from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import uuid
import asyncio

# Import services
from services.ai_service import AIService
from services.video_service import VideoService
from services.niche_analyzer import NicheAnalyzer
from services.learning_service import LearningService
from utils import serialize_doc, serialize_docs

load_dotenv()

app = FastAPI(title="TikTok Automation API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise ValueError("MONGO_URL environment variable is required")

client = AsyncIOMotorClient(MONGO_URL)

# Extract database name from connection string
from urllib.parse import urlparse
parsed_url = urlparse(MONGO_URL)
db_name = parsed_url.path.lstrip('/') or 'tiktok_automation'
db = client[db_name]

# Initialize services
ai_service = AIService()
video_service = VideoService()

# Create generated_videos directory and mount it
os.makedirs("/app/backend/generated_videos", exist_ok=True)
app.mount("/videos", StaticFiles(directory="/app/backend/generated_videos"), name="videos")

# Pydantic models
class TrendInput(BaseModel):
    title: str
    url: Optional[str] = None
    views: int
    engagement: int
    niche: str
    date_added: Optional[datetime] = None

class AnalyticsInput(BaseModel):
    video_id: str
    views: int
    likes: int
    shares: int
    comments: int
    revenue: float
    date: Optional[datetime] = None

class VideoGenerationRequest(BaseModel):
    niche: str
    inspiration_url: Optional[str] = None
    tone: str = "engageant"
    voice: str = "nova"

class FeedbackInput(BaseModel):
    video_id: str
    views: int
    likes: int
    shares: int
    comments: int
    revenue: float

# Routes

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "TikTok Automation API"}

# ===== TRENDS MANAGEMENT =====

@app.post("/api/trends")
async def add_trend(trend: TrendInput):
    """Ajoute une nouvelle tendance manuellement"""
    trend_data = trend.dict()
    if not trend_data.get('date_added'):
        trend_data['date_added'] = datetime.utcnow()
    
    trend_data['_id'] = str(uuid.uuid4())
    await db.trends.insert_one(trend_data)
    
    return {"message": "Tendance ajoutée avec succès", "id": trend_data['_id']}

@app.get("/api/trends")
async def get_trends(niche: Optional[str] = None, limit: int = 50):
    """Récupère la liste des tendances"""
    query = {}
    if niche:
        query['niche'] = niche
    
    cursor = db.trends.find(query).sort("views", -1).limit(limit)
    trends = await cursor.to_list(length=limit)
    
    return {"trends": serialize_docs(trends), "count": len(trends)}

@app.delete("/api/trends/{trend_id}")
async def delete_trend(trend_id: str):
    """Supprime une tendance"""
    result = await db.trends.delete_one({"_id": trend_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tendance non trouvée")
    
    return {"message": "Tendance supprimée"}

# ===== ANALYTICS MANAGEMENT =====

@app.post("/api/analytics")
async def add_analytics(analytics: AnalyticsInput):
    """Ajoute des analytics pour une vidéo publiée"""
    analytics_data = analytics.dict()
    if not analytics_data.get('date'):
        analytics_data['date'] = datetime.utcnow()
    
    analytics_data['_id'] = str(uuid.uuid4())
    await db.analytics.insert_one(analytics_data)
    
    # Enregistre pour le learning
    learning_service = LearningService(db)
    await learning_service.record_performance(
        analytics_data['video_id'],
        {
            'views': analytics_data['views'],
            'likes': analytics_data['likes'],
            'shares': analytics_data['shares'],
            'comments': analytics_data['comments'],
            'revenue': analytics_data['revenue']
        }
    )
    
    return {"message": "Analytics ajoutées avec succès", "id": analytics_data['_id']}

@app.get("/api/analytics")
async def get_analytics(video_id: Optional[str] = None):
    """Récupère les analytics"""
    query = {}
    if video_id:
        query['video_id'] = video_id
    
    cursor = db.analytics.find(query).sort("date", -1)
    analytics = await cursor.to_list(length=100)
    
    return {"analytics": serialize_docs(analytics), "count": len(analytics)}

# ===== NICHE RECOMMENDATIONS =====

@app.get("/api/niches/recommended")
async def get_recommended_niches(limit: int = 5):
    """Obtient les niches recommandées basées sur l'analyse"""
    analyzer = NicheAnalyzer(db)
    niches = await analyzer.get_recommended_niches(limit)
    
    return {"niches": serialize_docs(niches), "count": len(niches)}

@app.get("/api/niches/all")
async def get_all_niches():
    """Liste toutes les niches analysées"""
    cursor = db.niches.find({}).sort("profitability_score", -1)
    niches = await cursor.to_list(length=100)
    
    return {"niches": serialize_docs(niches), "count": len(niches)}

@app.get("/api/niches/{niche}/trends")
async def get_niche_trends(niche: str, limit: int = 10):
    """Récupère les vidéos virales d'une niche"""
    analyzer = NicheAnalyzer(db)
    trends = await analyzer.search_viral_videos(niche, limit)
    
    return {"niche": niche, "trends": serialize_docs(trends), "count": len(trends)}

# ===== VIDEO GENERATION =====

@app.post("/api/videos/generate")
async def generate_video(request: VideoGenerationRequest):
    """Génère une vidéo complète optimisée pour TikTok"""
    try:
        video_id = str(uuid.uuid4())
        
        # 1. Génère le script
        script_data = await ai_service.generate_script(
            niche=request.niche,
            inspiration_url=request.inspiration_url,
            tone=request.tone
        )
        
        # 2. Calcule le score de viralité
        virality_score = await ai_service.calculate_virality_score(script_data)
        
        # 3. Génère les images
        images = await ai_service.generate_images(script_data['script'], count=5)
        
        # 4. Génère la voix-off
        audio_bytes = await ai_service.generate_voiceover(
            script_data['script'],
            voice=request.voice
        )
        
        # 5. Assemble la vidéo
        video_path = await video_service.create_video(images, audio_bytes, script_data)
        
        # 6. Sauvegarde dans la DB
        video_doc = {
            "_id": video_id,
            "title": script_data['title'],
            "niche": request.niche,
            "script_data": script_data,
            "virality_score": virality_score,
            "video_path": video_path,
            "video_url": f"/api/videos/{video_id}/download",
            "created_at": datetime.utcnow(),
            "status": "completed"
        }
        
        await db.videos.insert_one(video_doc)
        
        # 7. Obtient des suggestions d'amélioration
        learning_service = LearningService(db)
        suggestions = await learning_service.suggest_improvements(video_doc)
        
        return {
            "video_id": video_id,
            "script": script_data,
            "virality_score": virality_score,
            "video_url": video_doc['video_url'],
            "suggestions": suggestions,
            "message": "Vidéo générée avec succès!"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération: {str(e)}")

@app.get("/api/videos")
async def list_videos(niche: Optional[str] = None, limit: int = 20):
    """Liste les vidéos générées"""
    query = {}
    if niche:
        query['niche'] = niche
    
    cursor = db.videos.find(query).sort("created_at", -1).limit(limit)
    videos = await cursor.to_list(length=limit)
    
    return {"videos": serialize_docs(videos), "count": len(videos)}

@app.get("/api/videos/{video_id}")
async def get_video(video_id: str):
    """Récupère les détails d'une vidéo"""
    video = await db.videos.find_one({"_id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    return serialize_doc(video)

@app.get("/api/videos/{video_id}/download")
async def download_video(video_id: str):
    """Télécharge une vidéo générée"""
    video = await db.videos.find_one({"_id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    video_path = video.get('video_path')
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Fichier vidéo non trouvé")
    
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=f"{video['title']}.mp4"
    )

@app.delete("/api/videos/{video_id}")
async def delete_video(video_id: str):
    """Supprime une vidéo"""
    video = await db.videos.find_one({"_id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    # Supprime le fichier
    if video.get('video_path') and os.path.exists(video['video_path']):
        os.remove(video['video_path'])
    
    # Supprime de la DB
    await db.videos.delete_one({"_id": video_id})
    
    return {"message": "Vidéo supprimée"}

# ===== LEARNING & FEEDBACK =====

@app.post("/api/learning/feedback")
async def submit_feedback(feedback: FeedbackInput):
    """Soumet un feedback sur une vidéo publiée pour le rétro-apprentissage"""
    learning_service = LearningService(db)
    
    await learning_service.record_performance(
        feedback.video_id,
        {
            'views': feedback.views,
            'likes': feedback.likes,
            'shares': feedback.shares,
            'comments': feedback.comments,
            'revenue': feedback.revenue
        }
    )
    
    return {"message": "Feedback enregistré pour l'apprentissage"}

@app.get("/api/learning/insights")
async def get_learning_insights(niche: Optional[str] = None):
    """Obtient les insights d'apprentissage"""
    learning_service = LearningService(db)
    insights = await learning_service.get_optimization_insights(niche)
    
    return insights

# ===== DASHBOARD STATS =====

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Récupère les statistiques du dashboard"""
    # Count documents
    total_trends = await db.trends.count_documents({})
    total_videos = await db.videos.count_documents({})
    total_niches = await db.niches.count_documents({})
    
    # Get recent analytics
    analytics_cursor = db.analytics.find({}).sort("date", -1).limit(100)
    analytics_list = await analytics_cursor.to_list(length=100)
    
    total_views = sum(a.get('views', 0) for a in analytics_list)
    total_revenue = sum(a.get('revenue', 0) for a in analytics_list)
    
    # Get top performing videos
    top_videos_cursor = db.analytics.find({}).sort("views", -1).limit(5)
    top_analytics = await top_videos_cursor.to_list(length=5)
    
    top_videos = []
    for analytic in top_analytics:
        video = await db.videos.find_one({"_id": analytic['video_id']})
        if video:
            top_videos.append({
                "video": video,
                "performance": analytic
            })
    
    return {
        "total_trends": total_trends,
        "total_videos": total_videos,
        "total_niches": total_niches,
        "total_views": total_views,
        "total_revenue": total_revenue,
        "top_videos": top_videos
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
