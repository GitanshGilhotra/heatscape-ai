import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Flame,
  Cpu,
  ShieldCheck,
  Sliders,
  MessageSquare,
  BarChart2,
  FileText,
  Key,
  ChevronLeft,
  ChevronRight,
  Globe,
  Radio
} from 'lucide-react';

export function Sidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }) {
  const menuGroups = [
    {
      group: "INTELLIGENCE CORE",
      items: [
        { id: "overview", label: "Overview Command", icon: LayoutDashboard },
        { id: "3d-studio", label: "3D Urban Studio", icon: Sparkles, badge: "PRO 3D" },
        { id: "gis-map", label: "GIS Heat Map", icon: Flame, badge: "LIVE GIS" },
      ]
    },
    {
      group: "PREDICTION & OPTIMIZATION",
      items: [
        { id: "prediction", label: "ML Heat Predictor", icon: Cpu },
        { id: "green-zones", label: "Green Zone Ranker", icon: ShieldCheck },
        { id: "cooling-simulator", label: "What-If Simulator", icon: Sliders },
      ]
    },
    {
      group: "AI & ANALYTICS",
      items: [
        { id: "ai-planner", label: "AI Urban Planner", icon: MessageSquare, badge: "RAG AI" },
        { id: "analytics", label: "Analytics Hub", icon: BarChart2 },
        { id: "reports", label: "Impact Reports", icon: FileText },
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#080c16]/95 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between font-mono backdrop-blur-xl ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header & Toggle */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-thermal-orange via-heat-red to-cyan-glow flex items-center justify-center p-0.5 shadow-lg shadow-cyan-glow/20 shrink-0">
              <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-cyan-glow" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5 truncate">
                <div className="font-display font-bold text-sm text-white tracking-wider">
                  HEATSCAPE <span className="text-cyan-glow">// AI</span>
                </div>
                <div className="text-[10px] text-slate-400">URBAN CLIMATE OS</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition hidden sm:block"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-500 tracking-wider">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 group relative ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-glow border border-cyan-500/40 shadow-lg shadow-cyan-500/10 font-bold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition ${
                        isActive ? "text-cyan-glow scale-110" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          item.badge.includes("PRO")
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Telemetry Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>SYSTEM STATUS</span>
              </span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-500">
              NASA Landsat-8 // UN SDG 11 & 13
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-emerald-400" title="System Online">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
