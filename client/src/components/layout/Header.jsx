import React, { useState } from 'react';
import { Search, Globe, Key, User, Activity, Flame, Sparkles, MapPin, X } from 'lucide-react';

const CITIES_LIST = [
  { id: "delhi", name: "New Delhi", country: "India", temp: "45.2°C" },
  { id: "phoenix", name: "Phoenix", country: "USA", temp: "49.1°C" },
  { id: "tokyo", name: "Tokyo", country: "Japan", temp: "40.8°C" },
  { id: "mumbai", name: "Mumbai", country: "India", temp: "43.6°C" },
  { id: "london", name: "London", country: "UK", temp: "33.2°C" },
  { id: "singapore", name: "Singapore", country: "Singapore", temp: "36.5°C" },
  { id: "nyc", name: "New York", country: "USA", temp: "38.9°C" },
  { id: "cairo", name: "Cairo", country: "Egypt", temp: "44.1°C" }
];

export function Header({
  activeCity,
  setActiveCity,
  onOpenAuth,
  onOpenApiKeys,
  currentUser,
  onSearchSubmit
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#080c16]/80 backdrop-blur-xl px-6 flex items-center justify-between gap-4 sticky top-0 z-30 font-mono">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search city, heat zone, intervention, or ask AI..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 focus:border-cyan-glow focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Suggestion Popup Overlay */}
        {isSearchFocused && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-cyan-glow/30 rounded-xl p-2 shadow-2xl space-y-1 text-xs z-50 backdrop-blur-xl">
            <div className="text-[10px] text-slate-500 font-bold px-2 py-1">SUGGESTED SEARCHES</div>
            <button
              onClick={() => {
                onSearchSubmit(`Search zone ${searchQuery}`);
                setIsSearchFocused(false);
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-cyan-glow flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI: "{searchQuery}"</span>
            </button>
          </div>
        )}
      </div>

      {/* Target Megacity Selector & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Megacity Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <MapPin className="w-3.5 h-3.5 text-thermal-orange" />
          <select
            value={activeCity.id}
            onChange={(e) => {
              const selected = CITIES_LIST.find(c => c.id === e.target.value);
              if (selected) setActiveCity(selected);
            }}
            className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
          >
            {CITIES_LIST.map((city) => (
              <option key={city.id} value={city.id} className="bg-slate-950 text-slate-200">
                {city.name} ({city.temp})
              </option>
            ))}
          </select>
        </div>

        {/* Live System Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-cyan-glow/30 px-3 py-1.5 rounded-xl text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">API CORE:</span>
          <span className="text-emerald-400 font-bold">ACTIVE</span>
        </div>

        {/* API Key Config Modal Trigger */}
        <button
          onClick={onOpenApiKeys}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs transition"
          title="Configure Environment API Keys"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">.ENV API</span>
        </button>

        {/* Operator Login Profile Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-glow/20 to-blue-600/20 hover:from-cyan-glow/30 hover:to-blue-600/30 border border-cyan-glow/50 text-cyan-glow text-xs font-bold transition shadow-cyan-glow"
        >
          <User className="w-3.5 h-3.5 text-cyan-glow" />
          <span className="truncate max-w-[110px]">
            {currentUser ? currentUser.name : 'OPERATOR LOGIN'}
          </span>
        </button>
      </div>
    </header>
  );
}
