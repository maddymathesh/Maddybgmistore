/**
 * PDFControls.jsx
 * MBSx STORE — PDF Field Configuration Preferences Control Panel
 *
 * Placed in SettingsView to customize PDF fields globally using Radio Buttons.
 */

import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────
// COMPREHENSIVE FIELD CONFIG
// ─────────────────────────────────────────────
const FIELD_LISTS = {
  Account: [
    { key: 'transaction_id',                label: 'Transaction ID',           required: true },
    { key: 'transaction_date',              label: 'Transaction Date',         required: true },
    { key: 'mode_of_deal',                  label: 'Mode of Deal' },
    { key: 'mode_of_payment',               label: 'Mode of Payment' },
    { key: 'payment_status',                label: 'Payment Status' },
    { key: 'product_link',                  label: 'Product Link' },
    { key: 'buyer_phone',                   label: 'Buyer Phone',              required: true },
    { key: 'primary_login_provider',        label: 'Primary Login Provider' },
    { key: 'primary_credentials',           label: 'Primary Credentials' },
    { key: 'primary_mothermail_status',     label: 'Primary Mothermail Status' },
    { key: 'secondary_login_provider',      label: 'Secondary Login Provider' },
    { key: 'secondary_credentials',         label: 'Secondary Credentials' },
    { key: 'secondary_mothermail_status',   label: 'Secondary Mothermail Status' },
    { key: 'guarantee_plan',                label: 'Guarantee Plan' },
    { key: 'primary_unlink_date',           label: 'Primary Unlink Date' },
    { key: 'secondary_unlink_date',         label: 'Secondary Unlink Date' },
    { key: 'primary_guarantee_void_date',   label: 'Guarantee Void (Primary)' },
    { key: 'secondary_guarantee_void_date', label: 'Guarantee Void (Secondary)' },
    { key: 'sold_price',                    label: 'Sold Price',               required: true },
    { key: 'owner_price',                   label: 'Cost / Owner Price',       required: true },
    { key: 'profit',                        label: 'Net Profit',               required: true },
    { key: 'owner_phone',                   label: 'Owner Phone' },
    { key: 'seller_phone',                  label: 'Seller Phone' },
    { key: 'reseller_phone',                label: 'Reseller Phone' },
    { key: 'owner_proof_link',              label: 'Owner Proof Link' },
  ],
  XSuit: [
    { key: 'transaction_id',                label: 'Transaction ID',           required: true },
    { key: 'transaction_date',              label: 'Transaction Date',         required: true },
    { key: 'mode_of_deal',                  label: 'Mode of Deal' },
    { key: 'mode_of_payment',               label: 'Mode of Payment' },
    { key: 'payment_status',                label: 'Payment Status' },
    { key: 'buyer_phone',                   label: 'Buyer Phone',              required: true },
    { key: 'xsuit_name',                    label: 'X-Suit Name' },
    { key: 'gift_status',                   label: 'Gift Status' },
    { key: 'delivery_date',                 label: 'Delivery Date' },
    { key: 'delivery_time',                 label: 'Delivery Time' },
    { key: 'buyer_ig_name',                 label: 'Buyer IG Name' },
    { key: 'buyer_ig_id',                   label: 'Buyer IG ID' },
    { key: 'sold_price',                    label: 'Sold Price',               required: true },
    { key: 'owner_price',                   label: 'Cost / Owner Price',       required: true },
    { key: 'profit',                        label: 'Net Profit',               required: true },
    { key: 'gifter_ig_name',                label: 'Gifter IG Name' },
    { key: 'gifter_ig_id',                  label: 'Gifter IG ID' },
    { key: 'owner_phone',                   label: 'Owner Phone' },
    { key: 'seller_phone',                  label: 'Seller Phone' },
    { key: 'reseller_phone',                label: 'Reseller Phone' },
    { key: 'owner_proof_link',              label: 'Owner Proof Link' },
  ],
  Supercar: [
    { key: 'transaction_id',                label: 'Transaction ID',           required: true },
    { key: 'transaction_date',              label: 'Transaction Date',         required: true },
    { key: 'mode_of_deal',                  label: 'Mode of Deal' },
    { key: 'mode_of_payment',               label: 'Mode of Payment' },
    { key: 'payment_status',                label: 'Payment Status' },
    { key: 'buyer_phone',                   label: 'Buyer Phone',              required: true },
    { key: 'supercar_name',                 label: 'Supercar Name' },
    { key: 'supercar_card_tier',            label: 'Card Tier (Tire)' },
    { key: 'gift_status',                   label: 'Gift Status' },
    { key: 'delivery_date',                 label: 'Delivery Date' },
    { key: 'buyer_ig_name',                 label: 'Buyer IG Name' },
    { key: 'buyer_ig_id',                   label: 'Buyer IG ID' },
    { key: 'sold_price',                    label: 'Sold Price',               required: true },
    { key: 'owner_price',                   label: 'Cost / Owner Price',       required: true },
    { key: 'profit',                        label: 'Net Profit',               required: true },
    { key: 'gifter_ig_name',                label: 'Gifter IG Name' },
    { key: 'gifter_ig_id',                  label: 'Gifter IG ID' },
    { key: 'owner_phone',                   label: 'Owner Phone' },
    { key: 'seller_phone',                  label: 'Seller Phone' },
    { key: 'reseller_phone',                label: 'Reseller Phone' },
    { key: 'owner_proof_link',              label: 'Owner Proof Link' },
  ],
  UC: [
    { key: 'transaction_id',                label: 'Transaction ID',           required: true },
    { key: 'transaction_date',              label: 'Transaction Date',         required: true },
    { key: 'mode_of_deal',                  label: 'Mode of Deal' },
    { key: 'mode_of_payment',               label: 'Mode of Payment' },
    { key: 'payment_status',                label: 'Payment Status' },
    { key: 'buyer_phone',                   label: 'Buyer Phone',              required: true },
    { key: 'uc_method',                     label: 'UC Method' },
    { key: 'uc_pack',                       label: 'UC Pack' },
    { key: 'num_packs',                     label: 'Number of Packs' },
    { key: 'total_uc',                      label: 'Total UC' },
    { key: 'delivery_status',               label: 'Delivery Status' },
    { key: 'delivery_date',                 label: 'Delivery Date' },
    { key: 'sold_price',                    label: 'Sold Price',               required: true },
    { key: 'owner_price',                   label: 'Cost / Owner Price',       required: true },
    { key: 'profit',                        label: 'Net Profit',               required: true },
    { key: 'owner_phone',                   label: 'Owner Phone' },
    { key: 'seller_phone',                  label: 'Seller Phone' },
    { key: 'reseller_phone',                label: 'Reseller Phone' },
    { key: 'owner_proof_link',              label: 'Owner Proof Link' },
  ]
};

// Build initial toggle state from defaults (For Customer Copy only)
function buildDefaultToggles(txType) {
  const fields = FIELD_LISTS[txType] || [];
  const result = { customer: {}, internal: {} };
  
  // Define typical internal-only keys
  const internalKeys = ['sold_price', 'owner_price', 'profit', 'owner_phone', 'seller_phone', 'reseller_phone', 'owner_proof_link', 'gifter_ig_name', 'gifter_ig_id'];
  
  for (const field of fields) {
    const isInternalOnly = internalKeys.includes(field.key);
    result.customer[field.key] = !isInternalOnly;
    result.internal[field.key] = true; // Always true for Internal PDF
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
    padding: 24,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#e0e0f0',
    maxWidth: '100%',
  },
  heading: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
    margin: 0,
  },
  subText: {
    color: '#888899',
    fontSize: 12,
    margin: '4px 0 20px',
  },
  typeTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    borderBottom: '1px solid #1e1e30',
    paddingBottom: 12,
  },
  typeTab: (active) => ({
    padding: '8px 16px',
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
  tableWrap: {
    overflowX: 'auto',
    marginBottom: 24,
    border: '1px solid #1e1e30',
    borderRadius: 8,
    background: '#111122',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'left',
  },
  th: {
    padding: '12px 16px',
    background: '#0a0a14',
    color: 'var(--gold)',
    fontWeight: 700,
    borderBottom: '1px solid #1e1e30',
    fontSize: '11px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #1e1e30',
    color: '#fff',
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    userSelect: 'none',
  },
  radioInput: {
    accentColor: '#ffd700',
    cursor: 'pointer',
  },
  requiredBadge: {
    fontSize: 9,
    background: '#ffd70022',
    color: '#ffd700',
    borderRadius: 3,
    padding: '1px 5px',
    letterSpacing: '0.04em',
    marginLeft: '8px',
    fontWeight: 700,
  },
  infoBadge: {
    fontSize: 9,
    background: '#2ecc7122',
    color: '#2ecc71',
    borderRadius: 3,
    padding: '1.5px 6px',
    letterSpacing: '0.04em',
    fontWeight: 700,
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
  btnReset: {
    background: 'none',
    border: '1px solid #333',
    borderRadius: 6,
    color: '#888',
    fontSize: 11,
    cursor: 'pointer',
    padding: '6px 12px',
    transition: 'all 0.2s',
  }
};

// ─────────────────────────────────────────────
// CORE EXPORT COMPONENT
// ─────────────────────────────────────────────
export default function PDFControls() {
  const [selectedType, setSelectedType] = useState('Account');

  const [toggles, setToggles] = useState(() => {
    const raw = localStorage.getItem('mbs_pdf_fields_config');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const complete = { ...parsed };
        for (const type of ['Account', 'XSuit', 'Supercar', 'UC']) {
          if (!complete[type] || !complete[type].customer || !complete[type].internal) {
            complete[type] = buildDefaultToggles(type);
          }
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

  const handleRadioChange = useCallback((type, mode, key, visible) => {
    setToggles(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [mode]: {
          ...prev[type][mode],
          [key]: visible
        }
      }
    }));
  }, []);

  const resetTypeDefaults = useCallback(() => {
    if (window.confirm(`Reset Customer PDF visibility config to default values for ${selectedType}?`)) {
      setToggles(prev => ({
        ...prev,
        [selectedType]: buildDefaultToggles(selectedType)
      }));
      toast.success(`Reset default visibility rules for ${selectedType}`);
    }
  }, [selectedType]);

  const handleSave = () => {
    localStorage.setItem('mbs_pdf_fields_config', JSON.stringify(toggles));
    toast.success('Customer PDF visibility configurations saved successfully!');
  };

  const fields = FIELD_LISTS[selectedType] || [];

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={S.heading}>Customer PDF Field Configurator</p>
          <p style={S.subText}>
            Select which fields are visible in the <strong>Customer copy</strong>. Note: The <strong>Internal Copy (Admin PDF)</strong> is always guaranteed to display all details.
          </p>
        </div>
        <button onClick={resetTypeDefaults} style={S.btnReset} title="Reset current category to factory defaults">
          Reset Default Values
        </button>
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

      {/* Radio Buttons Table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Transaction Data Field</th>
              <th style={S.th}>Customer PDF Visibility</th>
              <th style={S.th}>Internal PDF (Admin Copy)</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(field => {
              const isCustShow = toggles[selectedType]?.customer?.[field.key] !== false;
              const isReq      = !!field.required;

              return (
                <tr key={field.key} style={{ transition: 'background 0.2s' }}>
                  {/* Field Label */}
                  <td style={S.td}>
                    <span style={{ fontWeight: 600 }}>{field.label}</span>
                    {isReq && <span style={S.requiredBadge}>SYSTEM FIELD</span>}
                  </td>

                  {/* Customer PDF Radio Buttons */}
                  <td style={S.td}>
                    <div style={S.radioGroup}>
                      <label style={S.radioLabel}>
                        <input
                          type="radio"
                          name={`cust_${selectedType}_${field.key}`}
                          checked={isCustShow}
                          onChange={() => handleRadioChange(selectedType, 'customer', field.key, true)}
                          style={S.radioInput}
                        />
                        <span style={{ color: isCustShow ? 'var(--gold)' : 'var(--muted)' }}>Show</span>
                      </label>
                      <label style={S.radioLabel}>
                        <input
                          type="radio"
                          name={`cust_${selectedType}_${field.key}`}
                          checked={!isCustShow}
                          onChange={() => handleRadioChange(selectedType, 'customer', field.key, false)}
                          style={S.radioInput}
                        />
                        <span style={{ color: !isCustShow ? '#ef4444' : 'var(--muted)' }}>Hide</span>
                      </label>
                    </div>
                  </td>

                  {/* Internal PDF Visibility (Status only, always show) */}
                  <td style={S.td}>
                    <span style={S.infoBadge}>ALWAYS INCLUDED</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <button style={S.btn} onClick={handleSave} title="Save Customer PDF visibility preferences">
        💾 Save Customer PDF Configuration
      </button>
    </div>
  );
}
