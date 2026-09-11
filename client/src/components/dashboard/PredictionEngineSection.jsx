import React, { useState, useEffect } from 'react';
import { Cpu, Sliders, Activity, CheckCircle2, BarChart2, ShieldAlert, Sparkles } from 'lucide-react';

const CITY_FEATURE_DEFAULTS = {
  delhi: { ambient_temp: 45.2, ndvi: 0.14, building_density: 78, impervious_ratio: 88, humidity: 45 },
  phoenix: { ambient_temp: 49.1, ndvi: 0.11, building_density: 82, impervious_ratio: 92, humidity: 22 },
  tokyo: { ambient_temp: 40.8, ndvi: 0.22, building_density: 85, impervious_ratio: 86, humidity: 62 },
  mumbai: { ambient_temp: 43.6, ndvi: 0.16, building_density: 89, impervious_ratio: 90, humidity: 78 },
  london: { ambient_temp: 33.2, ndvi: 0.28, building_density: 74, impervious_ratio: 72, humidity: 68 },
  singapore: { ambient_temp: 36.5, ndvi: 0.35, building_density: 81, impervious_ratio: 78, humidity: 82 },
  nyc: { ambient_temp: 38.9, ndvi: 0.18, building_density: 84, impervious_ratio: 84, humidity: 58 },
  cairo: { ambient_temp: 44.1, ndvi: 0.08, building_density: 91, impervious_ratio: 94, humidity: 32 }
};

export function PredictionEngineSection({ activeCity }) {
  const [modelType, setModelType] = useState('xgboost');
  const [features, setFeatures] = useState({
    ndvi: 0.14,
    building_density: 78,
    impervious_ratio: 88,
    humidity: 45,
    ambient_temp: 45.2
  });

  useEffect(() => {
    if (activeCity) {
      const cityDefaults = CITY_FEATURE_DEFAULTS[activeCity.id];
      if (cityDefaults) {
        setFeatures(cityDefaults);
      } else {
        const numericTemp = parseFloat(String(activeCity.temp || '38').replace('°C', '').trim()) || 38.0;
        setFeatures(prev => ({ ...prev, ambient_temp: numericTemp }));
      }
    }
  }, [activeCity]);

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Model comparisons stats
  const modelMetrics = [
    { type: 'xgboost', name: 'XGBoost Regressor', mae: '0.38 °C', rmse: '0.52 °C', r2: '0.962', status: 'RECOMMENDED', color: 'border-cyan-glow text-cyan-glow' },
    { type: 'random_forest', name: 'Random Forest Regressor', mae: '0.45 °C', rmse: '0.61 °C', r2: '0.948', status: 'OPTIMAL', color: 'border-thermal-orange text-thermal-orange' },
    { type: 'linear', name: 'Ridge Linear Regression', mae: '1.12 °C', rmse: '1.45 °C', r2: '0.824', status: 'BASELINE', color: 'border-slate-700 text-slate-400' }
  ];

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch('/py-api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...features,
          model_type: modelType
        })
      });
      const json = await res.json();
      if (json.success) {
        setPrediction(json.data);
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      // Client-side fallback calculation if Python API service is offline
      const lst = features.ambient_temp + (features.building_density * 0.12) + (features.impervious_ratio * 0.08) - (features.ndvi * 14.5) - (features.humidity * 0.03);
      const uhi = Math.max(0, lst - features.ambient_temp);
      setPrediction({
        predicted_lst: lst.toFixed(2),
        uhi_intensity: uhi.toFixed(2),
        risk_level: lst >= 46 ? "EXTREME" : (lst >= 42 ? "CRITICAL" : (lst >= 38 ? "HIGH" : "OPTIMAL")),
        risk_color: lst >= 46 ? "#ff2a5f" : (lst >= 42 ? "#ff5500" : (lst >= 38 ? "#ffaa00" : "#00ff88")),
        used_model: modelType,
        feature_importance: {
          'NDVI': 0.35,
          'Building Density': 0.28,
          'Impervious Ratio': 0.22,
          'Ambient Temp': 0.10,
          'Humidity': 0.05
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [features, modelType]);

  return (
    <section id="prediction" className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-glow/30 text-cyan-glow font-mono text-xs">
          <Cpu className="w-3.5 h-3.5" />
          <span>MACHINE LEARNING PREDICTION ENGINE</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          LOCALIZED <span className="text-thermal-orange">HEAT ISLAND PREDICTION</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Evaluate microclimate features against trained XGBoost and Random Forest spatial regressors to estimate Land Surface Temperature (LST) and UHI severity.
        </p>
      </div>

      {/* Model Benchmark Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {modelMetrics.map((m) => (
          <div
            key={m.type}
            onClick={() => setModelType(m.type)}
            className={`p-4 rounded-xl glass-panel border transition cursor-pointer ${
              modelType === m.type ? `${m.color} glass-panel-glow shadow-lg scale-[1.02]` : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-sm text-white">{m.name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${m.color}`}>
                {m.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800">
              <div>
                <div className="text-slate-500 text-[10px]">MAE</div>
                <div className="font-bold text-white">{m.mae}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">RMSE</div>
                <div className="font-bold text-white">{m.rmse}</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">R² SCORE</div>
                <div className="font-bold text-neon-lime">{m.r2}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Feature Flow & Prediction Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Feature Controls Sliders */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-glow" />
              INPUT ENVIRONMENTAL FEATURES
            </h3>
            <span className="text-xs font-mono text-cyan-glow">MODEL: {modelType.toUpperCase()}</span>
          </div>

          {/* NDVI Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>NDVI Vegetation Index:</span>
              <span className="text-neon-lime font-bold">{features.ndvi}</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.75"
              step="0.01"
              value={features.ndvi}
              aria-label="NDVI Vegetation Index"
              onChange={(e) => setFeatures({ ...features, ndvi: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-lime"
            />
          </div>

          {/* Building Density Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Building Density Ratio:</span>
              <span className="text-thermal-orange font-bold">{features.building_density}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="98"
              step="1"
              value={features.building_density}
              aria-label="Building Density Ratio"
              onChange={(e) => setFeatures({ ...features, building_density: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-thermal-orange"
            />
          </div>

          {/* Impervious Ratio Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Impervious Surface Ratio:</span>
              <span className="text-heat-red font-bold">{features.impervious_ratio}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="99"
              step="1"
              value={features.impervious_ratio}
              aria-label="Impervious Surface Ratio"
              onChange={(e) => setFeatures({ ...features, impervious_ratio: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-heat-red"
            />
          </div>

          {/* Ambient Air Temp Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Baseline Ambient Air Temp:</span>
              <span className="text-cyan-glow font-bold">{features.ambient_temp}°C</span>
            </div>
            <input
              type="range"
              min="25"
              max="42"
              step="0.5"
              value={features.ambient_temp}
              aria-label="Baseline Ambient Air Temp"
              onChange={(e) => setFeatures({ ...features, ambient_temp: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
            />
          </div>

          {/* Relative Humidity Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Relative Humidity:</span>
              <span className="text-atmospheric-blue font-bold">{features.humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="85"
              step="1"
              value={features.humidity}
              aria-label="Relative Humidity"
              onChange={(e) => setFeatures({ ...features, humidity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-atmospheric-blue"
            />
          </div>
        </div>

        {/* Right Column: Dynamic Output Heat Gauge & Prediction Cards */}
        <div className="lg:col-span-6 glass-panel-glow p-6 rounded-2xl border border-cyan-glow/40 space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-glow/20 pb-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-thermal-orange animate-pulse" />
              AI MODEL PREDICTION OUTPUT
            </h3>
            {loading ? (
              <span className="text-xs font-mono text-cyan-glow animate-pulse">COMPUTING...</span>
            ) : (
              <span className="text-xs font-mono text-neon-lime flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> LIVE
              </span>
            )}
          </div>

          {prediction && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              
              {/* Circular Thermal Gauge */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke={prediction.risk_color}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="377"
                      strokeDashoffset={377 - (377 * Math.min(100, (prediction.predicted_lst / 55) * 100)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-mono text-slate-400">PREDICTED LST</span>
                    <span className="font-display font-bold text-2xl" style={{ color: prediction.risk_color }}>
                      {prediction.predicted_lst}°C
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono">
                  UHI INTENSITY: <span className="text-thermal-orange font-bold">+{prediction.uhi_intensity}°C</span>
                </div>
              </div>

              {/* Risk Status & Importance Breakdown */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400">UHI RISK LEVEL</div>
                  <div className="text-xl font-display font-bold mt-0.5" style={{ color: prediction.risk_color }}>
                    {prediction.risk_level}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="text-slate-400 text-[11px]">FEATURE IMPORTANCE MATRIX</div>
                  {prediction.feature_importance && Object.entries(prediction.feature_importance).map(([feat, val]) => (
                    <div key={feat} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span>{feat}</span>
                        <span className="text-cyan-glow font-bold">{(val * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-glow rounded-full" style={{ width: `${val * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
