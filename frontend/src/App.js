import React, { useState, useEffect } from 'react';
import { TrendingUp, Video, BarChart3, Sparkles, Plus } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TrendManager from './components/TrendManager';
import VideoGenerator from './components/VideoGenerator';
import VideoLibrary from './components/VideoLibrary';
import AnalyticsManager from './components/AnalyticsManager';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trends', label: 'Tendances', icon: TrendingUp },
    { id: 'generator', label: 'Générer Vidéo', icon: Sparkles },
    { id: 'library', label: 'Bibliothèque', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: Plus },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'trends':
        return <TrendManager />;
      case 'generator':
        return <VideoGenerator />;
      case 'library':
        return <VideoLibrary />;
      case 'analytics':
        return <AnalyticsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container" data-testid="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`} data-testid="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <Sparkles className="inline-block mr-2" size={24} />
            TikTok AI
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              data-testid={`nav-${item.id}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" data-testid="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;