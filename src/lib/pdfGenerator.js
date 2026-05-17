/**
 * pdfGenerator.js
 * MBSx STORE — Production PDF Generator
 * Built with pdf-lib (client-side, no server required)
 *
 * Usage:
 *   import { generateCustomerPDF, generateInternalPDF } from './lib/pdfGenerator';
 *   await generateCustomerPDF(transactionObject);
 *   await generateInternalPDF(transactionObject);
 *
 * Requires: pdf-lib  →  npm install pdf-lib
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ─────────────────────────────────────────────
// DESIGN SYSTEM TOKENS
// ─────────────────────────────────────────────
const C = {
  bgDark:      rgb(0.05, 0.05, 0.12),   // Primary dark background
  gold:        rgb(1.00, 0.84, 0.00),   // Bright gold accent
  goldMuted:   rgb(0.85, 0.70, 0.10),   // Softer gold for secondary text
  white:       rgb(1.00, 1.00, 1.00),
  textDark:    rgb(0.15, 0.15, 0.20),   // Main body text
  textMid:     rgb(0.35, 0.35, 0.42),   // Subdued labels
  borderLight: rgb(0.80, 0.80, 0.85),   // Light rule lines
  borderGold:  rgb(0.85, 0.72, 0.20),   // Gold rule lines
  panelBg:     rgb(0.96, 0.96, 0.98),   // Light panel fill
  panelDark:   rgb(0.10, 0.10, 0.18),   // Dark panel inside header
  green:       rgb(0.08, 0.68, 0.28),   // Positive / paid
  red:         rgb(0.85, 0.10, 0.10),   // Negative / unpaid
  amber:       rgb(0.90, 0.55, 0.05),   // Warning / partial
};

const SUPPORT_PHONE = '+91 90253 91516';
const BRAND_NAME    = 'MBSx STORE';
const PAGE_W        = 595;  // A4 width  (pts)
const PAGE_H        = 842;  // A4 height (pts)
const MARGIN        = 40;
const CONTENT_W     = PAGE_W - MARGIN * 2;

// ─────────────────────────────────────────────
// DATE FORMATTERS & UTILITIES
// ─────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    const months = ['Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec'];
    const day   = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year  = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return raw;
  }
}

function formatDateTime(raw) {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${formatDate(raw)}  ${time}`;
  } catch {
    return raw;
  }
}

function safeVal(v) {
  if (v === null || v === undefined || v === '') return '—';
  // Guard against unencodable currency symbols (like ₹) by replacing them with Rs.
  return String(v).replace(/₹/g, 'Rs.');
}

// ─────────────────────────────────────────────
// CONFIG-BASED VISIBILITY FILTER
// ─────────────────────────────────────────────
function applyConfigVisibility(tx, isInternal) {
  if (isInternal) return tx; // Always show everything for Internal PDF
  
  const clone = JSON.parse(JSON.stringify(tx));
  const txType = clone.transaction_type || 'Account';
  
  let savedConfig;
  try {
    const raw = localStorage.getItem('mbs_pdf_fields_config');
    if (raw) savedConfig = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse pdf fields config:', e);
  }

  if (!savedConfig || !savedConfig[txType]) return clone;

  const modeMap = savedConfig[txType].customer || {};

  // For any field that is false (unchecked), set its value in the clone to null
  for (const [key, visible] of Object.entries(modeMap)) {
    if (visible === false) {
      if (key in clone) clone[key] = null;
      
      const subTables = ['account_transactions', 'xsuit_transactions',
                         'supercar_transactions', 'uc_transactions'];
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
// LOGO LOADER (graceful fallback)
// ─────────────────────────────────────────────
async function tryLoadLogo(pdfDoc) {
  try {
    const res = await fetch('/logo.png');
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return await pdfDoc.embedPng(buf);
  } catch {
    try {
      const res = await fetch('/logo.jpg');
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      return await pdfDoc.embedJpg(buf);
    } catch {
      return null;
    }
  }
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
  const logo = await tryLoadLogo(pdfDoc);
  return { pdfDoc, page, fonts, logo };
}

// ─────────────────────────────────────────────
// LOW-LEVEL DRAWING HELPERS
// ─────────────────────────────────────────────

/** 
 * Draw text at absolute (x, y). 
 * Natively supports multi-line text (splitting by newlines) to prevent WinAnsi encoding crashes.
 * Returns the maximum width of drawn text.
 */
function txt(page, fonts, text, x, y, {
  size  = 10,
  color = C.textDark,
  bold  = false,
  align = 'left',
  maxW  = null,
} = {}) {
  const font  = bold ? fonts.bold : fonts.regular;
  const str   = safeVal(text);
  
  // Split by newlines and draw each line downward to completely support line breaks!
  const lines = str.split(/\r?\n/);
  let maxWidthOfLines = 0;
  
  lines.forEach((line, index) => {
    // Strip carriage returns or any remaining unencodable control characters from each line
    const cleanLine = line.replace(/[\r\n\x00-\x1F\x7F-\x9F]/g, '');
    const lineY = y - (index * (size + 4));
    let drawX = x;
    const w = font.widthOfTextAtSize(cleanLine, size);
    if (w > maxWidthOfLines) maxWidthOfLines = w;

    if (align === 'center' && maxW) {
      drawX = x + (maxW - w) / 2;
    } else if (align === 'right' && maxW) {
      drawX = x + maxW - w;
    }
    
    // Draw the single safe line
    page.drawText(cleanLine, { x: drawX, y: lineY, size, font, color });
  });

  return maxWidthOfLines;
}

/** Draw a horizontal rule */
function hRule(page, x, y, width, { color = C.borderLight, thickness = 0.5 } = {}) {
  page.drawLine({
    start: { x, y },
    end:   { x: x + width, y },
    thickness,
    color,
  });
}

/** Draw a filled rectangle */
function rect(page, x, y, w, h, { fill = C.panelBg, border = null, borderW = 0.5 } = {}) {
  page.drawRectangle({ x, y, width: w, height: h, color: fill });
  if (border) {
    page.drawRectangle({ x, y, width: w, height: h,
      borderColor: border, borderWidth: borderW, color: undefined });
  }
}

/** Two-column label + value row. Returns new y after drawing. */
function labelRow(page, fonts, label, value, y, {
  labelColor = C.textMid,
  valueColor = C.textDark,
  labelSize  = 8.5,
  valueSize  = 9,
  colSplit    = 160,
  indent      = MARGIN,
  bold        = false,
  valueBold   = false,
} = {}) {
  txt(page, fonts, label, indent, y, { size: labelSize, color: labelColor });
  txt(page, fonts, value, indent + colSplit, y, { size: valueSize, color: valueColor, bold: valueBold });
  
  // Calculate spacing depending on multiline values to prevent text overlapping!
  const numLines = safeVal(value).split(/\r?\n/).length;
  const lineH = valueSize + 4;
  const heightOccupied = Math.max(15, numLines * lineH);
  
  return y - heightOccupied - 2;
}

/** Multi-line wrapped text. Returns new y after drawing. */
function wrappedText(page, fonts, text, x, y, {
  maxW   = CONTENT_W,
  size   = 9,
  color  = C.textDark,
  bold   = false,
  lineH  = 14,
} = {}) {
  const font  = bold ? fonts.bold : fonts.regular;
  const words = safeVal(text).split(/\s+/);
  let line    = '';
  let curY    = y;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxW && line) {
      page.drawText(line, { x, y: curY, size, font, color });
      curY -= lineH;
      line  = word;
    } else {
      line = test;
    }
  }
  if (line) page.drawText(line, { x, y: curY, size, font, color });
  return curY - lineH;
}

// ─────────────────────────────────────────────
// COMPOSITE LAYOUT BLOCKS
// ─────────────────────────────────────────────

/** Draw the branded header band. Returns y after header. */
function drawHeader(page, fonts, logo, { label, txId, txDate }) {
  const HEADER_H = 90;
  const y0       = PAGE_H;

  // Dark background band
  rect(page, 0, y0 - HEADER_H, PAGE_W, HEADER_H, { fill: C.bgDark });

  // Gold accent bar at very top
  rect(page, 0, y0 - 4, PAGE_W, 4, { fill: C.gold });

  // Logo or brand text
  if (logo) {
    const logoH = 42;
    const logoW = (logo.width / logo.height) * logoH;
    page.drawImage(logo, { x: MARGIN, y: y0 - HEADER_H + (HEADER_H - logoH) / 2, width: logoW, height: logoH });
    // Brand name beside logo
    txt(page, fonts, BRAND_NAME, MARGIN + logoW + 10, y0 - HEADER_H / 2 + 10,
        { size: 18, color: C.gold, bold: true });
    txt(page, fonts, 'BGMI Gaming Store', MARGIN + logoW + 10, y0 - HEADER_H / 2 - 6,
        { size: 8.5, color: C.goldMuted });
  } else {
    txt(page, fonts, BRAND_NAME, MARGIN, y0 - 35, { size: 22, color: C.gold, bold: true });
    txt(page, fonts, 'BGMI Gaming Store', MARGIN, y0 - 50, { size: 9, color: C.goldMuted });
  }

  // Right side — document label block
  const rightX = PAGE_W - MARGIN - 150;
  rect(page, rightX, y0 - HEADER_H + 12, 152, HEADER_H - 24, { fill: C.panelDark });
  txt(page, fonts, label, rightX, y0 - HEADER_H + 12 + 46,
      { size: 7.5, color: C.gold, bold: true, align: 'center', maxW: 152 });
  txt(page, fonts, txId, rightX, y0 - HEADER_H + 12 + 30,
      { size: 11, color: C.white, bold: true, align: 'center', maxW: 152 });
  txt(page, fonts, formatDate(txDate), rightX, y0 - HEADER_H + 12 + 14,
      { size: 8, color: C.goldMuted, align: 'center', maxW: 152 });

  // Gold divider
  hRule(page, 0, y0 - HEADER_H, PAGE_W, { color: C.gold, thickness: 1.2 });

  return y0 - HEADER_H - 12;
}

/** Draw a section header band. Returns y after section header. */
function sectionHeader(page, fonts, title, y) {
  rect(page, MARGIN, y - 16, CONTENT_W, 20, { fill: C.bgDark });
  // Gold left accent stripe
  rect(page, MARGIN, y - 16, 4, 20, { fill: C.gold });
  txt(page, fonts, title.toUpperCase(), MARGIN + 10, y - 8,
      { size: 8, color: C.gold, bold: true });
  return y - 16 - 10;
}

/** Draw a data panel (light bg, rounded border). Returns y after panel. */
function openPanel(page, y, height) {
  rect(page, MARGIN, y - height, CONTENT_W, height,
       { fill: C.panelBg, border: C.borderLight, borderW: 0.6 });
  return y - 6;
}

/** Draw the footer band. Respects excludePrintDate option. */
function drawFooter(page, fonts, isInternal, excludePrintDate = false) {
  const FOOT_H = 38;

  rect(page, 0, 0, PAGE_W, FOOT_H, { fill: C.bgDark });
  hRule(page, 0, FOOT_H, PAGE_W, { color: C.gold, thickness: 0.8 });

  if (!excludePrintDate) {
    const generated = `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
    txt(page, fonts, generated, MARGIN, 24, { size: 7, color: C.textMid });
  }

  const notice = isInternal
    ? 'CONFIDENTIAL — Internal use only. Do not share with customers.'
    : `Support: ${SUPPORT_PHONE}  |  Thank you for choosing ${BRAND_NAME}!`;
  txt(page, fonts, notice, MARGIN, 12, { size: 7.5, color: C.goldMuted });

  // Page number right
  txt(page, fonts, 'Page 1 of 1', 0, 24,
      { size: 7, color: C.textMid, align: 'right', maxW: PAGE_W - MARGIN });
}

/** Draw a status badge (Paid / Unpaid / Partial). */
function statusBadge(page, fonts, status, x, y) {
  const s = safeVal(status).toLowerCase();
  let fill  = C.green;
  let label = safeVal(status);
  if (s.includes('unpaid') || s.includes('pending')) fill = C.red;
  else if (s.includes('partial'))                     fill = C.amber;

  const W = 90, H = 14;
  rect(page, x, y - 2, W, H, { fill });
  txt(page, fonts, label.toUpperCase(), x, y + 1,
      { size: 7, color: C.white, bold: true, align: 'center', maxW: W });
}

// ─────────────────────────────────────────────
// SHARED INFO BLOCKS
// ─────────────────────────────────────────────

/** Draws deal basics (tx_id, date, mode, payment, status). Returns new y. */
function drawDealInfo(page, fonts, tx, y, { showPrice = false } = {}) {
  const rows = [];
  if (tx.transaction_id !== null)      rows.push(['Transaction ID',   safeVal(tx.transaction_id)]);
  if (tx.transaction_date !== null)    rows.push(['Date',             formatDateTime(tx.transaction_date)]);
  if (tx.mode_of_deal !== null)        rows.push(['Mode of Deal',     safeVal(tx.mode_of_deal)]);
  if (tx.mode_of_payment !== null)     rows.push(['Mode of Payment',  safeVal(tx.mode_of_payment)]);

  for (const [label, value] of rows) {
    y = labelRow(page, fonts, label, value, y);
  }

  // Status with badge
  if (tx.payment_status !== null) {
    txt(page, fonts, 'Payment Status', MARGIN, y, { size: 8.5, color: C.textMid });
    statusBadge(page, fonts, tx.payment_status, MARGIN + 160, y);
    y -= 18;
  }

  if (showPrice && tx.sold_price !== null) {
    hRule(page, MARGIN, y + 4, CONTENT_W, { color: C.borderGold, thickness: 0.5 });
    y -= 4;
    y = labelRow(page, fonts, 'Sold Price', `Rs. ${Number(tx.sold_price || 0).toLocaleString('en-IN')}`, y,
                 { valueColor: C.textDark, valueBold: true });
  }

  return y;
}

/** Draws contact block. Returns new y. */
function drawContacts(page, fonts, contacts, y) {
  for (const [label, value] of contacts) {
    if (value !== null) {
      y = labelRow(page, fonts, label, value, y);
    }
  }
  return y;
}

// ─────────────────────────────────────────────
// TRANSACTION-TYPE SPECIFIC BLOCKS
// ─────────────────────────────────────────────

function drawAccountSection(page, fonts, acc, y, isInternal) {
  const hasLogin = acc.primary_login_provider !== null || acc.primary_credentials !== null || acc.primary_mothermail_status !== null ||
                   acc.secondary_login_provider !== null || acc.secondary_credentials !== null || acc.secondary_mothermail_status !== null;
                   
  if (hasLogin) {
    y = sectionHeader(page, fonts, 'Account Login Details', y);
    y -= 4;

    if (acc.primary_login_provider !== null)    y = labelRow(page, fonts, 'Primary Login',     safeVal(acc.primary_login_provider), y, { valueBold: true });
    if (acc.primary_credentials !== null)       y = labelRow(page, fonts, 'Primary Credentials', safeVal(acc.primary_credentials), y);
    if (acc.primary_mothermail_status !== null)  y = labelRow(page, fonts, 'Primary Mothermail', safeVal(acc.primary_mothermail_status), y);
    y -= 4;
    if (acc.secondary_login_provider !== null)  y = labelRow(page, fonts, 'Secondary Login',    safeVal(acc.secondary_login_provider), y, { valueBold: true });
    if (acc.secondary_credentials !== null)     y = labelRow(page, fonts, 'Secondary Credentials', safeVal(acc.secondary_credentials), y);
    if (acc.secondary_mothermail_status !== null) y = labelRow(page, fonts, 'Secondary Mothermail', safeVal(acc.secondary_mothermail_status), y);
    y -= 8;
  }

  const hasGuarantee = acc.guarantee_plan !== null || acc.primary_unlink_date !== null || acc.primary_guarantee_void_date !== null ||
                       acc.secondary_unlink_date !== null || acc.secondary_guarantee_void_date !== null;
                       
  if (hasGuarantee) {
    y = sectionHeader(page, fonts, 'Guarantee & Warranty', y);
    y -= 4;
    if (acc.guarantee_plan !== null)                y = labelRow(page, fonts, 'Guarantee Plan',          safeVal(acc.guarantee_plan), y, { valueBold: true });
    if (acc.primary_unlink_date !== null)           y = labelRow(page, fonts, 'Primary Unlink Date',     formatDate(acc.primary_unlink_date), y);
    if (acc.primary_guarantee_void_date !== null)   y = labelRow(page, fonts, 'Primary Guarantee Void',  formatDate(acc.primary_guarantee_void_date), y);
    if (acc.secondary_unlink_date !== null)         y = labelRow(page, fonts, 'Secondary Unlink Date',   formatDate(acc.secondary_unlink_date), y);
    if (acc.secondary_guarantee_void_date !== null) y = labelRow(page, fonts, 'Secondary Guarantee Void', formatDate(acc.secondary_guarantee_void_date), y);
    y -= 8;
  }

  if (acc.product_link && acc.product_link !== '—' && acc.product_link !== null) {
    y = sectionHeader(page, fonts, 'Product Reference', y);
    y -= 4;
    y = labelRow(page, fonts, 'Product Link', safeVal(acc.product_link), y,
                 { valueColor: rgb(0.10, 0.30, 0.80) });
    y -= 4;
  }

  return y;
}

function drawXSuitSection(page, fonts, xs, y, isInternal) {
  y = sectionHeader(page, fonts, 'X-Suit Details', y);
  y -= 4;

  if (xs.xsuit_name !== null)    y = labelRow(page, fonts, 'X-Suit Name',    safeVal(xs.xsuit_name), y, { valueBold: true });
  if (xs.gift_status !== null)   y = labelRow(page, fonts, 'Gift Status',     safeVal(xs.gift_status), y);
  if (xs.delivery_date !== null) y = labelRow(page, fonts, 'Delivery Date',   formatDate(xs.delivery_date), y);
  if (xs.delivery_time !== null) y = labelRow(page, fonts, 'Delivery Time',   safeVal(xs.delivery_time), y);
  y -= 4;
  if (xs.buyer_ig_name !== null) y = labelRow(page, fonts, 'Buyer IG Name',   safeVal(xs.buyer_ig_name), y);
  if (xs.buyer_ig_id !== null)   y = labelRow(page, fonts, 'Buyer IG ID',      safeVal(xs.buyer_ig_id), y);
  y -= 4;

  if (isInternal) {
    hRule(page, MARGIN, y + 6, CONTENT_W, { color: C.borderGold });
    y -= 2;
    txt(page, fonts, 'SUPPLIER DETAILS', MARGIN, y, { size: 7.5, color: C.amber, bold: true });
    y -= 14;
    y = labelRow(page, fonts, 'Gifter IG Name',  safeVal(xs.gifter_ig_name), y);
    y = labelRow(page, fonts, 'Gifter IG ID',    safeVal(xs.gifter_ig_id), y);
    y -= 4;
  }

  return y;
}

function drawSupercarSection(page, fonts, sc, y, isInternal) {
  y = sectionHeader(page, fonts, 'Supercar Details', y);
  y -= 4;

  if (sc.supercar_name !== null)      y = labelRow(page, fonts, 'Supercar Name',    safeVal(sc.supercar_name), y, { valueBold: true });
  if (sc.supercar_card_tier !== null) y = labelRow(page, fonts, 'Card Tier (Tire)',  safeVal(sc.supercar_card_tier), y);
  if (sc.gift_status !== null)        y = labelRow(page, fonts, 'Gift Status',       safeVal(sc.gift_status), y);
  if (sc.delivery_date !== null)      y = labelRow(page, fonts, 'Delivery Date',     formatDate(sc.delivery_date), y);
  y -= 4;
  if (sc.buyer_ig_name !== null)      y = labelRow(page, fonts, 'Buyer IG Name',     safeVal(sc.buyer_ig_name), y);
  if (sc.buyer_ig_id !== null)        y = labelRow(page, fonts, 'Buyer IG ID',       safeVal(sc.buyer_ig_id), y);
  y -= 4;

  if (isInternal) {
    hRule(page, MARGIN, y + 6, CONTENT_W, { color: C.borderGold });
    y -= 2;
    txt(page, fonts, 'SUPPLIER DETAILS', MARGIN, y, { size: 7.5, color: C.amber, bold: true });
    y -= 14;
    y = labelRow(page, fonts, 'Gifter IG Name',  safeVal(sc.gifter_ig_name), y);
    y = labelRow(page, fonts, 'Gifter IG ID',    safeVal(sc.gifter_ig_id), y);
    y -= 4;
  }

  return y;
}

function drawUCSection(page, fonts, uc, y) {
  y = sectionHeader(page, fonts, 'UC Order Details', y);
  y -= 4;

  if (uc.uc_method !== null)     y = labelRow(page, fonts, 'UC Method',       safeVal(uc.uc_method), y, { valueBold: true });
  if (uc.uc_pack !== null)       y = labelRow(page, fonts, 'UC Pack',         safeVal(uc.uc_pack), y);
  if (uc.num_packs !== null)     y = labelRow(page, fonts, 'Number of Packs', safeVal(uc.num_packs), y);
  if (uc.total_uc !== null)      y = labelRow(page, fonts, 'Total UC',        safeVal(uc.total_uc), y);
  y -= 4;

  // Delivery status badge
  if (uc.delivery_status !== null) {
    txt(page, fonts, 'Delivery Status', MARGIN, y, { size: 8.5, color: C.textMid });
    statusBadge(page, fonts, uc.delivery_status, MARGIN + 160, y);
    y -= 18;
  }

  if (uc.delivery_date !== null) y = labelRow(page, fonts, 'Delivery Date', formatDate(uc.delivery_date), y);
  y -= 4;

  return y;
}

/** Internal-only financial summary block. Returns new y. */
function drawFinancials(page, fonts, tx, y) {
  y = sectionHeader(page, fonts, 'Financial Summary — Confidential', y);
  y -= 4;

  const sold   = Number(tx.sold_price  || 0);
  const cost   = Number(tx.owner_price || 0);
  const profit = sold - cost;
  const isPos  = profit >= 0;

  rect(page, MARGIN, y - 52, CONTENT_W, 58, { fill: C.bgDark });

  // Three-column financial figures
  const col   = CONTENT_W / 3;
  const cols  = [
    { label: 'COST PRICE',  value: `Rs. ${cost.toLocaleString('en-IN')}`,   color: C.white },
    { label: 'SOLD PRICE',  value: `Rs. ${sold.toLocaleString('en-IN')}`,   color: C.goldMuted },
    { label: 'NET PROFIT',  value: `Rs. ${Math.abs(profit).toLocaleString('en-IN')}`, color: isPos ? C.green : C.red },
  ];

  cols.forEach(({ label, value, color }, i) => {
    const cx = MARGIN + col * i;
    txt(page, fonts, label, cx, y - 14, { size: 7, color: C.goldMuted, bold: true, align: 'center', maxW: col });
    txt(page, fonts, value, cx, y - 32, { size: 13, color, bold: true, align: 'center', maxW: col });
    const sign = i === 2 ? (isPos ? '▲ Gain' : '▼ Loss') : '';
    if (sign) txt(page, fonts, sign, cx, y - 46, { size: 7.5, color, align: 'center', maxW: col });
  });

  y -= 58;

  // Dividers inside dark block
  hRule(page, MARGIN + col,     y + 6, 1, { color: C.borderGold, thickness: 0.5 });
  hRule(page, MARGIN + col * 2, y + 6, 1, { color: C.borderGold, thickness: 0.5 });

  y -= 10;
  return y;
}

/** Internal-only contact block with all parties. Returns new y. */
function drawInternalContacts(page, fonts, tx, y) {
  y = sectionHeader(page, fonts, 'All Party Contacts — Admin Only', y);
  y -= 4;

  if (tx.buyer_phone !== null)    y = labelRow(page, fonts, 'Buyer Phone',     safeVal(tx.buyer_phone), y);
  if (tx.owner_phone !== null)    y = labelRow(page, fonts, 'Owner Phone',     safeVal(tx.owner_phone), y);
  if (tx.seller_phone !== null)   y = labelRow(page, fonts, 'Seller Phone',    safeVal(tx.seller_phone), y);
  if (tx.reseller_phone !== null) y = labelRow(page, fonts, 'Reseller Phone',  safeVal(tx.reseller_phone), y);
  y -= 6;

  if (tx.owner_proof_link !== null && tx.owner_proof_link) {
    txt(page, fonts, 'Owner Proof Link', MARGIN, y, { size: 8.5, color: C.textMid });
    txt(page, fonts, safeVal(tx.owner_proof_link), MARGIN + 160, y,
        { size: 8.5, color: rgb(0.10, 0.30, 0.80) });
    y -= 15;
  }

  y -= 4;
  return y;
}

// ─────────────────────────────────────────────
// WATERMARK (admin copies only)
// ─────────────────────────────────────────────
function drawWatermark(page, fonts) {
  const label = 'CONFIDENTIAL';
  for (let i = 0; i < 3; i++) {
    txt(page, fonts, label, 80 + i * 180, 500 - i * 120,
        { size: 36, color: rgb(0.92, 0.78, 0.20), bold: true });
  }
}

// ─────────────────────────────────────────────
// CORE PDF BUILDERS
// ─────────────────────────────────────────────

/**
 * Builds a complete PDF for the given transaction and mode.
 * @param {Object}  tx         - Joined transaction object from your API/Sheets
 * @param {boolean} isInternal - true = admin copy, false = customer copy
 */
async function buildPDF(tx, isInternal) {
  const { pdfDoc, page, fonts, logo } = await createDoc();
  
  // Filter visibility based on configuration (Customer Copy only)
  const filteredTx = applyConfigVisibility(tx, isInternal);
  const type = safeVal(filteredTx.transaction_type);  // 'Account' | 'XSuit' | 'Supercar' | 'UC'

  // ── HEADER ──
  const docLabel = isInternal
    ? `[ CONFIDENTIAL — ADMIN COPY ]`
    : `[ CUSTOMER COPY ]`;

  let y = drawHeader(page, fonts, logo, {
    label:  docLabel,
    txId:   safeVal(filteredTx.transaction_id),
    txDate: filteredTx.transaction_date,
  });

  y -= 8;

  // ── DEAL INFORMATION ──
  y = sectionHeader(page, fonts, 'Transaction Details', y);
  y -= 4;
  y = drawDealInfo(page, fonts, filteredTx, y, { showPrice: false });
  y -= 10;

  // ── TYPE-SPECIFIC PRODUCT SECTIONS ──
  const acc = (filteredTx.account_transactions   || [])[0] || {};
  const xs  = (filteredTx.xsuit_transactions     || [])[0] || {};
  const sc  = (filteredTx.supercar_transactions  || [])[0] || {};
  const uc  = (filteredTx.uc_transactions        || [])[0] || {};

  if (type === 'Account') {
    y = drawAccountSection(page, fonts, acc, y, isInternal);
  } else if (type === 'XSuit') {
    y = drawXSuitSection(page, fonts, xs, y, isInternal);
  } else if (type === 'Supercar') {
    y = drawSupercarSection(page, fonts, sc, y, isInternal);
  } else if (type === 'UC') {
    y = drawUCSection(page, fonts, uc, y);
  }

  y -= 4;

  // ── CONTACTS ──
  if (isInternal) {
    y = drawFinancials(page, fonts, filteredTx, y);
    y -= 4;
    y = drawInternalContacts(page, fonts, filteredTx, y);
  } else {
    // Customer contacts — buyer phone + support only
    y = sectionHeader(page, fonts, 'Contact Information', y);
    y -= 4;
    y = drawContacts(page, fonts, [
      ['Your Phone',    filteredTx.buyer_phone !== null ? safeVal(filteredTx.buyer_phone) : null],
      ['MBSx Support',  SUPPORT_PHONE],
    ], y);
  }

  // ── DISCLAIMER / NOTICE ──
  y -= 12;
  hRule(page, MARGIN, y, CONTENT_W, { color: C.borderGold, thickness: 0.5 });
  y -= 12;

  const notice = isInternal
    ? 'This document is strictly confidential. Unauthorized disclosure is prohibited.'
    : 'Please save this receipt. For support or warranty claims, contact MBSx Store with your Transaction ID.';

  wrappedText(page, fonts, notice, MARGIN, y, {
    maxW:  CONTENT_W,
    size:  7.5,
    color: C.textMid,
  });

  // ── FOOTER ──
  drawFooter(page, fonts, isInternal, tx.exclude_print_date);

  return pdfDoc;
}

// ─────────────────────────────────────────────
// DOWNLOAD TRIGGER
// ─────────────────────────────────────────────

/**
 * Triggers a bulletproof direct PDF download in the browser.
 * Appends anchor temporarily to document body to ensure 100% compatibility with
 * Safari, Chrome, iOS/iPad devices, and prevents UUID-fallback naming.
 */
function triggerDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.style.display = 'none';
  a.href     = url;
  a.download = filename;
  
  // CRITICAL: Appending to the body is strictly required for Safari & mobile browsers!
  document.body.appendChild(a); 
  a.click();
  document.body.removeChild(a);
  
  // Clean up Object URL
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

/**
 * Generate and download a customer-safe PDF for a transaction.
 * Filename format: MBSX_Transaction_<TRANSACTION_ID>_Customer.pdf
 * @param {Object} tx - Joined transaction object
 */
export async function generateCustomerPDF(tx) {
  const pdfDoc = await buildPDF(tx, false);
  const bytes  = await pdfDoc.save();
  const txId   = safeVal(tx.transaction_id).replace(/\s+/g, '_');
  triggerDownload(bytes, `MBSX_Transaction_${txId}_Customer.pdf`);
}

/**
 * Generate and download a full admin/internal PDF for a transaction.
 * Filename format: MBSX_Transaction_<TRANSACTION_ID>_Admin.pdf
 * @param {Object} tx - Joined transaction object
 */
export async function generateInternalPDF(tx) {
  const pdfDoc = await buildPDF(tx, true);
  const bytes  = await pdfDoc.save();
  const txId   = safeVal(tx.transaction_id).replace(/\s+/g, '_');
  triggerDownload(bytes, `MBSX_Transaction_${txId}_Admin.pdf`);
}

/**
 * Generate both PDFs at once (useful for admin panels).
 * @param {Object} tx
 */
export async function generateBothPDFs(tx) {
  await generateCustomerPDF(tx);
  // Small delay so browser doesn't block the second download
  await new Promise(r => setTimeout(r, 800));
  await generateInternalPDF(tx);
}
