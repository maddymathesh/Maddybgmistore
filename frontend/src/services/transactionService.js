import * as api from './api';
import { sanitizePhone } from '../utils/formatters';

/**
 * Generates the next sequential ID by fetching all transactions and finding the max.
 */
const getNextSequentialId = async (prefix, sheet = 'transactions') => {
  try {
    const transactions = await api.getTransactions(sheet);
    const filtered = transactions
      .filter(tx => tx.transaction_id && tx.transaction_id.startsWith(prefix))
      .map(tx => parseInt(tx.transaction_id.replace(prefix, ''), 10))
      .filter(num => !isNaN(num));

    if (filtered.length === 0) {
      if (prefix === 'MBSA') return 'MBSA403';
      return `${prefix}001`;
    }

    const next = Math.max(...filtered) + 1;
    return `${prefix}${String(next).padStart(3, '0')}`;
  } catch (error) {
    console.error(`Error generating next ${prefix} ID:`, error);
    if (prefix === 'MBSA') return 'MBSA403';
    return `${prefix}001`;
  }
};

export const generateNextTransactionId = () => getNextSequentialId('MBSA');
export const generateNextXsuitId = () => getNextSequentialId('MBSXS');
export const generateNextSupercarId = () => getNextSequentialId('MBSSC');
export const generateNextUcId = () => getNextSequentialId('MBSUC');

/**
 * Fetch all transactions with their details manually joined.
 */
export const fetchAllTransactions = async (forceRefresh = false) => {
  try {
    const params = forceRefresh ? { noCache: 'true' } : {};
    const [transactions, accounts, xsuits, supercars, ucs] = await Promise.all([
      api.getTransactions('transactions', params),
      api.getTransactions('account_transactions', params),
      api.getTransactions('xsuit_transactions', params),
      api.getTransactions('supercar_transactions', params),
      api.getTransactions('uc_transactions', params),
    ]);

    return transactions.map(tx => ({
      ...tx,
      account_transactions: accounts.filter(a => a.transaction_ref === tx.transaction_id),
      xsuit_transactions: xsuits.filter(x => x.transaction_ref === tx.transaction_id),
      supercar_transactions: supercars.filter(s => s.transaction_ref === tx.transaction_id),
      uc_transactions: ucs.filter(u => u.transaction_ref === tx.transaction_id),
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
};

/**
 * Fetch optimized cached dashboard analytics
 */
export const fetchDashboardStats = async (forceRefresh = false) => {
  try {
    const params = { action: 'analytics' };
    if (forceRefresh) params.noCache = 'true';
    const stats = await api.getTransactions('dashboard', params);
    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Generic create function to handle main + detail inserts.
 */
const createFullTransaction = async (mainData, detailData, detailSheet) => {
  try {
    const sanitizedMainData = { ...mainData };
    const phoneFields = ['buyer_phone', 'owner_phone', 'seller_phone', 'reseller_phone'];
    phoneFields.forEach(field => {
      if (sanitizedMainData[field]) {
        sanitizedMainData[field] = sanitizePhone(sanitizedMainData[field]);
      }
    });

    // 1. Insert main transaction
    const transaction = await api.createTransaction('transactions', {
      ...sanitizedMainData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    });

    // 2. Insert detail record
    if (detailData && detailSheet) {
      await api.createTransaction(detailSheet, {
        ...detailData,
        id: crypto.randomUUID(),
        transaction_ref: mainData.transaction_id,
        created_at: new Date().toISOString()
      });
    }

    return transaction;
  } catch (error) {
    console.error(`Error creating transaction in ${detailSheet}:`, error);
    throw error;
  }
};

export const createAccountTransaction = (mainData, detailData) => 
  createFullTransaction(mainData, detailData, 'account_transactions');

export const createXsuitTransaction = (mainData, detailData) => 
  createFullTransaction(mainData, detailData, 'xsuit_transactions');

export const createSupercarTransaction = (mainData, detailData) => 
  createFullTransaction(mainData, detailData, 'supercar_transactions');

export const createUcTransaction = (mainData, detailData) => 
  createFullTransaction(mainData, detailData, 'uc_transactions');

/**
 * Delete a transaction by its ID.
 */
export const deleteTransaction = async (txOrId) => {
  try {
    if (typeof txOrId === 'object' && txOrId !== null) {
      const tx = txOrId;
      const mainId = tx.id;
      const promises = [];

      // 1. Delete main transaction from 'transactions' sheet
      if (mainId) {
        promises.push(api.deleteTransaction('transactions', mainId));
      }

      // 2. Delete matching rows in detail sheets in parallel
      if (tx.account_transactions && tx.account_transactions.length > 0) {
        tx.account_transactions.forEach(detail => {
          if (detail.id) {
            promises.push(api.deleteTransaction('account_transactions', detail.id));
          }
        });
      }
      if (tx.xsuit_transactions && tx.xsuit_transactions.length > 0) {
        tx.xsuit_transactions.forEach(detail => {
          if (detail.id) {
            promises.push(api.deleteTransaction('xsuit_transactions', detail.id));
          }
        });
      }
      if (tx.supercar_transactions && tx.supercar_transactions.length > 0) {
        tx.supercar_transactions.forEach(detail => {
          if (detail.id) {
            promises.push(api.deleteTransaction('supercar_transactions', detail.id));
          }
        });
      }
      if (tx.uc_transactions && tx.uc_transactions.length > 0) {
        tx.uc_transactions.forEach(detail => {
          if (detail.id) {
            promises.push(api.deleteTransaction('uc_transactions', detail.id));
          }
        });
      }

      await Promise.all(promises);
    } else {
      // Fallback if only id is passed (old behavior or fallback)
      await api.deleteTransaction('transactions', txOrId);
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
