import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const buildPDF = async (tx, isInternal = false) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (text, x, y, size = 12, fontType = font, color = rgb(0,0,0)) => {
    page.drawText(String(text), { x, y, size, font: fontType, color });
  };

  // Header
  page.drawRectangle({ x: 0, y: 700, width: 600, height: 100, color: rgb(0.05, 0.05, 0.05) });
  drawText('MBSx STORE', 50, 760, 24, boldFont, rgb(1, 1, 1));
  drawText(isInternal ? 'INTERNAL INVOICE & RECORD' : 'CUSTOMER RECEIPT & GUARANTEE', 50, 730, 12, font, rgb(0.8, 0.8, 0.8));

  let y = 650;

  // Transaction Info
  drawText(`Transaction ID: ${tx.transaction_id}`, 50, y, 12, boldFont);
  drawText(`Date: ${new Date(tx.transaction_date).toLocaleDateString()}`, 400, y, 12, font);
  y -= 30;
  drawText(`Type: ${tx.transaction_type}`, 50, y, 12, font);
  drawText(`Payment Status: ${tx.payment_status}`, 400, y, 12, font);
  y -= 40;

  page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  y -= 30;

  // Financials
  if (isInternal) {
    drawText('FINANCIAL DETAILS (INTERNAL ONLY)', 50, y, 14, boldFont);
    y -= 25;
    drawText(`Owner Price: ₹${tx.owner_price}`, 50, y, 12, font);
    drawText(`Sold Price: ₹${tx.sold_price}`, 250, y, 12, font);
    drawText(`Profit: ₹${tx.profit}`, 450, y, 12, boldFont, rgb(0, 0.5, 0));
    y -= 40;
    page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 30;
  } else {
    drawText(`Amount Paid: ₹${tx.sold_price}`, 50, y, 14, boldFont);
    y -= 40;
    page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 30;
  }

  // Specific Details
  if (tx.transaction_type === 'Account' && tx.account_transactions?.[0]) {
    const acc = tx.account_transactions[0];
    drawText('ACCOUNT DETAILS', 50, y, 14, boldFont);
    y -= 25;
    drawText(`Primary Login: ${acc.primary_login_provider}`, 50, y, 12, font);
    drawText(`Secondary Login: ${acc.secondary_login_provider}`, 300, y, 12, font);
    y -= 25;
    drawText(`Guarantee Plan: ${acc.guarantee_plan}`, 50, y, 12, font);
    if (acc.unlink_eligible_date) drawText(`Unlink Date: ${acc.unlink_eligible_date}`, 300, y, 12, font);
    y -= 40;

    if (isInternal && acc.credentials) {
      drawText('CREDENTIALS (INTERNAL ONLY)', 50, y, 14, boldFont, rgb(0.8, 0, 0));
      y -= 25;
      drawText(acc.credentials, 50, y, 10, font);
      y -= 40;
    }
  }

  // Footer
  drawText('Thank you for choosing MBSx Store!', 50, 100, 14, boldFont);
  drawText('For support, contact us via WhatsApp or Telegram.', 50, 80, 10, font, rgb(0.5, 0.5, 0.5));

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${tx.transaction_id}_${isInternal ? 'Internal' : 'Customer'}.pdf`;
  link.click();
};

export const generateCustomerPDF = (tx) => buildPDF(tx, false);
export const generateInternalPDF = (tx) => buildPDF(tx, true);
