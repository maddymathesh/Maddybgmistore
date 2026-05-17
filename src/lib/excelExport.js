import * as XLSX from 'xlsx';

const parseDateString = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

const parseDateTimeString = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString();
  } catch {
    return 'N/A';
  }
};

export const exportToExcel = (data, filename = 'Transactions_Export') => {
  if (!data || !data.length) return;

  const flattenedData = data.map(tx => {
    const base = {
      'Transaction ID': tx.transaction_id || 'N/A',
      'Type': tx.transaction_type || 'N/A',
      'Date': parseDateString(tx.transaction_date),
      'Mode': tx.mode_of_deal || 'N/A',
      'Sold Price': tx.sold_price !== undefined && tx.sold_price !== null ? tx.sold_price : 0,
      'Owner Price': tx.owner_price !== undefined && tx.owner_price !== null ? tx.owner_price : 0,
      'Profit': tx.profit !== undefined && tx.profit !== null ? tx.profit : 0,
      'Buyer Phone': tx.buyer_phone || 'N/A',
      'Payment Status': tx.payment_status || 'N/A',
      'Created At': parseDateTimeString(tx.created_at || tx.transaction_date),
    };

    // Include type-specific details if available
    if (tx.account_transactions?.[0]) {
      const acc = tx.account_transactions[0];
      base['Primary Login'] = acc.primary_login_provider || 'N/A';
      base['Secondary Login'] = acc.secondary_login_provider || 'N/A';
      base['Guarantee Plan'] = acc.guarantee_plan || 'N/A';
      base['Owner Phone'] = tx.owner_phone || 'N/A';
      base['Seller Phone'] = tx.seller_phone || 'N/A';
      base['Reseller Phone'] = tx.reseller_phone || 'N/A';
      base['Owner Proof Link'] = acc.owner_proof_link || 'N/A';
    } else if (tx.xsuit_transactions?.[0]) {
      const xsuit = tx.xsuit_transactions[0];
      base['XSuit Name'] = xsuit.xsuit_name || 'N/A';
      base['Gifter In-Game Name'] = xsuit.gifter_ig_name || 'N/A';
      base['Gifter In-Game ID'] = xsuit.gifter_ig_id || 'N/A';
      base['Buyer In-Game Name'] = xsuit.buyer_ig_name || 'N/A';
      base['Buyer In-Game ID'] = xsuit.buyer_ig_id || 'N/A';
      base['Gift Status'] = xsuit.gift_status || 'N/A';
      base['Delivery Date'] = parseDateString(xsuit.delivery_date);
      base['Delivery Time'] = xsuit.delivery_time || 'N/A';
      base['Gifter Phone'] = tx.owner_phone || 'N/A';
      base['Seller Phone'] = tx.seller_phone || 'N/A';
      base['Reseller Phone'] = tx.reseller_phone || 'N/A';
    } else if (tx.supercar_transactions?.[0]) {
      const car = tx.supercar_transactions[0];
      base['Supercar Name'] = car.supercar_name || 'N/A';
      base['Card Tier'] = car.supercar_card_tier || 'N/A';
      base['Gifter In-Game Name'] = car.gifter_ig_name || 'N/A';
      base['Gifter In-Game ID'] = car.gifter_ig_id || 'N/A';
      base['Buyer In-Game Name'] = car.buyer_ig_name || 'N/A';
      base['Buyer In-Game ID'] = car.buyer_ig_id || 'N/A';
      base['Gift Status'] = car.gift_status || 'N/A';
      base['Delivery Date'] = parseDateString(car.delivery_date);
      base['Delivery Time'] = car.delivery_time || 'N/A';
      base['Gifter Phone'] = tx.owner_phone || 'N/A';
      base['Seller Phone'] = tx.seller_phone || 'N/A';
      base['Reseller Phone'] = tx.reseller_phone || 'N/A';
    } else if (tx.uc_transactions?.[0]) {
      const uc = tx.uc_transactions[0];
      base['UC Method'] = uc.uc_method || 'N/A';
      base['UC Pack'] = uc.uc_pack || 'N/A';
      base['Num Packs'] = uc.num_packs || 0;
      base['Total UC'] = uc.total_uc || 0;
      base['Delivery Date'] = parseDateString(uc.delivery_date);
      base['Delivery Time'] = uc.delivery_time || 'N/A';
      base['Delivery Status'] = uc.delivery_status || 'N/A';
      base['Loader Phone'] = tx.owner_phone || 'N/A';
      base['Seller Phone'] = tx.seller_phone || 'N/A';
      base['UC Seller Phone'] = tx.reseller_phone || 'N/A';
    }

    return base;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
};
