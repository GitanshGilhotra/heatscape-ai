import React, { useState } from 'react';
import {
  Shield,
  TreePine,
  Building2,
  Sun,
  Waves,
  ArrowUpRight,
  CheckCircle,
  Sparkles,
  Filter,
  Compass,
  AlertTriangle,
  Leaf,
  DollarSign,
  Calculator
} from 'lucide-react';

export function GreenZonePlannerSection({ activeCity, onSelectIntervention, onNavigateToSimulator }) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const cityName = activeCity?.name || "New Delhi";

  const interventions = [
    {
      id: "tree-plantation",
      rank: "#01",
      title: "Urban Forest & Canopy Plantation",
      category: "Bio-Infrastructure",
      coolingLst: "-3.5 to -6.2 °C (Surface)",
      coolingAir: "-1.2 to -2.1 °C (Pedestrian Air)",
      costPerSqM: "$28 - $45 / m²",
      feasibility: 88,
      feasibilityLabel: "HIGH FEASIBILITY (OPEN GROUND BOUNDED)",
      priorityScore: 94.2,
      description: "Multi-layered native tree canopy along avenue corridors and parking perimeters to maximize shade and evapotranspiration.",
      spatialConstraint: "Bounded by ground open space. High-density zones (>80% built-up) require vertical green trellises.",
      scientificBasis: "Beer-Lambert canopy solar extinction (k=0.6, LAI=3.4) blocking 85% insolation + 185 W/m² latent heat flux cooling.",
      recommendedSpecies: cityName.toLowerCase().includes('delhi') || cityName.toLowerCase().includes('mumbai')
        ? ["Neem (Azadirachta indica)", "Peepal (Ficus religiosa)", "Jamun (Syzygium cumini)", "Amaltas"]
        : (cityName.toLowerCase().includes('phoenix') || cityName.toLowerCase().includes('cairo')
            ? ["Desert Palo Verde", "Mesquite (Prosopis)", "Desert Ironwood"]
            : ["London Plane", "Silver Birch", "Field Maple"]),
      icon: TreePine,
      color: "border-neon-lime/40 bg-neon-lime/5 text-neon-lime",
      tag: "HIGHEST COOLING DELTA"
    },
    {
      id: "green-roof",
      rank: "#02",
      title: "Extensive Green Roof Systems",
      category: "Rooftop Infrastructure",
      coolingLst: "-2.8 to -4.5 °C (Surface)",
      coolingAir: "-0.9 to -1.5 °C (Pedestrian Air)",
      costPerSqM: "$65 - $115 / m²",
      feasibility: 92,
      feasibilityLabel: "HIGH FEASIBILITY (RCC SLABS)",
      priorityScore: 89.5,
      description: "Lightweight Sedum vegetation layers retrofitted onto commercial and residential flat reinforced concrete roofs.",
      spatialConstraint: "Dead-load allowance of 70-120 kg/m² required. Unreinforced load-bearing brick roofs require prior structural retrofit.",
      scientificBasis: "Reduces building envelope U-value by 72% (from 1.8 to 0.45 W/m²K) isolating indoor spaces and lowering upward thermal radiation.",
      recommendedSpecies: ["Sedum spurium", "Portulaca grandiflora", "Native Succulent Grasses"],
      icon: Building2,
      color: "border-cyan-glow/40 bg-cyan-glow/5 text-cyan-glow",
      tag: "DENSE URBAN CORE"
    },
    {
      id: "reflective-surface",
      rank: "#03",
      title: "High-Albedo Reflective Pavement & Cool Roofs",
      category: "Surface Materials",
      coolingLst: "-4.2 to -7.5 °C (Surface)",
      coolingAir: "-1.0 to -1.8 °C (Pedestrian Air)",
      costPerSqM: "$12 - $22 / m²",
      feasibility: 96,
      feasibilityLabel: "HIGHEST FEASIBILITY (LOWEST CAPEX)",
      priorityScore: 84.1,
      description: "Solar reflective elastomeric coatings (SRI >= 82) applied on asphalt highways, industrial rooftops, and wide parking lots.",
      spatialConstraint: "Zero ground displacement. Directly applied over existing asphalt and concrete surfaces.",
      scientificBasis: "Increases solar reflectance from alpha=0.12 (aged asphalt) to alpha=0.68, rejecting ~476 W/m² of incoming solar radiation.",
      recommendedSpecies: ["Titanium Dioxide Micro-aggregates", "Thermally Reflective Polymer Sealants"],
      icon: Sun,
      color: "border-thermal-orange/40 bg-thermal-orange/5 text-thermal-orange",
      tag: "QUICK DEPLOY // FAST ROI"
    },
    {
      id: "urban-water-body",
      rank: "#04",
      title: "Blue-Green Bioswales & Urban Retention Basins",
      category: "Hydro-Infrastructure",
      coolingLst: "-2.5 to -4.8 °C (Surface)",
      coolingAir: "-0.8 to -1.4 °C (Pedestrian Air)",
      costPerSqM: "$75 - $130 / m²",
      feasibility: 78,
      feasibilityLabel: "MODERATE (DRAINAGE & RUNOFF DEPENDENT)",
      priorityScore: 78.6,
      description: "Constructed urban wetlands and retention ponds absorbing surface storm runoff while creating localized thermal micro-oases.",
      spatialConstraint: "Requires natural watershed gradient and municipal storm-water drainage integration.",
      scientificBasis: "High specific heat capacity of water (4184 J/kg K) creates thermal inertia and continuous evaporative cooling.",
      recommendedSpecies: ["Typha latifolia", "Vetiver Grass (Chrysopogon zizanioides)", "Phragmites australis"],
      icon: Waves,
      color: "border-atmospheric-blue/40 bg-atmospheric-blue/5 text-atmospheric-blue",
      tag: "HYDRO OPTIMUM"
    }
  ];

  const filtered = filterCategory === "ALL"
    ? interventions
    : interventions.filter(i => i.category === filterCategory);

  return (
    <section id="green-zones" className="py-8 px-4 max-w-7xl mx-auto font-mono text-slate-100 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-neon-lime/40 bg-slate-950/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-lime/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-neon-lime/40 text-neon-lime text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>SPATIAL MCDA RECOMMENDATION ENGINE // {cityName.toUpperCase()}</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              ENGINEERED <span className="text-neon-lime">COOLING INTERVENTIONS</span> FOR {cityName.toUpperCase()}
            </h1>
            <p className="text-slate-400 text-xs">
              Prioritized by multi-criteria spatial optimization balancing cooling delta (°C), physical ground constraints, structural dead-load feasibility, and Capex payback.
            </p>
          </div>

          {onNavigateToSimulator && (
            <button
              onClick={onNavigateToSimulator}
              className="px-4 py-2.5 rounded-xl bg-neon-lime text-slate-950 font-bold text-xs hover:bg-emerald-400 transition flex items-center gap-2 shadow-lg shadow-neon-lime/20 shrink-0"
            >
              <Calculator className="w-4 h-4" />
              <span>SIMULATE SCENARIOS</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
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
              className={`p-6 rounded-2xl border ${item.color} glass-panel hover:scale-[1.01] transition duration-300 relative overflow-hidden group shadow-2xl space-y-4`}
            >
              {/* Top Rank Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg text-white bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                    {item.rank}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    {item.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-neon-lime/20 text-neon-lime border border-neon-lime/40">
                  {item.tag}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  <Icon className="w-6 h-6 text-neon-lime" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">{item.title}</h3>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Two-Tier Cooling & Feasibility Metrics */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">EST. COOLING</div>
                  <div className="text-neon-lime font-bold text-xs mt-0.5">{item.coolingLst}</div>
                  <div className="text-cyan-glow text-[9px] mt-0.5">{item.coolingAir}</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">FEASIBILITY</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{item.feasibility}%</div>
                  <div className="text-slate-500 text-[9px]">Audited Score</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">CAPEX COST</div>
                  <div className="text-amber-400 font-bold text-xs mt-0.5">{item.costPerSqM}</div>
                  <div className="text-slate-500 text-[9px]">Priority: {item.priorityScore}</div>
                </div>
              </div>

              {/* Engineering Feasibility & Constraint Audit */}
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>ENGINEERING FEASIBILITY & CONSTRAINTS:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {item.spatialConstraint}
                </p>
              </div>

              {/* Scientific Basis */}
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-[10px] text-cyan-glow font-bold flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>SCIENTIFIC PHYSICAL BASIS:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {item.scientificBasis}
                </p>
              </div>

              {/* Recommended Species for Active City */}
              {item.recommendedSpecies && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    <span>RECOMMENDED SPECIES / MATERIALS FOR {cityName.toUpperCase()}:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.recommendedSpecies.map((sp, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => onSelectIntervention && onSelectIntervention(item)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-neon-lime border border-neon-lime/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>SIMULATE THIS INTERVENTION IN WHAT-IF ENGINE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
