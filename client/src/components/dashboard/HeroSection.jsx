import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EarthGlobe } from '../3d/EarthGlobe';
import { FuturisticMiniCity } from '../3d/FuturisticMiniCity';
import { Flame, Shield, ArrowRight, Activity, Terminal, Radio, Sparkles, Globe, Sun, Zap } from 'lucide-react';

export function HeroSection({ onExploreMap, onAskAi }) {
  const [viewMode, setViewMode] = useState("earth"); // "earth" | "city"
  const [selectedCityInfo, setSelectedCityInfo] = useState({ name: "New Delhi", temp: "45.2°C", color: "#ff2a5f" });

  return (
    <section id="hero" className="relative min-h-screen pt-20 pb-12 flex flex-col justify-between overflow-hidden">
      {/* Top Global Telemetry Marquee Ticker Bar */}
      <div className="w-full bg-slate-950/90 border-b border-cyan-500/20 py-1.5 px-4 font-mono text-[11px] text-slate-400 overflow-hidden backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 animate-pulse">
            <span className="text-cyan-glow font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-glow" />
              <span>NASA LANDSAT-8 TELEMETRY:</span>
            </span>
            <span className="hidden sm:inline">GLOBAL MEAN TEMP ANOMALY: <strong className="text-thermal-orange">+1.48°C</strong></span>
            <span className="hidden md:inline">URBAN CANOPY DEFICIT: <strong className="text-red-400">-34.2%</strong></span>
            <span className="hidden lg:inline">CO2 CONCENTRATION: <strong className="text-cyan-glow">424.5 PPM</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME MULTI-SATELLITE SYNC</span>
          </div>
        </div>
      </div>

      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-glow/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-thermal-orange/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto pt-6">
        
        {/* Left Column: Hero Headlines & Dynamic Storytelling Copy */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Live Telemetry Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-glow/40 text-cyan-glow font-mono text-xs shadow-lg shadow-cyan-glow/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
            <span>AI-POWERED URBAN HEAT ISLAND COMMAND CORE</span>
          </div>

          {/* Main Enormous Title */}
          <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-white">
            THE CITY IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-thermal-orange via-heat-red to-cyan-glow">HOT.</span>
            <br />
            <span className="text-slate-200 text-3xl sm:text-5xl lg:text-6xl">WE PREDICT WHY.</span>
            <br />
            <span className="text-cyan-glow text-2xl sm:text-4xl lg:text-5xl font-mono">AND COOL IT.</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            NASA satellite spatial regressions meet real-time 3D microclimate simulations. Predict Land Surface Temperature spikes, optimize urban canopy allocation, and deploy AI-driven heat island interventions.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreMap}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-thermal-orange to-heat-red hover:from-thermal-orange/90 hover:to-heat-red/90 text-white font-display font-bold text-sm shadow-lg shadow-thermal-orange/20 hover:scale-105 transition duration-200"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>EXPLORE LIVE HEAT MAP</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              onClick={onAskAi}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass-panel-glow border border-cyan-glow/50 text-cyan-glow hover:bg-cyan-glow/10 font-mono font-bold text-sm shadow-cyan-glow hover:scale-105 transition duration-200"
            >
              <Sparkles className="w-4 h-4 text-cyan-glow" />
              <span>ASK AI URBAN PLANNER</span>
            </button>
          </div>

          {/* Micro Telemetry Metrics Footer */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 font-mono text-xs">
            <div className="glass-panel p-2.5 rounded-lg border-slate-800">
              <div className="text-slate-400 text-[10px]">TARGET MEGACITY</div>
              <div className="text-cyan-glow font-bold mt-0.5">{selectedCityInfo.name}</div>
            </div>
            <div className="glass-panel p-2.5 rounded-lg border-slate-800">
              <div className="text-slate-400 text-[10px]">PREDICTED LST</div>
              <div className="text-thermal-orange font-bold mt-0.5">{selectedCityInfo.temp}</div>
            </div>
            <div className="glass-panel p-2.5 rounded-lg border-slate-800">
              <div className="text-slate-400 text-[10px]">UHI RISK INDEX</div>
              <div className="text-heat-red font-bold mt-0.5">CRITICAL</div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive 3D Canvas Viewport */}
        <div className="lg:col-span-6 relative h-[480px] sm:h-[540px] w-full flex items-center justify-center">
          
          {/* 3D Mode Toggle Capsule */}
          <div className="absolute top-3 right-3 z-20 flex bg-slate-950/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 font-mono text-xs shadow-xl">
            <button
              onClick={() => setViewMode("earth")}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === "earth" ? "bg-cyan-glow text-black font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              3D EARTH ORBIT
            </button>
            <button
              onClick={() => setViewMode("city")}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === "city" ? "bg-thermal-orange text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              3D MINI-CITY
            </button>
          </div>

          {/* Dynamic Technical Overlay Badges */}
          <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-xl border border-cyan-glow/30 font-mono text-[11px] space-y-1">
            <div className="flex items-center gap-2 text-cyan-glow font-bold">
              <Terminal className="w-3.5 h-3.5" />
              SATELLITE TELEMETRY
            </div>
            <div className="text-slate-300">LAT: 28.6139° N | LON: 77.2090° E</div>
            <div className="text-slate-300">NDVI INDEX: <span className="text-neon-lime">0.14 (DEFICIT)</span></div>
            <div className="text-slate-300">SENSOR: <span className="text-cyan-glow">Landsat-8 TIRS / Sentinel-2</span></div>
          </div>

          {/* Three.js 3D Canvas */}
          <div className="w-full h-full rounded-2xl glass-panel-glow border border-cyan-glow/40 overflow-hidden shadow-2xl bg-slate-950">
            <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00f3ff" />
              
              {viewMode === "earth" ? (
                <EarthGlobe onSelectCity={(c) => setSelectedCityInfo({ name: c.name, temp: c.temp, color: c.color })} />
              ) : (
                <FuturisticMiniCity greenSimulationActive={false} />
              )}
              
              <OrbitControls enableZoom={false} autoRotate={false} />
            </Canvas>
          </div>

        </div>

      </div>

      {/* Hero Bottom Telemetry Ticker */}
      <div className="max-w-7xl mx-auto px-4 w-full mt-8">
        <div className="glass-panel p-3 rounded-xl border-slate-800/80 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></span>
            <span>SATELLITE DATA: <strong className="text-slate-200">CONNECTED (Landsat-8)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-glow"></span>
            <span>ML ENGINE: <strong className="text-slate-200">XGBoost Regressor (MAE: 0.42°C)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-thermal-orange"></span>
            <span>QDRANT VECTOR: <strong className="text-slate-200">ONLINE (1.2k Climate Embeddings)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-atmospheric-blue"></span>
            <span>GENAI CORE: <strong className="text-slate-200">ACTIVE (Gemini 1.5)</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}

