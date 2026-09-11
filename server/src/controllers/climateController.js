// Climate Data Controller for HEATSCAPE AI

const CITIES = [
  {
    id: "delhi",
    name: "New Delhi",
    country: "India",
    coordinates: [28.6139, 77.2090],
    avgLST: 42.8,
    maxLST: 47.4,
    avgNDVI: 0.14,
    builtUpDensity: 78.5,
    uhiSeverity: "CRITICAL",
    heatHotspots: 142,
    populationAtRisk: "4.2M",
    zones: [
      { id: "DEL-Z01", name: "Connaught Place Hub", lat: 28.6315, lng: 77.2167, lst: 45.2, ndvi: 0.09, builtUp: 92, risk: "CRITICAL", priority: 1, recommended: "Green Roofs & Reflective Pavement" },
      { id: "DEL-Z02", name: "Okhla Industrial Estate", lat: 28.5355, lng: 77.2711, lst: 47.4, ndvi: 0.05, builtUp: 96, risk: "EXTREME", priority: 2, recommended: "Industrial Urban Canopy & Cool Roofs" },
      { id: "DEL-Z03", name: "Dwarka Sector 21", lat: 28.5522, lng: 77.0583, lst: 41.8, ndvi: 0.18, builtUp: 74, risk: "HIGH", priority: 3, recommended: "Permeable Pavement & Street Trees" },
      { id: "DEL-Z04", name: "Ridge Forest Zone", lat: 28.6012, lng: 77.1850, lst: 34.1, ndvi: 0.62, builtUp: 12, risk: "LOW", priority: 15, recommended: "Conservation Buffer Zone" },
      { id: "DEL-Z05", name: "Chandni Chowk Dense Grid", lat: 28.6506, lng: 77.2303, lst: 46.8, ndvi: 0.04, builtUp: 98, risk: "CRITICAL", priority: 4, recommended: "Shade Canopies & Micro-Parks" }
    ]
  },
  {
    id: "phoenix",
    name: "Phoenix",
    country: "USA",
    coordinates: [33.4484, -112.0740],
    avgLST: 44.5,
    maxLST: 49.1,
    avgNDVI: 0.11,
    builtUpDensity: 82.1,
    uhiSeverity: "EXTREME",
    heatHotspots: 189,
    populationAtRisk: "2.8M",
    zones: [
      { id: "PHX-Z01", name: "Downtown Sky Harbor Strip", lat: 33.4352, lng: -112.0078, lst: 49.1, ndvi: 0.03, builtUp: 95, risk: "EXTREME", priority: 1, recommended: "High-Albedo Reflective Coatings" },
      { id: "PHX-Z02", name: "Tempe Industrial Sector", lat: 33.4147, lng: -111.9093, lst: 46.3, ndvi: 0.08, builtUp: 88, risk: "CRITICAL", priority: 2, recommended: "Desert Canopy & Solar Shading" },
      { id: "PHX-Z03", name: "Papago Park Preserve", lat: 33.4568, lng: -111.9472, lst: 37.2, ndvi: 0.28, builtUp: 22, risk: "MODERATE", priority: 10, recommended: "Native Xeriscaping Expansion" }
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    coordinates: [35.6762, 139.6503],
    avgLST: 36.2,
    maxLST: 40.8,
    avgNDVI: 0.22,
    builtUpDensity: 85.0,
    uhiSeverity: "HIGH",
    heatHotspots: 98,
    populationAtRisk: "5.1M",
    zones: [
      { id: "TYO-Z01", name: "Shinjuku Station Core", lat: 35.6895, lng: 139.7004, lst: 40.8, ndvi: 0.07, builtUp: 97, risk: "CRITICAL", priority: 1, recommended: "Vertical Green Walls & Sky Gardens" },
      { id: "TYO-Z02", name: "Marunouchi Business District", lat: 35.6812, lng: 139.7671, lst: 38.4, ndvi: 0.15, builtUp: 91, risk: "HIGH", priority: 2, recommended: "Cool Roof Coatings & Misting Canopies" },
      { id: "TYO-Z03", name: "Yoyogi Park Sanctuary", lat: 35.6717, lng: 139.6949, lst: 30.5, ndvi: 0.68, builtUp: 8, risk: "LOW", priority: 20, recommended: "Biodiversity Preservation" }
    ]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    coordinates: [19.0760, 72.8777],
    avgLST: 39.8,
    maxLST: 43.6,
    avgNDVI: 0.16,
    builtUpDensity: 89.2,
    uhiSeverity: "CRITICAL",
    heatHotspots: 165,
    populationAtRisk: "6.5M",
    zones: [
      { id: "BOM-Z01", name: "BKC Commercial Corridor", lat: 19.0657, lng: 72.8687, lst: 43.6, ndvi: 0.08, builtUp: 94, risk: "CRITICAL", priority: 1, recommended: "Urban Forest & Permeable Surfaces" },
      { id: "BOM-Z02", name: "Dharavi Dense Zone", lat: 19.0402, lng: 72.8508, lst: 44.1, ndvi: 0.04, builtUp: 99, risk: "EXTREME", priority: 2, recommended: "Reflective Roof Paints & Cool Corridors" }
    ]
  }
];

const INTERVENTIONS_CATALOG = [
  {
    id: "tree-plantation",
    title: "Urban Forest & Canopy Plantation",
    category: "Vegetation",
    coolingImpact: "2.5 - 4.5 °C",
    costPerSqM: "$25 - $45",
    feasibilityScore: 88,
    description: "Multi-layered native tree planting along avenues, parks, and parking lot borders to maximize shade and evapotranspiration.",
    icon: "TreePine",
    bestFor: "High temperature areas with available ground space and wide road corridors."
  },
  {
    id: "green-roof",
    title: "Extensive Green Roof Systems",
    category: "Rooftop",
    coolingImpact: "1.8 - 3.2 °C",
    costPerSqM: "$60 - $110",
    feasibilityScore: 92,
    description: "Lightweight vegetation layers installed on commercial and residential flat roofs to isolate thermal mass.",
    icon: "Building2",
    bestFor: "Dense urban cores with high building density (>80%) and limited ground planting space."
  },
  {
    id: "reflective-surface",
    title: "High-Albedo Cool Pavement & Roofs",
    category: "Materials",
    coolingImpact: "1.5 - 2.8 °C",
    costPerSqM: "$12 - $22",
    feasibilityScore: 95,
    description: "Solar reflective coatings (SRI > 78) applied on asphalt streets, parking spaces, and concrete roofs.",
    icon: "Sun",
    bestFor: "Large parking structures, wide highways, and industrial metal rooftops."
  },
  {
    id: "urban-water-body",
    title: "Blue-Green Wetland & Retention Basins",
    category: "Hydro-Infrastructure",
    coolingImpact: "2.2 - 3.8 °C",
    costPerSqM: "$75 - $130",
    feasibilityScore: 79,
    description: "Constructed urban wetlands, micro-lakes, and bioswales that absorb surface runoff and reduce ambient air temperature.",
    icon: "Waves",
    bestFor: "Flood-prone low-lying urban areas and natural water drainage lines."
  }
];

const getCities = (req, res) => {
  res.json({ success: true, count: CITIES.length, data: CITIES });
};

const getCityById = (req, res) => {
  const city = CITIES.find(c => c.id === req.params.id);
  if (!city) return res.status(404).json({ success: false, message: "City not found" });
  res.json({ success: true, data: city });
};

const getInterventions = (req, res) => {
  res.json({ success: true, data: INTERVENTIONS_CATALOG });
};

const getAnalytics = (req, res) => {
  res.json({
    success: true,
    data: {
      lstVsNdviTrend: [
        { ndvi: 0.05, lst: 46.8 },
        { ndvi: 0.10, lst: 44.2 },
        { ndvi: 0.15, lst: 42.1 },
        { ndvi: 0.20, lst: 39.5 },
        { ndvi: 0.30, lst: 36.8 },
        { ndvi: 0.40, lst: 34.2 },
        { ndvi: 0.50, lst: 32.1 },
        { ndvi: 0.60, lst: 30.5 }
      ],
      heatRiskDistribution: [
        { name: "Extreme Risk (>46°C)", value: 24, fill: "#ff2a5f" },
        { name: "Critical Risk (42-46°C)", value: 42, fill: "#ff5500" },
        { name: "High Risk (38-42°C)", value: 22, fill: "#ffaa00" },
        { name: "Moderate Risk (34-38°C)", value: 8, fill: "#0088ff" },
        { name: "Optimal (<34°C)", value: 4, fill: "#00ff88" }
      ],
      coolingBenefitProjection: [
        { scenario: "Current State", temp: 44.5 },
        { scenario: "15% Canopy", temp: 42.8 },
        { scenario: "30% Canopy + Cool Roofs", temp: 40.2 },
        { scenario: "Full Green Infrastructure", temp: 37.6 }
      ]
    }
  });
};

const getLiveWeather = async (req, res) => {
  const { cityName } = req.params;
  const apiKey = process.env.OPENWEATHER_API_KEY || req.query.apiKey;

  if (apiKey && apiKey !== 'your_openweather_api_key_here') {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        return res.json({
          success: true,
          live: true,
          data: {
            city: data.name,
            temp: data.main.temp,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed,
            description: data.weather[0]?.description || "Clear",
            icon: data.weather[0]?.icon
          }
        });
      }
    } catch (err) {
      console.warn(`[OPENWEATHER] Live fetch failed, using fallback: ${err.message}`);
    }
  }

  // Built-in synthetic microclimate telemetry fallback
  const cityObj = CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase()) || CITIES[0];
  res.json({
    success: true,
    live: false,
    data: {
      city: cityObj.name,
      temp: cityObj.avgLST,
      feelsLike: cityObj.maxLST,
      humidity: Math.floor(35 + Math.random() * 25),
      pressure: 1012,
      windSpeed: Number((2.5 + Math.random() * 3).toFixed(1)),
      description: "Satellite Simulated Land Surface Temp",
      icon: "01d"
    }
  });
};

const getSystemStatus = (req, res) => {
  res.json({
    success: true,
    services: {
      expressServer: { status: "ONLINE", version: "1.0.0", port: process.env.PORT || 5000 },
      openWeatherApi: { configured: !!(process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here'), provider: "OpenWeatherMap API" },
      nasaEarthApi: { configured: !!(process.env.NASA_API_KEY && process.env.NASA_API_KEY !== 'your_nasa_api_key_here'), provider: "NASA Earth Thermal Landsat" },
      geminiAi: { configured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_google_gemini_api_key_here'), provider: "Google Gemini AI Engine" },
      vectorStore: { configured: true, provider: "Qdrant Vector Database (Simulated/Local)" }
    }
  });
};

module.exports = {
  getCities,
  getCityById,
  getInterventions,
  getAnalytics,
  getLiveWeather,
  getSystemStatus
};

