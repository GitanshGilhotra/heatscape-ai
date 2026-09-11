import React from 'react';
import { Globe2, ShieldCheck, HeartPulse, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export function SdgImpactSection({ onGenerateReport }) {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-glow/30 text-cyan-glow font-mono text-xs">
          <Globe2 className="w-3.5 h-3.5" />
          <span>SUSTAINABILITY & METHODOLOGY</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          UNITED NATIONS <span className="text-neon-lime">SDG ALIGNMENT</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          HEATSCAPE AI directly contributes to Global Climate Action & Sustainable Urban Development metrics.
        </p>
      </div>

      {/* SDG Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* SDG 11 */}
        <div className="p-6 rounded-2xl glass-panel border border-neon-lime/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-2xl text-neon-lime">SDG 11</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-neon-lime/20 text-neon-lime border border-neon-lime/40">
              TARGET 11.7
            </span>
          </div>
          <h3 className="font-display font-bold text-xl text-white">SUSTAINABLE CITIES & COMMUNITIES</h3>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            Provides universal access to safe, inclusive, and accessible green public spaces by optimizing microclimate canopy density and mitigating severe thermal exposure in vulnerable communities.
          </p>
        </div>

        {/* SDG 13 */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-glow/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-2xl text-cyan-glow">SDG 13</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40">
              TARGET 13.1
            </span>
          </div>
          <h3 className="font-display font-bold text-xl text-white">CLIMATE ACTION</h3>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            Strengthens resilience and adaptive capacity to climate-related thermal hazards through predictive machine learning models and spatial green infrastructure optimization.
          </p>
        </div>

      </div>

      {/* Urban Heat Assessment Report Generator Banner */}
      <div className="glass-panel-glow p-8 rounded-2xl border border-cyan-glow/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-cyan-glow font-mono text-xs">
            <BookOpen className="w-4 h-4" />
            <span>EXECUTIVE CLIMATE REPORTING</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-white">
            GENERATE OFFICIAL URBAN HEAT ISLAND ASSESSMENT REPORT
          </h3>
          <p className="text-slate-300 text-xs max-w-2xl font-sans">
            Export a comprehensive, publication-quality PDF report containing localized LST telemetry, NDVI canopy deficits, priority intervention rankings, and AI planner recommendations.
          </p>
        </div>

        <button
          onClick={onGenerateReport}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-glow to-atmospheric-blue text-black font-display font-bold text-sm shadow-cyan-glow hover:scale-105 transition duration-200 shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>GENERATE URBAN HEAT REPORT (PDF)</span>
        </button>
      </div>

    </section>
  );
}
