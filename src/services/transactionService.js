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
