import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactionStore } from '../../store/useTransactionStore';
import PinLogin from './PinLogin';
import Dashboard from './Dashboard';
import TransactionsList from './TransactionsList';
import CreateTransaction from './CreateTransaction';
import CreateXsuitTransaction from './CreateXsuitTransaction';
import CreateSupercarTransaction from './CreateSupercarTransaction';
import CreateUcTransaction from './CreateUcTransaction';
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
        return <TransactionsList onAddNew={() => setActiveTab('create_account')} />;
      case 'create_account':
        return <CreateTransaction onBack={() => setActiveTab('transactions')} />;
      case 'create_xsuit':
        return <CreateXsuitTransaction onBack={() => setActiveTab('transactions')} />;
      case 'create_supercar':
        return <CreateSupercarTransaction onBack={() => setActiveTab('transactions')} />;
      case 'create_uc':
        return <CreateUcTransaction onBack={() => setActiveTab('transactions')} />;
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: 'var(--muted)' }}>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Coming Soon</h2>
            <p>This module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-layout" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-b)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo" style={{ lineHeight: 1.2 }}>
          MBSx <br/><span style={{ fontSize: '14px' }}>Transaction Panel</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: isActive ? 'var(--gold-dim)' : 'transparent', borderRadius: '8px', marginBottom: '4px', justifyContent: 'flex-start' }}
              >
                <Icon size={18} className="nav-icon" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border-gold)', marginTop: 'auto' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="btn btn-outline"
            style={{ width: '100%', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)', justifyContent: 'center' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">
              {activeTab.replace('_', ' ')} <span style={{ color: 'var(--gold)' }}>Panel</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {(activeTab === 'transactions') && (
              <>
                <button onClick={() => setActiveTab('create_account')} className="btn btn-gold" style={{ fontSize: '12px', padding: '10px 16px' }}>
                  <Plus size={15} /> Account
                </button>
                <button onClick={() => setActiveTab('create_xsuit')} className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 16px', borderColor: 'var(--border-gold)', color: 'var(--gold)' }}>
                  <Plus size={15} /> XSuit Gift
                </button>
                <button onClick={() => setActiveTab('create_supercar')} className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 16px', borderColor: 'rgba(239,68,68,0.4)', color: 'var(--red)' }}>
                  <Plus size={15} /> Supercar Gift
                </button>
                <button onClick={() => setActiveTab('create_uc')} className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 16px', borderColor: 'rgba(59,130,246,0.4)', color: '#3b82f6' }}>
                  <Plus size={15} /> UC Order
                </button>
              </>
            )}
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>

        {/* Content Render */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
