import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'Transactions_Export') => {
  if (!data || !data.length) return;

  const flattenedData = data.map(tx => {
    const base = {
      'Transaction ID': tx.transaction_id,
      'Type': tx.transaction_type,
      'Date': new Date(tx.transaction_date).toLocaleDateString(),
      'Mode': tx.mode_of_deal,
      'Sold Price': tx.sold_price,
      'Owner Price': tx.owner_price,
      'Profit': tx.profit,
      'Buyer Phone': tx.buyer_phone,
      'Payment Status': tx.payment_status,
      'Created At': new Date(tx.created_at).toLocaleString(),
    };

    // Include type-specific details if available
    if (tx.account_transactions?.[0]) {
      const acc = tx.account_transactions[0];
      base['Primary Login'] = acc.primary_login_provider;
      base['Secondary Login'] = acc.secondary_login_provider;
      base['Guarantee Plan'] = acc.guarantee_plan;
      base['Owner Phone'] = acc.owner_phone;
      base['Reseller Phone'] = acc.reseller_phone;
    } else if (tx.xsuit_transactions?.[0]) {
      const xsuit = tx.xsuit_transactions[0];
      base['Owner IG'] = xsuit.owner_ig_name;
      base['Buyer IG'] = xsuit.buyer_ig_name;
      base['Delivery Date'] = new Date(xsuit.delivery_date).toLocaleDateString();
    } else if (tx.supercar_transactions?.[0]) {
      const car = tx.supercar_transactions[0];
      base['Owner IG'] = car.owner_ig_name;
      base['Buyer IG'] = car.buyer_ig_name;
      base['Delivery Date'] = new Date(car.delivery_date).toLocaleDateString();
    } else if (tx.uc_transactions?.[0]) {
      const uc = tx.uc_transactions[0];
      base['UC Quantity'] = uc.uc_quantity;
      base['BGMI ID'] = uc.bgmi_id;
      base['Delivery Date'] = new Date(uc.delivery_date).toLocaleDateString();
    }

    return base;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
};
