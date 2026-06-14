/* global document, window, alert, URL, File */
/**
 * pdfGenerator.js
 * MBSx STORE — Premium Receipt Generator
 * Built with pdf-lib
 *
 * This module generates an Apple/Stripe-tier premium invoice layout.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { loadCustomerPDFSettings } from './pdfFieldConfig';

// ─────────────────────────────────────────────
// DESIGN SYSTEM TOKENS (PREMIUM LIGHT THEME)
// ─────────────────────────────────────────────
const C = {
  bg:          rgb(1, 1, 1),             // Pure White
  bgAlt:       rgb(0.97, 0.97, 0.98),    // Very light grey for alternate rows
  textDark:    rgb(0.08, 0.08, 0.10),    // Near Black for primary text
  textMid:     rgb(0.45, 0.45, 0.50),    // Gray for labels & secondary
  textLight:   rgb(0.65, 0.65, 0.70),    // Light gray for subtle notes
  borderLight: rgb(0.90, 0.90, 0.92),    // Subtle divider lines
  borderDark:  rgb(0.10, 0.10, 0.15),    // Dark divider lines
  gold:        rgb(0.85, 0.68, 0.10),    // Premium gold accent
  goldLight:   rgb(0.99, 0.97, 0.88),    // Very light gold background
  green:       rgb(0.15, 0.65, 0.35),    // Success / Paid
  red:         rgb(0.85, 0.25, 0.25),    // Error / Unpaid
  amber:       rgb(0.95, 0.65, 0.10),    // Warning / Partial
};

const SUPPORT_PHONE = '+91 90253 91516';
const BRAND_NAME    = 'MBSx STORE';
const PAGE_W        = 595;  // A4 width (pts)
const PAGE_H        = 842;  // A4 height (pts)
const MARGIN        = 50;
const CONTENT_W     = PAGE_W - MARGIN * 2;

// ─────────────────────────────────────────────
// DATE FORMATTERS & UTILITIES
// ─────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return raw;
  }
}

function formatDateTime(raw) {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return `${formatDate(raw)}, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  } catch {
    return raw;
  }
}

function safeVal(v) {
  if (v === null || v === undefined || v === '') return '—';
  return String(v).replace(/₹/g, 'Rs.');
}

const PDF_TEXT_REPLACEMENTS = {
  '₹': 'Rs.', '▲': 'Gain', '▼': 'Loss', '–': '-', '—': '-', '…': '...', '•': '-', '✓': 'Yes', '✔': 'Yes', '✕': 'x', '×': 'x', '→': '->', '←': '<-'
};

function pdfSafeText(text, font) {
  const replaced = Array.from(safeVal(text))
    .map(char => PDF_TEXT_REPLACEMENTS[char] ?? char)
    .join('')
    // eslint-disable-next-line no-control-regex
    .replace(/[\r\n\x00-\x1F\x7F-\x9F]/g, '');

  return Array.from(replaced).filter(char => {
    try { font.widthOfTextAtSize(char, 1); return true; } catch { return false; }
  }).join('');
}

function applyConfigVisibility(tx, isInternal) {
  if (isInternal) return tx;
  const clone = JSON.parse(JSON.stringify(tx));
  const settings = loadCustomerPDFSettings();

  for (const [key, visible] of Object.entries(settings)) {
    if (visible === false) {
      if (key in clone) clone[key] = null;
      const subTables = ['account_transactions', 'xsuit_transactions', 'supercar_transactions', 'uc_transactions'];
      for (const table of subTables) {
        if (Array.isArray(clone[table])) {
          clone[table] = clone[table].map(row => {
            const r = { ...row };
            if (key in r) r[key] = null;
            return r;
          });
        }
      }
    }
  }
  return clone;
}

// ─────────────────────────────────────────────
// DOCUMENT FACTORY
// ─────────────────────────────────────────────
async function createDoc() {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const fonts  = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold:    await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    oblique: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
  };
  
  // Minimalist text logo rendering, we skip images for cleaner vector output unless provided
  return { pdfDoc, page, fonts };
}

// ─────────────────────────────────────────────
// LOW-LEVEL DRAWING HELPERS
// ─────────────────────────────────────────────
function txt(page, fonts, text, x, y, { size = 10, color = C.textDark, bold = false, align = 'left', maxW = null } = {}) {
  const font = bold ? fonts.bold : fonts.regular;
  const str = safeVal(text);
  const lines = str.split(/\r?\n/);
  let maxWidthOfLines = 0;
  
  lines.forEach((line, index) => {
    const cleanLine = pdfSafeText(line, font);
    const lineY = y - (index * (size + 4));
    let drawX = x;
    const w = font.widthOfTextAtSize(cleanLine, size);
    if (w > maxWidthOfLines) maxWidthOfLines = w;

    if (align === 'center' && maxW) drawX = x + (maxW - w) / 2;
    else if (align === 'right' && maxW) drawX = x + maxW - w;
    
    page.drawText(cleanLine, { x: drawX, y: lineY, size, font, color });
  });

  return maxWidthOfLines;
}

function rect(page, x, y, w, h, { fill = C.bgAlt, border = null, borderW = 0.5 } = {}) {
  page.drawRectangle({ x, y, width: w, height: h, color: fill });
  if (border) page.drawRectangle({ x, y, width: w, height: h, borderColor: border, borderWidth: borderW, color: undefined });
}

function hRule(page, x, y, width, { color = C.borderLight, thickness = 0.5 } = {}) {
  page.drawLine({ start: { x, y }, end: { x: x + width, y }, thickness, color });
}

// Draw alternating table rows
function dataTable(page, fonts, title, rows, startY, showHighlight = false) {
  let y = startY;
  
  if (title) {
    txt(page, fonts, title.toUpperCase(), MARGIN, y, { size: 9, color: C.textMid, bold: true, align: 'left' });
    y -= 15;
    hRule(page, MARGIN, y, CONTENT_W, { color: C.borderDark, thickness: 1.5 });
    y -= 2;
  }

  rows.forEach((row, idx) => {
    if (!row) return; // Skip empty rows
    const [label, value, isBoldVal] = row;
    
    // Alternate background for rows
    if (idx % 2 === 0) {
      rect(page, MARGIN, y - 20, CONTENT_W, 20, { fill: C.bgAlt });
    }

    txt(page, fonts, label, MARGIN + 10, y - 14, { size: 8.5, color: C.textMid });
    txt(page, fonts, value, MARGIN + CONTENT_W - 10, y - 14, { 
      size: 9.5, 
      color: showHighlight && isBoldVal ? C.gold : C.textDark, 
      bold: isBoldVal, 
      align: 'right', 
      maxW: CONTENT_W / 2 
    });

    y -= 20;
  });

  hRule(page, MARGIN, y, CONTENT_W, { color: C.borderLight, thickness: 0.5 });
  return y - 20; // Return new Y with some padding
}

// ─────────────────────────────────────────────
// COMPOSITE LAYOUT BLOCKS
// ─────────────────────────────────────────────

function drawHeader(page, fonts, txId, txDate, isInternal) {
  let y = PAGE_H - MARGIN;

  // Invoice Title
  txt(page, fonts, isInternal ? 'INTERNAL LEDGER' : 'RECEIPT', MARGIN, y, { size: 24, bold: true, color: C.textDark });
  y -= 14;
  txt(page, fonts, BRAND_NAME, MARGIN, y, { size: 10, bold: true, color: C.gold });

  // Right side meta
  const rightX = PAGE_W - MARGIN - 180;
  txt(page, fonts, 'Receipt Number', rightX, PAGE_H - MARGIN, { size: 8, color: C.textMid, align: 'right', maxW: 180 });
  txt(page, fonts, txId, rightX, PAGE_H - MARGIN - 12, { size: 10, color: C.textDark, bold: true, align: 'right', maxW: 180 });
  
  txt(page, fonts, 'Date of Issue', rightX, PAGE_H - MARGIN - 28, { size: 8, color: C.textMid, align: 'right', maxW: 180 });
  txt(page, fonts, formatDate(txDate), rightX, PAGE_H - MARGIN - 40, { size: 10, color: C.textDark, bold: true, align: 'right', maxW: 180 });

  y -= 40;
  hRule(page, MARGIN, y, CONTENT_W, { color: C.borderLight, thickness: 1 });
  return y - 30;
}

function drawHeroAmount(page, fonts, tx, y, isInternal) {
  const sold = Number(tx.sold_price || 0);
  const status = safeVal(tx.payment_status).toLowerCase();
  
  let badgeColor = C.green;
  if (status.includes('unpaid') || status.includes('pending')) badgeColor = C.red;
  else if (status.includes('partial')) badgeColor = C.amber;

  // Center Block
  rect(page, MARGIN, y - 90, CONTENT_W, 90, { fill: C.goldLight, border: C.gold, borderW: 0.5 });
  
  txt(page, fonts, 'TOTAL AMOUNT PAID', MARGIN, y - 25, { size: 10, color: C.gold, bold: true, align: 'center', maxW: CONTENT_W });
  txt(page, fonts, `Rs. ${sold.toLocaleString('en-IN')}`, MARGIN, y - 60, { size: 28, color: C.textDark, bold: true, align: 'center', maxW: CONTENT_W });
  
  // Status Badge directly inside the hero
  const badgeW = 70;
  rect(page, MARGIN + (CONTENT_W - badgeW) / 2, y - 80, badgeW, 14, { fill: badgeColor });
  txt(page, fonts, tx.payment_status.toUpperCase(), MARGIN + (CONTENT_W - badgeW) / 2, y - 76, { size: 8, color: C.bg, bold: true, align: 'center', maxW: badgeW });

  return y - 110; // Extra padding below
}

function drawFinancialSummary(page, fonts, tx, y) {
  const sold = Number(tx.sold_price || 0);
  const cost = Number(tx.owner_price || 0);
  const profit = sold - cost;

  y = dataTable(page, fonts, 'Confidential Financials', [
    ['Cost Price', `Rs. ${cost.toLocaleString('en-IN')}`, false],
    ['Sold Price', `Rs. ${sold.toLocaleString('en-IN')}`, true],
    ['Net Profit', `Rs. ${profit.toLocaleString('en-IN')}`, true],
  ], y);

  return y;
}

// ─────────────────────────────────────────────
// CORE PDF BUILDERS
// ─────────────────────────────────────────────

async function buildPDF(tx, isInternal) {
  const { pdfDoc, page, fonts } = await createDoc();
  const filteredTx = applyConfigVisibility(tx, isInternal);
  const type = safeVal(filteredTx.transaction_type); 

  let y = drawHeader(page, fonts, safeVal(filteredTx.transaction_id), filteredTx.transaction_date, isInternal);
  
  if (filteredTx.sold_price !== null) {
    y = drawHeroAmount(page, fonts, filteredTx, y, isInternal);
  }

  // Common Details
  y = dataTable(page, fonts, 'Transaction Overview', [
    ['Transaction Type', type, true],
    ['Mode of Deal', safeVal(filteredTx.mode_of_deal), false],
    ['Mode of Payment', safeVal(filteredTx.mode_of_payment), false],
    ['Buyer Phone', safeVal(filteredTx.buyer_phone), false],
  ], y);

  // Dynamic Product Sections
  if (type === 'Account') {
    const acc = (filteredTx.account_transactions || [])[0] || {};
    y = dataTable(page, fonts, 'Login Credentials', [
      acc.primary_login_provider !== null && ['Primary Login', safeVal(acc.primary_login_provider), true],
      acc.primary_credentials !== null && ['Primary Credentials', safeVal(acc.primary_credentials), false],
      acc.primary_mothermail_status !== null && ['Primary Mothermail', safeVal(acc.primary_mothermail_status), false],
      acc.secondary_login_provider !== null && ['Secondary Login', safeVal(acc.secondary_login_provider), true],
      acc.secondary_credentials !== null && ['Secondary Credentials', safeVal(acc.secondary_credentials), false],
      acc.secondary_mothermail_status !== null && ['Secondary Mothermail', safeVal(acc.secondary_mothermail_status), false]
    ].filter(Boolean), y);

    y = dataTable(page, fonts, 'Guarantee Policy', [
      acc.guarantee_plan !== null && ['Guarantee Plan', safeVal(acc.guarantee_plan), true],
      acc.primary_unlink_date !== null && ['Primary Unlink Date', formatDate(acc.primary_unlink_date), false],
      acc.primary_guarantee_void_date !== null && ['Primary Void Date', formatDate(acc.primary_guarantee_void_date), false],
      acc.secondary_unlink_date !== null && ['Secondary Unlink Date', formatDate(acc.secondary_unlink_date), false],
      acc.secondary_guarantee_void_date !== null && ['Secondary Void Date', formatDate(acc.secondary_guarantee_void_date), false]
    ].filter(Boolean), y, true);
  } else if (type === 'XSuit') {
    const xs = (filteredTx.xsuit_transactions || [])[0] || {};
    y = dataTable(page, fonts, 'X-Suit Details', [
      ['X-Suit Name', safeVal(xs.xsuit_name), true],
      ['Gift Status', safeVal(xs.gift_status), false],
      ['Buyer IG Name', safeVal(xs.buyer_ig_name), false],
      ['Buyer IG ID', safeVal(xs.buyer_ig_id), true],
    ], y);
  } else if (type === 'Supercar') {
    const sc = (filteredTx.supercar_transactions || [])[0] || {};
    y = dataTable(page, fonts, 'Supercar Details', [
      ['Supercar Name', safeVal(sc.supercar_name), true],
      ['Gift Status', safeVal(sc.gift_status), false],
      ['Buyer IG Name', safeVal(sc.buyer_ig_name), false],
      ['Buyer IG ID', safeVal(sc.buyer_ig_id), true],
    ], y);
  } else if (type === 'UC') {
    const uc = (filteredTx.uc_transactions || [])[0] || {};
    y = dataTable(page, fonts, 'UC Transfer Details', [
      ['UC Method', safeVal(uc.uc_method), true],
      ['UC Pack', safeVal(uc.uc_pack), false],
      ['Number of Packs', safeVal(uc.num_packs), false],
      ['Total UC', safeVal(uc.total_uc), true],
      ['Delivery Status', safeVal(uc.delivery_status), false],
    ], y);
  }

  // Admin specifics
  if (isInternal) {
    y = drawFinancialSummary(page, fonts, filteredTx, y);
    y = dataTable(page, fonts, 'Administrative Contacts', [
      ['Owner Phone', safeVal(filteredTx.owner_phone), false],
      ['Seller Phone', safeVal(filteredTx.seller_phone), false],
      ['Reseller Phone', safeVal(filteredTx.reseller_phone), false],
    ].filter(r => r[1] !== '—'), y);
  }

  // Footer Setup
  const FOOTER_Y = 60;
  hRule(page, MARGIN, FOOTER_Y + 20, CONTENT_W, { color: C.borderLight, thickness: 0.5 });
  
  if (isInternal) {
    txt(page, fonts, 'CONFIDENTIAL — INTERNAL USE ONLY', MARGIN, FOOTER_Y, { size: 8, color: C.red, bold: true });
  } else {
    txt(page, fonts, 'Thank you for choosing MBSx STORE.', MARGIN, FOOTER_Y, { size: 9, color: C.textDark, bold: true });
    txt(page, fonts, `For support, contact us at ${SUPPORT_PHONE} with your Receipt Number.`, MARGIN, FOOTER_Y - 14, { size: 8, color: C.textMid });
  }

  txt(page, fonts, `Generated: ${new Date().toLocaleString('en-IN')}`, PAGE_W - MARGIN - 150, FOOTER_Y - 14, { size: 7, color: C.textLight, align: 'right', maxW: 150 });

  return pdfDoc;
}

// ─────────────────────────────────────────────
// DOWNLOAD TRIGGER
// ─────────────────────────────────────────────
function triggerDownload(bytes, filename) {
  try {
    const safeName = String(filename || 'MBSX_Invoice').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '_');
    const downloadName = safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`;
    
    // File constructor handles bytes universally
    const file = new File([bytes], downloadName, { type: 'application/pdf' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = url;
    link.download = downloadName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      if (document.body.contains(link)) document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);

  } catch (err) {
    console.error('PDF DOWNLOAD ERROR:', err);
    alert('PDF generation failed. Check console logs.');
  }
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────
export async function generateCustomerPDF(tx) {
  const pdfDoc = await buildPDF(tx, false);
  const bytes  = await pdfDoc.save({ useObjectStreams: false });
  const txId   = safeVal(tx.transaction_id).replace(/\s+/g, '_');
  triggerDownload(bytes, `Premium_Invoice_${txId}.pdf`);
}

export async function generateInternalPDF(tx) {
  const pdfDoc = await buildPDF(tx, true);
  const bytes  = await pdfDoc.save({ useObjectStreams: false });
  const txId   = safeVal(tx.transaction_id).replace(/\s+/g, '_');
  triggerDownload(bytes, `Premium_Invoice_Admin_${txId}.pdf`);
}

export async function generateBothPDFs(tx) {
  await generateCustomerPDF(tx);
  await new Promise(r => setTimeout(r, 800));
  await generateInternalPDF(tx);
}

export async function testPDF() {
  try {
    const dummy = {
      transaction_id: 'TX_TEST_001',
      transaction_date: new Date().toISOString(),
      transaction_type: 'Account',
      sold_price: 24500,
      payment_status: 'PAID',
      mode_of_deal: 'Direct WhatsApp',
      account_transactions: [{
        primary_login_provider: 'Twitter',
        primary_credentials: 'user@test.com | pass123',
        guarantee_plan: '15 Days Guarantee',
        primary_unlink_date: new Date().toISOString()
      }]
    };
    await generateCustomerPDF(dummy);
  } catch(e) {
    console.error(e);
  }
}
