import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const BRAND_COLOR = rgb(0.05, 0.05, 0.12);
const GOLD = rgb(1, 0.84, 0);
const WHITE = rgb(1, 1, 1);
const LIGHT_GRAY = rgb(0.7, 0.7, 0.7);
const DARK_GRAY = rgb(0.15, 0.15, 0.2);
const GREEN = rgb(0.1, 0.7, 0.3);
const RED_TEXT = rgb(0.85, 0.1, 0.1);

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const buildPDF = async (tx, isInternal = false) => {
  if (!tx) return;
  
  const type = tx.transaction_type || 'Account';
  const acc = tx.account_transactions?.[0] || {};
  const xs = tx.xsuit_transactions?.[0] || {};
  const sc = tx.supercar_transactions?.[0] || {};
  const uc = tx.uc_transactions?.[0] || {};

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const draw = (text, x, y, size = 10, f = font, color = rgb(0.1, 0.1, 0.15)) => {
    page.drawText(String(text ?? 'N/A'), { x, y, size, font: f, color });
  };

  const line = (y, opacity = 0.15) => {
    page.drawLine({
      start: { x: 40, y },
      end: { x: width - 40, y },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
    });
  };

  const section = (title, y) => {
    page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 20, color: DARK_GRAY });
    draw(title.toUpperCase(), 48, y + 2, 9, bold, GOLD);
    return y - 30;
  };

  // ── HEADER ──────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: BRAND_COLOR });
  draw('MBSx STORE', 40, height - 38, 22, bold, GOLD);
  draw('South India\'s #1 BGMI Account Marketplace', 40, height - 56, 9, font, LIGHT_GRAY);
  draw(
    isInternal ? '[ INTERNAL RECORD — CONFIDENTIAL ]' : '[ CUSTOMER RECEIPT & GUARANTEE CERTIFICATE ]',
    width - 250,
    height - 38,
    9,
    bold,
    isInternal ? RED_TEXT : GREEN
  );
  draw(`Generated: ${new Date().toLocaleString('en-IN')}`, width - 250, height - 56, 8, font, LIGHT_GRAY);

  let y = height - 100;

  // ── TRANSACTION SUMMARY ─────────────────────────────────────────────────
  y = section('Transaction Summary', y);

  draw('Transaction ID', 48, y, 9, bold);       draw(`#${tx.transaction_id || 'N/A'}`, 180, y, 9, font);
  draw('Transaction Date', 330, y, 9, bold);    draw(formatDate(tx.transaction_date), 460, y, 9, font);
  y -= 18;
  draw('Mode of Deal', 48, y, 9, bold);         draw(tx.mode_of_deal || 'N/A', 180, y, 9, font);
  draw('Mode of Payment', 330, y, 9, bold);     draw(tx.mode_of_payment || 'N/A', 460, y, 9, font);
  y -= 18;
  draw('Payment Status', 48, y, 9, bold);
  const statusColor = tx.payment_status === 'Fully Paid' || tx.payment_status === 'Paid' ? GREEN : rgb(0.9, 0.6, 0.1);
  draw(tx.payment_status || 'N/A', 180, y, 9, bold, statusColor);
  y -= 24;
  line(y);
  y -= 18;

  // ── FINANCIAL DETAILS ───────────────────────────────────────────────────
  if (isInternal) {
    y = section('Financial Details (Internal Only)', y);
    draw('Cost Price', 48, y, 9, bold);         draw(`₹ ${Number(tx.owner_price || 0).toLocaleString('en-IN')}`, 180, y, 9, font);
    draw('Sold Price', 330, y, 9, bold);        draw(`₹ ${Number(tx.sold_price || 0).toLocaleString('en-IN')}`, 460, y, 9, font);
    y -= 18;
    draw('NET PROFIT', 48, y, 10, bold);
    const profit = Number(tx.profit || 0);
    draw(`₹ ${profit.toLocaleString('en-IN')}`, 180, y, 10, bold, profit >= 0 ? GREEN : RED_TEXT);
    y -= 22;
    line(y);
    y -= 18;
  } else {
    y = section('Payment Confirmation', y);
    draw('Amount Paid', 48, y, 9, bold);
    draw(`₹ ${Number(tx.sold_price || 0).toLocaleString('en-IN')}`, 180, y, 11, bold, GREEN);
    y -= 22;
    line(y);
    y -= 18;
  }

  // ── PRODUCT DETAILS ─────────────────────────────────────────────────────
  y = section('Product Details', y);
  draw('Product Type', 48, y, 9, bold);
  
  let prodType = 'BGMI Account';
  if (type === 'XSuit') prodType = 'XSuit Gift';
  else if (type === 'Supercar') prodType = 'Supercar Gift';
  else if (type === 'UC') prodType = 'UC Top-Up Order';
  
  draw(prodType, 180, y, 9, font);
  y -= 18;

  if (type === 'XSuit') {
    draw('XSuit Name', 48, y, 9, bold);          draw(xs.xsuit_name || 'N/A', 180, y, 9, font);
    draw('Gift Status', 330, y, 9, bold);
    draw(xs.gift_status || 'N/A', 460, y, 9, bold, xs.gift_status === 'Delivered' ? GREEN : rgb(0.9,0.6,0.1));
    y -= 18;
    draw('Delivery Date', 48, y, 9, bold);       draw(formatDate(xs.delivery_date), 180, y, 9, font);
    draw('Delivery Time', 330, y, 9, bold);      draw(xs.delivery_time || 'N/A', 460, y, 9, font);
    y -= 18;
    draw('Gifter In-Game Name', 48, y, 9, bold);  draw(xs.gifter_ig_name || 'N/A', 180, y, 9, font);
    draw('Gifter In-Game ID', 330, y, 9, bold);   draw(String(xs.gifter_ig_id || 'N/A'), 460, y, 9, font);
    y -= 18;
    if (!isInternal) {
      // Customer copy: show buyer details
      draw('Buyer In-Game Name', 48, y, 9, bold); draw(xs.buyer_ig_name || 'N/A', 180, y, 9, font);
      draw('Buyer In-Game ID', 330, y, 9, bold);  draw(String(xs.buyer_ig_id || 'N/A'), 460, y, 9, font);
      y -= 18;
    }
  } else if (type === 'Supercar') {
    draw('Supercar Name', 48, y, 9, bold);       draw(sc.supercar_name || 'N/A', 180, y, 9, font);
    draw('Card Tier', 330, y, 9, bold);          draw(sc.supercar_card_tier || 'N/A', 460, y, 9, font);
    y -= 18;
    draw('Gift Status', 48, y, 9, bold);
    draw(sc.gift_status || 'N/A', 180, y, 9, bold, sc.gift_status === 'Delivered' ? GREEN : rgb(0.9,0.6,0.1));
    draw('Delivery Date', 330, y, 9, bold);      draw(formatDate(sc.delivery_date), 460, y, 9, font);
    y -= 18;
    draw('Gifter In-Game Name', 48, y, 9, bold);  draw(sc.gifter_ig_name || 'N/A', 180, y, 9, font);
    draw('Gifter In-Game ID', 330, y, 9, bold);   draw(String(sc.gifter_ig_id || 'N/A'), 460, y, 9, font);
    y -= 18;
    if (!isInternal) {
      draw('Buyer In-Game Name', 48, y, 9, bold); draw(sc.buyer_ig_name || 'N/A', 180, y, 9, font);
      draw('Buyer In-Game ID', 330, y, 9, bold);  draw(String(sc.buyer_ig_id || 'N/A'), 460, y, 9, font);
      y -= 18;
    }
  } else if (type === 'UC') {
    draw('UC Method', 48, y, 9, bold);           draw(uc.uc_method || 'N/A', 180, y, 9, font);
    draw('UC Pack', 330, y, 9, bold);            draw(uc.uc_pack || 'N/A', 460, y, 9, font);
    y -= 18;
    draw('Number of Packs', 48, y, 9, bold);     draw(String(uc.num_packs || 0), 180, y, 9, font);
    draw('Total UC', 330, y, 9, bold);           draw(`${uc.total_uc || 0} UC`, 460, y, 9, font);
    y -= 18;
    draw('Delivery Status', 48, y, 9, bold);
    draw(uc.delivery_status || 'N/A', 180, y, 9, bold, uc.delivery_status === 'Delivered' ? GREEN : rgb(0.9,0.6,0.1));
    draw('Delivery Date', 330, y, 9, bold);      draw(formatDate(uc.delivery_date), 460, y, 9, font);
    y -= 18;
  } else {
    // Account details
    if (acc.product_link) {
      draw('Product Reference', 48, y, 9, bold);  draw(acc.product_link.substring(0, 70), 180, y, 8, font);
      y -= 18;
    }
  }

  y -= 10;
  line(y);
  y -= 18;

  // ── TYPE-SPECIFIC SECTIONS (ONLY FOR ACCOUNTS) ──────────────────────────
  if (type === 'Account') {
    // ── LOGIN DETAILS ───────────────────────────────────────────────────────
    y = section('Login Information', y);
    draw('Primary Login', 48, y, 9, bold);        draw(acc.primary_login_provider || 'N/A', 180, y, 9, font);
    draw('Secondary Login', 330, y, 9, bold);     draw(acc.secondary_login_provider || 'N/A', 460, y, 9, font);
    y -= 18;
    draw('Primary Mothermail', 48, y, 9, bold);   draw(acc.primary_mothermail_status || 'N/A', 180, y, 9, font);
    draw('Secondary Mothermail', 330, y, 9, bold);draw(acc.secondary_mothermail_status || 'N/A', 460, y, 9, font);
    y -= 18;

    if (isInternal && acc.primary_credentials) {
      y -= 6;
      draw('Primary Credentials:', 48, y, 9, bold, RED_TEXT);
      y -= 14;
      const lines = (acc.primary_credentials || '').split('\n').slice(0, 3);
      lines.forEach(l => { draw(l, 60, y, 9, font); y -= 13; });
    }

    if (isInternal && acc.secondary_credentials) {
      y -= 4;
      draw('Secondary Credentials:', 48, y, 9, bold, RED_TEXT);
      y -= 14;
      const lines = (acc.secondary_credentials || '').split('\n').slice(0, 3);
      lines.forEach(l => { draw(l, 60, y, 9, font); y -= 13; });
    }

    y -= 10;
    line(y);
    y -= 18;

    // ── GUARANTEE DETAILS ───────────────────────────────────────────────────
    y = section('Guarantee Information', y);
    draw('Guarantee Plan', 48, y, 9, bold);       draw(acc.guarantee_plan || 'Not Applicable', 180, y, 9, font);
    y -= 18;
    draw('Primary Unlink Date', 48, y, 9, bold);  draw(formatDate(acc.primary_unlink_date), 180, y, 9, font);
    draw('Secondary Unlink Date', 330, y, 9, bold);draw(formatDate(acc.secondary_unlink_date), 460, y, 9, font);
    y -= 18;
    draw('Primary Void Date', 48, y, 9, bold);    draw(acc.primary_guarantee_void === 'no_guarantee' ? 'No Guarantee' : formatDate(acc.primary_guarantee_void_date), 180, y, 9, font);
    draw('Secondary Void Date', 330, y, 9, bold); draw(acc.secondary_guarantee_void === 'no_guarantee' ? 'No Guarantee' : formatDate(acc.secondary_guarantee_void_date), 460, y, 9, font);
    y -= 22;
    line(y);
    y -= 18;
  }

  // ── CONTACT DETAILS ─────────────────────────────────────────────────────
  if (isInternal) {
    y = section('Contact & Seller Details (Internal)', y);
    
    let ownerLabel = 'Owner Phone';
    let resellerLabel = 'Reseller Phone';
    
    if (type === 'UC') {
      ownerLabel = 'Loader Phone';
      resellerLabel = 'UC Seller Phone';
    } else if (type === 'XSuit' || type === 'Supercar') {
      ownerLabel = 'Gifter Phone';
    }

    draw(ownerLabel, 48, y, 9, bold);           draw(tx.owner_phone || 'N/A', 180, y, 9, font);
    draw('Seller Phone', 330, y, 9, bold);      draw(tx.seller_phone || 'N/A', 460, y, 9, font);
    y -= 18;
    draw(resellerLabel, 48, y, 9, bold);        draw(tx.reseller_phone || 'N/A', 180, y, 9, font);
    draw('Buyer Phone', 330, y, 9, bold);       draw(tx.buyer_phone || 'N/A', 460, y, 9, font);
    y -= 18;
    
    if (acc.owner_proof_link || tx.owner_proof_link) {
      const link = acc.owner_proof_link || tx.owner_proof_link;
      draw('Owner Proof Link', 48, y, 9, bold); draw(link.substring(0, 60), 180, y, 8, font);
      y -= 18;
    }
    
    y -= 8;
    line(y);
    y -= 18;
  } else {
    // Customer copy: show only buyer phone & support info
    y = section('Contact Information', y);
    draw('Your Registered Phone', 48, y, 9, bold); draw(tx.buyer_phone || 'N/A', 220, y, 9, font);
    y -= 22;
    line(y);
    y -= 18;
  }

  // ── FOOTER ───────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height: 60, color: BRAND_COLOR });
  draw('Thank you for choosing MBSx Store!', 40, 38, 10, bold, WHITE);
  draw('For support: WhatsApp / Telegram | @MBSxStore', 40, 20, 8, font, LIGHT_GRAY);
  draw(`Document: ${isInternal ? 'INTERNAL RECORD' : 'CUSTOMER COPY'} | MBSx Store © ${new Date().getFullYear()}`, width - 260, 20, 7, font, LIGHT_GRAY);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tx.transaction_id || 'Transaction'}_${isInternal ? 'Internal' : 'Customer'}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateCustomerPDF = (tx) => buildPDF(tx, false);
export const generateInternalPDF = (tx) => buildPDF(tx, true);
