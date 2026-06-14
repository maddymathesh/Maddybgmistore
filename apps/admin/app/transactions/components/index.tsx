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
  ArrowLeft
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

export default function TransactionsLayout() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // router is defined but currently unused
  // const router = useRouter();

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
        return <TransactionsList onAddNew={() => setActiveTab('create_account')} />;
      case 'create_account':
        return <CreateTransaction onBack={() => setActiveTab('transactions')} />;
      case 'create_xsuit':
        return <CreateXsuitTransaction onBack={() => setActiveTab('transactions')} />;
      case 'create_supercar':
        return <CreateSupercarTransaction onBack={() => setActiveTab('transactions')} />;
      case 'create_uc':
        return <CreateUcTransaction onBack={() => setActiveTab('transactions')} />;
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
    <div className="admin-layout" style={{ background: 'var(--color-bg)', color: '#eaeaea', fontFamily: 'var(--font-b)' }}>
      {/* Sidebar Overlay Backdrop on Mobile */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', lineHeight: 1.2 }}>
          <div>
            MBSx <br/><span style={{ fontSize: '14px', color: '#fff' }}>Transaction Panel</span>
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {/* Back to Control Center */}
          <Link
            href="/"
            className="admin-nav-item"
            style={{ width: '100%', border: 'none', background: 'transparent', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-gold)', textDecoration: 'none', padding: '10px 16px' }}
          >
            <ArrowLeft size={18} className="nav-icon" />
            Back to Control Center
          </Link>

          {/* Admin Panel cross-navigation */}
          {isStoreAdmin && (
            <Link
              href="/panel"
              className="admin-nav-item"
              style={{ width: '100%', border: 'none', background: 'transparent', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#eaeaea', textDecoration: 'none', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <LayoutDashboard size={18} className="nav-icon" />
              Admin Panel
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
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: isActive ? 'var(--color-gold-dim)' : 'transparent', borderRadius: '8px', marginBottom: '4px', justifyContent: 'flex-start' }}
              >
                <Icon size={18} className="nav-icon" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--color-border-gold)', marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonBox: "scale-125" } }} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="mobile-sidebar-toggle" 
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="admin-title">
                {activeTab.replace('_', ' ')} <span style={{ color: 'var(--color-gold)' }}>Panel</span>
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }} className="admin-header-actions">
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
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold), var(--color-orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }} className="hide-mobile">
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
