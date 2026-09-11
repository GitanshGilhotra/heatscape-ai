import React, { useState } from 'react';
import { X, User, Lock, Mail, Building, Key, ShieldCheck, Sparkles } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('elena.vance@heatscape.ai');
  const [password, setPassword] = useState('cyberpunk123');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password, organization };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem('heatscape_token', json.token);
        onLoginSuccess(json.user);
        onClose();
      } else {
        setErrorMsg(json.message || 'Authentication failed');
      }
    } catch (err) {
      // Fallback guest user authorization if server is not active
      const fallbackUser = {
        id: "usr_guest",
        name: email.split('@')[0] || "Command Operator",
        email: email || "operator@heatscape.ai",
        role: "Lead Climate Analyst",
        organization: organization || "NASA Microclimate Lab"
      };
      localStorage.setItem('heatscape_token', 'mock_jwt_token_2026');
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem('heatscape_token', json.token);
        onLoginSuccess(json.user);
      } else {
        throw new Error();
      }
    } catch (err) {
      const guest = {
        id: "usr_guest",
        name: "Guest Command Officer",
        email: "guest@heatscape.ai",
        role: "Demo Operator",
        organization: "HEATSCAPE Open Research"
      };
      localStorage.setItem('heatscape_token', 'mock_guest_token');
      onLoginSuccess(guest);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-glow/40 max-w-md w-full space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">OPERATOR AUTHENTICATION</h3>
            <div className="text-xs font-mono text-cyan-glow">JWT SECURE COMMAND ACCESS</div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-heat-red/20 border border-heat-red/50 text-heat-red font-mono text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-400 mb-1">OPERATOR FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Elena Vance"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-glow"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@heatscape.ai"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-glow"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">PASSWORD</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-glow"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-slate-400 mb-1">INSTITUTION / ORGANIZATION</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="NASA Urban Microclimate Research"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-glow"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-glow to-atmospheric-blue text-black font-bold font-display shadow-cyan-glow hover:scale-[1.02] transition"
          >
            {loading ? "AUTHENTICATING..." : (mode === 'login' ? "LOG IN TO COMMAND CORE" : "CREATE OPERATOR ACCOUNT")}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="hover:text-cyan-glow transition"
          >
            {mode === 'login' ? "Need account? Register" : "Have account? Login"}
          </button>

          <button
            onClick={handleGuestSession}
            className="text-neon-lime hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Instant Guest Demo
          </button>
        </div>
      </div>
    </div>
  );
}
