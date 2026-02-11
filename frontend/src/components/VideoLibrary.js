import React, { useState, useEffect } from 'react';
import { Video, Trash2, Download, Eye } from 'lucide-react';
import { videosAPI } from '../services/api';

function VideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await videosAPI.list();
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error loading videos:', error);
      showMessage('Erreur lors du chargement des vidéos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo?')) return;

    try {
      await videosAPI.delete(id);
      showMessage('Vidéo supprimée', 'success');
      setSelectedVideo(null);
      loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      showMessage('Erreur lors de la suppression', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="video-library" data-testid="video-library">
      <h1 className="text-4xl font-bold mb-8">
        <span className="gradient-text">Bibliothèque de Vidéos</span>
      </h1>

      {message && (
        <div className={`alert alert-${message.type}`} data-testid="library-message">
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="card">
          <div className="text-center text-gray-400 py-12" data-testid="no-videos">
            <Video size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucune vidéo générée. Commencez par créer votre première vidéo!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-3 gap-6">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className="card cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => setSelectedVideo(video)}
              data-testid={`video-card-${video._id}`}
            >
              {/* Thumbnail placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-[9/16] rounded-lg mb-4 flex items-center justify-center">
                <Video size={48} className="text-gray-600" />
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>

              <div className="flex items-center justify-between text-sm mb-3">
                <span className="badge badge-primary">{video.niche}</span>
                <span className="text-gray-400">{formatDate(video.created_at)}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <span className="text-gray-400">Score: </span>
                  <span className="font-bold text-primary">{video.virality_score.toFixed(0)}/100</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={videosAPI.downloadUrl(video._id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`download-video-${video._id}`}
                >
                  <Download size={16} />
                  Télécharger
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(video._id);
                  }}
                  className="btn btn-secondary"
                  data-testid={`delete-video-${video._id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedVideo(null)}
          data-testid="video-detail-modal"
        >
          <div 
            className="card max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Niche</div>
                <div className="badge badge-primary">{selectedVideo.niche}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Date de création</div>
                <div>{formatDate(selectedVideo.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Score de Viralité</div>
                <div className="text-2xl font-bold text-primary">
                  {selectedVideo.virality_score.toFixed(0)}/100
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Durée</div>
                <div>{selectedVideo.script_data?.duration_seconds || 0}s</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Script</h3>
              <div className="bg-gray-800/50 p-4 rounded max-h-48 overflow-y-auto text-sm">
                {selectedVideo.script_data?.script}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.script_data?.hashtags?.map((tag, i) => (
                  <span key={i} className="badge badge-primary">{tag}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-300">{selectedVideo.script_data?.description}</p>
            </div>

            <div className="flex gap-3">
              <a
                href={videosAPI.downloadUrl(selectedVideo._id)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1"
              >
                <Download size={20} />
                Télécharger la Vidéo
              </a>
              <button
                onClick={() => handleDelete(selectedVideo._id)}
                className="btn btn-secondary"
              >
                <Trash2 size={20} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLibrary;