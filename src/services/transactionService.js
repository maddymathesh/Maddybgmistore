import { supabase } from '../utils/supabase';

export const fetchAllTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      account_transactions (*),
      xsuit_transactions (*),
      supercar_transactions (*),
      uc_transactions (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
  return data;
};

export const createTransaction = async (type, mainData, detailData) => {
  // 1. Insert into main transactions table
  const { data: transaction, error: mainError } = await supabase
    .from('transactions')
    .insert([mainData])
    .select()
    .single();

  if (mainError) throw mainError;

  const transactionRef = transaction.transaction_id;

  // 2. Insert into specific type table
  let detailError = null;

  switch (type) {
    case 'Account':
      const { error: accErr } = await supabase
        .from('account_transactions')
        .insert([{ ...detailData, transaction_ref: transactionRef }]);
      detailError = accErr;
      break;
    case 'XSuit':
      const { error: xErr } = await supabase
        .from('xsuit_transactions')
        .insert([{ ...detailData, transaction_ref: transactionRef }]);
      detailError = xErr;
      break;
    case 'Supercar':
      const { error: scErr } = await supabase
        .from('supercar_transactions')
        .insert([{ ...detailData, transaction_ref: transactionRef }]);
      detailError = scErr;
      break;
    case 'UC':
      const { error: ucErr } = await supabase
        .from('uc_transactions')
        .insert([{ ...detailData, transaction_ref: transactionRef }]);
      detailError = ucErr;
      break;
    default:
      throw new Error(`Unknown transaction type: ${type}`);
  }

  if (detailError) {
    // Optionally rollback main transaction here or handle orphaned data
    throw detailError;
  }

  return transaction;
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
