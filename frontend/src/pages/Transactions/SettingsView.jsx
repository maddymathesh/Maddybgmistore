import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Users, Shield, Phone, RefreshCw, CheckCircle2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import SettingsPDFControls from '../../components/settings/SettingsPDFControls';

const PRESET_THEMES = [
  {
    id: 'gold',
    name: 'Premium Gold-Dark (Default)',
    desc: 'The original premium BGMI Store aesthetic',
    colors: {
      gold: '#FFD700',
      goldDim: 'rgba(255, 215, 0, 0.12)',
      goldBorder: 'rgba(255, 215, 0, 0.2)',
      orange: '#FF6B35',
      orangeDim: 'rgba(255, 107, 53, 0.1)',
      bg: '#080A0F',
      bg2: '#0E1118',
      bg3: '#131824',
      card: '#111520',
      borderGold: 'rgba(255, 215, 0, 0.18)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Sleek Cyberpunk',
    desc: 'Neon Cyberpunk interface with magenta accents',
    colors: {
      gold: '#00FFFF',
      goldDim: 'rgba(0, 255, 255, 0.12)',
      goldBorder: 'rgba(0, 255, 255, 0.2)',
      orange: '#FF00FF',
      orangeDim: 'rgba(255, 0, 255, 0.1)',
      bg: '#0A0512',
      bg2: '#140B24',
      bg3: '#1F1135',
      card: '#1B0F2E',
      borderGold: 'rgba(0, 255, 255, 0.18)'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    desc: 'Muted marine shades with sky blue highlights',
    colors: {
      gold: '#38BDF8',
      goldDim: 'rgba(56, 189, 248, 0.12)',
      goldBorder: 'rgba(56, 189, 248, 0.2)',
      orange: '#0284C7',
      orangeDim: 'rgba(2, 132, 199, 0.1)',
      bg: '#030712',
      bg2: '#0F172A',
      bg3: '#1E293B',
      card: '#151E31',
      borderGold: 'rgba(56, 189, 248, 0.18)'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    desc: 'Vibrant digital emerald and dark moss gradients',
    colors: {
      gold: '#10B981',
      goldDim: 'rgba(16, 185, 129, 0.12)',
      goldBorder: 'rgba(16, 185, 129, 0.2)',
      orange: '#047857',
      orangeDim: 'rgba(4, 120, 87, 0.1)',
      bg: '#022C22',
      bg2: '#064E3B',
      bg3: '#0F766E',
      card: '#0A4335',
      borderGold: 'rgba(16, 185, 129, 0.18)'
    }
  }
];

export default function SettingsView() {
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('mbs_theme') || 'gold');
  const [whatsappSupport, setWhatsappSupport] = useState(() => localStorage.getItem('mbs_whatsapp') || '+91 90253 91516');
  const [rolePermissions, setRolePermissions] = useState({
    owner: { create: true, delete: true, viewProfit: true },
    seller: { create: true, delete: false, viewProfit: false },
    loader: { create: false, delete: false, viewProfit: false }
  });

  // Apply theme dynamically to index.css :root variables
  const applyTheme = (themeId) => {
    const theme = PRESET_THEMES.find(t => t.id === themeId);
    if (!theme) return;
    
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, val]) => {
      // Map JS camelCase variables to CSS variables
      const cssKey = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, val);
    });

    setActiveTheme(themeId);
    localStorage.setItem('mbs_theme', themeId);
    toast.success(`Applied ${theme.name}!`);
  };

  const handleSaveSupport = () => {
    localStorage.setItem('mbs_whatsapp', whatsappSupport);
    toast.success('WhatsApp Support Contact updated successfully');
  };

  const handleClearCache = () => {
    localStorage.removeItem('cached_transactions');
    localStorage.removeItem('cached_transactions_time');
    toast.success('Local Storage caching cleared successfully!');
  };

  const togglePermission = (role, perm) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm]
      }
    }));
    toast.success(`Permission updated for ${role}`);
  };

  return (
    <div className="space-y-6">
      {/* Theme Picker */}
      <div className="card" style={{ border: '1px solid var(--border-gold)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={18} style={{ color: 'var(--gold)' }} /> Premium UI Themes
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {PRESET_THEMES.map(theme => (
            <div
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              style={{
                background: activeTheme === theme.id ? 'var(--gold-dim)' : 'var(--bg)',
                border: activeTheme === theme.id ? '2px solid var(--gold)' : '1px solid var(--border)',
                padding: '16px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {activeTheme === theme.id && (
                <CheckCircle2 size={16} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--gold)' }} />
              )}
              <h4 style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{theme.name}</h4>
              <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{theme.desc}</p>
              
              {/* Color dots preview */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: theme.colors.gold }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: theme.colors.orange }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: theme.colors.bg }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role and Permissions Control */}
      <div className="card" style={{ border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} style={{ color: 'var(--orange)' }} /> Access Control & User Roles
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { id: 'owner', label: 'Owner / Administrator', desc: 'Full administrative access' },
            { id: 'seller', label: 'Authorized Seller', desc: 'Can enter sales details' },
            { id: 'loader', label: 'UC Loader Profile', desc: 'Can only fulfill active UC packs' }
          ].map(role => (
            <div key={role.id} style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: '#fff' }}>{role.label}</strong>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>{role.desc}</span>
              
              {/* Permissions list toggles */}
              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(rolePermissions[role.id]).map(([perm, val]) => (
                  <div key={perm} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ textTransform: 'capitalize', color: 'var(--muted)' }}>{perm.replace(/([A-Z])/g, ' $1')}</span>
                    <button
                      onClick={() => togglePermission(role.id, perm)}
                      className={`status ${val ? 'status-available' : 'status-sold'}`}
                      style={{ fontSize: '10px', cursor: 'pointer', padding: '2px 10px' }}
                    >
                      {val ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Default Support configuration & Cache Clear */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Support configuration */}
        <div className="card" style={{ border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} style={{ color: 'var(--gold)' }} /> Default Customer Support
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={whatsappSupport}
              onChange={e => setWhatsappSupport(e.target.value)}
              className="input"
              style={{ flex: 1, height: '38px' }}
              placeholder="+91 90253 91516"
            />
            <button onClick={handleSaveSupport} className="btn btn-gold" style={{ height: '38px', padding: '0 16px', fontSize: '12px' }}>
              Save Contact
            </button>
          </div>
        </div>

        {/* Caching panel */}
        <div className="card" style={{ border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} style={{ color: 'var(--orange)' }} /> Data Refresh & Cache
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '16px' }}>
            Clear local device cache for transactions sheets to pull live records immediately.
          </p>
          <button onClick={handleClearCache} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px', fontSize: '12px' }}>
            <RefreshCw size={12} /> Force Clear Local Cache
          </button>
        </div>
      </div>

      {/* PDF Visibility Configuration preferences */}
      <SettingsPDFControls />
    </div>
  );
}
