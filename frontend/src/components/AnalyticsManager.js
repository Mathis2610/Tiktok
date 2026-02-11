import React, { useState, useEffect } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { analyticsAPI, videosAPI } from '../services/api';

function AnalyticsManager() {
  const [analytics, setAnalytics] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    video_id: '',
    views: '',
    likes: '',
    shares: '',
    comments: '',
    revenue: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, videosRes] = await Promise.all([
        analyticsAPI.list(),
        videosAPI.list()
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setVideos(videosRes.data.videos);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await analyticsAPI.add({
        ...formData,
        views: parseInt(formData.views),
        likes: parseInt(formData.likes),
        shares: parseInt(formData.shares),
        comments: parseInt(formData.comments),
        revenue: parseFloat(formData.revenue)
      });
      
      showMessage('Analytics ajoutées avec succès!', 'success');
      setFormData({ video_id: '', views: '', likes: '', shares: '', comments: '', revenue: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error adding analytics:', error);
      showMessage('Erreur lors de l\'ajout des analytics', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const getVideoTitle = (videoId) => {
    const video = videos.find(v => v._id === videoId);
    return video ? video.title : 'Vidéo inconnue';
  };

  return (
    <div className="analytics-manager" data-testid="analytics-manager">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          <span className="gradient-text">Analytics & Performances</span>
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
          data-testid="add-analytics-btn"
        >
          <Plus size={20} />
          {showForm ? 'Annuler' : 'Ajouter Analytics'}
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} data-testid="analytics-message">
          {message.text}
        </div>
      )}

      {/* Add Analytics Form */}
      {showForm && (
        <div className="card mb-6" data-testid="analytics-form">
          <h2 className="text-2xl font-semibold mb-4">Nouvelles Analytics</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">Vidéo *</label>
                <select
                  className="form-select"
                  value={formData.video_id}
                  onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
                  required
                  data-testid="analytics-video-select"
                >
                  <option value="">Sélectionner une vidéo...</option>
                  {videos.map(video => (
                    <option key={video._id} value={video._id}>
                      {video.title} ({video.niche})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Vues *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  required
                  min="0"
                  data-testid="analytics-views-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Likes *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.likes}
                  onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                  required
                  min="0"
                  data-testid="analytics-likes-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Partages *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.shares}
                  onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                  required
                  min="0"
                  data-testid="analytics-shares-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Commentaires *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  required
                  min="0"
                  data-testid="analytics-comments-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Revenus (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  required
                  min="0"
                  data-testid="analytics-revenue-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" data-testid="submit-analytics-btn">
              <Plus size={20} />
              Ajouter les analytics
            </button>
          </form>
        </div>
      )}

      {/* Analytics List */}
      <div className="card">
        <h2 className="card-title mb-4">Historique des Performances ({analytics.length})</h2>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : analytics.length === 0 ? (
          <div className="text-center text-gray-400 py-8" data-testid="no-analytics">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucune analytics enregistrée. Ajoutez les performances de vos vidéos publiées!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.map((analytic) => (
              <div 
                key={analytic._id} 
                className="p-4 bg-gray-800/50 rounded-lg"
                data-testid={`analytics-item-${analytic._id}`}
              >
                <h3 className="font-semibold text-lg mb-2">{getVideoTitle(analytic.video_id)}</h3>
                <div className="grid grid-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Vues</div>
                    <div className="font-bold text-primary">{analytic.views.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Likes</div>
                    <div className="font-bold">{analytic.likes.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Partages</div>
                    <div className="font-bold">{analytic.shares.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Commentaires</div>
                    <div className="font-bold">{analytic.comments.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Revenus: </span>
                  <span className="font-bold text-green-400 text-lg">{analytic.revenue.toFixed(2)}€</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsManager;