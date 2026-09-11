import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Megacity Hotspot Nodes mapped to 3D Sphere Coordinates
const CITY_NODES = [
  { name: "New Delhi", lat: 28.6139, lng: 77.2090, temp: "45.2°C", color: "#ff2a5f", severity: "EXTREME" },
  { name: "Phoenix", lat: 33.4484, lng: -112.0740, temp: "49.1°C", color: "#ff5500", severity: "EXTREME" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, temp: "40.8°C", color: "#ffaa00", severity: "HIGH" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, temp: "43.6°C", color: "#ff2a5f", severity: "CRITICAL" },
  { name: "London", lat: 51.5074, lng: -0.1278, temp: "33.2°C", color: "#0088ff", severity: "MODERATE" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, temp: "36.5°C", color: "#00ff88", severity: "OPTIMAL" },
  { name: "New York", lat: 40.7128, lng: -74.0060, temp: "38.9°C", color: "#ffaa00", severity: "HIGH" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, temp: "44.1°C", color: "#ff2a5f", severity: "CRITICAL" }
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
