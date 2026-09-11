import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layers, MapPin, Thermometer, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { GLOBAL_CITIES_LIST, createDynamicCityObject } from '../../data/globalCities';

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function InteractiveGisMap({ activeCity, setActiveCity, onSelectZone }) {
  const [selectedCity, setSelectedCity] = useState(() => {
    if (activeCity) {
      return createDynamicCityObject(activeCity.name, activeCity.center ? activeCity.center[0] : null, activeCity.center ? activeCity.center[1] : null, activeCity.country);
    }
    return createDynamicCityObject("New Delhi");
  });
  const [mapMode, setMapMode] = useState("dark"); // "dark" | "satellite" | "osm"
  const [activeLayer, setActiveLayer] = useState("heat"); // "heat" | "ndvi"
  const [liveTelemetry, setLiveTelemetry] = useState(null);

  // Sync with global activeCity when prop changes
  useEffect(() => {
    if (activeCity) {
      const dynamicObj = createDynamicCityObject(activeCity.name, activeCity.center ? activeCity.center[0] : null, activeCity.center ? activeCity.center[1] : null, activeCity.country);
      setSelectedCity(dynamicObj);
    }
  }, [activeCity]);

  // Fetch live weather from Express server endpoint
  useEffect(() => {
    const cleanKey = (v) => (v || '').replace(/^["']|["']$/g, '').trim();
    const weatherKey = cleanKey(localStorage.getItem('heatscape_key_openweather')) || cleanKey(import.meta.env.VITE_OPENWEATHER_API_KEY);

    fetch(`/api/weather/${encodeURIComponent(selectedCity.name)}?apiKey=${encodeURIComponent(weatherKey)}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json && json.success && json.data) {
          setLiveTelemetry({
            temp: json.data.temp,
            humidity: json.data.humidity,
            desc: json.data.description,
            isLive: json.live
          });
        }
      })
      .catch(() => setLiveTelemetry(null));
  }, [selectedCity]);

  const handleCityChange = (cityName) => {
    const dynamicObj = createDynamicCityObject(cityName);
    setSelectedCity(dynamicObj);
    if (setActiveCity) {
      setActiveCity(dynamicObj);
    }
  };

  const tileUrl = mapMode === "satellite"
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : (mapMode === "osm" 
        ? "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}");


  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden glass-panel-glow border border-cyan-glow/30 shadow-2xl">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2 items-center bg-[#0d111a]/85 backdrop-blur-md p-2 rounded-xl border border-slate-700/60 shadow-lg text-xs">
        {/* City Selector */}
        <select
          value={selectedCity.name}
          onChange={(e) => handleCityChange(e.target.value)}
          aria-label="Select Target City"
          className="bg-slate-900 text-cyan-glow font-bold border border-cyan-glow/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-glow cursor-pointer max-w-[170px] truncate"
        >
          {GLOBAL_CITIES_LIST.map(c => (
            <option key={c.id} value={c.name}>{c.name}, {c.country}</option>
          ))}
        </select>

        {/* Basemap Toggle */}
        <button
          onClick={() => setMapMode(mapMode === "dark" ? "satellite" : "dark")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-glow" />
          <span>{mapMode === "dark" ? "Dark Vector" : "Satellite"}</span>
        </button>

        {/* Overlay Filters */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveLayer("heat")}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              activeLayer === "heat" ? "bg-thermal-orange text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            LST Thermal
          </button>
          <button
            onClick={() => setActiveLayer("ndvi")}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              activeLayer === "ndvi" ? "bg-neon-lime text-black" : "text-slate-400 hover:text-white"
            }`}
          >
            NDVI Canopy
          </button>
        </div>
      </div>

      {/* Map Stats Badge Top Right */}
      <div className="absolute top-4 right-4 z-[1000] hidden md:flex items-center gap-3 bg-[#0d111a]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-glow/30 text-xs font-mono">
        <span className="flex items-center gap-1 text-slate-300">
          <Thermometer className="w-4 h-4 text-thermal-orange" />
          <span>{liveTelemetry ? "Live Weather:" : "Avg LST:"}</span>
          <strong className="text-white">
            {liveTelemetry ? `${liveTelemetry.temp}°C (${liveTelemetry.desc})` : "42.8°C"}
          </strong>
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-slate-300">
          <Sparkles className="w-4 h-4 text-neon-lime" />
          Avg NDVI: <strong className="text-white">0.14</strong>
        </span>
      </div>


      {/* Leaflet Map Engine */}
      <MapContainer
        center={selectedCity.center}
        zoom={selectedCity.zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <ChangeMapView center={selectedCity.center} zoom={selectedCity.zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &amp; Landsat-8 GIS'
          url={tileUrl}
        />

        {/* GIS Hotspot Markers */}
        {selectedCity.zones.map((z) => {
          let color = "#ff5500";
          let radius = 28;

          if (activeLayer === "heat") {
            color = z.lst >= 46.0 ? "#ff2a5f" : (z.lst >= 42.0 ? "#ff5500" : "#0088ff");
            radius = Math.max(16, (z.lst - 25) * 1.4);
          } else {
            color = z.ndvi >= 0.4 ? "#00ff88" : (z.ndvi >= 0.15 ? "#ffaa00" : "#ff2a5f");
            radius = Math.max(16, z.ndvi * 50);
          }

          return (
            <CircleMarker
              key={z.id}
              center={[z.lat, z.lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.45,
                weight: 2
              }}
              eventHandlers={{
                click: () => onSelectZone && onSelectZone(z)
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-1">
                    <span className="font-bold text-cyan-glow text-sm">{z.name}</span>
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      Priority {z.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-200 font-mono text-[11px]">
                    <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Predicted LST</div>
                      <div className="text-thermal-orange font-bold text-sm">{z.lst}°C</div>
                    </div>
                    <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">NDVI Index</div>
                      <div className="text-neon-lime font-bold text-sm">{z.ndvi}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    <strong>Recommended Action:</strong>
                    <div className="text-cyan-glow font-medium mt-0.5">{z.action}</div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
