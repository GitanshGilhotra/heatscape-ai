import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layers, MapPin, Thermometer, ShieldAlert, Sparkles, Filter } from 'lucide-react';

const CITIES_DATA = [
  {
    id: "delhi",
    name: "New Delhi",
    center: [28.6139, 77.2090],
    zoom: 12,
    zones: [
      { id: "DEL-Z01", name: "Connaught Place Hub", lat: 28.6315, lng: 77.2167, lst: 45.2, ndvi: 0.09, builtUp: 92, risk: "CRITICAL", priority: "#1", action: "Green Roofs & Reflective Pavement" },
      { id: "DEL-Z02", name: "Okhla Industrial Estate", lat: 28.5355, lng: 77.2711, lst: 47.4, ndvi: 0.05, builtUp: 96, risk: "EXTREME", priority: "#2", action: "Industrial Urban Canopy & Cool Roofs" },
      { id: "DEL-Z03", name: "Dwarka Sector 21", lat: 28.5522, lng: 77.0583, lst: 41.8, ndvi: 0.18, builtUp: 74, risk: "HIGH", priority: "#3", action: "Permeable Pavement & Street Trees" },
      { id: "DEL-Z04", name: "Delhi Ridge Forest", lat: 28.6012, lng: 77.1850, lst: 34.1, ndvi: 0.62, builtUp: 12, risk: "OPTIMAL", priority: "#15", action: "Conservation Buffer Zone" },
      { id: "DEL-Z05", name: "Chandni Chowk Grid", lat: 28.6506, lng: 77.2303, lst: 46.8, ndvi: 0.04, builtUp: 98, risk: "CRITICAL", priority: "#4", action: "Shade Canopies & Micro-Parks" }
    ]
  },
  {
    id: "phoenix",
    name: "Phoenix, AZ",
    center: [33.4484, -112.0740],
    zoom: 12,
    zones: [
      { id: "PHX-Z01", name: "Downtown Sky Harbor", lat: 33.4352, lng: -112.0078, lst: 49.1, ndvi: 0.03, builtUp: 95, risk: "EXTREME", priority: "#1", action: "High-Albedo Reflective Coatings" },
      { id: "PHX-Z02", name: "Tempe Corridor", lat: 33.4147, lng: -111.9093, lst: 46.3, ndvi: 0.08, builtUp: 88, risk: "CRITICAL", priority: "#2", action: "Desert Canopy & Solar Shading" }
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    center: [35.6762, 139.6503],
    zoom: 12,
    zones: [
      { id: "TYO-Z01", name: "Shinjuku Core", lat: 35.6895, lng: 139.7004, lst: 40.8, ndvi: 0.07, builtUp: 97, risk: "CRITICAL", priority: "#1", action: "Vertical Green Walls & Sky Gardens" },
      { id: "TYO-Z02", name: "Yoyogi Park", lat: 35.6717, lng: 139.6949, lst: 30.5, ndvi: 0.68, builtUp: 8, risk: "OPTIMAL", priority: "#20", action: "Biodiversity Preservation" }
    ]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    center: [19.0760, 72.8777],
    zoom: 12,
    zones: [
      { id: "BOM-Z01", name: "BKC Commercial Corridor", lat: 19.0657, lng: 72.8687, lst: 43.6, ndvi: 0.08, builtUp: 94, risk: "CRITICAL", priority: "#1", action: "Urban Forest & Permeable Surfaces" },
      { id: "BOM-Z02", name: "Dharavi Dense Zone", lat: 19.0402, lng: 72.8508, lst: 44.1, ndvi: 0.04, builtUp: 99, risk: "EXTREME", priority: "#2", action: "Reflective Roof Paints & Cool Corridors" },
      { id: "BOM-Z03", name: "Sanjay Gandhi Park Buffer", lat: 19.2307, lng: 72.9106, lst: 31.2, ndvi: 0.74, builtUp: 10, risk: "OPTIMAL", priority: "#18", action: "Biodiversity Sanctuary Protection" }
    ]
  },
  {
    id: "london",
    name: "London",
    center: [51.5074, -0.1278],
    zoom: 12,
    zones: [
      { id: "LDN-Z01", name: "City of London Commercial", lat: 51.5127, lng: -0.0918, lst: 35.8, ndvi: 0.10, builtUp: 92, risk: "HIGH", priority: "#1", action: "Green Roofs & Misting Stations" },
      { id: "LDN-Z02", name: "Canary Wharf Financial Core", lat: 51.5054, lng: -0.0275, lst: 34.2, ndvi: 0.12, builtUp: 89, risk: "MODERATE", priority: "#2", action: "Dockside Cooling Basins" },
      { id: "LDN-Z03", name: "Hyde Park Sanctuary", lat: 51.5073, lng: -0.1657, lst: 26.4, ndvi: 0.72, builtUp: 5, risk: "OPTIMAL", priority: "#25", action: "Park Canopy Conservation" }
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    center: [1.3521, 103.8198],
    zoom: 12,
    zones: [
      { id: "SGP-Z01", name: "Marina Bay Financial Grid", lat: 1.2840, lng: 103.8510, lst: 38.5, ndvi: 0.14, builtUp: 93, risk: "HIGH", priority: "#1", action: "Sky Terraces & Vertical Greenery" },
      { id: "SGP-Z02", name: "Jurong Industrial Hub", lat: 1.3329, lng: 103.6980, lst: 37.9, ndvi: 0.11, builtUp: 90, risk: "HIGH", priority: "#2", action: "Cool Coatings & Solar Roofing" },
      { id: "SGP-Z03", name: "Gardens by the Bay Buffer", lat: 1.2816, lng: 103.8636, lst: 28.8, ndvi: 0.81, builtUp: 8, risk: "OPTIMAL", priority: "#30", action: "Tropical Canopy Preservation" }
    ]
  },
  {
    id: "nyc",
    name: "New York",
    center: [40.7128, -74.0060],
    zoom: 12,
    zones: [
      { id: "NYC-Z01", name: "Midtown Concrete Canyon", lat: 40.7549, lng: -73.9840, lst: 41.6, ndvi: 0.06, builtUp: 97, risk: "CRITICAL", priority: "#1", action: "Reflective Cool Roofs & Street Trees" },
      { id: "NYC-Z02", name: "Brooklyn Navy Yard Sector", lat: 40.7005, lng: -73.9740, lst: 39.8, ndvi: 0.09, builtUp: 91, risk: "HIGH", priority: "#2", action: "Permeable Pavements & Shading" },
      { id: "NYC-Z03", name: "Central Park Preserve", lat: 40.7829, lng: -73.9654, lst: 29.5, ndvi: 0.76, builtUp: 4, risk: "OPTIMAL", priority: "#20", action: "Urban Forest Conservation" }
    ]
  },
  {
    id: "cairo",
    name: "Cairo",
    center: [30.0444, 31.2357],
    zoom: 12,
    zones: [
      { id: "CAI-Z01", name: "Tahrir Square Urban Grid", lat: 30.0444, lng: 31.2357, lst: 46.5, ndvi: 0.03, builtUp: 96, risk: "CRITICAL", priority: "#1", action: "Desert Solar Canopies & Cool Pavement" },
      { id: "CAI-Z02", name: "Helwan Industrial Zone", lat: 29.8415, lng: 31.3008, lst: 47.9, ndvi: 0.02, builtUp: 98, risk: "EXTREME", priority: "#2", action: "Industrial Heat Radiation Isolation" },
      { id: "CAI-Z03", name: "Al-Azhar Park Oasis", lat: 30.0409, lng: 31.2652, lst: 33.8, ndvi: 0.65, builtUp: 12, risk: "MODERATE", priority: "#15", action: "Native Drought-Tolerant Canopy" }
    ]
  }
];

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
      const matched = CITIES_DATA.find(c => c.id === activeCity.id);
      if (matched) return matched;
    }
    return CITIES_DATA[0];
  });
  const [mapMode, setMapMode] = useState("dark"); // "dark" | "satellite" | "osm"
  const [activeLayer, setActiveLayer] = useState("heat"); // "heat" | "ndvi"
  const [liveTelemetry, setLiveTelemetry] = useState(null);

  // Sync with global activeCity when prop changes
  useEffect(() => {
    if (activeCity) {
      const matched = CITIES_DATA.find(c => c.id === activeCity.id);
      if (matched && matched.id !== selectedCity.id) {
        setSelectedCity(matched);
      }
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

  const handleCityChange = (cityId) => {
    const found = CITIES_DATA.find(c => c.id === cityId);
    if (found) {
      setSelectedCity(found);
      if (setActiveCity) {
        const cityTemps = {
          delhi: "45.2°C", phoenix: "49.1°C", tokyo: "40.8°C", mumbai: "43.6°C",
          london: "33.2°C", singapore: "36.5°C", nyc: "38.9°C", cairo: "44.1°C"
        };
        const cityCountries = {
          delhi: "India", phoenix: "USA", tokyo: "Japan", mumbai: "India",
          london: "UK", singapore: "Singapore", nyc: "USA", cairo: "Egypt"
        };
        setActiveCity({
          id: found.id,
          name: found.name,
          country: cityCountries[found.id] || "Global",
          temp: cityTemps[found.id] || "42.0°C"
        });
      }
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
          value={selectedCity.id}
          onChange={(e) => handleCityChange(e.target.value)}
          aria-label="Select Target City"
          className="bg-slate-900 text-cyan-glow font-bold border border-cyan-glow/40 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-glow cursor-pointer"
        >
          {CITIES_DATA.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
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
