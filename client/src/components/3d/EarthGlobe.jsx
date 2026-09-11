import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

const CITY_NODES = [
  { id: "delhi", name: "New Delhi", country: "India", lat: 28.6139, lng: 77.2090, temp: "45.2°C", color: "#ff2a5f", severity: "EXTREME" },
  { id: "phoenix", name: "Phoenix", country: "USA", lat: 33.4484, lng: -112.0740, temp: "49.1°C", color: "#ff5500", severity: "EXTREME" },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, temp: "40.8°C", color: "#ffaa00", severity: "HIGH" },
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, temp: "43.6°C", color: "#ff2a5f", severity: "CRITICAL" },
  { id: "london", name: "London", country: "UK", lat: 51.5074, lng: -0.1278, temp: "33.2°C", color: "#0088ff", severity: "MODERATE" },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, temp: "36.5°C", color: "#00ff88", severity: "OPTIMAL" },
  { id: "nyc", name: "New York", country: "USA", lat: 40.7128, lng: -74.0060, temp: "38.9°C", color: "#ffaa00", severity: "HIGH" },
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, temp: "44.1°C", color: "#ff2a5f", severity: "CRITICAL" },
  { id: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, temp: "34.5°C", color: "#ffaa00", severity: "HIGH" },
  { id: "berlin", name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, temp: "32.8°C", color: "#0088ff", severity: "MODERATE" },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, temp: "35.1°C", color: "#0088ff", severity: "MODERATE" },
  { id: "saopaulo", name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, temp: "37.4°C", color: "#ffaa00", severity: "HIGH" },
  { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, temp: "47.8°C", color: "#ff2a5f", severity: "EXTREME" },
  { id: "la", name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, temp: "39.5°C", color: "#ffaa00", severity: "HIGH" },
  { id: "beijing", name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, temp: "41.2°C", color: "#ff2a5f", severity: "CRITICAL" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, temp: "42.0°C", color: "#ff2a5f", severity: "CRITICAL" },
  { id: "seoul", name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, temp: "38.2°C", color: "#ffaa00", severity: "HIGH" },
  { id: "rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, temp: "37.8°C", color: "#ffaa00", severity: "HIGH" },
  { id: "madrid", name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, temp: "39.1°C", color: "#ffaa00", severity: "HIGH" },
  { id: "lagos", name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, temp: "39.8°C", color: "#ff2a5f", severity: "CRITICAL" },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, temp: "32.5°C", color: "#0088ff", severity: "MODERATE" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, temp: "36.8°C", color: "#ffaa00", severity: "HIGH" },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, temp: "40.5°C", color: "#ff2a5f", severity: "CRITICAL" },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, temp: "48.5°C", color: "#ff2a5f", severity: "EXTREME" }
];

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate realistic solid Earth texture with continents, blue oceans, green terrain & golden night lights
function createSolidEarthTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Solid Vibrant Ocean Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, "#0a3a6b");
  oceanGrad.addColorStop(0.5, "#0e4b85");
  oceanGrad.addColorStop(1, "#0a3a6b");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Continent Shading
  ctx.fillStyle = "#2d7a3a";
  ctx.strokeStyle = "#389447";

  const drawContinent = (xPct, yPct, rX, rY) => {
    ctx.beginPath();
    ctx.ellipse(xPct * width, yPct * height, rX * width, rY * height, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // North America
  drawContinent(0.22, 0.30, 0.13, 0.18);
  drawContinent(0.18, 0.25, 0.09, 0.12);
  drawContinent(0.27, 0.22, 0.08, 0.10);

  // South America
  drawContinent(0.32, 0.68, 0.07, 0.19);
  drawContinent(0.35, 0.60, 0.06, 0.12);

  // Europe
  drawContinent(0.52, 0.24, 0.07, 0.10);

  // Africa
  drawContinent(0.53, 0.54, 0.09, 0.20);
  drawContinent(0.56, 0.46, 0.08, 0.14);

  // Asia & Eurasia
  drawContinent(0.68, 0.26, 0.17, 0.16);
  drawContinent(0.78, 0.32, 0.12, 0.14);
  drawContinent(0.72, 0.44, 0.08, 0.10); // India

  // Australia
  drawContinent(0.85, 0.72, 0.08, 0.11);

  // Polar Ice Caps
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height * 0.07);
  ctx.fillRect(0, height * 0.93, width, height * 0.07);

  // Golden Urban Night Lights Clusters
  ctx.fillStyle = "#ffcc00";
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    if (y > height * 0.15 && y < height * 0.85) {
      ctx.globalAlpha = 0.4 + Math.random() * 0.6;
      ctx.fillRect(x, y, 1.6, 1.6);
    }
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function EarthGlobe({ activeCity, onSelectCity }) {
  const earthGroupRef = useRef();
  const satelliteRef = useRef();
  const cloudSphereRef = useRef();
  const particlesRef = useRef();

  const earthTexture = useMemo(() => createSolidEarthTexture(), []);

  // Selected city object
  const currentCityObj = useMemo(() => {
    if (!activeCity) return CITY_NODES[0];
    const match = CITY_NODES.find(c => c.name.toLowerCase() === activeCity.name.toLowerCase() || c.id === activeCity.id);
    if (match) return match;
    const lat = activeCity.center ? activeCity.center[0] : 28.6139;
    const lng = activeCity.center ? activeCity.center[1] : 77.2090;
    return {
      id: activeCity.id || 'custom',
      name: activeCity.name,
      country: activeCity.country || 'Global',
      lat,
      lng,
      temp: activeCity.temp || '38.5°C',
      color: '#00f3ff',
      severity: 'SELECTED'
    };
  }, [activeCity]);

  // Target rotation angle when activeCity changes
  const targetRotationY = useMemo(() => {
    if (!currentCityObj) return 0;
    // Map longitude to Y rotation: -lng converted to radians
    return (-currentCityObj.lng - 90) * (Math.PI / 180);
  }, [currentCityObj]);

  const targetRotationX = useMemo(() => {
    if (!currentCityObj) return 0;
    return (currentCityObj.lat) * (Math.PI / 180) * 0.4;
  }, [currentCityObj]);

  // Space Particle positions
  const particlePositions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.6 + Math.random() * 1.5;
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock, mouse }) => {
    const elapsedTime = clock.getElapsedTime();

    if (earthGroupRef.current) {
      // Smoothly lerp rotation towards active selected city
      earthGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        earthGroupRef.current.rotation.y,
        targetRotationY + (elapsedTime * 0.04),
        0.05
      );
      earthGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        earthGroupRef.current.rotation.x,
        targetRotationX + (mouse.y * 0.08),
        0.05
      );
    }

    if (cloudSphereRef.current) {
      cloudSphereRef.current.rotation.y = elapsedTime * 0.08;
    }

    if (satelliteRef.current) {
      const orbitAngle = elapsedTime * 0.35;
      const r = 3.2;
      satelliteRef.current.position.x = Math.cos(orbitAngle) * r;
      satelliteRef.current.position.z = Math.sin(orbitAngle) * r;
      satelliteRef.current.position.y = Math.sin(orbitAngle * 1.4) * 1.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = -elapsedTime * 0.02;
    }
  });

  const selectedPos = useMemo(() => {
    return latLngToVector3(currentCityObj.lat, currentCityObj.lng, 2.04);
  }, [currentCityObj]);

  const selectedPillarEnd = useMemo(() => {
    const normal = selectedPos.clone().normalize();
    return selectedPos.clone().add(normal.clone().multiplyScalar(0.6));
  }, [selectedPos]);

  return (
    <group ref={earthGroupRef}>
      {/* 100% Solid Photorealistic Earth Globe */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.5}
          metalness={0.1}
          emissive="#001122"
          emissiveIntensity={0.25}
          transparent={false}
          opacity={1.0}
        />
      </Sphere>

      {/* Atmospheric Cloud Swirl Layer */}
      <Sphere ref={cloudSphereRef} args={[2.035, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          roughness={1.0}
        />
      </Sphere>

      {/* Atmospheric Blue Rayleigh Glow Halo */}
      <Sphere args={[2.14, 32, 32]}>
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Render Cities Hotspot Nodes */}
      {CITY_NODES.map((city, idx) => {
        const pos = latLngToVector3(city.lat, city.lng, 2.04);
        const normal = pos.clone().normalize();
        const pillarEnd = pos.clone().add(normal.clone().multiplyScalar(0.42));
        const isSelected = currentCityObj.name.toLowerCase() === city.name.toLowerCase();

        return (
          <group key={idx}>
            <mesh
              position={pos}
              onClick={() => onSelectCity && onSelectCity(city)}
            >
              <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
              <meshBasicMaterial color={isSelected ? "#ffffff" : city.color} />
            </mesh>

            <Line
              points={[pos, pillarEnd]}
              color={isSelected ? "#00f3ff" : city.color}
              lineWidth={isSelected ? 4 : 2}
              transparent
              opacity={0.85}
            />
          </group>
        );
      })}

      {/* HIGHLIGHT & POINT OUT ACTIVE SELECTED CITY */}
      <group>
        {/* Pulsing Target Ring Pin */}
        <mesh position={selectedPos}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#00f3ff" />
        </mesh>

        {/* Dynamic 3D Volumetric Thermal Laser Pointer */}
        <Line
          points={[selectedPos, selectedPillarEnd]}
          color="#ff2a5f"
          lineWidth={4.5}
          transparent
          opacity={0.95}
        />

        <mesh position={selectedPillarEnd}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshBasicMaterial color="#ff2a5f" />
        </mesh>

        {/* Floating HTML HUD Target Badge */}
        <Html position={selectedPillarEnd} center distanceFactor={6.5}>
          <div className="bg-slate-950/95 border-2 border-cyan-glow p-3 rounded-2xl text-xs font-mono w-52 shadow-2xl backdrop-blur-xl pointer-events-none transform -translate-y-2">
            <div className="flex items-center justify-between border-b border-cyan-glow/30 pb-1.5 mb-1.5">
              <span className="font-bold text-cyan-glow flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>TARGET CITY</span>
              </span>
              <span className="text-[9px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-amber-400 font-bold">
                {currentCityObj.country}
              </span>
            </div>

            <div className="text-white font-bold text-sm mb-1">{currentCityObj.name}</div>
            
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Baseline Temp:</span>
              <span className="text-thermal-orange font-bold">{currentCityObj.temp}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>UHI Risk Level:</span>
              <span className="text-heat-red font-bold">{currentCityObj.severity || 'CRITICAL'}</span>
            </div>
          </div>
        </Html>
      </group>

      {/* Orbiting NASA Climate Satellite */}
      <group ref={satelliteRef}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.09, 0.09]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-0.22, 0, 0]}>
          <boxGeometry args={[0.24, 0.01, 0.14]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.24, 0.01, 0.14]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.65, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.45, 1.3, 16, 1, true]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Floating Space Particle Field */}
      <Points ref={particlesRef} positions={particlePositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.55}
        />
      </Points>
    </group>
  );
}
