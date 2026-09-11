// Comprehensive Global Cities Database & Dynamic City Generator for HEATSCAPE AI

export const GLOBAL_CITIES_LIST = [
  { id: "delhi", name: "New Delhi", country: "India", center: [28.6139, 77.2090], zoom: 12, temp: "45.2°C", uhi: "CRITICAL" },
  { id: "phoenix", name: "Phoenix", country: "USA", center: [33.4484, -112.0740], zoom: 12, temp: "49.1°C", uhi: "EXTREME" },
  { id: "tokyo", name: "Tokyo", country: "Japan", center: [35.6762, 139.6503], zoom: 12, temp: "40.8°C", uhi: "HIGH" },
  { id: "mumbai", name: "Mumbai", country: "India", center: [19.0760, 72.8777], zoom: 12, temp: "43.6°C", uhi: "CRITICAL" },
  { id: "london", name: "London", country: "UK", center: [51.5074, -0.1278], zoom: 12, temp: "33.2°C", uhi: "MODERATE" },
  { id: "singapore", name: "Singapore", country: "Singapore", center: [1.3521, 103.8198], zoom: 12, temp: "36.5°C", uhi: "MODERATE" },
  { id: "nyc", name: "New York", country: "USA", center: [40.7128, -74.0060], zoom: 12, temp: "38.9°C", uhi: "HIGH" },
  { id: "cairo", name: "Cairo", country: "Egypt", center: [30.0444, 31.2357], zoom: 12, temp: "44.1°C", uhi: "CRITICAL" },
  { id: "paris", name: "Paris", country: "France", center: [48.8566, 2.3522], zoom: 12, temp: "34.5°C", uhi: "HIGH" },
  { id: "berlin", name: "Berlin", country: "Germany", center: [52.5200, 13.4050], zoom: 12, temp: "32.8°C", uhi: "MODERATE" },
  { id: "sydney", name: "Sydney", country: "Australia", center: [-33.8688, 151.2093], zoom: 12, temp: "35.1°C", uhi: "MODERATE" },
  { id: "saopaulo", name: "São Paulo", country: "Brazil", center: [-23.5505, -46.6333], zoom: 12, temp: "37.4°C", uhi: "HIGH" },
  { id: "dubai", name: "Dubai", country: "UAE", center: [25.2048, 55.2708], zoom: 12, temp: "47.8°C", uhi: "EXTREME" },
  { id: "la", name: "Los Angeles", country: "USA", center: [34.0522, -118.2437], zoom: 12, temp: "39.5°C", uhi: "HIGH" },
  { id: "toronto", name: "Toronto", country: "Canada", center: [43.6532, -79.3832], zoom: 12, temp: "31.4°C", uhi: "MODERATE" },
  { id: "beijing", name: "Beijing", country: "China", center: [39.9042, 116.4074], zoom: 12, temp: "41.2°C", uhi: "CRITICAL" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", center: [13.7563, 100.5018], zoom: 12, temp: "42.0°C", uhi: "CRITICAL" },
  { id: "seoul", name: "Seoul", country: "South Korea", center: [37.5665, 126.9780], zoom: 12, temp: "38.2°C", uhi: "HIGH" },
  { id: "rome", name: "Rome", country: "Italy", center: [41.9028, 12.4964], zoom: 12, temp: "37.8°C", uhi: "HIGH" },
  { id: "madrid", name: "Madrid", country: "Spain", center: [40.4168, -3.7038], zoom: 12, temp: "39.1°C", uhi: "HIGH" },
  { id: "moscow", name: "Moscow", country: "Russia", center: [55.7558, 37.6173], zoom: 12, temp: "30.2°C", uhi: "MODERATE" },
  { id: "chicago", name: "Chicago", country: "USA", center: [41.8781, -87.6298], zoom: 12, temp: "36.2°C", uhi: "HIGH" },
  { id: "mexicocity", name: "Mexico City", country: "Mexico", center: [19.4326, -99.1332], zoom: 12, temp: "35.8°C", uhi: "MODERATE" },
  { id: "buenosaires", name: "Buenos Aires", country: "Argentina", center: [-34.6037, -58.3816], zoom: 12, temp: "34.2°C", uhi: "MODERATE" },
  { id: "lagos", name: "Lagos", country: "Nigeria", center: [6.5244, 3.3792], zoom: 12, temp: "39.8°C", uhi: "CRITICAL" },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", center: [-26.2041, 28.0473], zoom: 12, temp: "32.5°C", uhi: "MODERATE" },
  { id: "nairobi", name: "Nairobi", country: "Kenya", center: [-1.2921, 36.8219], zoom: 12, temp: "31.0°C", uhi: "OPTIMAL" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", center: [41.0082, 28.9784], zoom: 12, temp: "36.8°C", uhi: "HIGH" },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", center: [-6.2088, 106.8456], zoom: 12, temp: "40.5°C", uhi: "CRITICAL" },
  { id: "manila", name: "Manila", country: "Philippines", center: [14.5995, 120.9842], zoom: 12, temp: "41.0°C", uhi: "CRITICAL" },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", center: [24.7136, 46.6753], zoom: 12, temp: "48.5°C", uhi: "EXTREME" },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", center: [52.3676, 4.9041], zoom: 12, temp: "30.8°C", uhi: "OPTIMAL" },
  { id: "vienna", name: "Vienna", country: "Austria", center: [48.2082, 16.3738], zoom: 12, temp: "32.1°C", uhi: "MODERATE" },
  { id: "vancouver", name: "Vancouver", country: "Canada", center: [49.2827, -123.1207], zoom: 12, temp: "29.5°C", uhi: "OPTIMAL" },
  { id: "santiago", name: "Santiago", country: "Chile", center: [-33.4489, -70.6693], zoom: 12, temp: "36.0°C", uhi: "HIGH" }
];

// Generate dynamic GIS heat zones around ANY city center coordinates
export function generateCityZones(lat, lng, cityName, baseTempNum) {
  const t = baseTempNum || 38.0;
  return [
    {
      id: `${cityName.slice(0, 3).toUpperCase()}-Z01`,
      name: `${cityName} Commercial Core`,
      lat: lat + 0.015,
      lng: lng + 0.012,
      lst: Number((t + 3.2).toFixed(1)),
      ndvi: 0.07,
      builtUp: 95,
      risk: t + 3.2 >= 44 ? "CRITICAL" : "HIGH",
      priority: "#1",
      action: "High-Albedo Cool Roofs & Canopy Trees"
    },
    {
      id: `${cityName.slice(0, 3).toUpperCase()}-Z02`,
      name: `${cityName} Industrial Corridor`,
      lat: lat - 0.018,
      lng: lng + 0.025,
      lst: Number((t + 4.8).toFixed(1)),
      ndvi: 0.04,
      builtUp: 98,
      risk: t + 4.8 >= 46 ? "EXTREME" : "CRITICAL",
      priority: "#2",
      action: "Solar Reflective Pavements & Misting Canopies"
    },
    {
      id: `${cityName.slice(0, 3).toUpperCase()}-Z03`,
      name: `${cityName} Urban Residential Grid`,
      lat: lat + 0.022,
      lng: lng - 0.019,
      lst: Number((t - 0.8).toFixed(1)),
      ndvi: 0.19,
      builtUp: 72,
      risk: "MODERATE",
      priority: "#3",
      action: "Permeable Pavement & Street Trees"
    },
    {
      id: `${cityName.slice(0, 3).toUpperCase()}-Z04`,
      name: `${cityName} Park & River Preserve`,
      lat: lat - 0.025,
      lng: lng - 0.022,
      lst: Number((t - 8.5).toFixed(1)),
      ndvi: 0.74,
      builtUp: 10,
      risk: "OPTIMAL",
      priority: "#12",
      action: "Biodiversity Conservation & Buffer Zone"
    }
  ];
}

// Create a custom full city object for ANY search query worldwide
export function createDynamicCityObject(cityName, lat = null, lng = null, country = "Global") {
  const cleanName = cityName.trim();
  const existing = GLOBAL_CITIES_LIST.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
  
  if (existing) {
    const tempNum = parseFloat(existing.temp);
    return {
      ...existing,
      zones: generateCityZones(existing.center[0], existing.center[1], existing.name, tempNum)
    };
  }

  // Calculate deterministic lat/lng fallback if not provided
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  
  const finalLat = lat !== null ? lat : Number((15 + (Math.abs(hash % 45))).toFixed(4));
  const finalLng = lng !== null ? lng : Number((-120 + (Math.abs(hash * 3 % 240))).toFixed(4));
  const calcTemp = Number((32 + (Math.abs(hash % 15))).toFixed(1));

  const newId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');

  return {
    id: newId,
    name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    country,
    center: [finalLat, finalLng],
    zoom: 12,
    temp: `${calcTemp}°C`,
    uhi: calcTemp >= 44 ? "CRITICAL" : (calcTemp >= 38 ? "HIGH" : "MODERATE"),
    zones: generateCityZones(finalLat, finalLng, cleanName, calcTemp)
  };
}
