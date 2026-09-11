import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const VECTOR_NODES = [
  { id: "vec_01", pos: [0, 0, 0], label: "Query Embedding", color: "#00f3ff", radius: 0.25 },
  { id: "vec_02", pos: [-1.8, 1.2, 0.8], label: "LST Telemetry Node", color: "#ff5500", radius: 0.18 },
  { id: "vec_03", pos: [1.6, 1.5, -0.6], label: "NDVI Vegetation Cluster", color: "#00ff88", radius: 0.2 },
  { id: "vec_04", pos: [-1.2, -1.4, -1.1], label: "Green Roof Guideline (Sedum)", color: "#0088ff", radius: 0.16 },
  { id: "vec_05", pos: [1.4, -1.2, 1.0], label: "Cool Pavement Standard (SRI 78)", color: "#ffaa00", radius: 0.17 },
  { id: "vec_06", pos: [0.2, 2.2, 1.2], label: "Tree Canopy Evapotranspiration", color: "#00ff88", radius: 0.19 }
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 4], [2, 5], [3, 4]
];

export function VectorGraph3D() {
  const graphRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (graphRef.current) {
      graphRef.current.rotation.y = t * 0.15;
      graphRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <group ref={graphRef}>
      {/* Network Nodes */}
      {VECTOR_NODES.map((node, idx) => (
        <group key={idx} position={node.pos}>
          <Sphere args={[node.radius, 16, 16]}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </Sphere>
        </group>
      ))}

      {/* Pulsing Inter-Vector Connecting Lines */}
      {CONNECTIONS.map(([startIdx, endIdx], i) => {
        const start = VECTOR_NODES[startIdx].pos;
        const end = VECTOR_NODES[endIdx].pos;
        return (
          <Line
            key={i}
            points={[start, end]}
            color={i % 2 === 0 ? "#00f3ff" : "#00ff88"}
            opacity={0.5}
            transparent
            lineWidth={1.5}
          />
        );
      })}
    </group>
  );
}
