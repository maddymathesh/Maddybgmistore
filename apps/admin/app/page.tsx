"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Receipt, 
  ShieldAlert, 
  Loader2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { getAdminMetrics } from "./actions";

interface AdminMetrics {
  totalViews?: number;
  products?: { total: number; available: number; sold: number };
  reviews?: { total: number; pending: number; approved: number };
  feedback?: { unread: number };
  analytics?: { count: number; revenue: number; profit: number };
}

export default function ControlCenterPage() {
  const { user, isLoaded } = useUser();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Compute admin status (client-side checks)
  const isPermanentAdmin = 
    user?.primaryEmailAddress?.emailAddress === "contact@maddybgmistore.in" || 
    user?.primaryEmailAddress?.emailAddress === "maddybgmistoreog@gmail.com" || 
    user?.primaryEmailAddress?.emailAddress === "r.mateshwaran.io@gmail.com";
  
  const userRole = (user?.publicMetadata?.role as string) || "USER";
  const isAdmin = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN"].includes(userRole);
  const isSuperAdmin = isPermanentAdmin || userRole === "SUPER_ADMIN";
  const isTxManager = userRole === "TRANSACTION_MANAGER";
  const isAuthorized = isAdmin || isTxManager;

  useEffect(() => {
    async function fetchMetrics() {
      if (isLoaded && user && isAuthorized) {
        try {
          const res = await getAdminMetrics();
          if (res && res.success && res.metrics) {
            setMetrics(res.metrics);
          }
        } catch (err) {
          console.error("Failed to load metrics:", err);
        } finally {
          setLoadingMetrics(false);
        }
      }
    }
    fetchMetrics();
  }, [isLoaded, user, isAuthorized]);

  // Clerk Loading State
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0c10]">
        <Loader2 size={36} className="animate-spin text-gold" />
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a0c10] text-white font-sans px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(234,179,8,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        <div className="glass-panel p-8 max-w-md w-full rounded-2xl border border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <ShieldAlert size={54} className="text-gold mb-4 animate-pulse" />
          <h1 className="font-h text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 uppercase tracking-widest">Authentication Required</h1>
          <p className="text-sm text-[#94a3b8] font-mono mt-2 mb-6">Administrative privileges are required to access this portal.</p>
          <Link href="/login" className="btn btn-gold w-full justify-center py-3 text-xs font-bold tracking-wider uppercase bg-yellow-500 hover:bg-yellow-600 text-black rounded transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Logged In but Unauthorized
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a0c10] text-white font-sans px-4">
        <div className="glass-panel p-8 max-w-md w-full rounded-2xl border border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <ShieldAlert size={54} className="text-red-500 mb-4" />
          <h1 className="font-h text-2xl font-black text-red-500 uppercase tracking-widest">Access Denied</h1>
          <p className="text-sm text-[#94a3b8] font-mono mt-2 mb-6">Your account is not authorized to access this system. If you believe this is an error, contact the Super Admin.</p>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 w-full justify-start mb-4">
            <UserButton afterSignOutUrl="/login" />
            <div className="text-left truncate">
              <p className="text-xs font-bold text-white truncate">{user.primaryEmailAddress?.emailAddress}</p>
              <p className="text-[10px] text-[#94a3b8]">Logged in as USER</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine role text
  let roleBadgeLabel = "Transaction Manager";
  let roleBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (isSuperAdmin) {
    roleBadgeLabel = "Super Admin";
    roleBadgeColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  } else if (isAdmin) {
    roleBadgeLabel = "Store Admin";
    roleBadgeColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-sans relative overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-gold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded font-sans">
                Control Center
              </span>
              <span className={`text-[10px] tracking-[0.2em] font-black uppercase px-2 py-0.5 rounded border ${roleBadgeColor}`}>
                {roleBadgeLabel}
              </span>
            </div>
            <h1 className="text-3xl font-black font-h tracking-tight mt-1">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">{user.firstName || "Administrator"}</span>
            </h1>
            <p className="text-xs text-[#94a3b8] font-mono">{user.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 transition-all duration-300 backdrop-blur-md">
            <UserButton afterSignOutUrl="/login" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white max-w-[150px] truncate">{user.fullName || user.username}</p>
              <p className="text-[9px] text-[#94a3b8] font-mono">Clerk Verified Session</p>
            </div>
          </div>
        </header>

        {/* Unified Control Center Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: Admin Panel (Gold Theme) */}
          {isAdmin && (
            <Link href="/panel" className="group relative glass-panel rounded-3xl border border-white/5 hover:border-yellow-500/20 bg-gradient-to-b from-white/[0.02] to-transparent p-8 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(234,179,8,0.08)] hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-yellow-500/10 transition-all duration-500" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 shadow-lg group-hover:scale-110 transition-all duration-300">
                    <LayoutDashboard size={28} />
                  </div>
                  <span className="text-[10px] tracking-wider font-bold text-yellow-500 font-mono">ACCENT GOLD</span>
                </div>
                <h2 className="text-2xl font-black font-h tracking-wider mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  ADMIN PANEL
                </h2>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                  Manage inventory, Accounts, UC packs, Xsuits, Reviews, Proofs, and overall store settings. Add, update, or remove items in the catalog.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-[#64748b]">ACCESSIBLE</span>
                <span className="flex items-center gap-1.5 text-xs font-black text-yellow-500 tracking-wider group-hover:translate-x-1 transition-all duration-300">
                  ENTER PANEL <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          )}

          {/* Card 2: Transactions Panel (Emerald Theme) */}
          <Link href="/transactions" className="group relative glass-panel rounded-3xl border border-white/5 hover:border-emerald-500/20 bg-gradient-to-b from-white/[0.02] to-transparent p-8 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Receipt size={28} />
                </div>
                <span className="text-[10px] tracking-wider font-bold text-emerald-400 font-mono">ACCENT EMERALD</span>
              </div>
              <h2 className="text-2xl font-black font-h tracking-wider mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                TRANSACTIONS PANEL
              </h2>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                Manage transactions, sales, payment verifications, and customer logs. Perfect for processing payments and managing the store registries.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-[#64748b]">ACCESSIBLE</span>
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 tracking-wider group-hover:translate-x-1 transition-all duration-300">
                ENTER TRANSACTIONS <ArrowRight size={14} />
              </span>
            </div>
          </Link>

        </div>

        {/* Quick Stats Grid */}
        <section className="glass-panel rounded-3xl border border-white/5 p-8 bg-white/[0.01]">
          <h3 className="text-sm font-bold tracking-wider font-h text-gold mb-6 uppercase flex items-center gap-2">
            <TrendingUp size={16} /> Workspace Insights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Stat 1 */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold tracking-widest">Store Products</span>
              {loadingMetrics ? (
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-black font-h tracking-wide text-white">
                  {metrics?.products?.total ?? "—"} <span className="text-xs font-mono text-muted">items</span>
                </div>
              )}
              <span className="text-[10px] text-[#94a3b8]">Total catalog inventory size</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold tracking-widest">Pending Reviews</span>
              {loadingMetrics ? (
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-black font-h tracking-wide text-yellow-500">
                  {metrics?.reviews?.pending ?? "—"} <span className="text-xs font-mono text-yellow-500/60">pending</span>
                </div>
              )}
              <span className="text-[10px] text-[#94a3b8]">Awaiting administrator approval</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold tracking-widest">Completed Sales</span>
              {loadingMetrics ? (
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-black font-h tracking-wide text-emerald-400">
                  {metrics?.analytics?.count ?? "—"} <span className="text-xs font-mono text-emerald-400/60">sales</span>
                </div>
              )}
              <span className="text-[10px] text-[#94a3b8]">Recorded transaction history</span>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
