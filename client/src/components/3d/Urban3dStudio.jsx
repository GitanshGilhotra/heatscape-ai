import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Sun, TreePine, Flame, Sparkles, RefreshCw, ShieldCheck, Zap, Eye, Camera, Layers } from 'lucide-react';

// Map locality landmark names for any world city
function getLocalityLandmarks(cityName) {
  const c = (cityName || 'New Delhi').toLowerCase();
  if (c.includes('delhi')) {
    return ["Connaught Place Hub", "Okhla Industrial Sector", "Dwarka Sector 21", "Delhi Ridge Forest", "Chandni Chowk Grid"];
  } else if (c.includes('york') || c.includes('nyc')) {
    return ["Midtown Skyscraper Canyon", "Brooklyn Navy Yard", "Central Park West", "Wall Street Core", "Hudson Yards Tower"];
  } else if (c.includes('tokyo')) {
    return ["Shinjuku Station Core", "Marunouchi Business District", "Yoyogi Park Sanctuary", "Shibuya Crossing Grid", "Ginza High-Rise Zone"];
  } else if (c.includes('london')) {
    return ["City of London Commercial", "Canary Wharf Financial Core", "Hyde Park Sanctuary", "Thames Corridor Grid", "Mayfair Office Hub"];
  } else if (c.includes('paris')) {
    return ["La Défense Commercial Core", "Champs-Élysées Boulevard", "Jardin du Luxembourg Buffer", "Montparnasse Skyscraper", "Le Marais Grid"];
  } else if (c.includes('dubai')) {
    return ["Burj Financial District", "Dubai Marina Skyscraper", "Business Bay Commercial", "Jumeirah Palms Sanctuary", "Al Quoz Industrial"];
  } else if (c.includes('phoenix')) {
    return ["Downtown Sky Harbor", "Tempe Industrial Corridor", "Papago Park Preserve", "Camelback Sector", "Scottsdale Financial"];
  } else if (c.includes('mumbai')) {
    return ["BKC Commercial Corridor", "Dharavi High-Density Zone", "Sanjay Gandhi Sanctuary", "Nariman Point Tower", "Worli Sea Face Grid"];
  } else {
    return [`${cityName} Commercial Core`, `${cityName} Industrial Corridor`, `${cityName} Urban Park Sanctuary`, `${cityName} Financial District`, `${cityName} Residential Grid`];
  }
}

// Procedural Architectural 3D Block Generator
function createArchitecturalBlocks(cityName = "New Delhi") {
  const landmarks = getLocalityLandmarks(cityName);
  const blocks = [];
  const size = 6;
  let id = 1;

  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      const isRoad = (x % 2 === 0 || z % 2 === 0);
      const isPark = (!isRoad && x === 1 && z === -1);
      
      // Varied architectural building heights
      let height = 0.05;
      let buildingType = "road";

      if (isPark) {
        height = 0.1;
        buildingType = "park";
      } else if (!isRoad) {
        const hSeed = Math.abs(x * 1.7 + z * 2.3);
        if (hSeed > 4.5) {
          height = 2.8 + (hSeed % 1.5);
          buildingType = "skyscraper";
        } else if (hSeed > 2.5) {
          height = 1.6 + (hSeed % 1.0);
          buildingType = "commercial";
        } else {
          height = 0.9 + (hSeed % 0.6);
          buildingType = "residential";
        }
      }

      const initialLst = isPark ? 27.8 : (height > 2.0 ? 45.4 : 40.1);
      const initialNdvi = isPark ? 0.82 : 0.09;
      const landmarkName = isPark ? landmarks[3] || "Urban Park Preserve" : landmarks[(id - 1) % landmarks.length];

      blocks.push({
        id: `ZONE_${id++}`,
        landmarkName,
        x: x * 1.5,
        z: z * 1.5,
        height,
        buildingType,
        isRoad,
        isPark,
        hasTree: isPark,
        hasGreenRoof: false,
        hasSolarPanels: false,
        baseLst: initialLst,
        currentLst: initialLst,
        baseNdvi: initialNdvi,
        currentNdvi: initialNdvi,
        albedo: isPark ? 0.28 : (isRoad ? 0.06 : 0.16)
      });
    }
  }
  return blocks;
}

// Photorealistic Multi-Cluster Tree 3D Mesh
function PhotorealisticTree({ position }) {
  const treeRef = useRef();

  // Subtle wind swaying effect
  useFrame(({ clock }) => {
    if (treeRef.current) {
      treeRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.5 + position[0]) * 0.03;
      treeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 1.2 + position[2]) * 0.03;
    }
  });

  return (
    <group ref={treeRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#3d2314" roughness={0.9} />
      </mesh>

      {/* Main Canopy Foliage Clusters */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#0f766e" roughness={0.4} />
      </mesh>
      <mesh position={[-0.12, 0.72, 0.1]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#10b981" roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.75, -0.08]} castShadow>
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshStandardMaterial color="#059669" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#34d399" roughness={0.25} />
      </mesh>
    </group>
  );
}

// Realistic Architectural Building Mesh (Skyscraper / Commercial / Residential)
function ArchitecturalBuilding({ block, renderMode, isHovered, onClick, onPointerOver, onPointerOut }) {
  const b = block;
  const height = b.height;

  // Render Mode Colors (Photorealistic vs Thermal Infrared Spectrum)
  let materialProps = {};

  if (renderMode === 'thermal') {
    // False-Color Thermal Infrared Heatmap Shader
    let thermalColor = "#0088ff";
    let emissive = "#002b4d";
    let emissiveIntensity = 0.2;

    if (b.currentLst >= 44.0) {
      thermalColor = "#ff2a5f";
      emissive = "#ff2a5f";
      emissiveIntensity = 0.75;
    } else if (b.currentLst >= 38.0) {
      thermalColor = "#ff6600";
      emissive = "#ff6600";
      emissiveIntensity = 0.55;
    } else if (b.currentLst <= 31.0) {
      thermalColor = "#00ff88";
      emissive = "#00ff88";
      emissiveIntensity = 0.65;
    }

    materialProps = {
      color: isHovered ? "#ffffff" : thermalColor,
      emissive: emissive,
      emissiveIntensity: isHovered ? 0.9 : emissiveIntensity,
      roughness: 0.3,
      metalness: 0.7
    };
  } else {
    // Photorealistic Architectural Glass, Concrete, & Steel Materials
    let baseColor = "#1e293b";
    let roughness = 0.15;
    let metalness = 0.85;

    if (b.buildingType === 'skyscraper') {
      baseColor = "#0f172a";
      roughness = 0.1;
      metalness = 0.9;
    } else if (b.buildingType === 'commercial') {
      baseColor = "#334155";
      roughness = 0.3;
      metalness = 0.6;
    } else if (b.buildingType === 'residential') {
      baseColor = "#475569";
      roughness = 0.5;
      metalness = 0.4;
    }

    materialProps = {
      color: isHovered ? "#38bdf8" : baseColor,
      roughness,
      metalness,
      envMapIntensity: 1.5
    };
  }

  return (
    <group position={[b.x, height / 2, b.z]}>
      {/* Main Structural Building Geometry */}
      <mesh
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Photorealistic Architectural Details (Windows, Rooftop HVAC, Solar Arrays) */}
      {renderMode === 'photorealistic' && (
        <group>
          {/* Glass Window Grid Facade Overlay */}
          <mesh position={[0, 0, 0.605]}>
            <planeGeometry args={[1.1, height * 0.9]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={0.15}
              roughness={0.05}
              metalness={0.95}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0, -0.605]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.1, height * 0.9]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={0.15}
              roughness={0.05}
              metalness={0.95}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Rooftop HVAC Chiller Box */}
          <mesh position={[0.2, height / 2 + 0.08, -0.2]} castShadow>
            <boxGeometry args={[0.3, 0.16, 0.3]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Rooftop Solar Panels */}
          {b.hasSolarPanels && (
            <mesh position={[-0.2, height / 2 + 0.05, 0.2]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.5, 0.03, 0.4]} />
              <meshStandardMaterial color="#1e3a8a" emissive="#1d4ed8" emissiveIntensity={0.4} metalness={0.9} />
            </mesh>
          )}

          {/* Rooftop Helipad (for skyscrapers) */}
          {b.buildingType === 'skyscraper' && (
            <mesh position={[0, height / 2 + 0.02, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.02, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          )}
        </group>
      )}

      {/* 3D Green Rooftop Garden Terrace Cap */}
      {b.hasGreenRoof && (
        <group position={[0, height / 2 + 0.05, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.22, 0.1, 1.22]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
          {/* Mini garden trees on roof */}
          <PhotorealisticTree position={[-0.3, 0.05, -0.3]} />
          <PhotorealisticTree position={[0.3, 0.05, 0.3]} />
        </group>
      )}

      {/* Planted Ground Tree */}
      {b.hasTree && (
        <PhotorealisticTree position={[0, height / 2, 0]} />
      )}
    </group>
  );
}

// Moving Electric Transit Pod on Roadways
function MovingTransitPod() {
  const podRef = useRef();

  useFrame(({ clock }) => {
    if (podRef.current) {
      const t = clock.getElapsedTime() * 0.8;
      podRef.current.position.x = Math.sin(t) * 3.5;
      podRef.current.position.z = Math.cos(t * 0.5) * 3.5;
    }
  });

  return (
    <group ref={podRef} position={[0, 0.12, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.12, 0.12]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// Thermal Convection Volumetric Air Plumes
function ThermalVolumetricParticles({ blocks, renderMode }) {
  const particlesRef = useRef();
  const count = 500;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const b = blocks[i % blocks.length];
      pos[i * 3] = b.x + (Math.random() - 0.5) * 1.0;
      pos[i * 3 + 1] = b.height + Math.random() * 2.5;
      pos[i * 3 + 2] = b.z + (Math.random() - 0.5) * 1.0;

      if (b.currentLst > 41) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.15;
        col[i * 3 + 2] = 0.25;
      } else {
        col[i * 3] = 0.0;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 0.75;
      }
    }
    return { positions: pos, colors: col };
  }, [blocks]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const elapsed = clock.getElapsedTime();
      const posArr = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += 0.018;
        if (posArr[i * 3 + 1] > 4.5) {
          posArr[i * 3 + 1] = 0.2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = elapsed * 0.04;
    }
  });

  return (
    <Points ref={particlesRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={renderMode === 'thermal' ? 0.8 : 0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// Inner Canvas City Scene Manager
function PhotorealisticCityScene({
  blocks,
  timeOfDay,
  renderMode,
  selectedTool,
  onBlockClick,
  hoveredBlock,
  setHoveredBlock
}) {
  const sceneRef = useRef();

  // Solar Light Calculation
  const solarAngle = ((timeOfDay - 6) / 12) * Math.PI;
  const sunX = Math.cos(solarAngle) * 14;
  const sunY = Math.sin(solarAngle) * 14;
  const sunZ = 6;

  useFrame(({ clock }) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.04) * 0.04;
    }
  });

  return (
    <group ref={sceneRef} position={[0, -0.6, 0]}>
      {/* Dynamic Lighting & Atmospheric Shadows */}
      <directionalLight
        position={[sunX, Math.max(1, sunY), sunZ]}
        intensity={sunY > 0 ? (renderMode === 'photorealistic' ? 2.2 : 1.2) : 0.3}
        color={timeOfDay > 16 || timeOfDay < 8 ? "#ff8800" : "#ffffff"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={renderMode === 'photorealistic' ? 0.6 : 0.3} />

      {/* Asphalt Ground Base Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[12, 0.2, 12]} />
        <meshStandardMaterial color="#090d16" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Cyber Neon Ground Grid Helper */}
      <gridHelper args={[12, 24, "#00f3ff", "#1e293b"]} position={[0, 0.01, 0]} />

      {/* Moving Electric Transit Pod */}
      <MovingTransitPod />

      {/* Thermal Volumetric Air Drafts */}
      <ThermalVolumetricParticles blocks={blocks} renderMode={renderMode} />

      {/* Render All Architectural Buildings & Trees */}
      {blocks.map((b) => {
        const isHovered = hoveredBlock?.id === b.id;

        return (
          <group key={b.id}>
            <ArchitecturalBuilding
              block={b}
              renderMode={renderMode}
              isHovered={isHovered}
              onClick={(e) => {
                e.stopPropagation();
                onBlockClick(b);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredBlock(b);
              }}
              onPointerOut={() => setHoveredBlock(null)}
            />

            {/* Hover Tooltip HUD Card */}
            {isHovered && !b.isRoad && (
              <Html position={[b.x, b.height + 0.6, b.z]} center distanceFactor={7}>
                <div className="bg-slate-950/95 border border-cyan-400/60 p-3 rounded-xl text-xs font-mono w-48 shadow-2xl backdrop-blur-xl pointer-events-none">
                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5 mb-1.5">
                    <span className="font-bold text-cyan-glow truncate max-w-[120px]">
                      {b.landmarkName || b.id}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      b.currentLst >= 42 ? 'bg-red-500 text-white' : 'bg-emerald-400 text-black'
                    }`}>
                      {b.currentLst >= 42 ? "CRITICAL" : "COOLED"}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span>Land Surface Temp:</span>
                      <span className="font-bold text-thermal-orange">{b.currentLst.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NDVI Vegetation:</span>
                      <span className="font-bold text-emerald-400">{b.currentNdvi.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reflective SRI:</span>
                      <span className="text-cyan-glow">{(b.albedo * 100).toFixed(0)}%</span>
                    </div>
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

// Container Studio Component
export function Urban3dStudio({ activeCity }) {
  const cityName = activeCity?.name || "New Delhi";
  const cityTemp = parseFloat(String(activeCity?.temp || '42.8').replace('°C', '').trim()) || 42.8;

  const [blocks, setBlocks] = useState(() => {
    const defaultBlocks = createArchitecturalBlocks(cityName);
    return defaultBlocks.map(b => ({
      ...b,
      currentLst: b.isPark ? Math.max(22, cityTemp - 15) : (b.height > 2.0 ? cityTemp + 3 : cityTemp - 2),
      baseLst: b.isPark ? Math.max(22, cityTemp - 15) : (b.height > 2.0 ? cityTemp + 3 : cityTemp - 2)
    }));
  });

  useEffect(() => {
    if (activeCity) {
      const numericTemp = parseFloat(String(activeCity.temp || '42.8').replace('°C', '').trim()) || 42.8;
      const newCityBlocks = createArchitecturalBlocks(activeCity.name);
      setBlocks(newCityBlocks.map(b => ({
        ...b,
        currentLst: b.isPark ? Math.max(22, numericTemp - 15) : (b.height > 2.0 ? numericTemp + 3 : numericTemp - 2),
        baseLst: b.isPark ? Math.max(22, numericTemp - 15) : (b.height > 2.0 ? numericTemp + 3 : numericTemp - 2)
      })));
    }
  }, [activeCity]);
  const [timeOfDay, setTimeOfDay] = useState(13);
  const [renderMode, setRenderMode] = useState('photorealistic'); // 'photorealistic' | 'thermal'
  const [selectedTool, setSelectedTool] = useState('tree');
  const [hoveredBlock, setHoveredBlock] = useState(null);

  const stats = useMemo(() => {
    let sumLst = 0;
    let sumNdvi = 0;
    let cooledCount = 0;

    blocks.forEach((b) => {
      sumLst += b.currentLst;
      sumNdvi += b.currentNdvi;
      if (b.hasTree || b.hasGreenRoof || b.hasSolarPanels) cooledCount++;
    });

    return {
      avgLst: sumLst / blocks.length,
      avgNdvi: sumNdvi / blocks.length,
      cooledCount
    };
  }, [blocks]);

  const handleBlockClick = (block) => {
    if (block.isRoad) return;

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== block.id) return b;

        if (selectedTool === 'tree') {
          const newTree = !b.hasTree;
          return {
            ...b,
            hasTree: newTree,
            currentLst: Math.max(25.5, b.currentLst + (newTree ? -6.4 : 6.4)),
            currentNdvi: Math.min(0.98, Math.max(0.05, b.currentNdvi + (newTree ? 0.38 : -0.38)))
          };
        } else if (selectedTool === 'green_roof') {
          const newRoof = !b.hasGreenRoof;
          return {
            ...b,
            hasGreenRoof: newRoof,
            currentLst: Math.max(25.5, b.currentLst + (newRoof ? -5.2 : 5.2)),
            currentNdvi: Math.min(0.98, Math.max(0.05, b.currentNdvi + (newRoof ? 0.30 : -0.30)))
          };
        } else if (selectedTool === 'cool_pavement') {
          const newSolar = !b.hasSolarPanels;
          return {
            ...b,
            hasSolarPanels: newSolar,
            albedo: newSolar ? 0.82 : 0.16,
            currentLst: Math.max(25.5, b.currentLst + (newSolar ? -4.1 : 4.1))
          };
        }
        return b;
      })
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-glow/30 bg-slate-950/85 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 font-mono text-xs mb-1.5 shadow-lg shadow-cyan-glow/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D URBAN MICROCLIMATE STUDIO ({cityName.toUpperCase()})</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-white tracking-tight">
            3D ARCHITECTURAL THERMAL SIMULATION — {cityName.toUpperCase()}
          </h3>
          <p className="text-slate-400 text-xs font-mono">
            Interactive 3D viewport featuring procedural skyscrapers, glass facades, solar panels, and real-time thermal cooling calculations for {cityName}.
          </p>
        </div>

        {/* Live Metrics Widget */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl font-mono text-xs">
          <div className="text-center px-2">
            <span className="text-slate-400 text-[10px] block">AVG CITY LST</span>
            <span className="text-lg font-bold text-thermal-orange">{stats.avgLst.toFixed(1)}°C</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-slate-400 text-[10px] block">VEGETATION (NDVI)</span>
            <span className="text-lg font-bold text-emerald-400">{stats.avgNdvi.toFixed(2)}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-slate-400 text-[10px] block">INFRASTRUCTURE</span>
            <span className="text-lg font-bold text-cyan-glow">{stats.cooledCount} / 36</span>
          </div>
        </div>
      </div>

      {/* Toolkit & Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Toolbar Controls */}
        <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl font-mono text-xs">
          {/* Render Mode Switcher Toggle */}
          <div className="space-y-1.5">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>VISUAL CAMERA SPECTRUM</span>
            </span>
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setRenderMode('photorealistic')}
                className={`py-1.5 px-2 rounded text-[11px] font-bold transition ${
                  renderMode === 'photorealistic'
                    ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                REALISTIC
              </button>
              <button
                onClick={() => setRenderMode('thermal')}
                className={`py-1.5 px-2 rounded text-[11px] font-bold transition ${
                  renderMode === 'thermal'
                    ? 'bg-red-500/20 text-red-400 border border-red-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                THERMAL LST
              </button>
            </div>
          </div>

          {/* Infrastructure Action Tools */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <TreePine className="w-4 h-4 text-emerald-400" />
              <span>INFRASTRUCTURE TOOLKIT</span>
            </span>

            <button
              onClick={() => setSelectedTool('tree')}
              className={`w-full text-left p-3 rounded-lg border transition flex items-center gap-3 ${
                selectedTool === 'tree'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <TreePine className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs">Plant Urban Trees</div>
                <div className="text-[10px] opacity-70">-6.4°C Shading Delta</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedTool('green_roof')}
              className={`w-full text-left p-3 rounded-lg border transition flex items-center gap-3 ${
                selectedTool === 'green_roof'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs">Install Green Roof Gardens</div>
                <div className="text-[10px] opacity-70">-5.2°C Terrace Cooling</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedTool('cool_pavement')}
              className={`w-full text-left p-3 rounded-lg border transition flex items-center gap-3 ${
                selectedTool === 'cool_pavement'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs">Install Solar Array Roofs</div>
                <div className="text-[10px] opacity-70">High-Albedo Reflective</div>
              </div>
            </button>
          </div>

          {/* Solar Light Control */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>SOLAR ANGLE</span>
              </span>
              <span className="text-amber-400 font-bold">{timeOfDay}:00 HRS</span>
            </div>
            <input
              type="range"
              min="6"
              max="18"
              step="1"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Reset */}
          <button
            onClick={() => setBlocks(createArchitecturalBlocks(cityName))}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET SIMULATION</span>
          </button>
        </div>

        {/* Right 3D R3F Viewport Canvas */}
        <div className="lg:col-span-3 h-[460px] rounded-xl overflow-hidden border border-slate-800/80 relative bg-slate-950">
          <Canvas shadows camera={{ position: [8, 9, 10], fov: 42 }}>
            <PhotorealisticCityScene
              blocks={blocks}
              timeOfDay={timeOfDay}
              renderMode={renderMode}
              selectedTool={selectedTool}
              onBlockClick={handleBlockClick}
              hoveredBlock={hoveredBlock}
              setHoveredBlock={setHoveredBlock}
            />
            <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={20} />
          </Canvas>

          {/* Mode Indicator Overlay */}
          <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 backdrop-blur-md">
            <span>MODE: </span>
            <span className="text-cyan-glow font-bold capitalize">{selectedTool.replace('_', ' ')} PLACEMENT</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg text-[10px] font-mono backdrop-blur-md flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f]" />
              <span>Critical Hotspot (&gt;44°C)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff6600]" />
              <span>High (38-44°C)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
              <span>Cooled (&lt;31°C)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
