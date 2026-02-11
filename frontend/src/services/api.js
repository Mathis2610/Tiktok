import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_BACKEND_URL environment variable is not set');
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { API_BASE_URL }; // Export pour utilisation dans les composants

export const trendsAPI = {
  add: (data) => api.post('/trends', data),
  list: (niche = null, limit = 50) => api.get('/trends', { params: { niche, limit } }),
  delete: (id) => api.delete(`/trends/${id}`),
};

export const analyticsAPI = {
  add: (data) => api.post('/analytics', data),
  list: (videoId = null) => api.get('/analytics', { params: { video_id: videoId } }),
};

export const nichesAPI = {
  recommended: (limit = 5) => api.get('/niches/recommended', { params: { limit } }),
  all: () => api.get('/niches/all'),
  trends: (niche, limit = 10) => api.get(`/niches/${niche}/trends`, { params: { limit } }),
};

export const videosAPI = {
  generate: (data) => api.post('/videos/generate', data),
  list: (niche = null, limit = 20) => api.get('/videos', { params: { niche, limit } }),
  get: (id) => api.get(`/videos/${id}`),
  delete: (id) => api.delete(`/videos/${id}`),
  downloadUrl: (id) => `${API_BASE_URL}/api/videos/${id}/download`,
};

export const learningAPI = {
  feedback: (data) => api.post('/learning/feedback', data),
  insights: (niche = null) => api.get('/learning/insights', { params: { niche } }),
};

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};

export default api;