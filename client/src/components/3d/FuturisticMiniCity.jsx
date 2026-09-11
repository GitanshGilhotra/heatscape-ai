import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Generate procedural 3D city grid array (8x8 grid = 64 blocks)
const generateCityGrid = () => {
  const grid = [];
  const size = 8;
  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      const isRoad = (x % 3 === 0) || (z % 3 === 0);
      const isPark = (!isRoad && x === 1 && z === 1) || (x === -2 && z === -2);
      const height = isRoad || isPark ? 0.05 : 0.4 + Math.random() * 2.2;
      
      // Determine base thermal state
      const isHotZone = (x >= 0 && z >= 0) && !isRoad && !isPark;
      const isCoolZone = (x < 0 || z < 0) && !isRoad;

      let lst = isHotZone ? 42.0 + Math.random() * 5.5 : 31.0 + Math.random() * 4.0;
      let ndvi = isPark ? 0.72 : (isHotZone ? 0.08 + Math.random() * 0.05 : 0.25 + Math.random() * 0.2);

      grid.push({
        id: `BLOCK_${x}_${z}`,
        x: x * 1.1,
        z: z * 1.1,
        height,
        isRoad,
        isPark,
        isHotZone,
        isCoolZone,
        lst: round(lst, 1),
        ndvi: round(ndvi, 2),
        risk: lst >= 43.0 ? "CRITICAL" : (lst >= 38.0 ? "HIGH" : "OPTIMAL"),
        zoneId: `ZONE ${Math.abs(x * 7 + z * 3) % 25 + 1}`
      });
    }
  }
  return grid;
};

const round = (num, decimals) => Number(Math.round(num + "e" + decimals) + "e-" + decimals);

export function FuturisticMiniCity({ greenSimulationActive = false }) {
  const cityData = React.useMemo(() => generateCityGrid(), []);
  const cityGroupRef = useRef();
  const [hoveredBlock, setHoveredBlock] = useState(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (cityGroupRef.current) {
      cityGroupRef.current.rotation.y = elapsed * 0.06;
    }
  });

  return (
    <group ref={cityGroupRef} position={[0, -0.8, 0]}>
      {/* City Base Platform Grid */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[11, 0.2, 11]} />
        <meshStandardMaterial color="#0b101d" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Glowing Neon Grid Border */}
      <gridHelper args={[11, 22, "#00f3ff", "#1e293b"]} position={[0, 0.01, 0]} />

      {/* Buildings & Urban Blocks */}
      {cityData.map((b) => {
        // Dynamic thermal color calculation based on green infrastructure simulation toggle
        let color = "#1e293b";
        let emissive = "#000000";
        let emissiveIntensity = 0;

        if (b.isPark) {
          color = "#00ff88";
          emissive = "#00ff88";
          emissiveIntensity = 0.4;
        } else if (!b.isRoad) {
          if (greenSimulationActive && b.isHotZone) {
            // Transformed into Green Cooling Infrastructure
            color = "#00f3ff";
            emissive = "#00ff88";
            emissiveIntensity = 0.6;
          } else if (b.isHotZone) {
            // Critical Thermal Hotspot
            color = b.lst >= 44.0 ? "#ff2a5f" : "#ff5500";
            emissive = "#ff2a5f";
            emissiveIntensity = 0.55;
          } else {
            // Moderate / Cool block
            color = "#0088ff";
            emissive = "#0088ff";
            emissiveIntensity = 0.2;
          }
        }

        const isHovered = hoveredBlock?.id === b.id;

        return (
          <group key={b.id} position={[b.x, b.height / 2, b.z]}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredBlock(b);
              }}
              onPointerOut={() => setHoveredBlock(null)}
            >
              <boxGeometry args={[0.9, b.height, 0.9]} />
              <meshStandardMaterial
                color={isHovered ? "#ffffff" : color}
                emissive={emissive}
                emissiveIntensity={isHovered ? 0.9 : emissiveIntensity}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Rooftop Solar / Green Garden Cap */}
            {greenSimulationActive && b.isHotZone && (
              <mesh position={[0, b.height / 2 + 0.03, 0]}>
                <boxGeometry args={[0.92, 0.06, 0.92]} />
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
              </mesh>
            )}

            {/* Hover Tooltip Card */}
            {isHovered && !b.isRoad && (
              <Html position={[0, b.height / 2 + 0.4, 0]} center distanceFactor={8}>
                <div className="glass-panel-glow p-3 rounded-lg text-xs font-mono w-44 shadow-2xl backdrop-blur-md pointer-events-none">
                  <div className="flex items-center justify-between border-b border-cyan-glow/30 pb-1 mb-1">
                    <span className="font-bold text-cyan-glow">{b.zoneId}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      b.risk === 'CRITICAL' ? 'bg-heat-red text-white' : 'bg-neon-lime text-black'
                    }`}>
                      {greenSimulationActive && b.isHotZone ? "COOLED" : b.risk}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-slate-300 text-[11px]">
                    <div>LST: <span className="text-thermal-orange font-bold">
                      {greenSimulationActive && b.isHotZone ? (b.lst - 4.5).toFixed(1) : b.lst}°C
                    </span></div>
                    <div>NDVI: <span className="text-neon-lime font-bold">
                      {greenSimulationActive && b.isHotZone ? (b.ndvi + 0.35).toFixed(2) : b.ndvi}
                    </span></div>
                    <div>Type: <span className="text-slate-400">{b.isPark ? "Park Canopy" : "Commercial Grid"}</span></div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
