import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTransactionStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (pin) => {
        if (pin === '9025') {
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
    }),
    {
      name: 'transaction-auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
