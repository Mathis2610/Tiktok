import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Eye, Video as VideoIcon } from 'lucide-react';
import { dashboardAPI, nichesAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recommendedNiches, setRecommendedNiches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, nichesRes] = await Promise.all([
        dashboardAPI.stats(),
        nichesAPI.recommended(5)
      ]);
      
      setStats(statsRes.data);
      setRecommendedNiches(nichesRes.data.niches);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading" data-testid="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard" data-testid="dashboard">
      <h1 className="text-4xl font-bold mb-8">
        <span className="gradient-text">Tableau de bord</span>
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-4 mb-8">
        <div className="stat-card" data-testid="stat-trends">
          <TrendingUp size={32} className="mx-auto mb-3 text-primary" />
          <div className="stat-value">{stats?.total_trends || 0}</div>
          <div className="stat-label">Tendances suivies</div>
        </div>

        <div className="stat-card" data-testid="stat-videos">
          <VideoIcon size={32} className="mx-auto mb-3 text-primary" />
          <div className="stat-value">{stats?.total_videos || 0}</div>
          <div className="stat-label">Vidéos générées</div>
        </div>

        <div className="stat-card" data-testid="stat-views">
          <Eye size={32} className="mx-auto mb-3 text-primary" />
          <div className="stat-value">{(stats?.total_views || 0).toLocaleString()}</div>
          <div className="stat-label">Vues totales</div>
        </div>

        <div className="stat-card" data-testid="stat-revenue">
          <DollarSign size={32} className="mx-auto mb-3 text-primary" />
          <div className="stat-value">{(stats?.total_revenue || 0).toFixed(2)}€</div>
          <div className="stat-label">Revenus générés</div>
        </div>
      </div>

      {/* Recommended Niches */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" data-testid="recommended-niches-title">🎯 Niches Recommandées</h2>
        </div>

        {recommendedNiches.length === 0 ? (
          <div className="text-center text-gray-400 py-8" data-testid="no-niches">
            <p>Aucune niche disponible. Ajoutez des tendances pour commencer l'analyse.</p>
          </div>
        ) : (
          <div className="grid grid-2 gap-4">
            {recommendedNiches.map((niche, index) => (
              <div 
                key={niche.name} 
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-primary/20"
                data-testid={`niche-card-${index}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{niche.name}</h3>
                  <span className={`badge ${niche.trending ? 'badge-success' : 'badge-primary'}`}>
                    {niche.trending ? '🔥 Trending' : 'Active'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score de profitabilité:</span>
                    <span className="font-bold text-primary">{niche.profitability_score.toFixed(0)}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vues moyennes:</span>
                    <span className="font-semibold">{niche.avg_views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revenus moyens:</span>
                    <span className="font-semibold text-green-400">{niche.avg_revenue.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tendances actives:</span>
                    <span className="font-semibold">{niche.trend_count}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${niche.profitability_score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Videos */}
      {stats?.top_videos && stats.top_videos.length > 0 && (
        <div className="card mt-6">
          <div className="card-header">
            <h2 className="card-title" data-testid="top-videos-title">🏆 Meilleures Vidéos</h2>
          </div>

          <div className="space-y-4">
            {stats.top_videos.map((item, index) => (
              <div 
                key={item.video._id} 
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                data-testid={`top-video-${index}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.video.title}</h4>
                    <p className="text-sm text-gray-400">Niche: {item.video.niche}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{item.performance.views.toLocaleString()} vues</div>
                  <div className="text-sm text-green-400">{item.performance.revenue.toFixed(2)}€ revenus</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
