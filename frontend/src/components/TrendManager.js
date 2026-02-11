import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, RefreshCw } from 'lucide-react';
import { trendsAPI } from '../services/api';

function TrendManager() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    views: '',
    engagement: '',
    niche: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const response = await trendsAPI.list();
      setTrends(response.data.trends);
    } catch (error) {
      console.error('Error loading trends:', error);
      showMessage('Erreur lors du chargement des tendances', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: formData.title.trim(),
        niche: formData.niche.trim(),
        views: parseInt(formData.views) || 0,
        engagement: parseInt(formData.engagement) || 0
      };
      
      // Ajouter l'URL seulement si elle est remplie
      if (formData.url && formData.url.trim()) {
        payload.url = formData.url.trim();
      }
      
      await trendsAPI.add(payload);
      
      showMessage('Tendance ajoutée avec succès!', 'success');
      setFormData({ title: '', url: '', views: '', engagement: '', niche: '' });
      setShowForm(false);
      loadTrends();
    } catch (error) {
      console.error('Error adding trend:', error);
      const errorMsg = error.response?.data?.detail || 'Erreur lors de l\'ajout de la tendance';
      showMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tendance?')) return;
    
    try {
      await trendsAPI.delete(id);
      showMessage('Tendance supprimée', 'success');
      loadTrends();
    } catch (error) {
      console.error('Error deleting trend:', error);
      showMessage('Erreur lors de la suppression', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="trend-manager" data-testid="trend-manager">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          <span className="gradient-text">Gestion des Tendances</span>
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={loadTrends} 
            className="btn btn-secondary"
            data-testid="refresh-trends-btn"
          >
            <RefreshCw size={20} />
            Rafraîchir
          </button>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
            data-testid="add-trend-btn"
          >
            <Plus size={20} />
            {showForm ? 'Annuler' : 'Ajouter Tendance'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} data-testid="trend-message">
          {message.text}
        </div>
      )}

      {/* Add Trend Form */}
      {showForm && (
        <div className="card mb-6" data-testid="trend-form">
          <h2 className="text-2xl font-semibold mb-4">Nouvelle Tendance</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="trend-title-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Niche *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  required
                  placeholder="Ex: motivation, fitness, finance..."
                  data-testid="trend-niche-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL TikTok</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.tiktok.com/@..."
                  data-testid="trend-url-input"
                />
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
                  data-testid="trend-views-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Engagement (likes + comments + shares) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.engagement}
                  onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                  required
                  min="0"
                  data-testid="trend-engagement-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" data-testid="submit-trend-btn">
              <Plus size={20} />
              Ajouter la tendance
            </button>
          </form>
        </div>
      )}

      {/* Trends List */}
      <div className="card">
        <h2 className="card-title mb-4">Tendances Enregistrées ({trends.length})</h2>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center text-gray-400 py-8" data-testid="no-trends">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucune tendance enregistrée. Ajoutez votre première tendance!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trends.map((trend) => (
              <div 
                key={trend._id} 
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                data-testid={`trend-item-${trend._id}`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{trend.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span className="badge badge-primary">{trend.niche}</span>
                    <span>👁️ {trend.views.toLocaleString()} vues</span>
                    <span>❤️ {trend.engagement.toLocaleString()} engagements</span>
                  </div>
                  {trend.url && (
                    <a 
                      href={trend.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      🔗 Voir sur TikTok
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(trend._id)}
                  className="btn btn-secondary"
                  data-testid={`delete-trend-${trend._id}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrendManager;