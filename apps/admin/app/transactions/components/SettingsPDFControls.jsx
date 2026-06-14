import React, { useState, useCallback, useMemo } from 'react';
import {
  ALL_FIELDS,
  loadCustomerPDFSettings,
  saveCustomerPDFSettings,
  buildDefaultSettings,
} from '../../lib/pdfFieldConfig';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

// ─── TRANSACTION TYPE TABS ────────────────────────────────────────────────────
const TX_TYPES = ['Account', 'XSuit', 'Supercar', 'UC'];

const TX_TYPE_META = {
  Account:  { icon: '🎮', label: 'BGMI Accounts' },
  XSuit:    { icon: '👗', label: 'X-Suits' },
  Supercar: { icon: '🚗', label: 'Supercars' },
  UC:       { icon: '💎', label: 'UC Top-Ups' },
};

export default function SettingsPDFControls() {
  const [activeType, setActiveType] = useState('Account');
  const [settings,   setSettings]   = useState(() => loadCustomerPDFSettings());
  const [saved,      setSaved]      = useState(true);

  // Get fields for the active transaction type, grouped by section
  const groupedFields = useMemo(() => {
    const relevant = ALL_FIELDS.filter(f => f.txTypes.includes(activeType));
    const grouped  = {};
    for (const field of relevant) {
      if (!grouped[field.section]) grouped[field.section] = [];
      grouped[field.section].push(field);
    }
    return grouped;
  }, [activeType]);

  // Count enabled (non-required) fields for the active type
  const stats = useMemo(() => {
    const relevant  = ALL_FIELDS.filter(f => f.txTypes.includes(activeType) && !f.required);
    const enabled   = relevant.filter(f => settings[f.key] === true).length;
    return { total: relevant.length, enabled };
  }, [activeType, settings]);

  const handleToggle = useCallback((key, required) => {
    if (required) return;
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    const relevant = ALL_FIELDS.filter(f => f.txTypes.includes(activeType));
    const update   = {};
    for (const f of relevant) update[f.key] = true;
    setSettings(prev => ({ ...prev, ...update }));
    setSaved(false);
  }, [activeType]);

  const handleSelectNone = useCallback(() => {
    const relevant = ALL_FIELDS.filter(f => f.txTypes.includes(activeType) && !f.required);
    const update   = {};
    for (const f of relevant) update[f.key] = false;
    setSettings(prev => ({ ...prev, ...update }));
    setSaved(false);
  }, [activeType]);

  const handleResetAll = useCallback(() => {
    if (!window.confirm('Reset ALL transaction types to default PDF field settings?')) return;
    setSettings(buildDefaultSettings());
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveCustomerPDFSettings(settings);
    setSaved(true);
    toast.success('Customer PDF field configurations saved successfully');
  }, [settings]);

  return (
    <div className="glass-panel rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* ── TOP BAR ── */}
      <div className="p-6 border-b border-white/5 relative z-10">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-h uppercase tracking-wider">
          <FileText size={16} className="text-yellow-500" /> Customer PDF — Field Configuration
        </h3>
        <p className="text-[11.5px] text-muted mb-4 leading-relaxed">
          Configure exactly which fields are rendered on the <strong className="text-yellow-500">Customer PDF</strong> format for each transaction type. These visibility settings will instantly apply to all future generated receipts.
        </p>
        
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 flex items-start sm:items-center gap-3">
          <ShieldAlert size={16} className="text-yellow-500 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-yellow-500/90 leading-relaxed font-medium">
            <strong>Internal Admin PDFs are explicitly excluded from these settings.</strong> They are hardcoded to display all sensitive fields and party contacts automatically.
          </p>
        </div>
      </div>

      {/* ── TRANSACTION TYPE TABS ── */}
      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none relative z-10">
        {TX_TYPES.map(type => {
          const meta   = TX_TYPE_META[type];
          const active = activeType === type;
          const rel    = ALL_FIELDS.filter(f => f.txTypes.includes(type) && !f.required);
          const en     = rel.filter(f => settings[f.key] === true).length;
          
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold transition-all duration-300 border-b-2 whitespace-nowrap outline-none ${
                active 
                  ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' 
                  : 'border-transparent text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{meta.icon}</span>
              {meta.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                active ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-muted'
              }`}>
                {en}/{rel.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── BODY ── */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-3">
            <button 
              onClick={handleSelectAll}
              className="px-4 py-1.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
            >
              Select All
            </button>
            <button 
              onClick={handleSelectNone}
              className="px-4 py-1.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
            >
              Select None
            </button>
          </div>
          <span className="text-xs text-muted font-mono bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
            {stats.enabled} of {stats.total} optional fields enabled
          </span>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedFields).map(([section, fields]) => (
            <div key={section}>
              <h4 className="text-xs font-bold text-yellow-500 tracking-widest uppercase border-b border-white/5 pb-2 mb-4 font-h">
                {section}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fields.map(field => {
                  const checked  = field.required ? true : (settings[field.key] ?? field.defaultOn);
                  const disabled = field.required;
                  
                  return (
                    <label
                      key={field.key}
                      onClick={() => handleToggle(field.key, disabled)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 select-none ${
                        disabled 
                          ? 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed' 
                          : checked 
                            ? 'bg-yellow-500/5 border-yellow-500/20 cursor-pointer hover:bg-yellow-500/10' 
                            : 'bg-white/5 border-white/10 cursor-pointer hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        readOnly
                        className="w-4 h-4 rounded border-white/20 bg-black/40 accent-yellow-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-xs font-medium flex-1 ${checked && !disabled ? 'text-white' : 'text-muted'}`}>
                        {field.label}
                      </span>
                      {disabled && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-bold uppercase tracking-wider">
                          Req
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <button 
          onClick={handleResetAll}
          className="text-xs font-bold text-red-500/70 hover:text-red-400 transition-colors duration-200 underline underline-offset-4"
        >
          Reset everything to Default
        </button>
        <button 
          onClick={handleSave}
          className={`px-8 py-2.5 text-xs font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 ${
            saved 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10' 
              : 'bg-yellow-500 text-black shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5'
          }`}
        >
          {saved && <CheckCircle2 size={14} />}
          {saved ? 'Configurations Saved' : 'Save PDF Configurations'}
        </button>
      </div>
    </div>
  );
}
