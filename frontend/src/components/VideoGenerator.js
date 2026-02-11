import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, AlertCircle } from 'lucide-react';
import { videosAPI, nichesAPI, learningAPI, API_BASE_URL } from '../services/api';

function VideoGenerator() {
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    niche: '',
    inspiration_url: '',
    tone: 'engageant',
    voice: 'nova'
  });
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    loadNiches();
    loadInsights();
  }, []);

  const loadNiches = async () => {
    try {
      const response = await nichesAPI.recommended();
      setNiches(response.data.niches);
    } catch (error) {
      console.error('Error loading niches:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await learningAPI.insights();
      setInsights(response.data);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setResult(null);

    try {
      const response = await videosAPI.generate(formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error generating video:', error);
      setResult({
        error: true,
        message: error.response?.data?.detail || 'Erreur lors de la génération de la vidéo'
      });
    } finally {
      setGenerating(false);
    }
  };

  const toneOptions = [
    { value: 'engageant', label: 'Engageant' },
    { value: 'motivant', label: 'Motivant' },
    { value: 'informatif', label: 'Informatif' },
    { value: 'drôle', label: 'Drôle' },
    { value: 'inspirant', label: 'Inspirant' }
  ];

  const voiceOptions = [
    { value: 'alloy', label: 'Alloy (Neutre)' },
    { value: 'nova', label: 'Nova (Énergique)' },
    { value: 'shimmer', label: 'Shimmer (Joyeux)' },
    { value: 'echo', label: 'Echo (Calme)' },
    { value: 'fable', label: 'Fable (Storytelling)' },
    { value: 'onyx', label: 'Onyx (Autoritaire)' }
  ];

  return (
    <div className="video-generator" data-testid="video-generator">
      <h1 className="text-4xl font-bold mb-8">
        <span className="gradient-text">Générateur de Vidéos IA</span>
      </h1>

      {/* Insights Card */}
      {insights && insights.recommendations && insights.recommendations.length > 0 && (
        <div className="card mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30" data-testid="insights-card">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Recommandations basées sur vos performances
          </h3>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-2 gap-6">
        {/* Generation Form */}
        <div className="card" data-testid="generation-form">
          <h2 className="card-title mb-6">Paramètres de Génération</h2>

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Niche *</label>
              <select
                className="form-select"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                required
                disabled={generating}
                data-testid="niche-select"
              >
                <option value="">Sélectionner une niche...</option>
                {niches.map(niche => (
                  <option key={niche.name} value={niche.name}>
                    {niche.name} (Score: {niche.profitability_score.toFixed(0)})
                  </option>
                ))}
                <option value="autre">Autre (saisir manuellement)</option>
              </select>
              {formData.niche === 'autre' && (
                <input
                  type="text"
                  className="form-input mt-2"
                  placeholder="Entrez la niche..."
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">URL d'inspiration (optionnel)</label>
              <input
                type="url"
                className="form-input"
                value={formData.inspiration_url}
                onChange={(e) => setFormData({ ...formData, inspiration_url: e.target.value })}
                placeholder="https://www.tiktok.com/@..."
                disabled={generating}
                data-testid="inspiration-url-input"
              />
              <p className="text-xs text-gray-400 mt-1">
                Si non fourni, le système trouvera automatiquement des vidéos virales dans la niche
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Tone *</label>
              <select
                className="form-select"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                disabled={generating}
                data-testid="tone-select"
              >
                {toneOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Voix *</label>
              <select
                className="form-select"
                value={formData.voice}
                onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                disabled={generating}
                data-testid="voice-select"
              >
                {voiceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-4"
              disabled={generating}
              data-testid="generate-video-btn"
            >
              {generating ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Générer la Vidéo
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Display */}
        <div className="card" data-testid="result-display">
          <h2 className="card-title mb-6">Résultat</h2>

          {generating && (
            <div className="text-center py-12" data-testid="generating-state">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-400">Génération de votre vidéo virale en cours...</p>
              <p className="text-sm text-gray-500 mt-2">
                Cela peut prendre 1-2 minutes (script + images + voix + vidéo)
              </p>
            </div>
          )}

          {!generating && !result && (
            <div className="text-center py-12 text-gray-400" data-testid="no-result-state">
              <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
              <p>Les paramètres de votre vidéo apparaîtront ici après la génération</p>
            </div>
          )}

          {result && result.error && (
            <div className="alert alert-error" data-testid="error-result">
              <AlertCircle size={20} />
              {result.message}
            </div>
          )}

          {result && !result.error && (
            <div className="space-y-4" data-testid="success-result">
              {/* Success message */}
              <div className="alert alert-success">
                ✅ {result.message}
              </div>

              {/* Virality Score */}
              <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Score de Viralité</div>
                <div className="text-3xl font-bold text-primary">
                  {result.virality_score.toFixed(0)}/100
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${result.virality_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Script Details */}
              <div>
                <h3 className="font-semibold mb-2">Titre</h3>
                <p className="text-gray-300">{result.script.title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Hook</h3>
                <p className="text-gray-300 italic">"{result.script.hook}"</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Script Complet</h3>
                <div className="bg-gray-800/50 p-4 rounded max-h-48 overflow-y-auto text-sm">
                  {result.script.script}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.script.hashtags.map((tag, i) => (
                    <span key={i} className="badge badge-primary">{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-300">{result.script.description}</p>
              </div>

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Suggestions d'amélioration</h3>
                  <ul className="space-y-1 text-sm">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">→</span>
                        <span className="text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Download Button */}
              <a
                href={`${process.env.REACT_APP_BACKEND_URL}${result.video_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full text-center"
                data-testid="download-video-btn"
              >
                📥 Télécharger la Vidéo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoGenerator;