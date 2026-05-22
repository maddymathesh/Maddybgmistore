import { create } from 'zustand';
import { sha256 } from '../utils/crypto';

export const useTransactionStore = create(
  (set) => ({
    isAuthenticated: false,
    login: async (pin) => {
      const hashedInput = await sha256(pin);
      const expectedHash = "b5866a9c2c792af98bd521d4af16c6759481fc397e151609a45b77b48ac8cd2e"; // SHA-256 of '9025'
      if (hashedInput === expectedHash) {
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    },
    logout: () => set({ isAuthenticated: false }),
    transactions: [],
    setTransactions: (transactions) => set({ transactions }),
    
    // Dashboard stats
    stats: {
      totalSales: 0,
      totalProfit: 0,
      pendingPayments: 0,
      activeGuarantees: 0,
    },
    setStats: (stats) => set({ stats }),
  })
);
