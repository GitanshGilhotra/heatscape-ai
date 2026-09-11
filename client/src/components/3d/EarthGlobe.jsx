import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

// Megacity Hotspot Nodes mapped to 3D Sphere Coordinates across all continents
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

// Generate realistic Earth texture (Oceans, Continents, Night City Lights, Polar Ice)
function createPhotorealisticEarthTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep Ocean Base Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, "#081d38");
  oceanGrad.addColorStop(0.5, "#0b2b52");
  oceanGrad.addColorStop(1, "#081d38");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Helper to draw continent landmass blobs
  ctx.fillStyle = "#1e4d2b"; // Landmass Green/Olive
  ctx.strokeStyle = "#2e6f3e";

  const drawLand = (xPct, yPct, rX, rY) => {
    ctx.beginPath();
    ctx.ellipse(xPct * width, yPct * height, rX * width, rY * height, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // North America
  drawLand(0.22, 0.32, 0.12, 0.18);
  drawLand(0.18, 0.28, 0.08, 0.12);
  drawLand(0.26, 0.24, 0.09, 0.10);

  // South America
  drawLand(0.32, 0.68, 0.07, 0.18);
  drawLand(0.34, 0.62, 0.06, 0.12);

  // Europe
  drawLand(0.52, 0.26, 0.06, 0.10);

  // Africa
  drawLand(0.53, 0.54, 0.09, 0.19);
  drawLand(0.56, 0.48, 0.08, 0.14);

  // Eurasia / Asia
  drawLand(0.68, 0.28, 0.16, 0.16);
  drawLand(0.78, 0.35, 0.12, 0.14);
  drawLand(0.72, 0.45, 0.08, 0.10); // India

  // Australia
  drawLand(0.85, 0.72, 0.08, 0.11);

  // Antarctica & Arctic Ice Caps
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(0, 0, width, height * 0.08); // North Pole
  ctx.fillRect(0, height * 0.92, width, height * 0.08); // South Pole

  // Golden Night City Lights Dots
  ctx.fillStyle = "#fbbf24";
  const numLights = 1400;
  for (let i = 0; i < numLights; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    // Concentrate lights on land lat/lng ranges
    if ((y > height * 0.18 && y < height * 0.82) && (x < width * 0.4 || x > width * 0.48)) {
      ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      ctx.fillRect(x, y, 1.2, 1.2);
    }
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function EarthGlobe({ onSelectCity }) {
  const earthGroupRef = useRef();
  const satelliteRef = useRef();
  const cloudSphereRef = useRef();
  const particlesRef = useRef();
  const [hoveredCity, setHoveredCity] = React.useState(null);

  // Procedural Photorealistic Earth Canvas Texture
  const earthTexture = useMemo(() => createPhotorealisticEarthTexture(), []);

  // Orbital particle field
  const particleCount = 700;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
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
      earthGroupRef.current.rotation.y = elapsedTime * 0.08;
      earthGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05 + (mouse.y * 0.12);
    }

    if (cloudSphereRef.current) {
      cloudSphereRef.current.rotation.y = elapsedTime * 0.12;
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

  return (
    <group ref={earthGroupRef}>
      {/* Photorealistic 3D Earth Globe with Continents & Night Lights */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.4}
          metalness={0.3}
          emissive="#041226"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Atmospheric Cloud Swirl Layer */}
      <Sphere ref={cloudSphereRef} args={[2.035, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.14}
          wireframe={false}
          roughness={1.0}
        />
      </Sphere>

      {/* Atmospheric Rayleigh Blue Halo Glow Shroud */}
      <Sphere args={[2.14, 32, 32]}>
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Megacity Hotspot Nodes with 3D Volumetric Thermal Pillars */}
      {CITY_NODES.map((city, idx) => {
        const pos = latLngToVector3(city.lat, city.lng, 2.04);
        const normal = pos.clone().normalize();
        const pillarEnd = pos.clone().add(normal.clone().multiplyScalar(0.48));
        const isHovered = hoveredCity?.id === city.id;

        return (
          <group key={idx}>
            {/* Hotspot City Marker Pin */}
            <mesh
              position={pos}
              onClick={() => onSelectCity && onSelectCity(city)}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredCity(city);
              }}
              onPointerOut={() => setHoveredCity(null)}
            >
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshBasicMaterial color={isHovered ? "#ffffff" : city.color} />
            </mesh>

            {/* 3D Volumetric Thermal Laser Pillar */}
            <Line
              points={[pos, pillarEnd]}
              color={city.color}
              lineWidth={isHovered ? 4 : 2.5}
              transparent
              opacity={0.9}
            />

            {/* Pillar Top Glowing Orb */}
            <mesh position={pillarEnd}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={city.color} />
            </mesh>

            {/* Hover HTML Info Badge */}
            {isHovered && (
              <Html position={pillarEnd} center distanceFactor={7}>
                <div className="bg-slate-950/95 border border-cyan-glow p-2.5 rounded-xl text-xs font-mono w-40 shadow-2xl backdrop-blur-xl pointer-events-none">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                    <span className="font-bold text-white">{city.name}</span>
                    <span className="text-[10px] text-cyan-glow font-bold">{city.country}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Baseline LST:</span>
                    <span className="text-thermal-orange font-bold">{city.temp}</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

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
