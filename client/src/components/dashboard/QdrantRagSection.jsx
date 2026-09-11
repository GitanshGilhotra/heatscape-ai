import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VectorGraph3D } from '../3d/VectorGraph3D';
import { Network, Database, Sparkles, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export function QdrantRagSection() {
  const qdrantDocs = [
    { id: "doc_01", topic: "Urban Heat Island Causes", sim: 0.98, content: "Trapped thermal mass in high-density concrete canyon walls causes night-time re-radiation." },
    { id: "doc_02", topic: "Green Roof Mitigation", sim: 0.94, content: "Sedum substrate roofs reduce surface heat by up to 25°C compared to black tar asphalt." },
    { id: "doc_03", topic: "Evapotranspiration Canopy", sim: 0.91, content: "A mature broadleaf tree transpires up to 400L of water daily, providing 4.5°C canopy cooling." },
    { id: "doc_04", topic: "Cool Pavement Albedo", sim: 0.88, content: "High-albedo pavement coatings (SRI >= 78) reflect 80%+ of incoming solar irradiance." }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-glow/30 text-cyan-glow font-mono text-xs">
          <Network className="w-3.5 h-3.5" />
          <span>VECTOR MEMORY & RAG ARCHITECTURE</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          QDRANT <span className="text-cyan-glow">VECTOR MEMORY & LANGCHAIN</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          3D visualization of climate document embeddings and LangChain retrieval augmentation pipeline powering the AI Urban Planner.
        </p>
      </div>

      {/* Grid: 3D Vector Graph + Document Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: 3D Floating Vector Graph Canvas */}
        <div className="lg:col-span-6 h-[400px] rounded-2xl glass-panel-glow border border-cyan-glow/30 overflow-hidden relative">
          <div className="absolute top-3 left-3 z-20 font-mono text-xs text-cyan-glow bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-glow/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></span>
            3D VECTOR CLUSTER SPACE (1,248 EMBEDDINGS)
          </div>
          <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f3ff" />
            <VectorGraph3D />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
          </Canvas>
        </div>

        {/* Right Column: Qdrant Top-K Similarity Search Results */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-neon-lime" />
              RETRIEVED QDRANT EMBEDDINGS
            </span>
            <span className="text-cyan-glow font-bold">COSINE SIMILARITY TOP-K</span>
          </div>

          <div className="space-y-3">
            {qdrantDocs.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-cyan-glow font-bold">
                  <span>{doc.topic}</span>
                  <span className="bg-cyan-glow/20 px-2 py-0.5 rounded text-[10px] border border-cyan-glow/40">
                    SIM: {(doc.sim * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans mt-1">
                  "{doc.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
