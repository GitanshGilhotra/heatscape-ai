import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Thermometer, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FuturisticMiniCity } from '../3d/FuturisticMiniCity';

export function WhatIfSimulator() {
  const [baseLst, setBaseLst] = useState(44.5);
  const [treeCover, setTreeCover] = useState(25);
  const [greenRoof, setGreenRoof] = useState(20);
  const [reflectiveSurface, setReflectiveSurface] = useState(35);

  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/py-api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_lst: baseLst,
          tree_cover_pct: treeCover,
          green_roof_pct: greenRoof,
          reflective_surface_pct: reflectiveSurface
        })
      });
      const json = await res.json();
      if (json.success) {
        setSimulation(json.data);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      // Client fallback computation
      const treeDrop = (treeCover / 100.0) * 4.2;
      const roofDrop = (greenRoof / 100.0) * 2.8;
      const reflDrop = (reflectiveSurface / 100.0) * 2.1;
      const totalDrop = (treeDrop + roofDrop + reflDrop) * 0.92;
      const projected = Math.max(24.0, baseLst - totalDrop);
      const delta = baseLst - projected;

      let rating = "MODERATE";
      if (delta >= 5.0) rating = "TRANSFORMATIVE";
      else if (delta >= 3.0) rating = "SUBSTANTIAL";
      else if (delta >= 1.0) rating = "MODERATE";
      else rating = "MINIMAL";

      setSimulation({
        base_lst: baseLst.toFixed(1),
        projected_lst: projected.toFixed(1),
        cooling_delta: delta.toFixed(1),
        tree_impact: treeDrop.toFixed(1),
        green_roof_impact: roofDrop.toFixed(1),
        reflective_impact: reflDrop.toFixed(1),
        efficacy_rating: rating
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [baseLst, treeCover, greenRoof, reflectiveSurface]);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-glow/30 text-cyan-glow font-mono text-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-glow" />
          <span>INTERACTIVE COOLING SCENARIO SIMULATOR</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          WHAT IF WE <span className="text-cyan-glow">COOL THE CITY?</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Adjust green infrastructure adoption ratios to simulate microclimate thermal reduction in real time.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-glow" />
              DEPLOYMENT PARAMETERS
            </h3>
            <span className="text-xs font-mono text-slate-400">SIMULATION MODE</span>
          </div>

          {/* Base LST Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Baseline Land Surface Temp:</span>
              <span className="text-thermal-orange font-bold">{baseLst}°C</span>
            </div>
            <input
              type="range"
              min="35"
              max="50"
              step="0.5"
              value={baseLst}
              aria-label="Baseline Land Surface Temp"
              onChange={(e) => setBaseLst(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-thermal-orange"
            />
          </div>

          {/* Tree Canopy % */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Tree Canopy Expansion:</span>
              <span className="text-neon-lime font-bold">{treeCover}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={treeCover}
              aria-label="Tree Canopy Expansion"
              onChange={(e) => setTreeCover(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-lime"
            />
          </div>

          {/* Green Roof % */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Green Roof Retrofit Ratio:</span>
              <span className="text-cyan-glow font-bold">{greenRoof}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={greenRoof}
              aria-label="Green Roof Retrofit Ratio"
              onChange={(e) => setGreenRoof(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
          </div>

          {/* Reflective Surface % */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Reflective Cool Pavement:</span>
              <span className="text-thermal-yellow font-bold">{reflectiveSurface}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={reflectiveSurface}
              aria-label="Reflective Cool Pavement"
              onChange={(e) => setReflectiveSurface(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-thermal-yellow"
            />
          </div>
        </div>

        {/* Right Column: Projected Impact Cards & 3D Preview */}
        <div className="lg:col-span-6 space-y-4">
          
          {simulation && (
            <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-glow/40 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-glow/20 pb-3">
                <span className="font-display font-bold text-sm text-white">PROJECTED COOLING DELTA</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  simulation.efficacy_rating === 'TRANSFORMATIVE' ? 'bg-neon-lime text-black' : 'bg-cyan-glow/20 text-cyan-glow'
                }`}>
                  {simulation.efficacy_rating}
                </span>
              </div>

              {/* Temperature Comparison Box */}
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">CURRENT LST</div>
                  <div className="text-thermal-orange font-bold text-lg mt-0.5">{simulation.base_lst}°C</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">PROJECTED LST</div>
                  <div className="text-neon-lime font-bold text-lg mt-0.5">{simulation.projected_lst}°C</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-cyan-glow/40 shadow-cyan-glow">
                  <div className="text-cyan-glow text-[10px] font-bold">NET DROP</div>
                  <div className="text-cyan-glow font-bold text-lg mt-0.5">-{simulation.cooling_delta}°C</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 font-mono text-xs text-slate-300 pt-2">
                <div className="flex justify-between">
                  <span>Tree Canopy Cooling Impact:</span>
                  <span className="text-neon-lime font-bold">-{simulation.tree_impact} °C</span>
                </div>
                <div className="flex justify-between">
                  <span>Green Roof Cooling Impact:</span>
                  <span className="text-cyan-glow font-bold">-{simulation.green_roof_impact} °C</span>
                </div>
                <div className="flex justify-between">
                  <span>Reflective Pavement Impact:</span>
                  <span className="text-thermal-yellow font-bold">-{simulation.reflective_impact} °C</span>
                </div>
              </div>
            </div>
          )}

          {/* 3D Mini-City Real-Time Cooling View */}
          <div className="h-[220px] w-full rounded-2xl glass-panel border border-slate-800 overflow-hidden relative">
            <div className="absolute top-2 left-2 z-20 font-mono text-[10px] text-neon-lime bg-slate-900/80 px-2 py-0.5 rounded border border-neon-lime/30">
              ● REAL-TIME 3D COOLED URBAN MODEL
            </div>
            <Canvas camera={{ position: [0, 4, 6], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
              <FuturisticMiniCity greenSimulationActive={true} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
            </Canvas>
          </div>

        </div>

      </div>
    </section>
  );
}
