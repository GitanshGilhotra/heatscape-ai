import React, { useState } from 'react';
import { Shield, TreePine, Building2, Sun, Waves, ArrowUpRight, CheckCircle, Sparkles, Filter } from 'lucide-react';

export function GreenZonePlannerSection({ onSelectIntervention }) {
  const [filterCategory, setFilterCategory] = useState("ALL");

  const interventions = [
    {
      id: "tree-plantation",
      rank: "#01",
      title: "Urban Forest & Canopy Plantation",
      category: "Bio-Infrastructure",
      coolingImpact: "-2.5 to -4.5 °C",
      costPerSqM: "$25 - $45 / m²",
      feasibility: 88,
      priorityScore: 94.2,
      description: "Multi-layered native tree canopy along avenue corridors and parking perimeters to maximize shade and evapotranspiration.",
      icon: TreePine,
      color: "border-neon-lime/40 bg-neon-lime/5 text-neon-lime",
      tag: "HIGHEST ROI"
    },
    {
      id: "green-roof",
      rank: "#02",
      title: "Extensive Green Roof Retrofit",
      category: "Rooftop Infrastructure",
      coolingImpact: "-1.8 to -3.2 °C",
      costPerSqM: "$60 - $110 / m²",
      feasibility: 92,
      priorityScore: 89.5,
      description: "Lightweight Sedum vegetation layers retrofitted onto commercial flat roofs to isolate thermal building mass.",
      icon: Building2,
      color: "border-cyan-glow/40 bg-cyan-glow/5 text-cyan-glow",
      tag: "DENSE CORE"
    },
    {
      id: "reflective-surface",
      rank: "#03",
      title: "High-Albedo Cool Pavements",
      category: "Surface Materials",
      coolingImpact: "-1.5 to -2.8 °C",
      costPerSqM: "$12 - $22 / m²",
      feasibility: 95,
      priorityScore: 84.1,
      description: "Solar reflective coatings (SRI >= 78) applied on asphalt highways, parking lots, and industrial rooftops.",
      icon: Sun,
      color: "border-thermal-orange/40 bg-thermal-orange/5 text-thermal-orange",
      tag: "QUICK DEPLOY"
    },
    {
      id: "urban-water-body",
      rank: "#04",
      title: "Blue-Green Wetland & Retention Basins",
      category: "Hydro-Infrastructure",
      coolingImpact: "-2.2 to -3.8 °C",
      costPerSqM: "$75 - $130 / m²",
      feasibility: 79,
      priorityScore: 78.6,
      description: "Constructed urban wetlands and retention ponds absorbing surface storm runoff while creating localized thermal micro-oases.",
      icon: Waves,
      color: "border-atmospheric-blue/40 bg-atmospheric-blue/5 text-atmospheric-blue",
      tag: "HYDRO OPTIMUM"
    }
  ];

  const filtered = filterCategory === "ALL" 
    ? interventions 
    : interventions.filter(i => i.category === filterCategory);

  return (
    <section id="green-zones" className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-neon-lime/30 text-neon-lime font-mono text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>GREEN INFRASTRUCTURE RECOMMENDATION ENGINE</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          RANKED <span className="text-neon-lime">COOLING INTERVENTIONS</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          AI-prioritized green infrastructure deployment plans calculated using spatial priority scores, feasibility indices, and estimated cooling delta (°C).
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {["ALL", "Bio-Infrastructure", "Rooftop Infrastructure", "Surface Materials", "Hydro-Infrastructure"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition border ${
              filterCategory === cat
                ? "bg-neon-lime/20 text-neon-lime border-neon-lime/50 font-bold shadow-lime-glow"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Intervention Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border ${item.color} glass-panel hover:scale-[1.02] transition duration-300 relative overflow-hidden group shadow-2xl`}
            >
              {/* Top Rank Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg text-white bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                    {item.rank}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    {item.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neon-lime/20 text-neon-lime border border-neon-lime/40">
                  {item.tag}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">{item.title}</h3>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">EST. COOLING</div>
                  <div className="text-neon-lime font-bold text-sm mt-0.5">{item.coolingImpact}</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">EST. COST</div>
                  <div className="text-slate-200 font-bold text-sm mt-0.5">{item.costPerSqM}</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">PRIORITY SCORE</div>
                  <div className="text-cyan-glow font-bold text-sm mt-0.5">{item.priorityScore} / 100</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectIntervention && onSelectIntervention(item)}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-glow border border-cyan-glow/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>SIMULATE DEPLOYMENT IN ZONE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
