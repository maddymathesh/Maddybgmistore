import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactionStore } from '../../store/useTransactionStore';
import PinLogin from './PinLogin';
import Dashboard from './Dashboard';
import TransactionsList from './TransactionsList';
import CreateTransaction from './CreateTransaction';
import {
  LayoutDashboard,
  Receipt,
  UserSquare2,
  Gift,
  Car,
  Coins,
  Users,
  ShieldCheck,
  FileCheck,
  FileBarChart,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'accounts', label: 'Accounts', icon: UserSquare2 },
  { id: 'xsuit', label: 'XSuit', icon: Gift },
  { id: 'supercars', label: 'Supercars', icon: Car },
  { id: 'uc', label: 'UC', icon: Coins },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'guarantees', label: 'Guarantees', icon: ShieldCheck },
  { id: 'proofs', label: 'Payment Proofs', icon: FileCheck },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function TransactionsLayout() {
  const isAuthenticated = useTransactionStore((state) => state.isAuthenticated);
  const logout = useTransactionStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <PinLogin />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsList onAddNew={() => setActiveTab('create_transaction')} />;
      case 'create_transaction':
        return <CreateTransaction onBack={() => setActiveTab('transactions')} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>This module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col flex-shrink-0"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              MBSx Panel
            </h1>
            <p className="text-xs text-white/40 mt-1">Transaction Management</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-blue-500' : 'text-white/40'} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Secure Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div>
            <h2 className="text-xl font-semibold text-white capitalize">
              {activeTab.replace('_', ' ')}
            </h2>
            <p className="text-xs text-white/40 mt-1">
              {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             {activeTab !== 'create_transaction' && activeTab !== 'dashboard' && (
               <button 
                onClick={() => setActiveTab('create_transaction')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Plus size={16} /> New Transaction
              </button>
             )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg">
              <ShieldCheck size={20} className="text-white" />
            </div>
          </div>
        </header>

        {/* Content Render */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
