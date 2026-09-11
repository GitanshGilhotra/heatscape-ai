import React, { useState, useEffect } from 'react';
import { Flame, Shield, Globe, Cpu, BarChart2, MessageSquare, User, Activity, Key, Sparkles } from 'lucide-react';

export function Navbar({ onOpenAuth, onOpenApiKeys, currentUser, activeSection, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: Globe },
    { id: 'gis-map', label: 'LIVE MAP', icon: Flame },
    { id: '3d-studio', label: '3D STUDIO', icon: Sparkles },
    { id: 'prediction', label: 'PREDICTION', icon: Cpu },
    { id: 'green-zones', label: 'GREEN ZONES', icon: Shield },
    { id: 'ai-planner', label: 'AI PLANNER', icon: MessageSquare },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart2 }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-[500] flex justify-center px-4 transition-all duration-300">
      <div className={`flex items-center justify-between transition-all duration-300 px-5 py-2.5 rounded-full border ${
        scrolled 
          ? 'glass-panel-glow border-cyan-glow/40 shadow-2xl scale-95 w-full max-w-5xl bg-[#0d111a]/90' 
          : 'glass-panel border-white/10 w-full max-w-6xl'
      }`}>
        {/* Brand Logo & Subtitle */}
        <div 
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-thermal-orange via-heat-red to-cyan-glow flex items-center justify-center p-0.5 shadow-cyan-glow group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#07090e] rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-cyan-glow group-hover:rotate-12 transition" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-wider text-white flex items-center gap-1.5">
              HEATSCAPE <span className="text-cyan-glow font-mono text-xs">// AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              URBAN CLIMATE INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 shadow-cyan-glow font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-glow' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live System Status Badges & Auth */}
        <div className="flex items-center gap-2">
          {/* API Keys Environment Manager Button */}
          <button
            onClick={onOpenApiKeys}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono transition"
            title="Configure Environment API Keys"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">.ENV API</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-glow/20 to-atmospheric-blue/20 hover:from-cyan-glow/30 hover:to-atmospheric-blue/30 border border-cyan-glow/50 text-cyan-glow text-xs font-mono transition shadow-cyan-glow"
          >
            <User className="w-3.5 h-3.5 text-cyan-glow" />
            <span className="truncate max-w-[100px]">{currentUser ? currentUser.name : 'LOGIN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

