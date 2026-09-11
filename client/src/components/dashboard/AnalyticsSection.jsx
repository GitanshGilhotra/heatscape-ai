import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { BarChart2, TrendingDown, Shield, PieChart as PieIcon } from 'lucide-react';

export function AnalyticsSection() {
  const lstVsNdviData = [
    { ndvi: 0.04, lst: 47.4 },
    { ndvi: 0.08, lst: 45.2 },
    { ndvi: 0.12, lst: 42.8 },
    { ndvi: 0.18, lst: 41.5 },
    { ndvi: 0.25, lst: 38.6 },
    { ndvi: 0.35, lst: 35.8 },
    { ndvi: 0.50, lst: 32.4 },
    { ndvi: 0.65, lst: 30.1 }
  ];

  const heatRiskPieData = [
    { name: "Extreme Risk (>46°C)", value: 24, color: "#ff2a5f" },
    { name: "Critical Risk (42-46°C)", value: 42, color: "#ff5500" },
    { name: "High Risk (38-42°C)", value: 22, color: "#ffaa00" },
    { name: "Moderate Risk (34-38°C)", value: 8, color: "#0088ff" },
    { name: "Optimal (<34°C)", value: 4, color: "#00ff88" }
  ];

  const coolingProjectionData = [
    { scenario: "Current Baseline", temp: 44.5, fill: "#ff2a5f" },
    { scenario: "15% Canopy", temp: 42.1, fill: "#ff5500" },
    { scenario: "30% Canopy + Roofs", temp: 39.4, fill: "#0088ff" },
    { scenario: "Full Green Infra", temp: 36.8, fill: "#00ff88" }
  ];

  return (
    <section id="analytics" className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-glow/30 text-cyan-glow font-mono text-xs">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>CLIMATE ANALYTICS COMMAND CENTER</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          QUANTITATIVE <span className="text-cyan-glow">MICROCLIMATE INSIGHTS</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Empirical correlations between Land Surface Temperature (LST), NDVI canopy density, and projected green infrastructure ROI.
        </p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LST vs NDVI Scatter Correlation */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-glow" />
              LST vs NDVI INVERSE CORRELATION
            </span>
            <span className="text-neon-lime">R² = 0.948</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="ndvi" name="NDVI" unit="" domain={[0, 0.7]} stroke="#64748b" />
                <YAxis type="number" dataKey="lst" name="LST" unit="°C" domain={[28, 50]} stroke="#64748b" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0d111a', border: '1px solid #00f3ff', borderRadius: '8px' }} />
                <Scatter name="Zones" data={lstVsNdviData} fill="#00f3ff" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-400 text-xs font-mono">
            *Strong inverse correlation: Higher NDVI vegetation index directly suppresses Land Surface Temperature.
          </p>
        </div>

        {/* Heat Risk Distribution Pie */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-thermal-orange" />
              SPATIAL HEAT RISK DISTRIBUTION
            </span>
            <span className="text-slate-400">N = 250 URBAN ZONES</span>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={heatRiskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {heatRiskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d111a', border: '1px solid #ff5500', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cooling Projection Bar Chart */}
        <div className="lg:col-span-12 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-neon-lime" />
              PROJECTED COOLING DELTA ACROSS INTERVENTION SCENARIOS
            </span>
            <span className="text-neon-lime font-bold">MAX DROP: -7.7°C</span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coolingProjectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="scenario" stroke="#94a3b8" />
                <YAxis domain={[30, 48]} unit="°C" stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0d111a', border: '1px solid #00ff88', borderRadius: '8px' }} />
                <Bar dataKey="temp" radius={[8, 8, 0, 0]}>
                  {coolingProjectionData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
}
