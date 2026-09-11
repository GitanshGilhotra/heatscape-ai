import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Points, PointMaterial } from '@react-three/drei';
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

export function EarthGlobe({ onSelectCity }) {
  const earthGroupRef = useRef();
  const satelliteRef = useRef();
  const cloudSphereRef = useRef();
  const particlesRef = useRef();

  // Orbital particle field
  const particleCount = 800;
  const particlePositions = React.useMemo(() => {
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

  // Lat / Lng Grid lines
  const gridLines = React.useMemo(() => {
    const lines = [];
    const radius = 2.01;
    for (let lat = -60; lat <= 60; lat += 20) {
      const pts = [];
      for (let lng = -180; lng <= 180; lng += 10) {
        pts.push(latLngToVector3(lat, lng, radius));
      }
      lines.push(pts);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const pts = [];
      for (let lat = -80; lat <= 80; lat += 10) {
        pts.push(latLngToVector3(lat, lng, radius));
      }
      lines.push(pts);
    }
    return lines;
  }, []);

  useFrame(({ clock, mouse }) => {
    const elapsedTime = clock.getElapsedTime();

    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = elapsedTime * 0.1;
      earthGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.04) * 0.06 + (mouse.y * 0.15);
      earthGroupRef.current.rotation.z = mouse.x * 0.08;
    }

    if (cloudSphereRef.current) {
      cloudSphereRef.current.rotation.y = elapsedTime * 0.14;
    }

    if (satelliteRef.current) {
      const orbitAngle = elapsedTime * 0.35;
      const r = 3.3;
      satelliteRef.current.position.x = Math.cos(orbitAngle) * r;
      satelliteRef.current.position.z = Math.sin(orbitAngle) * r;
      satelliteRef.current.position.y = Math.sin(orbitAngle * 1.4) * 1.2;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = -elapsedTime * 0.03;
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* Central Cyberpunk Earth Core */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#060c19"
          roughness={0.3}
          metalness={0.85}
          emissive="#002244"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Cloud Layer Sphere */}
      <Sphere ref={cloudSphereRef} args={[2.03, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          wireframe={true}
        />
      </Sphere>

      {/* Atmospheric Rayleigh Glow Shroud */}
      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Lat/Long Grid Lines */}
      {gridLines.map((pts, idx) => (
        <Line key={idx} points={pts} color="#00f3ff" opacity={0.15} transparent lineWidth={1} />
      ))}

      {/* Megacity Nodes with 3D Volumetric Heat Pillars */}
      {CITY_NODES.map((city, idx) => {
        const pos = latLngToVector3(city.lat, city.lng, 2.04);
        const normal = pos.clone().normalize();
        const pillarEnd = pos.clone().add(normal.clone().multiplyScalar(0.45));

        return (
          <group key={idx}>
            {/* Hotspot City Marker Pin */}
            <mesh
              position={pos}
              onClick={() => onSelectCity && onSelectCity(city)}
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={city.color} />
            </mesh>

            {/* 3D Volumetric Thermal Pillar Laser Line */}
            <Line
              points={[pos, pillarEnd]}
              color={city.color}
              lineWidth={2.5}
              transparent
              opacity={0.85}
            />

            {/* Pillar Top Glowing Orb */}
            <mesh position={pillarEnd}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={city.color} />
            </mesh>
          </group>
        );
      })}

      {/* Detailed Orbiting Climate Satellite */}
      <group ref={satelliteRef}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.09, 0.09]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Solar Panels */}
        <mesh position={[-0.22, 0, 0]}>
          <boxGeometry args={[0.24, 0.01, 0.14]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.24, 0.01, 0.14]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
        {/* Antenna Dish */}
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.08, 0.05, 12]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>
        {/* Scanning Laser Beam */}
        <mesh position={[0, -0.65, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.45, 1.3, 16, 1, true]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Floating Orbital Particle Cloud */}
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
