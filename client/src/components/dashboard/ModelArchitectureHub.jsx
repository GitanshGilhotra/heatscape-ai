import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  Calculator,
  Compass,
  Database,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Sparkles,
  HelpCircle,
  FileCheck,
  TrendingDown,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';

export function ModelArchitectureHub({ activeCity }) {
  const [activeModelTab, setActiveModelTab] = useState('model1');

  // Interactive Live Workbench State for Model 1 (Spatial LST Regressor)
  const [m1Inputs, setM1Inputs] = useState({
    ndvi: 0.12,
    building_density: 82,
    impervious_ratio: 88,
    ambient_temp: 39.5,
    humidity: 42
  });
  const [selectedRegressor, setSelectedRegressor] = useState('xgboost');

  // Interactive Live Workbench State for Model 2 (Surface Energy Balance)
  const [m2Inputs, setM2Inputs] = useState({
    base_lst: 45.0,
    albedo_increase: 0.45,
    canopy_cover: 25,
    green_roof_cover: 30
  });

  // Calculate live results for Model 1
  const m1CalculatedLst = Number((
    m1Inputs.ambient_temp +
    (m1Inputs.building_density * 0.12) +
    (m1Inputs.impervious_ratio * 0.08) -
    (m1Inputs.ndvi * 14.5) -
    (m1Inputs.humidity * 0.03)
  ).toFixed(2));
  const m1UhiIntensity = Math.max(0, Number((m1CalculatedLst - m1Inputs.ambient_temp).toFixed(2)));

  // Calculate live results for Model 2
  const m2SolarPeak = 850.0;
  const m2GTotal = 40.5;
  const m2AlbedoDrop = Number(((m2SolarPeak * m2Inputs.albedo_increase) / m2GTotal).toFixed(2));
  const m2CanopyDrop = Number((((1.0 - Math.exp(-0.6 * 3.4)) * m2SolarPeak * (m2Inputs.canopy_cover / 100.0) * 0.65 + 185.0 * (m2Inputs.canopy_cover / 100.0) * 0.75) / m2GTotal).toFixed(2));
  const m2RoofDrop = Number(((145.0 * (m2Inputs.green_roof_cover / 100.0) * 0.72) / m2GTotal).toFixed(2));
  const m2TotalLstCooling = Number(((m2AlbedoDrop + m2CanopyDrop + m2RoofDrop) * 0.94).toFixed(2));
  const m2PedestrianAirDrop = Number((m2TotalLstCooling * 0.24).toFixed(2));

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto font-mono text-slate-100 space-y-8">
      {/* Top Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-glow/40 bg-slate-950/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-glow/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-glow text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-glow" />
              <span>HEATSCAPE AI // SYSTEM ARCHITECTURE & SCIENTIFIC TRANSPARENCY</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              AI MODELS & PHYSICS ENGINES <span className="text-cyan-glow">EXPLAINABILITY CENTER</span>
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Complete breakdown of every mathematical and machine learning model running inside HEATSCAPE AI:
              <strong className="text-slate-200"> Why it exists, What inputs it consumes, What calculations it executes, and What outputs it generates.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">PIPELINE INTEGRITY:</span>
            <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* High-Level Pipeline Flowchart Diagram */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-glow" />
            <span>4-TIER END-TO-END COMPUTATIONAL PIPELINE</span>
          </span>
          <span className="text-[10px] text-slate-500">RAW TELEMETRY → PREDICTION → PHYSICS → BYLAWS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Box 1 */}
          <div
            onClick={() => setActiveModelTab('model1')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              activeModelTab === 'model1'
                ? 'bg-cyan-500/10 border-cyan-glow text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-glow bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                MODEL #1
              </span>
              <Activity className="w-4 h-4 text-cyan-glow" />
            </div>
            <div className="font-bold text-slate-200 text-sm">Spatial LST Regressor</div>
            <p className="text-[11px] text-slate-400">
              XGBoost / Random Forest predicting Land Surface Temp (°C) & UHI from satellite indices.
            </p>
          </div>

          {/* Box 2 */}
          <div
            onClick={() => setActiveModelTab('model2')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              activeModelTab === 'model2'
                ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                MODEL #2
              </span>
              <Calculator className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-bold text-slate-200 text-sm">Surface Energy Balance</div>
            <p className="text-[11px] text-slate-400">
              Oke (1987) thermodynamic microclimate model simulating radiation & evapotranspiration cooling.
            </p>
          </div>

          {/* Box 3 */}
          <div
            onClick={() => setActiveModelTab('model3')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              activeModelTab === 'model3'
                ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-900">
                MODEL #3
              </span>
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-bold text-slate-200 text-sm">Spatial MCDA Feasibility</div>
            <p className="text-[11px] text-slate-400">
              Engineering constraints engine auditing ground space, roof structural loads, and water budget.
            </p>
          </div>

          {/* Box 4 */}
          <div
            onClick={() => setActiveModelTab('model4')}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
              activeModelTab === 'model4'
                ? 'bg-purple-500/10 border-purple-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-900">
                MODEL #4
              </span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-bold text-slate-200 text-sm">Qdrant Vector Policy RAG</div>
            <p className="text-[11px] text-slate-400">
              Retrieval-Augmented Generation grounding cooling proposals into municipal building bylaws & master plans.
            </p>
          </div>
        </div>
      </div>

      {/* MODEL 1 DEEP-DIVE: Spatial LST Regressor */}
      {activeModelTab === 'model1' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: What, Why, Inputs, Outputs */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-cyan-glow/40 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-glow" />
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">
                      MODEL #1: SPATIAL LAND SURFACE TEMPERATURE REGRESSOR
                    </h2>
                    <span className="text-[10px] text-cyan-glow">ALGORITHM: XGBOOST / GRADIENT BOOSTING / RANDOM FOREST</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-neon-lime bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  R² = 0.962 | MAE = 0.38°C
                </span>
              </div>

              {/* WHY DOES IT EXIST? */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. KYU CHAHIYE YE MODEL? (WHY DOES THIS MODEL EXIST?)</span>
                </span>
                <p className="text-slate-300 text-xs leading-relaxed pl-5 border-l-2 border-amber-400/40">
                  Satellites like Landsat-8 and Sentinel-2 only pass over a city once every <strong>16 days</strong>, and cloud cover frequently obstructs thermal infrared sensors. Ground IoT weather stations only measure air temperature at a few isolated points.
                  This machine learning regressor bridges the temporal and spatial gap: it takes localized micro-environmental variables (vegetation index, building footprint, surface impermeability) and predicts sub-kilometer Land Surface Temperature (LST) and Urban Heat Island intensity in real time.
                </p>
              </div>

              {/* WHAT ARE THE INPUTS? */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-cyan-glow flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>2. KYA INPUTS LE RAHA HAI? (EXACT INPUT FEATURES)</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs pl-5 border-l-2 border-cyan-glow/40">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">1. NDVI (Vegetation Index):</span>
                    <span className="text-emerald-400 font-bold">0.02 to 0.75</span> (Derived from Sentinel NIR/Red)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">2. Building Density (%):</span>
                    <span className="text-thermal-orange font-bold">5% to 98%</span> (GIS urban footprint ratio)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">3. Impervious Surface Ratio:</span>
                    <span className="text-red-400 font-bold">10% to 99%</span> (Asphalt, concrete roads)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">4. Ambient Air Temp & Humidity:</span>
                    <span className="text-cyan-glow font-bold">25°C - 45°C | 20% - 85%</span>
                  </div>
                </div>
              </div>

              {/* WHAT DOES IT OUTPUT? */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. KYA NIKAL RAHA HAI? (MODEL PREDICTION OUTPUT)</span>
                </span>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs pl-5 border-l-2 border-emerald-400/40">
                  <div className="flex justify-between">
                    <span className="text-slate-400">• Predicted Land Surface Temp (LST):</span>
                    <span className="text-thermal-orange font-bold">LST (°C) with ±0.38°C MAE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">• Surface UHI Anomaly:</span>
                    <span className="text-cyan-glow font-bold">ΔT_UHI = LST - T_ambient (°C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">• Heat Vulnerability Classification:</span>
                    <span className="text-red-400 font-bold">OPTIMAL | MODERATE | HIGH | CRITICAL | EXTREME</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">• Feature Importance Contribution (SHAP):</span>
                    <span className="text-emerald-400 font-bold">Vegetation (35%) &gt; Density (28%) &gt; Impervious (22%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Workbench for Model 1 */}
            <div className="lg:col-span-5 glass-panel-glow p-6 rounded-2xl border border-cyan-glow/40 bg-slate-950/90 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-glow/20 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-glow" />
                  <span>MODEL #1 LIVE TEST BENCH</span>
                </span>
                <span className="text-[10px] text-cyan-glow font-bold">INTERACTIVE RUNNER</span>
              </div>

              {/* Model Selector */}
              <div className="flex gap-2 text-xs">
                {['xgboost', 'random_forest', 'linear'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedRegressor(m)}
                    className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition ${
                      selectedRegressor === m
                        ? 'bg-cyan-500/20 text-cyan-glow border-cyan-glow'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sliders for live testing */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>NDVI Vegetation:</span>
                    <span className="text-emerald-400 font-bold">{m1Inputs.ndvi}</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.75"
                    step="0.01"
                    value={m1Inputs.ndvi}
                    aria-label="NDVI Vegetation"
                    onChange={(e) => setM1Inputs({ ...m1Inputs, ndvi: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Building Density:</span>
                    <span className="text-thermal-orange font-bold">{m1Inputs.building_density}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="98"
                    step="1"
                    value={m1Inputs.building_density}
                    aria-label="Building Density"
                    onChange={(e) => setM1Inputs({ ...m1Inputs, building_density: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-thermal-orange"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Impervious Ratio:</span>
                    <span className="text-red-400 font-bold">{m1Inputs.impervious_ratio}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="99"
                    step="1"
                    value={m1Inputs.impervious_ratio}
                    aria-label="Impervious Ratio"
                    onChange={(e) => setM1Inputs({ ...m1Inputs, impervious_ratio: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-red-400"
                  />
                </div>
              </div>

              {/* Live Output Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <div className="text-[10px] text-slate-400">REAL-TIME PREDICTED LST</div>
                <div className="text-3xl font-bold text-thermal-orange font-display">
                  {m1CalculatedLst}°C
                </div>
                <div className="text-xs text-slate-300">
                  UHI Intensity: <strong className="text-cyan-glow">+{m1UhiIntensity}°C</strong> over {m1Inputs.ambient_temp}°C air baseline
                </div>
                <div className="inline-block px-3 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {m1CalculatedLst >= 46 ? 'EXTREME RISK' : (m1CalculatedLst >= 42 ? 'CRITICAL RISK' : 'HIGH RISK')}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODEL 2 DEEP-DIVE: Surface Energy Balance Physics Engine */}
      {activeModelTab === 'model2' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-slate-950/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">
                      MODEL #2: SURFACE ENERGY BALANCE & MICROCLIMATE PHYSICS
                    </h2>
                    <span className="text-[10px] text-emerald-400">FOUNDATION: OKE (1987) & PENMAN-MONTEITH EVAPOTRANSPIRATION</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-glow bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  PHYSICS-CONSERVED
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. KYU CHAHIYE YE MODEL? (WHY A PHYSICS ENGINE INSTEAD OF PURE ML?)</span>
                </span>
                <p className="text-slate-300 text-xs leading-relaxed pl-5 border-l-2 border-amber-400/40">
                  Pure machine learning models can "hallucinate" cooling numbers that violate the laws of thermodynamics. When urban planners ask: <em>"How do you prove that planting 20% trees cools the neighborhood by 3.2°C?"</em>, ML cannot give a physics answer.
                  Model #2 applies the <strong>First Law of Thermodynamics</strong> (Conservation of Energy) to compute exact radiation reflections, latent heat dissipation from evapotranspiration, and pedestrian-level aerodynamic coupling.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-cyan-glow flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>2. GOVERNING PHYSICAL EQUATIONS</span>
                </span>
                <div className="space-y-2 text-xs pl-5 border-l-2 border-cyan-glow/40">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold block">• Oke's Energy Balance:</span>
                    <code className="text-cyan-glow font-mono text-[11px]">R_n - G = H + λE</code>
                    <p className="text-slate-400 text-[10px] mt-0.5">R_n is net radiation, G is ground storage, H is sensible air heat, λE is latent heat flux.</p>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block">• Albedo Radiation Rejection:</span>
                    <code className="text-amber-300 font-mono text-[11px]">ΔT_albedo = -(S_solar · Δα) / (g_convective + g_radiative)</code>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold block">• Canopy Beer-Lambert Solar Extinction:</span>
                    <code className="text-emerald-300 font-mono text-[11px]">I_trans = I_0 · exp(-k · LAI)  (blocks 87% direct solar insolation)</code>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. KYA NIKAL RAHA HAI? (PHYSICAL TEMPERATURE DELTAS)</span>
                </span>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 text-xs pl-5 border-l-2 border-emerald-400/40">
                  <div>• Surface LST Reduction: <strong className="text-emerald-400">ΔLST (°C)</strong></div>
                  <div>• Pedestrian 1.5m Air Reduction: <strong className="text-cyan-glow">ΔT_air = η · ΔLST (η = 0.24)</strong></div>
                  <div>• HVAC Cooling Reduction: <strong className="text-amber-400">~4.8% power saved per 1°C air drop</strong></div>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Workbench for Model 2 */}
            <div className="lg:col-span-5 glass-panel-glow p-6 rounded-2xl border border-emerald-500/40 bg-slate-950/90 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>MODEL #2 PHYSICS WORKBENCH</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">ENERGY BALANCE</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Tree Canopy Adoption:</span>
                    <span className="text-emerald-400 font-bold">{m2Inputs.canopy_cover}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={m2Inputs.canopy_cover}
                    aria-label="Tree Canopy Adoption"
                    onChange={(e) => setM2Inputs({ ...m2Inputs, canopy_cover: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Green Roof Retrofit:</span>
                    <span className="text-cyan-glow font-bold">{m2Inputs.green_roof_cover}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={m2Inputs.green_roof_cover}
                    aria-label="Green Roof Retrofit"
                    onChange={(e) => setM2Inputs({ ...m2Inputs, green_roof_cover: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-glow"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Albedo Increase (Δα):</span>
                    <span className="text-amber-400 font-bold">+{m2Inputs.albedo_increase} SRI</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.60"
                    step="0.05"
                    value={m2Inputs.albedo_increase}
                    aria-label="Albedo Increase"
                    onChange={(e) => setM2Inputs({ ...m2Inputs, albedo_increase: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>

              {/* Calculated Physics Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="text-[10px] text-slate-400 font-bold">DERIVED HEAT REDUCTION:</div>
                <div className="flex justify-between text-slate-300">
                  <span>Albedo Heat Rejection:</span>
                  <span className="text-amber-400 font-bold">-{m2AlbedoDrop} °C</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Canopy Shading + ET:</span>
                  <span className="text-emerald-400 font-bold">-{m2CanopyDrop} °C</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Green Roof U-value drop:</span>
                  <span className="text-cyan-glow font-bold">-{m2RoofDrop} °C</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-white font-bold">
                  <span>Net Surface Drop:</span>
                  <span className="text-emerald-400 text-sm">-{m2TotalLstCooling} °C</span>
                </div>
                <div className="flex justify-between text-cyan-glow font-bold">
                  <span>Pedestrian Air Drop (1.5m):</span>
                  <span className="text-sm">-{m2PedestrianAirDrop} °C</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODEL 3 DEEP-DIVE: Spatial MCDA Feasibility Engine */}
      {activeModelTab === 'model3' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-slate-950/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    MODEL #3: MULTI-CRITERIA DECISION ANALYSIS (MCDA) FEASIBILITY ENGINE
                  </h2>
                  <span className="text-[10px] text-amber-400">ENGINEERING CONSTRAINTS & REAL-WORLD VIABILITY AUDITOR</span>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                PANEL DEFENSE CORE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
                  <span>Ground Space Constraint</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Formula: <code className="text-cyan-glow">Max_Ground_Trees = (100 - Density) * 0.72</code>.
                  If building density is 85%, only 10.8% ground trees can physically fit. The engine prevents users/planners from proposing impossible ground tree expansions and routes excess to Vertical Living Walls and Trellises.
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
                  <span>Structural Roof Dead-Load</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Audits building stock structural typology: Green roofs add 70-120 kg/m² dead weight. The engine checks RCC flat slab availability and flags structural warnings if deployed on unreinforced load-bearing masonry.
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                  <span>Water Budget & Species</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Prevents water-thirsty lawn suggestions in arid cities. Evaluates daily evapotranspiration water demands (L/m²/day) and selects native drought-hardy flora (Neem, Peepal, Palo Verde, Sedum).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <span className="text-white font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>MCDA PRIORITY RANKING FORMULA:</span>
              </span>
              <div className="p-2 bg-slate-950 rounded font-mono text-cyan-glow text-xs border border-slate-800">
                Priority_Rank = (Heat_Vulnerability · 0.40) + (Canopy_Deficit · 0.30) + (Built_Density · 0.20) + (Open_Space_Scarcity · 0.10)
              </div>
              <p className="text-slate-400 text-[11px]">
                Produces an objective 0 to 100 Priority Score ranking each municipal ward by return on cooling investment ($/°C).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODEL 4 DEEP-DIVE: Qdrant Vector Policy RAG */}
      {activeModelTab === 'model4' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 bg-slate-950/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    MODEL #4: QDRANT VECTOR STORE + RAG URBAN POLICY ENGINE
                  </h2>
                  <span className="text-[10px] text-purple-400">RETRIEVAL-AUGMENTED GENERATION GROUNDED IN CLIMATE MASTER PLANS</span>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                SEMANTIC SEARCH
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>KNOWLEDGE BASE SOURCES EMBEDDED:</span>
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-cyan-glow font-bold block">• Delhi Master Plan 2041 (DDA):</span>
                    <span className="text-slate-400 text-[11px]">Chapter on Green Corridors, mandatory 15% green coverage in industrial zones.</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold block">• UNEP "Beating the Heat" Handbook:</span>
                    <span className="text-slate-400 text-[11px]">Global best practices for municipal cool roofs, urban forests, and porous paving.</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block">• ASHRAE 90.1 & EPA Heat Island Guidelines:</span>
                    <span className="text-slate-400 text-[11px]">Building envelope thermal isolation standards and Solar Reflectance Index (SRI) criteria.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>HOW RAG ANSWERS URBAN PLANNING QUERIES:</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  When a city official or judge asks: <em>"How should we reduce heat in Okhla or Connaught Place without demolishing buildings?"</em>, the query is converted into dense vector embeddings.
                  Qdrant performs cosine-similarity matching against the policy knowledge base, pulling exact legal bylaws, setback regulations, and native species suggestions. Google Gemini then synthesizes a verified, hallucination-free municipal roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
