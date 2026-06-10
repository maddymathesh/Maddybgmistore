/**
 * SettingsPDFControls.jsx
 * MBSx STORE — Settings Page: Customer PDF Field Configuration
 *
 * PURPOSE:
 *   Lets admins configure which fields appear on the Customer PDF.
 *   Settings are saved to localStorage and read by pdfGenerator.js at generation time.
 *   Internal PDF always shows everything — no configuration needed or shown here.
 *
 * PLACEMENT:
 *   Add this component inside your SettingsView.jsx page.
 *
 * USAGE:
 *   import SettingsPDFControls from './SettingsPDFControls';
 *   <SettingsPDFControls />
 *
 * NO PROPS NEEDED — reads and writes localStorage directly via pdfFieldConfig helpers.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  ALL_FIELDS,
  loadCustomerPDFSettings,
  saveCustomerPDFSettings,
  buildDefaultSettings,
} from '../../lib/pdfFieldConfig';

// ─── TRANSACTION TYPE TABS ────────────────────────────────────────────────────
const TX_TYPES = ['Account', 'XSuit', 'Supercar', 'UC'];

const TX_TYPE_META = {
  Account:  { icon: '🎮', label: 'BGMI Accounts',  color: '#ffd700' },
  XSuit:    { icon: '👗', label: 'X-Suits',         color: '#ffd700' },
  Supercar: { icon: '🚗', label: 'Supercars',       color: '#ffd700' },
  UC:       { icon: '💎', label: 'UC Top-Ups',      color: '#ffd700' },
};

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
const S = {
  wrap: {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(10px)',
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    color: '#dde0f0',
    maxWidth: 860,
    width: '100%',
  },
  topBar: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '18px 24px 14px',
  },
  topTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--color-gold)',
  },
  topSub: {
    margin: '4px 0 0',
    fontSize: 11.5,
    color: 'var(--color-muted)',
    lineHeight: 1.5,
  },
  internalBanner: {
    margin: '14px 0 0',
    padding: '10px 14px',
    background: 'rgba(255, 215, 0, 0.03)',
    border: '1px solid rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    fontSize: 11.5,
    color: 'var(--color-gold)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  tabBar: {
    display: 'flex',
    gap: 0,
    padding: '16px 24px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  tab: (active, color) => ({
    padding: '8px 18px',
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    color: active ? 'var(--color-gold)' : 'var(--color-muted)',
    background: 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid var(--color-gold)' : '2px solid transparent',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    marginBottom: -1,
    transition: 'color 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }),
  body: {
    padding: '20px 24px',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--color-gold)',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '4px 8px',
  },
  fieldRow: (disabled, checked) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '7px 10px',
    borderRadius: 6,
    background: checked && !disabled ? 'rgba(255, 215, 0, 0.02)' : 'transparent',
    border: checked && !disabled ? '1px solid rgba(255, 215, 0, 0.08)' : '1px solid transparent',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 0.12s, border-color 0.12s',
  }),
  checkbox: {
    accentColor: 'var(--color-gold)',
    width: 14,
    height: 14,
    flexShrink: 0,
    cursor: 'pointer',
  },
  fieldLabel: {
    fontSize: 11.5,
    color: '#b8bcd0',
    flex: 1,
    userSelect: 'none',
  },
  reqBadge: {
    fontSize: 8.5,
    padding: '1px 5px',
    borderRadius: 3,
    background: 'rgba(255, 215, 0, 0.08)',
    color: 'var(--color-gold)',
    letterSpacing: '0.06em',
    flexShrink: 0,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  toolbarLeft: {
    display: 'flex',
    gap: 6,
  },
  smallBtn: (variant) => {
    const base = {
      fontSize: 11,
      padding: '4px 11px',
      borderRadius: 5,
      cursor: 'pointer',
      border: '1px solid',
      transition: 'all 0.12s',
    };
    if (variant === 'ghost')   return { ...base, background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)', color: 'var(--color-muted)' };
    if (variant === 'danger')  return { ...base, background: 'transparent', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
    return base;
  },
  footer: {
    padding: '14px 24px 18px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveBtn: (saved) => ({
    padding: '10px 28px',
    borderRadius: 8,
    border: 'none',
    background: saved ? '#1e3a1e' : 'var(--color-gold)',
    color: saved ? '#2ecc71' : '#0d0d1a',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }),
  statusText: {
    fontSize: 11,
    color: 'var(--color-muted)',
  },
  toast: (visible) => ({
    position: 'fixed',
    bottom: 28,
    right: 28,
    background: '#1a2a1a',
    border: '1px solid #2ecc71',
    borderRadius: 8,
    padding: '10px 18px',
    color: '#2ecc71',
    fontSize: 13,
    fontWeight: 600,
    zIndex: 9999,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: 'opacity 0.25s, transform 0.25s',
    pointerEvents: 'none',
  }),
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function SettingsPDFControls() {
  const [activeType, setActiveType] = useState('Account');
  const [settings,   setSettings]   = useState(() => loadCustomerPDFSettings());
  const [saved,      setSaved]       = useState(false);
  const [toastVisible, setToast]     = useState(false);

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
    if (!window.confirm('Reset ALL transaction types to default settings?')) return;
    setSettings(buildDefaultSettings());
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveCustomerPDFSettings(settings);
    setSaved(true);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  }, [settings]);

  return (
    <>
      <div style={S.wrap}>

        {/* ── TOP BAR ── */}
        <div style={S.topBar}>
          <p style={S.topTitle}>Customer PDF — Field Controls</p>
          <p style={S.topSub}>
            Choose exactly which fields appear on the <strong style={{ color: 'var(--color-gold)' }}>Customer PDF</strong> for each transaction type.
            These settings are saved and applied every time a Customer PDF is generated.
          </p>
          <div style={S.internalBanner}>
            <span>🔒</span>
            <span>
              <strong>Internal PDF is not configured here.</strong> It always includes every field automatically — no settings needed.
            </span>
          </div>
        </div>

        {/* ── TRANSACTION TYPE TABS ── */}
        <div style={S.tabBar}>
          {TX_TYPES.map(type => {
            const meta    = TX_TYPE_META[type];
            const active  = activeType === type;
            // Count enabled for this type
            const rel     = ALL_FIELDS.filter(f => f.txTypes.includes(type) && !f.required);
            const en      = rel.filter(f => settings[f.key] === true).length;
            return (
              <button
                key={type}
                style={S.tab(active, meta.color)}
                onClick={() => setActiveType(type)}
              >
                <span>{meta.icon}</span>
                {meta.label}
                <span style={{
                  fontSize: 9,
                  padding: '1px 5px',
                  borderRadius: 10,
                  background: active ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: active ? 'var(--color-gold)' : 'var(--color-muted)',
                  marginLeft: 6,
                }}>
                  {en}/{rel.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── BODY ── */}
        <div style={S.body}>

          {/* Toolbar row */}
          <div style={S.toolbar}>
            <div style={S.toolbarLeft}>
              <button style={S.smallBtn('ghost')} onClick={handleSelectAll}>Select All</button>
              <button style={S.smallBtn('ghost')} onClick={handleSelectNone}>Select None</button>
            </div>
            <span style={S.statusText}>
              {stats.enabled} of {stats.total} optional fields enabled for {TX_TYPE_META[activeType].label}
            </span>
          </div>

          {/* Field sections */}
          {Object.entries(groupedFields).map(([section, fields]) => (
            <div key={section} style={S.sectionBlock}>
              <div style={S.sectionTitle}>{section}</div>
              <div style={S.fieldGrid}>
                {fields.map(field => {
                  const checked  = field.required ? true : (settings[field.key] ?? field.defaultOn);
                  const disabled = field.required;
                  return (
                    <label
                      key={field.key}
                      style={S.fieldRow(disabled, checked)}
                      onClick={() => handleToggle(field.key, disabled)}
                    >
                      <input
                        type="checkbox"
                        style={S.checkbox}
                        checked={checked}
                        disabled={disabled}
                        readOnly
                      />
                      <span style={S.fieldLabel}>{field.label}</span>
                      {disabled && <span style={S.reqBadge}>REQUIRED</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={S.footer}>
          <button style={S.smallBtn('danger')} onClick={handleResetAll}>
            Reset All to Defaults
          </button>
          <button style={S.saveBtn(saved)} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Save toast */}
      <div style={S.toast(toastVisible)}>
        ✓ Customer PDF settings saved
      </div>
    </>
  );
}
