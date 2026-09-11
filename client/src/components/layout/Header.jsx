import React, { useState } from 'react';
import { Search, Globe, Key, User, Activity, Flame, Sparkles, MapPin, X, ArrowRight } from 'lucide-react';
import { GLOBAL_CITIES_LIST, createDynamicCityObject } from '../../data/globalCities';

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

  const matchedCities = searchQuery.trim()
    ? GLOBAL_CITIES_LIST.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (queryToSearch) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;

    // Check if query matches a city name
    const found = GLOBAL_CITIES_LIST.find(c => c.name.toLowerCase() === q.toLowerCase());
    if (found) {
      setActiveCity(createDynamicCityObject(found.name));
    } else if (q.length > 2 && !q.toLowerCase().startsWith('why') && !q.toLowerCase().startsWith('how') && !q.toLowerCase().startsWith('what')) {
      // Custom dynamic city search anywhere in the world!
      setActiveCity(createDynamicCityObject(q));
    }

    onSearchSubmit(q);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
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
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search any world city (e.g. Paris, Dubai, Sydney, Berlin)..."
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-cyan-glow/40 rounded-xl p-2 shadow-2xl space-y-1 text-xs z-50 backdrop-blur-xl">
            {matchedCities.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-bold px-2 py-0.5">MATCHING GLOBAL CITIES</div>
                {matchedCities.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCity(createDynamicCityObject(c.name));
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-thermal-orange" />
                      {c.name}, {c.country}
                    </span>
                    <span className="text-cyan-glow font-bold">{c.temp}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-slate-800/80 pt-1">
              <button
                onClick={() => handleSearchSubmit()}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-cyan-glow flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Analyze Heat Telemetry for "{searchQuery}"</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Target Megacity Selector & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Megacity Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <MapPin className="w-3.5 h-3.5 text-thermal-orange" />
          <select
            value={activeCity.id || activeCity.name.toLowerCase()}
            onChange={(e) => {
              const selected = GLOBAL_CITIES_LIST.find(c => c.id === e.target.value || c.name.toLowerCase() === e.target.value);
              if (selected) {
                setActiveCity(createDynamicCityObject(selected.name));
              }
            }}
            className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer max-w-[160px] truncate"
          >
            {GLOBAL_CITIES_LIST.map((city) => (
              <option key={city.id} value={city.id} className="bg-slate-950 text-slate-200">
                {city.name}, {city.country} ({city.temp})
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
