import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EarthGlobe } from '../3d/EarthGlobe';
import {
  Flame,
  Shield,
  Cpu,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Globe,
  Radio,
  Layers,
  Activity
} from 'lucide-react';

const CITY_OVERVIEW_METRICS = {
  delhi: { canopyDeficit: "-34.2%", popAtRisk: "4.2M", maxCooling: "-6.4°C" },
  phoenix: { canopyDeficit: "-41.5%", popAtRisk: "2.8M", maxCooling: "-7.2°C" },
  tokyo: { canopyDeficit: "-22.1%", popAtRisk: "5.1M", maxCooling: "-5.8°C" },
  mumbai: { canopyDeficit: "-31.8%", popAtRisk: "6.5M", maxCooling: "-6.2°C" },
  london: { canopyDeficit: "-16.4%", popAtRisk: "1.4M", maxCooling: "-4.5°C" },
  singapore: { canopyDeficit: "-12.8%", popAtRisk: "1.8M", maxCooling: "-4.8°C" },
  nyc: { canopyDeficit: "-28.4%", popAtRisk: "3.4M", maxCooling: "-5.9°C" },
  cairo: { canopyDeficit: "-44.8%", popAtRisk: "5.8M", maxCooling: "-7.5°C" }
};

export function OverviewView({
  activeCity,
  setActiveCity,
  onNavigate,
  onOpenReport
}) {
  const currentMetrics = CITY_OVERVIEW_METRICS[activeCity?.id] || CITY_OVERVIEW_METRICS.delhi;

  return (
    <div className="space-y-6 font-mono text-slate-100 pb-12">
      {/* Top Banner & Quick Telemetry Metrics */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-glow/30 bg-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-glow/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-glow text-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>NASA CLIMATE INTELLIGENCE COMMAND CENTER ({activeCity?.name ? activeCity.name.toUpperCase() : 'NEW DELHI'})</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              URBAN HEAT ISLAND <span className="text-cyan-glow">EXECUTIVE OVERVIEW</span>
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Multi-satellite Landsat-8 and Sentinel-2 telemetry paired with XGBoost spatial regressions predicting Land Surface Temperatures (LST) and evaluating green cooling interventions for {activeCity?.name || 'New Delhi'}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('3d-studio')}
              className="px-5 py-3 rounded-xl bg-cyan-glow text-black font-bold text-xs hover:bg-cyan-400 transition flex items-center gap-2 shadow-lg shadow-cyan-glow/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>OPEN 3D STUDIO</span>
            </button>
            <button
              onClick={() => onNavigate('gis-map')}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 font-bold text-xs transition flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-thermal-orange" />
              <span>VIEW GIS MAP</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">TARGET CITY LST</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-thermal-orange">{activeCity.temp || "45.2°C"}</span>
              <TrendingUp className="w-4 h-4 text-thermal-orange" />
            </div>
            <span className="text-[10px] text-slate-500">{activeCity.name || "New Delhi"} Baseline</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">CANOPY DEFICIT</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-400">{currentMetrics.canopyDeficit}</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-[10px] text-slate-500">NDVI &lt; 0.15 Hotspots</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">MAX COOLING DELTA</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-emerald-400">{currentMetrics.maxCooling}</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500">Via Tree Canopy & Roofs</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">POPULATION AT RISK</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-cyan-glow">{currentMetrics.popAtRisk}</span>
              <Globe className="w-4 h-4 text-cyan-glow" />
            </div>
            <span className="text-[10px] text-slate-500">Urban Heat Vulnerability</span>
          </div>
        </div>
      </div>

      {/* Grid Section: 3D Earth Preview & Quick Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Earth Orbit Preview */}
        <div className="lg:col-span-7 h-[440px] rounded-2xl glass-panel-glow border border-cyan-glow/30 overflow-hidden relative bg-slate-950 shadow-2xl">
          <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <EarthGlobe activeCity={activeCity} onSelectCity={(c) => setActiveCity(c)} />
            <OrbitControls enableZoom={false} autoRotate={false} />
          </Canvas>

          <div className="absolute top-4 left-4 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-glow animate-pulse" />
            <span className="text-slate-300">INTERACTIVE SATELLITE ORBIT VIEW</span>
          </div>

          <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl text-[11px] backdrop-blur-md flex items-center gap-2">
            <span className="text-slate-400">ACTIVE MEGACITY:</span>
            <span className="text-cyan-glow font-bold">{activeCity.name} ({activeCity.temp})</span>
          </div>
        </div>

        {/* Right Column: Module Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onClick={() => onNavigate('3d-studio')}
            className="glass-panel p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer group bg-slate-950/70"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-glow font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-glow group-hover:rotate-12 transition" />
                <span>3D ARCHITECTURAL STUDIO</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-slate-400 text-xs">
              Procedural glass skyscrapers, window grids, solar roof arrays, tree planting, and thermal infrared camera mode.
            </p>
          </div>

          <div
            onClick={() => onNavigate('gis-map')}
            className="glass-panel p-4 rounded-xl border border-thermal-orange/30 hover:border-thermal-orange/60 transition cursor-pointer group bg-slate-950/70"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-thermal-orange font-bold text-sm">
                <Flame className="w-4 h-4 text-thermal-orange group-hover:rotate-12 transition" />
                <span>GIS SPATIAL HEAT MAP</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-slate-400 text-xs">
              Interactive Leaflet satellite map with LST heat raster overlays, NDVI vegetation index layers, and zone popups.
            </p>
          </div>

          <div
            onClick={() => onNavigate('ai-planner')}
            className="glass-panel p-4 rounded-xl border border-purple-500/30 hover:border-purple-400 transition cursor-pointer group bg-slate-950/70"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Cpu className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                <span>AI RAG CLIMATE ASSISTANT</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-slate-400 text-xs">
              Grounded Qdrant vector memory embeddings & Google Gemini AI providing structural urban planning recommendations.
            </p>
          </div>

          <button
            onClick={onOpenReport}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-slate-950" />
            <span>GENERATE PDF CLIMATE ASSESSMENT REPORT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
