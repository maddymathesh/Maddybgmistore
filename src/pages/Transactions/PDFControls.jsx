/**
 * PDFControls.jsx
 * MBSx STORE — PDF Field Configuration Preferences Control Panel
 *
 * Placed in SettingsView to customize PDF fields globally.
 */

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────
// FIELD VISIBILITY CONFIG
// ─────────────────────────────────────────────
const FIELD_GROUPS = {
  Account: {
    customer: [
      { key: 'transaction_id',                label: 'Transaction ID',           default: true,  required: true },
      { key: 'transaction_date',              label: 'Transaction Date',         default: true,  required: true },
      { key: 'mode_of_deal',                  label: 'Mode of Deal',             default: true  },
      { key: 'mode_of_payment',               label: 'Mode of Payment',          default: true  },
      { key: 'payment_status',                label: 'Payment Status',           default: true  },
      { key: 'product_link',                  label: 'Product Link',             default: true  },
      { key: 'primary_login_provider',        label: 'Primary Login Provider',   default: true  },
      { key: 'primary_credentials',           label: 'Primary Credentials',      default: true  },
      { key: 'secondary_login_provider',      label: 'Secondary Login Provider', default: true  },
      { key: 'secondary_credentials',         label: 'Secondary Credentials',    default: true  },
      { key: 'primary_mothermail_status',     label: 'Primary Mothermail',       default: true  },
      { key: 'secondary_mothermail_status',   label: 'Secondary Mothermail',     default: true  },
      { key: 'guarantee_plan',                label: 'Guarantee Plan',           default: true  },
      { key: 'primary_unlink_date',           label: 'Primary Unlink Date',      default: true  },
      { key: 'secondary_unlink_date',         label: 'Secondary Unlink Date',    default: true  },
      { key: 'primary_guarantee_void_date',   label: 'Guarantee Void (Primary)', default: true  },
      { key: 'secondary_guarantee_void_date', label: 'Guarantee Void (Secondary)',default: true },
      { key: 'buyer_phone',                   label: 'Buyer Phone',              default: true,  required: true },
    ],
    internal: [
      { key: 'sold_price',      label: 'Sold Price',      default: true, required: true },
      { key: 'owner_price',     label: 'Cost / Owner Price', default: true, required: true },
      { key: 'profit',          label: 'Net Profit',       default: true, required: true },
      { key: 'owner_phone',     label: 'Owner Phone',      default: true },
      { key: 'seller_phone',    label: 'Seller Phone',     default: true },
      { key: 'reseller_phone',  label: 'Reseller Phone',   default: true },
      { key: 'owner_proof_link',label: 'Owner Proof Link', default: true },
    ],
  },
  XSuit: {
    customer: [
      { key: 'transaction_id',    label: 'Transaction ID',    default: true, required: true },
      { key: 'transaction_date',  label: 'Transaction Date',  default: true, required: true },
      { key: 'mode_of_deal',      label: 'Mode of Deal',      default: true },
      { key: 'mode_of_payment',   label: 'Mode of Payment',   default: true },
      { key: 'payment_status',    label: 'Payment Status',    default: true },
      { key: 'xsuit_name',        label: 'X-Suit Name',       default: true },
      { key: 'gift_status',       label: 'Gift Status',       default: true },
      { key: 'delivery_date',     label: 'Delivery Date',     default: true },
      { key: 'delivery_time',     label: 'Delivery Time',     default: true },
      { key: 'buyer_ig_name',     label: 'Buyer IG Name',     default: true },
      { key: 'buyer_ig_id',       label: 'Buyer IG ID',       default: true },
      { key: 'buyer_phone',       label: 'Buyer Phone',       default: true, required: true },
    ],
    internal: [
      { key: 'sold_price',      label: 'Sold Price',         default: true, required: true },
      { key: 'owner_price',     label: 'Cost / Owner Price', default: true, required: true },
      { key: 'profit',          label: 'Net Profit',         default: true, required: true },
      { key: 'gifter_ig_name',  label: 'Gifter IG Name',     default: true },
      { key: 'gifter_ig_id',    label: 'Gifter IG ID',       default: true },
      { key: 'owner_phone',     label: 'Owner Phone',        default: true },
      { key: 'seller_phone',    label: 'Seller Phone',       default: true },
      { key: 'reseller_phone',  label: 'Reseller Phone',     default: true },
      { key: 'owner_proof_link',label: 'Owner Proof Link',   default: true },
    ],
  },
  Supercar: {
    customer: [
      { key: 'transaction_id',       label: 'Transaction ID',    default: true, required: true },
      { key: 'transaction_date',     label: 'Transaction Date',  default: true, required: true },
      { key: 'mode_of_deal',         label: 'Mode of Deal',      default: true },
      { key: 'mode_of_payment',      label: 'Mode of Payment',   default: true },
      { key: 'payment_status',       label: 'Payment Status',    default: true },
      { key: 'supercar_name',        label: 'Supercar Name',     default: true },
      { key: 'supercar_card_tier',   label: 'Card Tier (Tire)',  default: true },
      { key: 'gift_status',          label: 'Gift Status',       default: true },
      { key: 'delivery_date',        label: 'Delivery Date',     default: true },
      { key: 'buyer_ig_name',        label: 'Buyer IG Name',     default: true },
      { key: 'buyer_ig_id',          label: 'Buyer IG ID',       default: true },
      { key: 'buyer_phone',          label: 'Buyer Phone',       default: true, required: true },
    ],
    internal: [
      { key: 'sold_price',      label: 'Sold Price',         default: true, required: true },
      { key: 'owner_price',     label: 'Cost / Owner Price', default: true, required: true },
      { key: 'profit',          label: 'Net Profit',         default: true, required: true },
      { key: 'gifter_ig_name',  label: 'Gifter IG Name',     default: true },
      { key: 'gifter_ig_id',    label: 'Gifter IG ID',       default: true },
      { key: 'owner_phone',     label: 'Owner Phone',        default: true },
      { key: 'seller_phone',    label: 'Seller Phone',       default: true },
      { key: 'reseller_phone',  label: 'Reseller Phone',     default: true },
      { key: 'owner_proof_link',label: 'Owner Proof Link',   default: true },
    ],
  },
  UC: {
    customer: [
      { key: 'transaction_id',   label: 'Transaction ID',   default: true, required: true },
      { key: 'transaction_date', label: 'Transaction Date', default: true, required: true },
      { key: 'mode_of_deal',     label: 'Mode of Deal',     default: true },
      { key: 'mode_of_payment',  label: 'Mode of Payment',  default: true },
      { key: 'payment_status',   label: 'Payment Status',   default: true },
      { key: 'uc_method',        label: 'UC Method',        default: true },
      { key: 'uc_pack',          label: 'UC Pack',          default: true },
      { key: 'num_packs',        label: 'Number of Packs',  default: true },
      { key: 'total_uc',         label: 'Total UC',         default: true },
      { key: 'delivery_status',  label: 'Delivery Status',  default: true },
      { key: 'delivery_date',    label: 'Delivery Date',    default: true },
      { key: 'buyer_phone',      label: 'Buyer Phone',      default: true, required: true },
    ],
    internal: [
      { key: 'sold_price',      label: 'Sold Price',         default: true, required: true },
      { key: 'owner_price',     label: 'Cost / Owner Price', default: true, required: true },
      { key: 'profit',          label: 'Net Profit',         default: true, required: true },
      { key: 'owner_phone',     label: 'Owner Phone',        default: true },
      { key: 'seller_phone',    label: 'Seller Phone',       default: true },
      { key: 'reseller_phone',  label: 'Reseller Phone',     default: true },
      { key: 'owner_proof_link',label: 'Owner Proof Link',   default: true },
    ],
  },
};

// Build initial toggle state from defaults
function buildDefaultToggles(txType) {
  const groups = FIELD_GROUPS[txType] || {};
  const result = {};
  for (const mode of ['customer', 'internal']) {
    result[mode] = {};
    for (const field of (groups[mode] || [])) {
      result[mode][field.key] = field.default;
    }
  }
  return result;
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container: {
    background: '#0d0d1a',
    border: '1px solid #2a2a3d',
    borderRadius: 12,
    padding: 20,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#e0e0f0',
    maxWidth: '100%',
  },
  heading: {
    color: '#ffd700',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
    margin: 0,
  },
  subText: {
    color: '#888899',
    fontSize: 12,
    margin: '4px 0 18px',
  },
  typeTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    borderBottom: '1px solid #1e1e30',
    paddingBottom: 12,
  },
  typeTab: (active) => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: active ? '1px solid #ffd700' : '1px solid #2a2a3d',
    background: active ? 'rgba(255,215,0,0.15)' : 'transparent',
    color: active ? '#ffd700' : '#c8c8e0',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.05em',
    transition: 'all 0.15s',
  }),
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  tab: (active) => ({
    padding: '6px 18px',
    borderRadius: 6,
    border: active ? '1px solid #ffd700' : '1px solid #333',
    background: active ? 'rgba(255,215,0,0.12)' : 'transparent',
    color: active ? '#ffd700' : '#888',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    letterSpacing: '0.05em',
    transition: 'all 0.15s',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '6px 12px',
    marginBottom: 20,
    padding: '14px',
    background: '#111122',
    borderRadius: 8,
    border: '1px solid #1e1e30',
  },
  checkRow: (disabled) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  checkbox: {
    accentColor: '#ffd700',
    width: 14,
    height: 14,
    cursor: 'pointer',
  },
  checkLabel: {
    fontSize: 12,
    color: '#c8c8e0',
    userSelect: 'none',
  },
  requiredBadge: {
    fontSize: 9,
    background: '#ffd70022',
    color: '#ffd700',
    borderRadius: 3,
    padding: '1px 5px',
    letterSpacing: '0.04em',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.05em',
    transition: 'all 0.15s',
    background: '#ffd700',
    color: '#0d0d1a',
    width: '100%',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.25)',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #1e1e30',
    margin: '14px 0',
  },
};

// ─────────────────────────────────────────────
// COMPOSITE CONFIG PANEL
// ─────────────────────────────────────────────
export default function PDFControls() {
  const [selectedType, setSelectedType] = useState('Account');
  const [activeTab, setActiveTab]       = useState('customer');

  const [toggles, setToggles] = useState(() => {
    const raw = localStorage.getItem('mbs_pdf_fields_config');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Ensure all types exist in saved state
        const complete = { ...parsed };
        for (const type of ['Account', 'XSuit', 'Supercar', 'UC']) {
          if (!complete[type]) complete[type] = buildDefaultToggles(type);
        }
        return complete;
      } catch (e) {}
    }
    
    // Default config
    const config = {};
    for (const type of ['Account', 'XSuit', 'Supercar', 'UC']) {
      config[type] = buildDefaultToggles(type);
    }
    return config;
  });

  const handleToggle = useCallback((type, mode, key) => {
    setToggles(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [mode]: {
          ...prev[type][mode],
          [key]: !prev[type][mode][key]
        }
      }
    }));
  }, []);

  const resetToggles = useCallback(() => {
    setToggles(prev => ({
      ...prev,
      [selectedType]: buildDefaultToggles(selectedType)
    }));
  }, [selectedType]);

  const handleSave = () => {
    localStorage.setItem('mbs_pdf_fields_config', JSON.stringify(toggles));
    toast.success('PDF field preferences saved successfully!');
  };

  const currentFields = FIELD_GROUPS[selectedType]?.[activeTab] || [];

  return (
    <div style={S.container}>
      {/* Header */}
      <div>
        <p style={S.heading}>PDF Field Configurator</p>
        <p style={S.subText}>
          Configure which data fields are drawn inside customer receipts vs. internal admin copies globally.
        </p>
      </div>

      {/* Transaction Type Tabs */}
      <div style={S.typeTabs}>
        {['Account', 'XSuit', 'Supercar', 'UC'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={S.typeTab(selectedType === type)}
          >
            {type === 'XSuit' ? 'X-Suit' : type}
          </button>
        ))}
      </div>

      {/* Copy Mode tabs */}
      <div style={S.tabs}>
        {['customer', 'internal'].map(mode => (
          <button
            key={mode}
            style={S.tab(activeTab === mode)}
            onClick={() => setActiveTab(mode)}
          >
            {mode === 'customer' ? '👤 Customer PDF Fields' : '🔒 Internal PDF Fields'}
          </button>
        ))}
        <button
          onClick={resetToggles}
          style={{
            marginLeft: 'auto', background: 'none', border: '1px solid #333',
            borderRadius: 6, color: '#888', fontSize: 11, cursor: 'pointer',
            padding: '4px 10px',
          }}
        >
          Reset Type
        </button>
      </div>

      {/* Select All / None */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[['Select All', true], ['Select None', false]].map(([label, val]) => (
          <button
            key={label}
            onClick={() => {
              const next = {};
              for (const f of currentFields) {
                if (!f.required) next[f.key] = val;
                else next[f.key] = true;
              }
              setToggles(prev => ({
                ...prev,
                [selectedType]: {
                  ...prev[selectedType],
                  [activeTab]: {
                    ...prev[selectedType][activeTab],
                    ...next
                  }
                }
              }));
            }}
            style={{
              background: 'none', border: '1px solid #2a2a3d', borderRadius: 4,
              color: '#888', fontSize: 10, cursor: 'pointer', padding: '3px 9px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Field grid */}
      <div style={S.grid}>
        {currentFields.map(field => {
          const checked  = toggles[selectedType]?.[activeTab]?.[field.key] ?? field.default;
          const disabled = !!field.required;
          return (
            <label
              key={field.key}
              style={S.checkRow(disabled)}
              title={disabled ? 'Required field — always included' : ''}
            >
              <input
                type="checkbox"
                style={S.checkbox}
                checked={checked}
                disabled={disabled}
                onChange={() => handleToggle(selectedType, activeTab, field.key)}
              />
              <span style={S.checkLabel}>{field.label}</span>
              {disabled && <span style={S.requiredBadge}>REQ</span>}
            </label>
          );
        })}
      </div>

      <hr style={S.divider} />

      {/* Save preferences button */}
      <button style={S.btn} onClick={handleSave}>
        💾 Save PDF Visibility preferences
      </button>
    </div>
  );
}
