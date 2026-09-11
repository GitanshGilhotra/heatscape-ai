import React from 'react';
import { Database, Cpu, Network, Sparkles, ArrowRight, Layers, Satellite, CloudSun } from 'lucide-react';

export function DataPipelineSection() {
  const pipelineNodes = [
    {
      id: "source",
      title: "SATELLITE & SENSORS",
      subtitle: "Multi-Source Telemetry",
      icon: Satellite,
      color: "border-cyan-glow/40 bg-cyan-glow/5 text-cyan-glow",
      items: ["Landsat-8 TIRS (LST)", "Sentinel-2 MSI (NDVI)", "NASA POWER Weather"]
    },
    {
      id: "processing",
      title: "GIS PROCESSING",
      subtitle: "Spatial Normalization",
      icon: Database,
      color: "border-atmospheric-blue/40 bg-atmospheric-blue/5 text-atmospheric-blue",
      items: ["Raster Resampling", "Impervious Ratio Calc", "Building Density Index"]
    },
    {
      id: "ml",
      title: "ML PREDICTION ENGINE",
      subtitle: "Microclimate Modeling",
      icon: Cpu,
      color: "border-thermal-orange/40 bg-thermal-orange/5 text-thermal-orange",
      items: ["Random Forest Regressor", "XGBoost Gradient Boosting", "Feature Importance Matrix"]
    },
    {
      id: "rag",
      title: "QDRANT VECTOR RAG",
      subtitle: "Knowledge Base Search",
      icon: Network,
      color: "border-neon-lime/40 bg-neon-lime/5 text-neon-lime",
      items: ["1.2k Climate Embeddings", "LangChain Orchestrator", "Cosine Vector Search"]
    },
    {
      id: "genai",
      title: "GENAI URBAN PLANNER",
      subtitle: "Grounded Insights",
      icon: Sparkles,
      color: "border-heat-red/40 bg-heat-red/5 text-heat-red",
      items: ["Structured Action Cards", "Cooling Benefit Estimates", "Policy Guidelines"]
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-glow/30 text-cyan-glow font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>DATA PIPELINE ARCHITECTURE</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          FROM SATELLITE TELEMETRY TO <span className="text-cyan-glow">ACTIONABLE COOLING</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto font-sans">
          How HEATSCAPE AI ingests multi-band satellite rasters, extracts microclimate spatial features, runs machine learning regressions, and synthesizes grounded urban planning recommendations.
        </p>
      </div>

      {/* Pipeline Flowchart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {pipelineNodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.id} className="relative group">
              <div className={`p-5 rounded-2xl border ${node.color} backdrop-blur-md glass-panel h-full flex flex-col justify-between hover:scale-105 transition duration-300 shadow-xl`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700/60">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">0{index + 1}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">{node.title}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mb-3">{node.subtitle}</div>
                  
                  <ul className="space-y-1.5 border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-300">
                    {node.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-glow"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Arrow Connector between nodes (desktop) */}
              {index < pipelineNodes.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  <ArrowRight className="w-5 h-5 text-cyan-glow/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
