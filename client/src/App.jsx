import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/views/OverviewView';
import { Urban3dStudio } from './components/3d/Urban3dStudio';
import { InteractiveGisMap } from './components/maps/InteractiveGisMap';
import { PredictionEngineSection } from './components/dashboard/PredictionEngineSection';
import { GreenZonePlannerSection } from './components/dashboard/GreenZonePlannerSection';
import { WhatIfSimulator } from './components/dashboard/WhatIfSimulator';
import { AiUrbanPlannerChat } from './components/dashboard/AiUrbanPlannerChat';
import { AnalyticsSection } from './components/dashboard/AnalyticsSection';
import { SdgImpactSection } from './components/dashboard/SdgImpactSection';
import { ReportGeneratorModal } from './components/dashboard/ReportGeneratorModal';
import { AuthModal } from './components/dashboard/AuthModal';
import { ApiKeyModal } from './components/dashboard/ApiKeyModal';
import { CustomCursor } from './components/dashboard/CustomCursor';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeCity, setActiveCity] = useState({ id: "delhi", name: "New Delhi", country: "India", temp: "45.2°C" });
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('heatscape_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(json => {
        if (json.success) setCurrentUser(json.user);
      })
      .catch(() => {
        setCurrentUser({ name: "Dr. Elena Vance", role: "Lead Climate Analyst" });
      });
    }
  }, []);

  const handleGlobalSearch = (query) => {
    setActiveView('ai-planner');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-glow selection:text-black relative overflow-x-hidden flex">
      {/* Custom Cyberpunk Cursor */}
      <CustomCursor />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Workspace Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Top Sticky Command Header */}
        <Header
          activeCity={activeCity}
          setActiveCity={setActiveCity}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenApiKeys={() => setIsApiKeyOpen(true)}
          currentUser={currentUser}
          onSearchSubmit={handleGlobalSearch}
        />

        {/* Dynamic Dedicated Workspace Viewport */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activeView === 'overview' && (
            <OverviewView
              activeCity={activeCity}
              setActiveCity={setActiveCity}
              onNavigate={(view) => setActiveView(view)}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeView === '3d-studio' && (
            <div className="space-y-6">
              <Urban3dStudio activeCity={activeCity} />
            </div>
          )}

          {activeView === 'gis-map' && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-6 font-mono">
                <h2 className="font-display font-bold text-3xl text-white">
                  INTERACTIVE <span className="text-thermal-orange">GIS SPATIAL HEAT MAP</span>
                </h2>
                <p className="text-slate-400 text-xs max-w-xl mx-auto">
                  Satellite-derived Land Surface Temperature (LST) and NDVI vegetation index overlays across global urban centers.
                </p>
              </div>
              <InteractiveGisMap activeCity={activeCity} setActiveCity={setActiveCity} />
            </div>
          )}

          {activeView === 'prediction' && (
            <PredictionEngineSection activeCity={activeCity} />
          )}

          {activeView === 'green-zones' && (
            <GreenZonePlannerSection activeCity={activeCity} />
          )}

          {activeView === 'cooling-simulator' && (
            <WhatIfSimulator activeCity={activeCity} />
          )}

          {activeView === 'ai-planner' && (
            <AiUrbanPlannerChat activeCity={activeCity} />
          )}

          {activeView === 'analytics' && (
            <AnalyticsSection activeCity={activeCity} />
          )}

          {activeView === 'reports' && (
            <SdgImpactSection onGenerateReport={() => setIsReportOpen(true)} />
          )}
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      <ReportGeneratorModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetCity={activeCity.name}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
      />
    </div>
  );
}


