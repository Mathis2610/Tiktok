import os
import asyncio
import base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
from emergentintegrations.llm.openai import OpenAITextToSpeech

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv("EMERGENT_LLM_KEY")
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment")
        self.tts = OpenAITextToSpeech(api_key=self.api_key)
    
    async def generate_script(self, niche: str, inspiration_url: str = None, tone: str = "engageant") -> dict:
        """Génère un script viral optimisé pour TikTok"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"script-gen-{asyncio.get_event_loop().time()}",
            system_message="Tu es un expert en création de contenu viral TikTok. Tu génères des scripts courts, accrocheurs et optimisés pour maximiser l'engagement et les revenus."
        )
        chat.with_model("openai", "gpt-5.2")
        
        prompt = f"""
Crée un script TikTok viral pour la niche: {niche}
Tone: {tone}

{f"Inspire-toi de cette vidéo: {inspiration_url}" if inspiration_url else ""}

Le script doit:
- Commencer par un hook PUISSANT (3 premières secondes)
- Durée totale: 30-60 secondes
- Structure claire avec émotions fortes
- Inclure des appels à l'action subtils
- Utiliser des mots-clés tendance

Réponds au format JSON:
{{
  "title": "Titre accrocheur",
  "script": "Le script complet...",
  "hook": "La première phrase d'accroche",
  "duration_seconds": 45,
  "hashtags": ["#tendance1", "#tendance2"],
  "description": "Description optimisée SEO",
  "call_to_action": "CTA à la fin"
}}
"""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Parse JSON response
        import json
        try:
            script_data = json.loads(response)
        except:
            # Fallback if not valid JSON
            script_data = {
                "title": "Script Généré",
                "script": response,
                "hook": response[:100],
                "duration_seconds": 45,
                "hashtags": ["#fyp", "#viral"],
                "description": "Contenu viral TikTok",
                "call_to_action": "Abonne-toi!"
            }
        
        return script_data
    
    async def generate_images(self, script_content: str, count: int = 5) -> list:
        """Génère des images pour accompagner le script"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"image-gen-{asyncio.get_event_loop().time()}",
            system_message="Tu es un créateur d'images pour TikTok."
        )
        chat.with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])
        
        # Analyse le script pour créer des prompts d'images
        analysis_chat = LlmChat(
            api_key=self.api_key,
            session_id=f"analysis-{asyncio.get_event_loop().time()}",
            system_message="Tu analyses des scripts et crée des prompts d'images."
        )
        analysis_chat.with_model("openai", "gpt-5.2")
        
        analysis_prompt = f"""
Analyse ce script TikTok et crée {count} prompts d'images descriptifs pour l'accompagner:

{script_content}

Réponds avec une liste de prompts séparés par |||
"""
        
        analysis_msg = UserMessage(text=analysis_prompt)
        prompts_text = await analysis_chat.send_message(analysis_msg)
        image_prompts = [p.strip() for p in prompts_text.split("|||")[:count]]
        
        # Génère les images
        images = []
        for i, prompt in enumerate(image_prompts):
            try:
                msg = UserMessage(
                    text=f"Crée une image verticale (9:16) optimisée TikTok: {prompt}. Style moderne, coloré, accrocheur."
                )
                text_response, image_list = await chat.send_message_multimodal_response(msg)
                
                if image_list:
                    for img in image_list:
                        images.append({
                            "data": img['data'],
                            "mime_type": img['mime_type'],
                            "prompt": prompt
                        })
            except Exception as e:
                print(f"Error generating image {i}: {e}")
                continue
        
        return images
    
    async def generate_voiceover(self, script_text: str, voice: str = "nova") -> bytes:
        """Génère la voix-off du script"""
        try:
            audio_bytes = await self.tts.generate_speech(
                text=script_text,
                model="tts-1-hd",
                voice=voice,
                speed=1.1  # Légèrement plus rapide pour TikTok
            )
            return audio_bytes
        except Exception as e:
            print(f"Error generating voiceover: {e}")
            raise
    
    async def calculate_virality_score(self, script_data: dict) -> float:
        """Calcule le score de viralité d'un script"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"virality-score-{asyncio.get_event_loop().time()}",
            system_message="Tu es un expert en analyse de viralité TikTok. Tu évalues le potentiel viral d'un script sur une échelle de 0 à 100."
        )
        chat.with_model("openai", "gpt-5.2")
        
        prompt = f"""
Évalue le potentiel viral de ce script TikTok sur 100:

Titre: {script_data.get('title', '')}
Hook: {script_data.get('hook', '')}
Script: {script_data.get('script', '')}
Hashtags: {script_data.get('hashtags', [])}

Critères:
- Hook impactant (0-25 points)
- Structure narrative (0-25 points)
- Timing et rythme (0-20 points)
- Déclencheurs émotionnels (0-20 points)
- SEO et hashtags (0-10 points)

Réponds UNIQUEMENT avec un nombre entre 0 et 100.
"""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        try:
            score = float(response.strip())
            return min(100, max(0, score))
        except:
            return 50.0  # Score par défaut
