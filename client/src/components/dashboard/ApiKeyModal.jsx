import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertTriangle, Save, RefreshCw, X, Server, Globe, Cpu, ShieldCheck } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose }) {
  const [keys, setKeys] = useState({
    openWeather: '',
    gemini: '',
    nasa: '',
    apiUrl: 'http://localhost:5000',
    mlUrl: 'http://localhost:8000'
  });

  const [status, setStatus] = useState({
    express: 'checking',
    mlService: 'checking',
    weatherApi: 'fallback',
    geminiAi: 'fallback'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load from env / localStorage
    const envWeather = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
    const envGemini = import.meta.env.VITE_GEMINI_API_KEY || '';
    const envNasa = import.meta.env.VITE_NASA_API_KEY || '';
    const envApi = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const envMl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';

    const localWeather = localStorage.getItem('heatscape_key_openweather') || envWeather;
    const localGemini = localStorage.getItem('heatscape_key_gemini') || envGemini;
    const localNasa = localStorage.getItem('heatscape_key_nasa') || envNasa;

    setKeys({
      openWeather: localWeather,
      gemini: localGemini,
      nasa: localNasa,
      apiUrl: envApi,
      mlUrl: envMl
    });

    checkServices(envApi, envMl, localWeather, localGemini);
  }, [isOpen]);

  const checkServices = async (api, ml, weatherKey, geminiKey) => {
    // Check Express Server
    try {
      const res = await fetch(`${api}/api/system-status`);
      if (res.ok) {
        const json = await res.json();
        setStatus(prev => ({
          ...prev,
          express: 'online',
          weatherApi: json.services?.openWeatherApi?.configured ? 'live' : (weatherKey ? 'live' : 'fallback'),
          geminiAi: json.services?.geminiAi?.configured ? 'live' : (geminiKey ? 'live' : 'fallback')
        }));
      } else {
        setStatus(prev => ({ ...prev, express: 'offline' }));
      }
    } catch {
      setStatus(prev => ({ ...prev, express: 'offline' }));
    }

    // Check ML FastAPI Service
    try {
      const res = await fetch(`${ml}/health`);
      if (res.ok) {
        setStatus(prev => ({ ...prev, mlService: 'online' }));
      } else {
        setStatus(prev => ({ ...prev, mlService: 'offline' }));
      }
    } catch {
      setStatus(prev => ({ ...prev, mlService: 'offline' }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('heatscape_key_openweather', keys.openWeather);
    localStorage.setItem('heatscape_key_gemini', keys.gemini);
    localStorage.setItem('heatscape_key_nasa', keys.nasa);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    checkServices(keys.apiUrl, keys.mlUrl, keys.openWeather, keys.gemini);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-glow/30 p-6 rounded-2xl max-w-xl w-full shadow-2xl space-y-6 font-mono relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-glow font-bold text-lg">
            <Key className="w-5 h-5 text-cyan-glow" />
            <span>SYSTEM & API ENVIRONMENT CONFIGURATION</span>
          </div>
          <p className="text-slate-400 text-xs">
            Configure external API endpoints and security keys. The system includes built-in offline fallbacks for all services.
          </p>
        </div>

        {/* Live Service Connection Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex flex-col items-center p-2 rounded bg-slate-900">
            <Server className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-400">Node Express</span>
            <span className={`font-bold text-[11px] ${status.express === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {status.express.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded bg-slate-900">
            <Cpu className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[10px] text-slate-400">FastAPI ML</span>
            <span className={`font-bold text-[11px] ${status.mlService === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {status.mlService.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded bg-slate-900">
            <Globe className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400">OpenWeather</span>
            <span className={`font-bold text-[11px] ${status.weatherApi === 'live' ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {status.weatherApi.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded bg-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-400">Gemini AI</span>
            <span className={`font-bold text-[11px] ${status.geminiAi === 'live' ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {status.geminiAi.toUpperCase()}
            </span>
          </div>
        </div>

        {/* API Keys Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
              <span>GOOGLE GEMINI API KEY</span>
              <span className="text-[10px] text-slate-500">Live AI Urban Planner RAG</span>
            </label>
            <input
              type="password"
              value={keys.gemini}
              onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-cyan-glow focus:outline-none text-cyan-glow"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
              <span>OPENWEATHERMAP API KEY</span>
              <span className="text-[10px] text-slate-500">Live Climate Telemetry</span>
            </label>
            <input
              type="password"
              value={keys.openWeather}
              onChange={(e) => setKeys({ ...keys, openWeather: e.target.value })}
              placeholder="b1b15..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-cyan-glow focus:outline-none text-amber-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
              <span>NASA EARTH LANDSAT API KEY</span>
              <span className="text-[10px] text-slate-500">Thermal Satellite Rasters</span>
            </label>
            <input
              type="password"
              value={keys.nasa}
              onChange={(e) => setKeys({ ...keys, nasa: e.target.value })}
              placeholder="DEMO_KEY or custom NASA API Key"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-cyan-glow focus:outline-none text-emerald-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => checkServices(keys.apiUrl, keys.mlUrl, keys.openWeather, keys.gemini)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>TEST ENDPOINTS</span>
          </button>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-emerald-400 text-xs flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> SAVED!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-glow hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-cyan-glow/20"
            >
              <Save className="w-4 h-4" />
              <span>SAVE ENVIRONMENT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
