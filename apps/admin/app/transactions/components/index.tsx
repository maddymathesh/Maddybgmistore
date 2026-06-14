"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserButton } from '@clerk/nextjs';
import Dashboard from './Dashboard';
import TransactionsList from './TransactionsList';
import CreateTransaction from './CreateTransaction';
import CreateXsuitTransaction from './CreateXsuitTransaction';
import CreateSupercarTransaction from './CreateSupercarTransaction';
import CreateUcTransaction from './CreateUcTransaction';
import CustomersList from './CustomersList';
import GuaranteesList from './GuaranteesList';
import ReportsView from './ReportsView';
import SettingsView from './SettingsView';
import ProductInsights from './ProductInsights';
import TasksAlerts from './TasksAlerts';
// Removed unused CustomerFeedback import
import AdminActivityLog from './AdminActivityLog';
import FinancialOverview from './FinancialOverview';
import Link from 'next/link';

import {
  Users,
  ShieldCheck,
  FileBarChart,
  Settings,
  Plus,
  Layers,
  CheckSquare,
  History,
  DollarSign,
  Menu,
  X,
  ShieldAlert,
  Loader2,
  LayoutDashboard,
  Receipt,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'insights', label: 'Product Insights', icon: Layers },
  { id: 'tasks', label: 'Tasks & Alerts', icon: CheckSquare },
  { id: 'activity', label: 'Admin Activity Log', icon: History },
  { id: 'financials', label: 'Financial Overview', icon: DollarSign },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'guarantees', label: 'Guarantees', icon: ShieldCheck },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface TransactionData {
  transaction_id?: string;
  transaction_type: string;
  [key: string]: unknown;
}

export default function TransactionsLayout() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTx, setEditingTx] = useState<TransactionData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-gold)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', background: 'var(--color-bg)', color: '#fff', fontFamily: 'var(--font-b)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-gold)' }} />
        <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '24px', fontWeight: 900 }}>Authentication Required</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>Please sign in to access the Transactions Panel.</p>
        <Link href="/login" className="btn btn-gold px-6 py-2.5 text-sm">Sign In</Link>
      </div>
    );
  }

  const isPermanentAdmin = 
    user?.primaryEmailAddress?.emailAddress === "contact@maddybgmistore.in" ||
    user?.primaryEmailAddress?.emailAddress === "maddybgmistoreog@gmail.com" ||
    user?.primaryEmailAddress?.emailAddress === "r.mateshwaran.io@gmail.com";
  const userRole = String((user?.publicMetadata as Record<string, unknown> | undefined)?.role || "USER");
  const isAdmin = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER"].includes(userRole);
  const isStoreAdmin = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN"].includes(userRole);

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', background: 'var(--color-bg)', color: '#fff', fontFamily: 'var(--font-b)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-red)' }} />
        <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '24px', fontWeight: 900, color: 'var(--color-red)' }}>Access Denied</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>You do not have administrative privileges to view this page.</p>
        <Link href="/" className="btn btn-outline px-6 py-2.5 text-sm">← Back to Control Center</Link>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsList 
                 onAddNew={() => setActiveTab('create_account')} 
                 onEdit={(tx: TransactionData) => { 
                   setEditingTx(tx); 
                   setActiveTab(`edit_${tx.transaction_type.toLowerCase()}`); 
                 }} 
               />;
      case 'create_account':
      case 'edit_account':
        return <CreateTransaction onBack={() => { setActiveTab('transactions'); setEditingTx(null); }} initialData={editingTx} />;
      case 'create_xsuit':
      case 'edit_xsuit':
        return <CreateXsuitTransaction onBack={() => { setActiveTab('transactions'); setEditingTx(null); }} initialData={editingTx} />;
      case 'create_supercar':
      case 'edit_supercar':
        return <CreateSupercarTransaction onBack={() => { setActiveTab('transactions'); setEditingTx(null); }} initialData={editingTx} />;
      case 'create_uc':
      case 'edit_uc':
        return <CreateUcTransaction onBack={() => { setActiveTab('transactions'); setEditingTx(null); }} initialData={editingTx} />;
      case 'insights':
        return <ProductInsights />;
      case 'tasks':
        return <TasksAlerts />;
      case 'activity':
        return <AdminActivityLog />;
      case 'financials':
        return <FinancialOverview />;
      case 'customers':
        return <CustomersList />;
      case 'guarantees':
        return <GuaranteesList />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: 'var(--color-muted)' }}>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Coming Soon</h2>
            <p>This module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-layout min-h-screen bg-[#080a0f] text-[#eaeaea] font-[var(--font-b)]">
      {/* Sidebar Overlay Backdrop on Mobile */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo flex items-center justify-between leading-tight">
          <div className="logo-full-text">
            MBSx <br/><span className="text-sm text-white">Transaction Panel</span>
          </div>
          <div className="logo-collapsed-text hidden font-black text-xl text-yellow-500 tracking-wider">
            MBS
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-muted)",
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "4px"
            }}
            className="mobile-only-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          {/* Collapse/Expand Toggle (Desktop only) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex admin-nav-item w-full border-none bg-transparent rounded-lg mb-2 items-center gap-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2.5"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} className="nav-icon text-yellow-500" />
            ) : (
              <ChevronLeft size={18} className="nav-icon text-yellow-500" />
            )}
            <span>Collapse Sidebar</span>
          </button>

          {/* Back to Control Center */}
          <Link
            href="/"
            className="admin-nav-item w-full border-none bg-transparent rounded-lg mb-2 flex items-center gap-2 text-[13px] text-yellow-500 hover:bg-yellow-500/10 no-underline px-4 py-2.5"
          >
            <ArrowLeft size={18} className="nav-icon" />
            <span>Back to Control Center</span>
          </Link>

          {/* Admin Panel cross-navigation */}
          {isStoreAdmin && (
            <Link
              href="/panel"
              className="admin-nav-item w-full border-none bg-transparent rounded-lg mb-4 flex items-center gap-2 text-[13px] text-[#eaeaea] hover:bg-white/5 no-underline px-4 py-2.5 border-b border-white/5"
            >
              <LayoutDashboard size={18} className="nav-icon" />
              <span>Admin Panel</span>
            </Link>
          )}

          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`admin-nav-item w-full border-none rounded-lg mb-1 flex justify-start items-center gap-2 px-4 py-2.5 transition-colors ${isActive ? 'bg-yellow-500/10 text-yellow-500' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-yellow-500/20 mt-auto flex justify-center">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonBox: "scale-125" } }} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-header">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="mobile-sidebar-toggle" 
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="admin-title capitalize">
                {activeTab.replace('_', ' ')} <span style={{ color: 'var(--color-gold)' }}>Panel</span>
              </h1>
              <p className="text-[13px] text-gray-400 mt-1">
                {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap admin-header-actions">
            {(activeTab === 'transactions') && (
              <>
                <button onClick={() => setActiveTab('create_account')} className="btn btn-gold px-4 py-2.5 text-xs">
                  <Plus size={15} /> Account
                </button>
                <button onClick={() => setActiveTab('create_xsuit')} className="btn btn-outline border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 px-4 py-2.5 text-xs">
                  <Plus size={15} /> XSuit Gift
                </button>
                <button onClick={() => setActiveTab('create_supercar')} className="btn btn-outline border-red-500/50 text-red-500 hover:bg-red-500/10 px-4 py-2.5 text-xs">
                  <Plus size={15} /> Supercar Gift
                </button>
                <button onClick={() => setActiveTab('create_uc')} className="btn btn-outline border-blue-500/50 text-blue-500 hover:bg-blue-500/10 px-4 py-2.5 text-xs">
                  <Plus size={15} /> UC Order
                </button>
              </>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black hide-mobile">
              <ShieldCheck size={20} />
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

      {/* Mobile styling overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .mobile-only-close-btn {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .admin-header-actions {
            width: 100%;
            gap: 8px;
          }
          .admin-header-actions button {
            flex: 1;
            min-width: 120px;
            justify-content: center;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
