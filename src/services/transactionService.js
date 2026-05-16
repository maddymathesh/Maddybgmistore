import { supabase } from '../utils/supabase';

/**
 * Generates the next sequential MBSAID transaction ID.
 * Queries the DB for the highest existing ID and increments by 1.
 * Format: MBSAID001, MBSAID002, ..., MBSAID999, MBSAID1000
 */
export const generateNextTransactionId = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('transaction_id')
    .like('transaction_id', 'MBSA%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    // No records yet — continue from the last known ID in the old system
    return 'MBSA403';
  }

  const lastId = data[0].transaction_id; // e.g. "MBSA402"
  const num = parseInt(lastId.replace('MBSA', ''), 10);
  const next = num + 1;
  // Pad to 3 digits minimum, e.g. MBSA403, MBSA1000
  return `MBSA${String(next).padStart(3, '0')}`;
};

/**
 * Fetch all transactions with their account details joined.
 */
export const fetchAllTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      account_transactions (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  return data;
};

/**
 * Create a new Account transaction.
 * @param {object} mainData  - Fields for the `transactions` table.
 * @param {object} detailData - Fields for the `account_transactions` table.
 */
export const createAccountTransaction = async (mainData, detailData) => {
  // 1. Insert main transaction record
  const { data: transaction, error: mainError } = await supabase
    .from('transactions')
    .insert([mainData])
    .select()
    .single();

  if (mainError) throw mainError;

  // 2. Insert account-specific details
  const { error: detailError } = await supabase
    .from('account_transactions')
    .insert([{ ...detailData, transaction_ref: transaction.transaction_id }]);

  if (detailError) throw detailError;

  return transaction;
};

/**
 * Delete a transaction by its UUID.
 */
export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Generates the next sequential MBSXS XSuit transaction ID.
 */
export const generateNextXsuitId = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('transaction_id')
    .like('transaction_id', 'MBSXS%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) return 'MBSXS001';

  const num = parseInt(data[0].transaction_id.replace('MBSXS', ''), 10);
  return `MBSXS${String(num + 1).padStart(3, '0')}`;
};

/**
 * Create a new XSuit Gift transaction.
 */
export const createXsuitTransaction = async (mainData, detailData) => {
  const { data: transaction, error: mainError } = await supabase
    .from('transactions')
    .insert([mainData])
    .select()
    .single();

  if (mainError) throw mainError;

  const { error: detailError } = await supabase
    .from('xsuit_transactions')
    .insert([{ ...detailData, transaction_ref: transaction.transaction_id }]);

  if (detailError) throw detailError;

  return transaction;
};

/**
 * Generates the next sequential MBSSC Supercar transaction ID.
 */
export const generateNextSupercarId = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('transaction_id')
    .like('transaction_id', 'MBSSC%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) return 'MBSSC001';

  const num = parseInt(data[0].transaction_id.replace('MBSSC', ''), 10);
  return `MBSSC${String(num + 1).padStart(3, '0')}`;
};

/**
 * Create a new Supercar Gift transaction.
 */
export const createSupercarTransaction = async (mainData, detailData) => {
  const { data: transaction, error: mainError } = await supabase
    .from('transactions')
    .insert([mainData])
    .select()
    .single();

  if (mainError) throw mainError;

  const { error: detailError } = await supabase
    .from('supercar_transactions')
    .insert([{ ...detailData, transaction_ref: transaction.transaction_id }]);

  if (detailError) throw detailError;

  return transaction;
};

/**
 * Generates the next sequential MBSUC transaction ID.
 */
export const generateNextUcId = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('transaction_id')
    .like('transaction_id', 'MBSUC%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) return 'MBSUC001';

  const num = parseInt(data[0].transaction_id.replace('MBSUC', ''), 10);
  return `MBSUC${String(num + 1).padStart(3, '0')}`;
};

/**
 * Create a new UC Order transaction.
 */
export const createUcTransaction = async (mainData, detailData) => {
  const { data: transaction, error: mainError } = await supabase
    .from('transactions')
    .insert([mainData])
    .select()
    .single();

  if (mainError) throw mainError;

  const { error: detailError } = await supabase
    .from('uc_transactions')
    .insert([{ ...detailData, transaction_ref: transaction.transaction_id }]);

  if (detailError) throw detailError;

  return transaction;
};
