import { create } from 'zustand';


export const useTransactionStore = create(
  (set) => ({

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
