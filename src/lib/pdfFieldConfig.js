/**
 * pdfFieldConfig.js
 * MBSx STORE — Master PDF Field Registry
 *
 * This is the SINGLE SOURCE OF TRUTH for every field that can appear in a PDF.
 *
 * Rules:
 *  - Internal PDF  → always draws EVERY field. Never filtered. Never changes.
 *  - Customer PDF  → only draws fields where the saved setting is `true`.
 *                    Settings are managed in SettingsPDFControls (Settings page).
 *
 * Each field entry:
 *  key        — matches the exact property key on the joined transaction object
 *               (or on its sub-table rows: account_transactions[0], xsuit_transactions[0], etc.)
 *  label      — human-readable name shown in the Settings UI and in the PDF
 *  section    — which PDF section this field renders inside
 *  required   — if true, CANNOT be turned off for the Customer PDF (always shown)
 *  defaultOn  — pre-selected state in the Settings UI for first-time setup
 *  source     — 'core' (top-level tx object) | 'account' | 'xsuit' | 'supercar' | 'uc'
 *  txTypes    — which transaction types this field applies to
 */

// ─── STORAGE KEY ────────────────────────────────────────────────────────────
// Used by SettingsPDFControls (save) and pdfGenerator (read).
export const CUSTOMER_PDF_SETTINGS_KEY = 'mbsx_customer_pdf_fields';

// ─── MASTER FIELD REGISTRY ──────────────────────────────────────────────────
export const ALL_FIELDS = [

  // ── CORE DEAL FIELDS (shared across all transaction types) ────────────────
  {
    key: 'transaction_id',
    label: 'Transaction ID',
    section: 'Transaction Details',
    required: true,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },
  {
    key: 'transaction_date',
    label: 'Transaction Date',
    section: 'Transaction Details',
    required: true,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },
  {
    key: 'transaction_type',
    label: 'Transaction Type',
    section: 'Transaction Details',
    required: false,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },
  {
    key: 'mode_of_deal',
    label: 'Mode of Deal',
    section: 'Transaction Details',
    required: false,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },
  {
    key: 'mode_of_payment',
    label: 'Mode of Payment',
    section: 'Transaction Details',
    required: false,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },
  {
    key: 'payment_status',
    label: 'Payment Status',
    section: 'Transaction Details',
    required: false,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },
  {
    key: 'sold_price',
    label: 'Sold Price (Customer-Facing)',
    section: 'Transaction Details',
    required: false,
    defaultOn: false, // Off by default — only show if you want customer to see price
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },

  // ── CUSTOMER CONTACTS ─────────────────────────────────────────────────────
  {
    key: 'buyer_phone',
    label: 'Buyer Phone',
    section: 'Contact Information',
    required: true,
    defaultOn: true,
    source: 'core',
    txTypes: ['Account', 'XSuit', 'Supercar', 'UC'],
  },

  // ── ACCOUNT FIELDS ────────────────────────────────────────────────────────
  {
    key: 'primary_login_provider',
    label: 'Primary Login Provider',
    section: 'Account Login Details',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'primary_credentials',
    label: 'Primary Credentials',
    section: 'Account Login Details',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'primary_mothermail_status',
    label: 'Primary Mothermail Status',
    section: 'Account Login Details',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'secondary_login_provider',
    label: 'Secondary Login Provider',
    section: 'Account Login Details',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'secondary_credentials',
    label: 'Secondary Credentials',
    section: 'Account Login Details',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'secondary_mothermail_status',
    label: 'Secondary Mothermail Status',
    section: 'Account Login Details',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'guarantee_plan',
    label: 'Guarantee Plan',
    section: 'Guarantee & Warranty',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'primary_unlink_date',
    label: 'Primary Unlink Date',
    section: 'Guarantee & Warranty',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'primary_guarantee_void_date',
    label: 'Primary Guarantee Void Date',
    section: 'Guarantee & Warranty',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'secondary_unlink_date',
    label: 'Secondary Unlink Date',
    section: 'Guarantee & Warranty',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'secondary_guarantee_void_date',
    label: 'Secondary Guarantee Void Date',
    section: 'Guarantee & Warranty',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },
  {
    key: 'product_link',
    label: 'Product Link',
    section: 'Product Reference',
    required: false,
    defaultOn: true,
    source: 'account',
    txTypes: ['Account'],
  },

  // ── X-SUIT FIELDS ─────────────────────────────────────────────────────────
  {
    key: 'xsuit_name',
    label: 'X-Suit Name',
    section: 'X-Suit Details',
    required: false,
    defaultOn: true,
    source: 'xsuit',
    txTypes: ['XSuit'],
  },
  {
    key: 'gift_status',
    label: 'Gift Status',
    section: 'X-Suit Details',
    required: false,
    defaultOn: true,
    source: 'xsuit',
    txTypes: ['XSuit'],
  },
  {
    key: 'delivery_date',
    label: 'Delivery Date',
    section: 'X-Suit Details',
    required: false,
    defaultOn: true,
    source: 'xsuit',
    txTypes: ['XSuit'],
  },
  {
    key: 'delivery_time',
    label: 'Delivery Time',
    section: 'X-Suit Details',
    required: false,
    defaultOn: true,
    source: 'xsuit',
    txTypes: ['XSuit'],
  },
  {
    key: 'buyer_ig_name',
    label: 'Buyer IG Name',
    section: 'X-Suit Details',
    required: false,
    defaultOn: true,
    source: 'xsuit',
    txTypes: ['XSuit', 'Supercar'],
  },
  {
    key: 'buyer_ig_id',
    label: 'Buyer IG ID',
    section: 'X-Suit Details',
    required: false,
    defaultOn: true,
    source: 'xsuit',
    txTypes: ['XSuit', 'Supercar'],
  },

  // ── SUPERCAR FIELDS ───────────────────────────────────────────────────────
  {
    key: 'supercar_name',
    label: 'Supercar Name',
    section: 'Supercar Details',
    required: false,
    defaultOn: true,
    source: 'supercar',
    txTypes: ['Supercar'],
  },
  {
    key: 'supercar_card_tier',
    label: 'Card Tier (Tire)',
    section: 'Supercar Details',
    required: false,
    defaultOn: true,
    source: 'supercar',
    txTypes: ['Supercar'],
  },
  {
    key: 'supercar_gift_status',
    label: 'Gift Status',
    section: 'Supercar Details',
    required: false,
    defaultOn: true,
    source: 'supercar',
    txTypes: ['Supercar'],
  },
  {
    key: 'supercar_delivery_date',
    label: 'Delivery Date',
    section: 'Supercar Details',
    required: false,
    defaultOn: true,
    source: 'supercar',
    txTypes: ['Supercar'],
  },

  // ── UC FIELDS ─────────────────────────────────────────────────────────────
  {
    key: 'uc_method',
    label: 'UC Method',
    section: 'UC Order Details',
    required: false,
    defaultOn: true,
    source: 'uc',
    txTypes: ['UC'],
  },
  {
    key: 'uc_pack',
    label: 'UC Pack',
    section: 'UC Order Details',
    required: false,
    defaultOn: true,
    source: 'uc',
    txTypes: ['UC'],
  },
  {
    key: 'num_packs',
    label: 'Number of Packs',
    section: 'UC Order Details',
    required: false,
    defaultOn: true,
    source: 'uc',
    txTypes: ['UC'],
  },
  {
    key: 'total_uc',
    label: 'Total UC',
    section: 'UC Order Details',
    required: false,
    defaultOn: true,
    source: 'uc',
    txTypes: ['UC'],
  },
  {
    key: 'delivery_status',
    label: 'Delivery Status',
    section: 'UC Order Details',
    required: false,
    defaultOn: true,
    source: 'uc',
    txTypes: ['UC'],
  },
  {
    key: 'uc_delivery_date',
    label: 'Delivery Date',
    section: 'UC Order Details',
    required: false,
    defaultOn: true,
    source: 'uc',
    txTypes: ['UC'],
  },
];

// ─── HELPER: Build the default settings object (all fields → their defaultOn) ─
export function buildDefaultSettings() {
  const settings = {};
  for (const field of ALL_FIELDS) {
    settings[field.key] = field.required ? true : field.defaultOn;
  }
  return settings;
}

// ─── HELPER: Load saved settings from localStorage, merging with defaults ────
export function loadCustomerPDFSettings() {
  try {
    const raw = localStorage.getItem(CUSTOMER_PDF_SETTINGS_KEY);
    if (!raw) return buildDefaultSettings();
    const saved = JSON.parse(raw);
    const defaults = buildDefaultSettings();
    // Merge: saved values override defaults, but required fields are always true
    const merged = { ...defaults, ...saved };
    for (const field of ALL_FIELDS) {
      if (field.required) merged[field.key] = true;
    }
    return merged;
  } catch (e) {
    console.warn('Failed to load customer PDF settings:', e);
    return buildDefaultSettings();
  }
}

// ─── HELPER: Save settings to localStorage ───────────────────────────────────
export function saveCustomerPDFSettings(settings) {
  // Always enforce required fields before saving
  const safe = { ...settings };
  for (const field of ALL_FIELDS) {
    if (field.required) safe[field.key] = true;
  }
  localStorage.setItem(CUSTOMER_PDF_SETTINGS_KEY, JSON.stringify(safe));
}

// ─── HELPER: Get fields for a specific txType, grouped by section ─────────────
export function getFieldsForType(txType) {
  const relevant = ALL_FIELDS.filter(f => f.txTypes.includes(txType));
  // Group by section
  const grouped = {};
  for (const field of relevant) {
    if (!grouped[field.section]) grouped[field.section] = [];
    grouped[field.section].push(field);
  }
  return grouped; // { 'Transaction Details': [...], 'Account Login Details': [...], ... }
}

// ─── HELPER: Check if a field is enabled given a settings object ──────────────
export function isFieldEnabled(key, settings) {
  // Required fields are always enabled regardless of settings
  const fieldDef = ALL_FIELDS.find(f => f.key === key);
  if (fieldDef?.required) return true;
  return settings[key] === true;
}
