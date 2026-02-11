from typing import List, Dict
import asyncio
from datetime import datetime

class NicheAnalyzer:
    def __init__(self, db):
        self.db = db
    
    async def analyze_niches(self) -> List[Dict]:
        """Analyse toutes les niches et calcule leur profitabilité"""
        # Récupère toutes les tendances
        trends_cursor = self.db.trends.find({})
        trends = await trends_cursor.to_list(length=1000)
        
        # Récupère toutes les analytics
        analytics_cursor = self.db.analytics.find({})
        analytics = await analytics_cursor.to_list(length=1000)
        
        # Groupe par niche
        niche_data = {}
        
        # Analyse des tendances
        for trend in trends:
            niche = trend.get('niche', 'general')
            if niche not in niche_data:
                niche_data[niche] = {
                    'name': niche,
                    'trend_count': 0,
                    'total_views': 0,
                    'total_engagement': 0,
                    'video_count': 0,
                    'total_revenue': 0,
                    'avg_views': 0,
                    'avg_engagement': 0,
                    'avg_revenue': 0,
                    'profitability_score': 0,
                    'trending': False
                }
            
            niche_data[niche]['trend_count'] += 1
            niche_data[niche]['total_views'] += trend.get('views', 0)
            niche_data[niche]['total_engagement'] += trend.get('engagement', 0)
        
        # Analyse des analytics (performances réelles)
        for analytic in analytics:
            # Récupère la vidéo associée
            video = await self.db.videos.find_one({"_id": analytic.get('video_id')})
            if video:
                niche = video.get('niche', 'general')
                if niche in niche_data:
                    niche_data[niche]['video_count'] += 1
                    niche_data[niche]['total_revenue'] += analytic.get('revenue', 0)
        
        # Calcule les moyennes et scores
        niche_list = []
        for niche, data in niche_data.items():
            if data['trend_count'] > 0:
                data['avg_views'] = data['total_views'] / data['trend_count']
                data['avg_engagement'] = data['total_engagement'] / data['trend_count']
            
            if data['video_count'] > 0:
                data['avg_revenue'] = data['total_revenue'] / data['video_count']
            
            # Score de profitabilité (0-100)
            # Facteurs: vues moyennes, engagement, revenus, tendances récentes
            views_score = min(50, (data['avg_views'] / 100000) * 50)  # Max 50 points
            engagement_score = min(20, (data['avg_engagement'] / 10000) * 20)  # Max 20 points
            revenue_score = min(20, (data['avg_revenue'] / 100) * 20)  # Max 20 points
            trending_score = 10 if data['trend_count'] >= 3 else 5  # 10 points si trending
            
            data['profitability_score'] = views_score + engagement_score + revenue_score + trending_score
            data['trending'] = data['trend_count'] >= 3
            
            niche_list.append(data)
        
        # Trie par score de profitabilité
        niche_list.sort(key=lambda x: x['profitability_score'], reverse=True)
        
        # Mise à jour dans la DB
        for niche_info in niche_list:
            await self.db.niches.update_one(
                {"name": niche_info['name']},
                {"$set": {
                    **niche_info,
                    "last_updated": datetime.utcnow()
                }},
                upsert=True
            )
        
        return niche_list
    
    async def get_recommended_niches(self, limit: int = 5) -> List[Dict]:
        """Retourne les niches les plus recommandées"""
        # Analyse d'abord si pas fait récemment
        await self.analyze_niches()
        
        # Récupère les top niches
        cursor = self.db.niches.find({}).sort("profitability_score", -1).limit(limit)
        niches = await cursor.to_list(length=limit)
        
        return niches
    
    async def search_viral_videos(self, niche: str, limit: int = 10) -> List[Dict]:
        """Recherche les vidéos virales dans une niche (basé sur les tendances ajoutées)"""
        cursor = self.db.trends.find({"niche": niche}).sort("views", -1).limit(limit)
        trends = await cursor.to_list(length=limit)
        return trends