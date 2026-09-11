import React, { useState, useEffect } from 'react';
import { Navbar } from './components/dashboard/Navbar';
import { HeroSection } from './components/dashboard/HeroSection';
import { InteractiveGisMap } from './components/maps/InteractiveGisMap';
import { Urban3dStudio } from './components/3d/Urban3dStudio';
import { DataPipelineSection } from './components/dashboard/DataPipelineSection';
import { PredictionEngineSection } from './components/dashboard/PredictionEngineSection';
import { GreenZonePlannerSection } from './components/dashboard/GreenZonePlannerSection';
import { WhatIfSimulator } from './components/dashboard/WhatIfSimulator';
import { QdrantRagSection } from './components/dashboard/QdrantRagSection';
import { AiUrbanPlannerChat } from './components/dashboard/AiUrbanPlannerChat';
import { AnalyticsSection } from './components/dashboard/AnalyticsSection';
import { SdgImpactSection } from './components/dashboard/SdgImpactSection';
import { ReportGeneratorModal } from './components/dashboard/ReportGeneratorModal';
import { AuthModal } from './components/dashboard/AuthModal';
import { ApiKeyModal } from './components/dashboard/ApiKeyModal';
import { CustomCursor } from './components/dashboard/CustomCursor';
import { Flame, Shield, Globe, Terminal, Heart, ExternalLink, Activity, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  useEffect(() => {
    // Verify guest or user session on load
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
        // Fallback demo user
        setCurrentUser({ name: "Dr. Elena Vance", role: "Lead Climate Analyst" });
      });
    }
  }, []);

  const scrollToId = (id) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-glow selection:text-black relative overflow-x-hidden">
      {/* Custom Cyberpunk Cursor */}
      <CustomCursor />

      {/* Capsule Glass Floating Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenApiKeys={() => setIsApiKeyOpen(true)}
        currentUser={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreMap={() => scrollToId('gis-map')}
        onAskAi={() => scrollToId('ai-planner')}
      />

      {/* Interactive GIS Spatial Heat Map Section */}
      <section id="gis-map" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-thermal-orange/40 text-thermal-orange font-mono text-xs">
            <Flame className="w-3.5 h-3.5" />
            <span>REAL-TIME SPATIAL GIS SYSTEM</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            INTERACTIVE <span className="text-thermal-orange">URBAN HEAT ISLAND MAP</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Inspect satellite-derived Land Surface Temperature (LST) and NDVI vegetation index overlays across global urban centers.
          </p>
        </div>

        <InteractiveGisMap />
      </section>

      {/* 3D Microclimate Urban Simulation Studio Section */}
      <section id="3d-studio" className="py-16 px-4 max-w-7xl mx-auto">
        <Urban3dStudio />
      </section>

      {/* Data Pipeline Architecture */}
      <DataPipelineSection />

      {/* ML Heat Prediction Engine */}
      <PredictionEngineSection />

      {/* Green Zone Ranked Infrastructure Recommendations */}
      <GreenZonePlannerSection />

      {/* "What If?" Interactive Cooling Simulator */}
      <WhatIfSimulator />

      {/* Qdrant Vector Memory & RAG Architecture */}
      <QdrantRagSection />

      {/* AI Urban Planner Interactive Chatbot */}
      <AiUrbanPlannerChat />

      {/* Microclimate Analytics Dashboard */}
      <AnalyticsSection />

      {/* UN SDGs & PDF Report Generator */}
      <SdgImpactSection onGenerateReport={() => setIsReportOpen(true)} />

      {/* Futuristic Command Core Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-display font-bold text-sm text-white flex items-center gap-1.5 justify-center md:justify-start">
              HEATSCAPE <span className="text-cyan-glow">// CLIMATE INTELLIGENCE</span>
            </div>
            <div className="text-[11px] text-slate-500">
              "Predict the heat. Understand the city. Design the solution."
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button onClick={() => scrollToId('hero')} className="hover:text-cyan-glow transition">HOME</button>
            <button onClick={() => scrollToId('gis-map')} className="hover:text-cyan-glow transition">LIVE MAP</button>
            <button onClick={() => scrollToId('3d-studio')} className="hover:text-cyan-glow transition">3D STUDIO</button>
            <button onClick={() => scrollToId('prediction')} className="hover:text-cyan-glow transition">PREDICTION</button>
            <button onClick={() => scrollToId('green-zones')} className="hover:text-cyan-glow transition">GREEN ZONES</button>
            <button onClick={() => scrollToId('ai-planner')} className="hover:text-cyan-glow transition">AI PLANNER</button>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span>HEATSCAPE AI © 2026 // NASA CLIMATE TECH</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      <ReportGeneratorModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetCity="New Delhi"
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
      />
    </div>
  );
}

