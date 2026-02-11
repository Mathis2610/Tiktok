import os
import uuid
import base64
from moviepy.editor import *
from pydub import AudioSegment
import tempfile
import shutil

class VideoService:
    def __init__(self):
        self.output_dir = "/app/backend/generated_videos"
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def create_video(self, images: list, audio_bytes: bytes, script_data: dict) -> str:
        """Assemble une vidéo complète avec images, audio, et sous-titres"""
        video_id = str(uuid.uuid4())
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Sauvegarde l'audio
            audio_path = os.path.join(temp_dir, "audio.mp3")
            with open(audio_path, "wb") as f:
                f.write(audio_bytes)
            
            # Get audio duration
            audio_clip = AudioFileClip(audio_path)
            total_duration = audio_clip.duration
            
            # Prépare les images
            image_clips = []
            duration_per_image = total_duration / len(images) if images else 5
            
            for i, img_data in enumerate(images):
                # Décode et sauvegarde l'image
                img_path = os.path.join(temp_dir, f"image_{i}.png")
                img_bytes = base64.b64decode(img_data['data'])
                with open(img_path, "wb") as f:
                    f.write(img_bytes)
                
                # Crée un clip d'image
                img_clip = ImageClip(img_path, duration=duration_per_image)
                img_clip = img_clip.resize(height=1920)  # Format vertical 9:16
                
                # Ajoute un effet de zoom léger
                img_clip = img_clip.fx(vfx.resize, lambda t: 1 + 0.05 * t / duration_per_image)
                
                image_clips.append(img_clip)
            
            # Concatène les clips d'images
            if image_clips:
                video_clip = concatenate_videoclips(image_clips, method="compose")
            else:
                # Fallback: clip noir si pas d'images
                video_clip = ColorClip(size=(1080, 1920), color=(0, 0, 0), duration=total_duration)
            
            # Ajoute l'audio
            video_clip = video_clip.set_audio(audio_clip)
            
            # TODO: Ajouter les sous-titres (nécessite moviepy avec TextClip)
            # Pour l'instant, on skip les sous-titres pour éviter les dépendances ImageMagick
            
            # Export final
            output_path = os.path.join(self.output_dir, f"{video_id}.mp4")
            video_clip.write_videofile(
                output_path,
                fps=30,
                codec='libx264',
                audio_codec='aac',
                temp_audiofile=os.path.join(temp_dir, 'temp-audio.m4a'),
                remove_temp=True,
                threads=4
            )
            
            # Cleanup
            audio_clip.close()
            video_clip.close()
            
            return output_path
        
        except Exception as e:
            print(f"Error creating video: {e}")
            raise
        finally:
            # Nettoyage du répertoire temporaire
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
    
    def get_video_path(self, video_id: str) -> str:
        """Retourne le chemin d'une vidéo générée"""
        return os.path.join(self.output_dir, f"{video_id}.mp4")