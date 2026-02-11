from typing import Dict, List
from datetime import datetime, timedelta

class LearningService:
    def __init__(self, db):
        self.db = db
    
    async def record_performance(self, video_id: str, performance_data: Dict):
        """Enregistre les performances d'une vidéo pour l'apprentissage"""
        # Récupère la vidéo
        video = await self.db.videos.find_one({"_id": video_id})
        if not video:
            return
        
        # Extrait les features
        features = {
            "niche": video.get('niche'),
            "virality_score": video.get('virality_score', 0),
            "duration_seconds": video.get('script_data', {}).get('duration_seconds', 0),
            "hook_length": len(video.get('script_data', {}).get('hook', '')),
            "hashtag_count": len(video.get('script_data', {}).get('hashtags', [])),
            "has_cta": bool(video.get('script_data', {}).get('call_to_action')),
        }
        
        # Enregistre dans learning_data
        learning_entry = {
            "video_id": video_id,
            "features": features,
            "performance": performance_data,
            "timestamp": datetime.utcnow()
        }
        
        await self.db.learning_data.insert_one(learning_entry)
    
    async def get_optimization_insights(self, niche: str = None) -> Dict:
        """Analyse les données d'apprentissage pour obtenir des insights"""
        # Requête pour les données récentes (30 derniers jours)
        since_date = datetime.utcnow() - timedelta(days=30)
        query = {"timestamp": {"$gte": since_date}}
        
        if niche:
            query["features.niche"] = niche
        
        cursor = self.db.learning_data.find(query)
        data = await cursor.to_list(length=1000)
        
        if not data:
            return {
                "message": "Pas assez de données pour l'analyse",
                "recommendations": []
            }
        
        # Analyse simple: corrélations
        high_performers = [d for d in data if d['performance'].get('views', 0) > 10000]
        low_performers = [d for d in data if d['performance'].get('views', 0) < 1000]
        
        insights = {
            "total_videos": len(data),
            "high_performers": len(high_performers),
            "low_performers": len(low_performers),
            "recommendations": []
        }
        
        # Analyse durée optimale
        if high_performers:
            avg_duration_high = sum(d['features'].get('duration_seconds', 0) for d in high_performers) / len(high_performers)
            insights['optimal_duration'] = avg_duration_high
            insights['recommendations'].append(
                f"La durée optimale est autour de {int(avg_duration_high)} secondes"
            )
        
        # Analyse score viralité
        if high_performers:
            avg_virality_high = sum(d['features'].get('virality_score', 0) for d in high_performers) / len(high_performers)
            insights['virality_threshold'] = avg_virality_high
            insights['recommendations'].append(
                f"Viser un score de viralité supérieur à {int(avg_virality_high)}"
            )
        
        # Analyse hashtags
        avg_hashtags_high = sum(d['features'].get('hashtag_count', 0) for d in high_performers) / len(high_performers) if high_performers else 0
        insights['optimal_hashtags'] = int(avg_hashtags_high)
        if avg_hashtags_high > 0:
            insights['recommendations'].append(
                f"Utiliser environ {int(avg_hashtags_high)} hashtags"
            )
        
        return insights
    
    async def suggest_improvements(self, video_data: Dict) -> List[str]:
        """Suggère des améliorations pour une vidéo basé sur l'apprentissage"""
        niche = video_data.get('niche')
        insights = await self.get_optimization_insights(niche)
        
        suggestions = []
        
        # Vérifie la durée
        current_duration = video_data.get('script_data', {}).get('duration_seconds', 0)
        if 'optimal_duration' in insights:
            optimal = insights['optimal_duration']
            if current_duration < optimal * 0.8:
                suggestions.append(f"Augmenter la durée à environ {int(optimal)} secondes")
            elif current_duration > optimal * 1.2:
                suggestions.append(f"Réduire la durée à environ {int(optimal)} secondes")
        
        # Vérifie le score de viralité
        current_virality = video_data.get('virality_score', 0)
        if 'virality_threshold' in insights and current_virality < insights['virality_threshold']:
            suggestions.append("Améliorer le hook et la structure pour augmenter le score de viralité")
        
        # Vérifie les hashtags
        current_hashtags = len(video_data.get('script_data', {}).get('hashtags', []))
        if 'optimal_hashtags' in insights:
            optimal_tags = insights['optimal_hashtags']
            if current_hashtags < optimal_tags:
                suggestions.append(f"Ajouter plus de hashtags (cible: {optimal_tags})")
        
        return suggestions if suggestions else ["Aucune amélioration suggérée - le contenu est bien optimisé!"]