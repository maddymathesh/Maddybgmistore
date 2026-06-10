/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  LayoutDashboard, Gamepad2, Star, MessageSquare, Link2, CreditCard,
  Radio, Settings, Plus, Edit, Trash2, Check, X, ShieldAlert,
  Loader2, RefreshCw, MessageCircle, Copy,
  TrendingUp, Users, Zap, Camera, Key, User,
  Menu, Coins, Gift, Car, FileCheck, History
} from "lucide-react";

import {
  getAdminMetrics,
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  getAdminReviews, updateReviewStatus, deleteReview,
  getFeedbackLogs, updateFeedbackStatus,
  getPaymentLinks, createPaymentLink, revokePaymentLink,
  getTransactionsRegistry, createManualTransaction,
  getAdminPaymentSettings, updateAdminPaymentSettings
} from "./actions";

import { parseDescRawText, buildFormattedOutput } from "@repo/parser";

type ActiveTab = 
  | "accounts"
  | "description_factory"
  | "uc_packs"
  | "xsuit_gifts"
  | "cars"
  | "reviews"
  | "proofs"
  | "payments"
  | "customer_feedback"
  | "activity_log"
  | "admin_controls"
  | "dashboard";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "accounts", label: "Accounts", icon: Gamepad2 },
  { id: "description_factory", label: "Description Factory", icon: Zap },
  { id: "uc_packs", label: "UC Packs", icon: Coins },
  { id: "xsuit_gifts", label: "Xsuit Gifts", icon: Gift },
  { id: "cars", label: "Cars", icon: Car },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "proofs", label: "Proofs", icon: FileCheck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "customer_feedback", label: "Customer Feedback", icon: MessageSquare },
  { id: "activity_log", label: "Activity Log", icon: History },
  { id: "admin_controls", label: "Admin Controls", icon: Settings },
];

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();

  // All hooks MUST be declared before any conditional returns (Rules of Hooks)
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // States for DB data
  const [metrics, setMetrics] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [paymentLinksList, setPaymentLinksList] = useState<any[]>([]);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [settingsData, setSettingsData] = useState<any>(null);

  // Description Factory State
  const [rawDescription, setRawDescription] = useState("");
  const [parsedData, setParsedData] = useState({
    mythics: 0,
    xsuits: 0,
    guns: 0,
    vehicles: 0,
    level: "—",
    collector: 0,
    fashion: "0/100",
    ultimateFashion: 0,
    logins: "—"
  });

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Compute admin status (client-side guard; middleware is the real enforcer)
  const isPermanentAdmin = user?.primaryEmailAddress?.emailAddress === "maddybgmistoreog@gmail.com";
  const userRole = (user?.publicMetadata?.role as string) || "USER";
  const isAdmin = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER", "CONTENT_MANAGER"].includes(userRole);

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        metricsRes,
        productsRes,
        reviewsRes,
        feedbackRes,
        payLinksRes,
        txnRes,
        settingsRes
      ] = await Promise.all([
        getAdminMetrics(),
        getAdminProducts(),
        getAdminReviews(),
        getFeedbackLogs(),
        getPaymentLinks(),
        getTransactionsRegistry(),
        getAdminPaymentSettings()
      ]);

      if (metricsRes.success) setMetrics(metricsRes.metrics);
      if (productsRes.success) setProductsList(productsRes.products || []);
      if (reviewsRes.success) setReviewsList(reviewsRes.reviews || []);
      if (feedbackRes.success) setFeedbackList(feedbackRes.feedback || []);
      if (payLinksRes.success) setPaymentLinksList(payLinksRes.paymentLinks || []);
      if (txnRes.success) setTransactionsList(txnRes.transactions || []);
      if (settingsRes.success) setSettingsData(settingsRes.settings);
    } catch (_err) {
      console.error("Failed to load dashboard details:", _err);
      toast.error("Failed to sync some dashboard items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // --- STOCKS FORM STATE ---
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Budget",
    status: "available",
    youtubeUrl: "",
    primaryLogin: "Facebook",
    secondaryLogin: "Play Games",
    unlinkGuarantee: "Not Applicable",
    tag: "None",
    imageUrls: [] as string[]
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) {
      toast.error("Title and price are required");
      return;
    }

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, productForm);
        if (res.success) {
          toast.success("Product updated successfully!");
          setShowProductModal(false);
          setEditingProduct(null);
          triggerRefresh();
        } else {
          toast.error("Failed to update product");
        }
      } else {
        const res = await createProduct(productForm);
        if (res.success) {
          toast.success("Product created successfully!");
          setShowProductModal(false);
          triggerRefresh();
        } else {
          toast.error("Failed to create product");
        }
      }
    } catch (_err) {
      toast.error("Failed to submit product form");
    }
  };

  const startEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title || "",
      description: prod.description || "",
      price: prod.price || "",
      category: prod.category || "Budget",
      status: prod.status || "available",
      youtubeUrl: prod.youtubeUrl || "",
      primaryLogin: prod.primaryLogin || "Facebook",
      secondaryLogin: prod.secondaryLogin || "Play Games",
      unlinkGuarantee: prod.unlinkGuarantee || "Not Applicable",
      tag: prod.tag || "None",
      imageUrls: prod.imageUrls || []
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product listing?")) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success("Product deleted successfully");
        triggerRefresh();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (_err) {
      toast.error("Error deleting product");
    }
  };

  // --- REVIEWS MODERATION HANDLERS ---
  const handleReviewStatus = async (id: string, status: string) => {
    try {
      const res = await updateReviewStatus(id, status);
      if (res.success) {
        toast.success(`Review ${status} successfully`);
        triggerRefresh();
      } else {
        toast.error("Failed to update review");
      }
    } catch (_err) {
      toast.error("Error updating review");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review forever?")) return;
    try {
      const res = await deleteReview(id);
      if (res.success) {
        toast.success("Review deleted successfully");
        triggerRefresh();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (_err) {
      toast.error("Error deleting review");
    }
  };

  // --- FEEDBACK HANDLERS ---
  const handleFeedbackStatus = async (id: string, status: string) => {
    try {
      const res = await updateFeedbackStatus(id, status);
      if (res.success) {
        toast.success(`Feedback marked as ${status}`);
        triggerRefresh();
      } else {
        toast.error("Failed to update feedback");
      }
    } catch (_err) {
      toast.error("Error updating feedback");
    }
  };

  // --- PAYMENT LINKS GENERATOR ---
  const [payLinkForm, setPayLinkForm] = useState({
    customerName: "",
    amount: "",
    note: "",
    pin: "",
    expiresHours: 24
  });

  const handleCreatePayLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payLinkForm.customerName || !payLinkForm.amount) {
      toast.error("Name and amount are required");
      return;
    }

    try {
      const pinVal = payLinkForm.pin || Math.floor(100000 + Math.random() * 900000).toString();
      const res = await createPaymentLink({
        customerName: payLinkForm.customerName,
        amount: payLinkForm.amount,
        note: payLinkForm.note,
        pin: pinVal,
        expiresHours: Number(payLinkForm.expiresHours)
      });

      if (res.success && res.paymentLink) {
        toast.success("Payment Link Generated!");
        setPayLinkForm({
          customerName: "",
          amount: "",
          note: "",
          pin: "",
          expiresHours: 24
        });
        triggerRefresh();
      } else {
        toast.error("Failed to generate payment link");
      }
    } catch (_err) {
      toast.error("Error creating payment link");
    }
  };

  const handleRevokePayLink = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this active checkout gateway?")) return;
    try {
      const res = await revokePaymentLink(id);
      if (res.success) {
        toast.success("Payment gateway link revoked");
        triggerRefresh();
      } else {
        toast.error("Failed to revoke link");
      }
    } catch (_err) {
      toast.error("Error revoking link");
    }
  };

  const copyPayLinkCheckout = (id: string) => {
    const url = `https://maddybgmistore.in/pay/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Checkout link copied to clipboard!");
    });
  };

  // --- MANUAL TRANSACTION LOGGING ---
  const [txnForm, setTxnForm] = useState({
    transactionId: "",
    buyerName: "",
    buyerPhone: "",
    buyerContact: "",
    totalAmount: "",
    modeOfDeal: "WhatsApp", // WhatsApp, Telegram, F2F, Middleman
    dealDate: new Date().toISOString().split("T")[0] || "",
    details: {
      type: "account" as "account" | "uc" | "xsuit" | "supercar",
      productId: "",
      ownerPrice: "",
      soldPrice: "",
      ownerPhone: "",
      sellerPhone: "",
      resellerPhone: "",
      accountOwner: "",
      logins: "Facebook",
      credentials: "",
      ucAmount: 0,
      xsuitName: "",
      carName: ""
    }
  });

  const handleTxnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnForm.buyerName || !txnForm.totalAmount) {
      toast.error("Buyer Name and Total Amount are required");
      return;
    }

    try {
      const res = await createManualTransaction({
        transactionId: txnForm.transactionId,
        buyerName: txnForm.buyerName,
        buyerPhone: txnForm.buyerPhone,
        buyerContact: txnForm.buyerContact,
        totalAmount: txnForm.totalAmount,
        modeOfDeal: txnForm.modeOfDeal,
        dealDate: txnForm.dealDate,
        details: txnForm.details
      });

      if (res.success) {
        toast.success("Transaction Logged Successfully!");
        setTxnForm({
          transactionId: "",
          buyerName: "",
          buyerPhone: "",
          buyerContact: "",
          totalAmount: "",
          modeOfDeal: "WhatsApp",
          dealDate: new Date().toISOString().split("T")[0] || "",
          details: {
            type: "account",
            productId: "",
            ownerPrice: "",
            soldPrice: "",
            ownerPhone: "",
            sellerPhone: "",
            resellerPhone: "",
            accountOwner: "",
            logins: "Facebook",
            credentials: "",
            ucAmount: 0,
            xsuitName: "",
            carName: ""
          }
        });
        triggerRefresh();
      } else {
        toast.error("Failed to log transaction: " + res.error);
      }
    } catch (_err) {
      toast.error("Error submitting transaction log");
    }
  };

  // --- BROADCAST MAKER ---
  const [broadcastInput, setBroadcastInput] = useState("");
  const [broadcastForm, setBroadcastForm] = useState<any>(null);
  const [styleMode, setStyleMode] = useState<"plain" | "whatsapp" | "telegram">("plain");
  const [broadcastOutput, setBroadcastOutput] = useState("");

  const handleParseBroadcast = () => {
    if (!broadcastInput.trim()) {
      toast.error("Input raw description copy to parse");
      return;
    }
    const parsed = parseDescRawText(broadcastInput);
    setBroadcastForm(parsed);
    const output = buildFormattedOutput(parsed, styleMode);
    setBroadcastOutput(output);
    toast.success("Account description parsed successfully!");
  };

  useEffect(() => {
    if (broadcastForm) {
      const output = buildFormattedOutput(broadcastForm, styleMode);
      setBroadcastOutput(output);
    }
  }, [broadcastForm, styleMode]);

  const copyBroadcastText = () => {
    navigator.clipboard.writeText(broadcastOutput).then(() => {
      toast.success("Broadcast formatted payload copied to clipboard!");
    });
  };

  // --- GLOBAL SETTINGS ---
  const [settingsForm, setSettingsForm] = useState({
    payeeName: "",
    payeeUpiId: "",
    bankName: "",
    accountType: "SAVINGS ACCOUNT",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    branch: ""
  });

  useEffect(() => {
    if (settingsData) {
      setSettingsForm({
        payeeName: settingsData.payeeName || "",
        payeeUpiId: settingsData.payeeUpiId || "",
        bankName: settingsData.bankName || "",
        accountType: settingsData.accountType || "SAVINGS ACCOUNT",
        accountHolder: settingsData.accountHolder || "",
        accountNumber: settingsData.accountNumber || "",
        ifscCode: settingsData.ifscCode || "",
        branch: settingsData.branch || ""
      });
    }
  }, [settingsData]);

  // Description Factory Parser
  useEffect(() => {
    const text = rawDescription.toLowerCase();
    
    // Naive parsing logic
    let mythics = 0;
    let xsuits = 0;
    let guns = 0;
    let vehicles = 0;
    
    // Parse mythics
    const mythicMatch = text.match(/(\d+)\s*mythic/);
    if (mythicMatch && mythicMatch[1]) mythics = parseInt(mythicMatch[1]);
    
    // Parse xsuits
    const xsuitMatches = text.match(/xsuit/g);
    if (xsuitMatches) xsuits = xsuitMatches.length;
    
    // Parse guns
    const gunMatch = text.match(/(\d+)\s*(gun|lab)/);
    if (gunMatch && gunMatch[1]) guns = parseInt(gunMatch[1]);
    
    // Parse vehicles
    const vehicleMatch = text.match(/(\d+)\s*(supercar|vehicle)/);
    if (vehicleMatch && vehicleMatch[1]) vehicles = parseInt(vehicleMatch[1]);

    // Parse level
    let level = "—";
    const levelMatch = text.match(/level\s*(\d+)/);
    if (levelMatch && levelMatch[1]) level = levelMatch[1];

    // Parse collector
    let collector = 0;
    const collectorMatch = text.match(/collector\s*(\d+)/);
    if (collectorMatch && collectorMatch[1]) collector = parseInt(collectorMatch[1]);
    
    setParsedData({
      mythics,
      xsuits,
      guns,
      vehicles,
      level,
      collector,
      fashion: mythics > 0 ? `${mythics}/100` : "0/100",
      ultimateFashion: 0,
      logins: "—"
    });
  }, [rawDescription]);


  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateAdminPaymentSettings(settingsForm);
      if (res.success) {
        toast.success("Payment Gateway Settings Updated!");
        triggerRefresh();
      } else {
        toast.error("Failed to update payment settings");
      }
    } catch (_err) {
      toast.error("Error saving global payment settings");
    }
  };

  // While Clerk is loading, show spinner
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Loader2 size={36} className="animate-spin text-[var(--color-gold)]" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-bg)] text-white font-sans">
        <ShieldAlert size={48} className="text-[var(--color-gold)]" />
        <h1 className="font-h text-2xl font-black">Authentication Required</h1>
        <p className="text-sm text-[var(--color-muted)] font-mono">Please sign in to access the Admin Panel.</p>
        <a href="/sign-in" className="btn btn-gold px-6 py-2.5 text-sm">Sign In</a>
      </div>
    );
  }

  // Logged in but not an admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-bg)] text-white font-sans">
        <ShieldAlert size={48} className="text-red-500" />
        <h1 className="font-h text-2xl font-black text-red-400">Access Denied</h1>
        <p className="text-sm text-[var(--color-muted)] font-mono">You do not have administrative privileges to view this page.</p>
        <a href="/" className="btn btn-outline px-6 py-2.5 text-sm">← Return Home</a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[#eaeaea] font-sans overflow-hidden">
      
      {/* Sidebar Overlay Backdrop on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR SECTION */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="leading-tight">
            <span className="font-h font-black tracking-wide text-2xl text-white flex items-center gap-2">
              Admin <span className="text-[var(--color-gold)]">Panel</span>
            </span>
            <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-widest font-bold mt-1 block">
              Core Workspace
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-[var(--color-muted)] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-thin">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-[13.5px] font-bold tracking-wide ${active ? 'bg-[var(--color-gold-dim)] text-[var(--color-gold)] shadow-inner' : 'text-[var(--color-muted)] hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/5 flex flex-col gap-3">
          <a 
            href="/transactions"
            className="w-full btn btn-outline justify-center border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 text-[11px] py-2"
          >
            <CreditCard size={14} /> Transaction Panel
          </a>
          <div className="w-full flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
            <UserButton afterSignOutUrl="/sign-in" />
            <span className="text-[10px] text-[var(--color-muted)] font-bold">LOGGED IN</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 h-screen relative">
        
        {/* Sticky Header */}
        <header className="h-[80px] shrink-0 border-b border-white/5 glass-panel sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-h font-bold text-lg lg:text-xl tracking-wide flex items-center gap-2 text-white">
              {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.icon && React.createElement(SIDEBAR_ITEMS.find(i => i.id === activeTab)!.icon, { size: 20, className: "text-[var(--color-gold)]" })}
              {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label || "Dashboard"}
            </h2>
          </div>
          <button 
            onClick={triggerRefresh} 
            className="flex items-center gap-2 p-2 px-4 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition font-bold text-xs uppercase tracking-wider"
          >
            <RefreshCw size={14} /> <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* CONTAINER SCROLL */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto scrollbar-thin">
          {loading && !metrics ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 size={36} className="animate-spin text-[var(--color-gold)]" />
              <p className="text-sm text-[var(--color-muted)] font-mono uppercase tracking-widest">Hydrating dashboard workspaces...</p>
            </div>
          ) : (
            <>
              {/* ==============================================================
                  TAB: DASHBOARD
                  ============================================================== */}
              {activeTab === "dashboard" && metrics && (
                <div className="flex flex-col gap-8">
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel border border-[var(--color-gold)]/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp size={80} className="text-[var(--color-gold)]" /></div>
                      <span className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-wider block mb-1">Total Sales Revenue</span>
                      <strong className="text-4xl font-h font-black text-white">₹{Number(metrics.analytics.revenue).toLocaleString("en-IN")}</strong>
                      <span className="text-xs text-[var(--color-muted)] block mt-2 font-mono">Mapped from logged transactions</span>
                    </div>

                    <div className="glass-panel border border-green-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Users size={80} className="text-green-500" /></div>
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block mb-1">Total Profit</span>
                      <strong className="text-4xl font-h font-black text-white">₹{Number(metrics.analytics.profit).toLocaleString("en-IN")}</strong>
                      <span className="text-xs text-[var(--color-muted)] block mt-2 font-mono">Difference of owner vs sold price</span>
                    </div>

                    <div className="glass-panel border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><LayoutDashboard size={80} className="text-blue-500" /></div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Counter Site Views</span>
                      <strong className="text-4xl font-h font-black text-white">{metrics.totalViews.toLocaleString()}</strong>
                      <span className="text-xs text-[var(--color-muted)] block mt-2 font-mono">Live counter tracked on public portal</span>
                    </div>
                  </div>

                  {/* SECONDARY STATS */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: "Available Stocks", val: `${metrics.products.available} / ${metrics.products.total}`, desc: "Active ready stocks listing" },
                      { label: "Pending Reviews", val: metrics.reviews.pending, desc: "Awaiting AI/Manual approval", highlight: metrics.reviews.pending > 0 },
                      { label: "Unread Feedback", val: metrics.feedback.unread, desc: "Awaiting administrator response", highlight: metrics.feedback.unread > 0 },
                      { label: "Total Handover Logs", val: metrics.analytics.count, desc: "Manual transaction counts" }
                    ].map((stat, idx) => (
                      <div key={idx} className={`glass-panel rounded-2xl p-6 shadow-md ${stat.highlight ? "border-orange-500/30 bg-orange-500/2" : ""}`}>
                        <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider block mb-1">{stat.label}</span>
                        <strong className="text-2xl font-h font-extrabold text-white block">{stat.val}</strong>
                        <span className="text-xs text-[var(--color-muted)] block mt-1">{stat.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* QUICK TIPS PANEL */}
                  <div className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-[var(--color-gold)]/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] rounded-2xl p-6 flex gap-4 items-start">
                    <ShieldAlert className="text-[var(--color-gold)] shrink-0" size={24} />
                    <div>
                      <h4 className="font-h font-bold text-white uppercase text-sm tracking-wider mb-1">Administrator Safety Protocol</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        Secure transaction settings and PIN codes are active. Never share payment links PINs with third parties.
                        When adding new accounts in Ready Stocks, upload high-quality catalog images. Formatted broadcast scripts can be shared on WhatsApp and Telegram channels directly from the Broadcast Maker tab.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: ACCOUNTS
                  ============================================================== */}
              {activeTab === "accounts" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD PRODUCT FORM */}
                  <div className="lg:col-span-1 glass-panel rounded-2xl p-6 shadow-xl h-fit">
                    <div className="flex items-center gap-2 mb-6 text-[var(--color-gold)] font-bold tracking-wider font-h">
                      <Plus size={16} /> Add Product
                    </div>
                    <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
                      <div>
                        <input type="text" value={productForm.youtubeUrl || ""} onChange={e => setProductForm({ ...productForm, youtubeUrl: e.target.value })} placeholder="YouTube Video URL" className="input-field" />
                      </div>
                      <div>
                        <input type="text" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} required placeholder="Account Title (e.g. M416 Maxed 60K UC)" className="input-field" />
                      </div>
                      <div>
                        <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Account Description (items, skins, levels...)" rows={4} className="input-field resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price (₹)" className="input-field" />
                        <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="input-field">
                          <option value="Budget">Budget</option>
                          <option value="Mid Range">Mid Range</option>
                          <option value="Premium">Premium</option>
                          <option value="Ultra Premium">Ultra Premium</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PRIMARY LOGIN</label>
                        <select value={productForm.primaryLogin || "Facebook"} onChange={e => setProductForm({ ...productForm, primaryLogin: e.target.value })} className="input-field">
                          <option value="X">X</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Google">Google</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">SECONDARY LOGIN</label>
                        <select value={productForm.secondaryLogin || "None (Single Login)"} onChange={e => setProductForm({ ...productForm, secondaryLogin: e.target.value })} className="input-field">
                          <option value="None (Single Login)">None (Single Login)</option>
                          <option value="Play Games">Play Games</option>
                          <option value="Email">Email</option>
                          <option value="Facebook">Facebook</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <select value={productForm.tag} onChange={e => setProductForm({ ...productForm, tag: e.target.value })} className="input-field">
                          <option value="None">None</option>
                          <option value="Hot">Hot</option>
                          <option value="Sale">Sale</option>
                          <option value="Best Value">Best Value</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <select value={productForm.status} onChange={e => setProductForm({ ...productForm, status: e.target.value })} className="input-field">
                          <option value="available">Available</option>
                          <option value="sold">Sold</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-gold w-full justify-center py-3">SAVE PRODUCT</button>
                    </form>
                  </div>

                  {/* INVENTORY LIST */}
                  <div className="lg:col-span-2">
                    <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[400px]">
                      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-black/20">
                        <span className="font-h text-[13px] font-bold text-white tracking-wider">Account Inventory</span>
                        <span className="text-[10px] text-[var(--color-muted)] font-mono">{productsList.length} items</span>
                      </div>
                      <div className="table-wrap m-4">
                        <table className="admin-table font-sans">
                          <tbody>
                            {productsList.length > 0 ? (
                              productsList.map((prod) => (
                                <tr key={prod.id}>
                                  <td>
                                    <div className="flex flex-col gap-1">
                                      <strong className="text-white text-xs">{prod.title}</strong>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-[var(--color-gold)] font-mono text-[11px]">₹{Number(prod.price).toLocaleString("en-IN")}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${prod.status === "available" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{prod.status}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="w-24 text-right">
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => {
                                        setEditingProduct(prod);
                                        setProductForm({
                                          title: prod.title,
                                          description: prod.description || "",
                                          price: prod.price.toString(),
                                          category: prod.category,
                                          status: prod.status,
                                          youtubeUrl: prod.youtubeUrl || "",
                                          primaryLogin: prod.primaryLogin || "Facebook",
                                          secondaryLogin: prod.secondaryLogin || "None (Single Login)",
                                          unlinkGuarantee: prod.unlinkGuarantee || "Not Applicable",
                                          tag: prod.tag || "None",
                                          imageUrls: prod.imageUrls || []
                                        });
                                      }} className="p-2 bg-white/5 border border-white/10 rounded-md text-[var(--color-gold)] hover:bg-white/10 transition">
                                        <Edit size={12} />
                                      </button>
                                      <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-white/5 border border-white/10 rounded-md text-red-400 hover:bg-white/10 transition">
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="text-center py-8 text-[var(--color-muted)] font-mono text-xs">No products listed. Add one to begin!</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: DESCRIPTION FACTORY
                  ============================================================== */}
              {activeTab === "description_factory" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT PANEL: PARSER */}
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 font-bold tracking-wider font-h text-[var(--color-gold)]">
                        <Zap size={16} /> AI Description Factory
                        <span className="text-[8px] bg-green-500 text-black px-1.5 py-0.5 rounded ml-2 uppercase">100% Client-Side</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-[9px] font-bold border border-white/20 px-3 py-1.5 rounded hover:bg-white/5 transition text-[var(--color-muted)] flex items-center gap-1">
                          <LayoutDashboard size={12} /> BROWSER PRESETS (0)
                        </button>
                        <button className="text-[9px] font-bold border border-[var(--color-gold)] text-[var(--color-gold)] px-3 py-1.5 rounded hover:bg-[var(--color-gold)] hover:text-black transition flex items-center gap-1">
                          <Check size={12} /> SAVE PRESET
                        </button>
                        <button className="text-[9px] font-bold bg-red-500/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition flex items-center gap-1">
                          <Trash2 size={12} /> CLEAR INPUT
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="glass-panel rounded-xl p-3 flex flex-col justify-center">
                        <span className="text-[8px] font-bold text-[var(--color-muted)] tracking-widest uppercase mb-1">MYTHICS DETECTED</span>
                        <span className="text-xl font-black font-h text-[var(--color-gold)]">{parsedData.mythics}</span>
                      </div>
                      <div className="glass-panel rounded-xl p-3 flex flex-col justify-center">
                        <span className="text-[8px] font-bold text-[var(--color-muted)] tracking-widest uppercase mb-1">X-SUITS DETECTED</span>
                        <span className="text-xl font-black font-h text-[var(--color-gold)]">{parsedData.xsuits}</span>
                      </div>
                      <div className="glass-panel rounded-xl p-3 flex flex-col justify-center">
                        <span className="text-[8px] font-bold text-[var(--color-muted)] tracking-widest uppercase mb-1">WEAPON LABS DETECTED</span>
                        <span className="text-xl font-black font-h text-[var(--color-gold)]">{parsedData.guns}</span>
                      </div>
                      <div className="glass-panel rounded-xl p-3 flex flex-col justify-center">
                        <span className="text-[8px] font-bold text-[var(--color-muted)] tracking-widest uppercase mb-1">VEHICLES DETECTED</span>
                        <span className="text-xl font-black font-h text-[var(--color-gold)]">{parsedData.vehicles}</span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-wider text-white">
                        <Edit size={12} className="text-[var(--color-gold)]" /> PASTE MESSY RAW BGMI DATA
                      </div>
                      <p className="text-[9px] text-[var(--color-muted)] mb-4">
                        Paste messy raw specifications below. The AI/Rule-based parser will instantly detect values, clean spellings, calculate totals, and organize posting formats.
                      </p>
                      <textarea 
                        value={rawDescription}
                        onChange={e => setRawDescription(e.target.value)}
                        className="w-full h-[250px] bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-[var(--color-muted)] font-mono resize-none focus:outline-none focus:border-[var(--color-gold)] transition"
                        placeholder="Example Paste Structure:&#10;&#10;100 mythics&#10;ignis xsuit lvl 4&#10;galadria xsuit lvl 1&#10;m416 shinobi kami on hit&#10;m416 sealed realm lvl 6 on hit&#10;42 gun labs&#10;19 kill feeds&#10;3 supercars&#10;4 upgraded vehicles&#10;&#10;account level 81&#10;pro collector 63"
                      ></textarea>
                      <div className="flex justify-end mt-3">
                        <button className="text-[9px] font-bold border border-white/20 px-3 py-1.5 rounded hover:bg-white/5 transition text-white">
                          LOAD PLACEHOLDER DEMO SPEC
                        </button>
                      </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">
                        <Settings size={12} /> FINE-TUNE PARSED DATA (MANUAL EDITING)
                      </div>
                      <X size={14} className="rotate-45" />
                    </div>
                  </div>

                  {/* RIGHT PANEL: PREVIEW */}
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-2 mb-2 border-b border-[var(--color-border)] pb-4">
                      <button className="text-[9px] font-bold bg-[var(--color-gold)] text-black px-4 py-1.5 rounded-full flex items-center gap-1">
                         <MessageSquare size={12} /> WHATSAPP VIEW
                      </button>
                      <button className="text-[9px] font-bold border border-white/20 text-[var(--color-muted)] hover:text-white px-4 py-1.5 rounded-full flex items-center gap-1 transition">
                         <Zap size={12} /> TELEGRAM VIEW
                      </button>
                    </div>

                    <div className="flex-grow flex items-center justify-center bg-black/20 border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden">
                      {/* Simulated WhatsApp Phone */}
                      <div className="w-[300px] h-[450px] bg-[#111b21] rounded-[2rem] border-[6px] border-[#222e35] shadow-2xl flex flex-col overflow-hidden relative">
                        {/* Header */}
                        <div className="bg-[#202c33] h-12 flex items-center px-3 gap-3 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] text-xs font-bold">MB</div>
                          <div className="flex flex-col">
                            <span className="text-white text-[11px] font-bold">Maddy BGMI Store WhatsApp Channel</span>
                            <span className="text-[8px] text-[var(--color-muted)]">Official • posting style</span>
                          </div>
                        </div>
                        {/* Chat Body */}
                        <div className="flex-grow bg-[#0b141a] p-3 overflow-y-auto">
                          <div className="bg-[#005c4b] rounded-lg rounded-tl-none p-3 max-w-[90%] shadow text-[10px] text-white leading-relaxed font-sans">
                            <span className="block mb-2 font-bold">#NEWSTOCK<br/>#NEWPOST</span>
                            <span className="block mb-3">‼️❤️ Premium Deal Of The Day ❤️‼️</span>
                            <span className="block mb-3">➥ Bgmi {parsedData.mythics} Mythics + {parsedData.guns}xTotal Gun Labs + {parsedData.xsuits}xX-Suits + {parsedData.vehicles}xUpgraded Vehicles✨</span>
                            <span className="block mb-1">🙎‍♂️Account Level - {parsedData.level}</span>
                            <span className="block mb-1">✅Pro Collector - ({parsedData.collector})</span>
                            <span className="block mb-1">👘Mythic Fashion - ({parsedData.fashion})</span>
                            <span className="block mb-3">👘Ultimate Mythic Fashion - ({parsedData.ultimateFashion})</span>
                            <span className="block mb-3">✅Logins : {parsedData.logins} ✅</span>
                            <span className="block font-bold">📩DM WHATSAPP</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-border)] pb-2">
                        <LayoutDashboard size={12} className="text-[var(--color-gold)]" /> Description Actions
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-outline justify-center text-[10px] py-3">
                          <Copy size={12} /> COPY TELEGRAM STYLE
                        </button>
                        <button className="btn btn-gold justify-center text-[10px] py-3">
                          <Copy size={12} /> COPY WHATSAPP STYLE
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="glass-panel hover:bg-white/5 transition rounded-xl text-white font-bold text-[10px] justify-center flex items-center py-3 gap-2">
                          <Copy size={12} /> COPY BOTH STYLES
                        </button>
                        <button className="glass-panel hover:bg-white/5 transition rounded-xl text-white font-bold text-[10px] justify-center flex items-center py-3 gap-2">
                          <Check size={12} /> DOWNLOAD TXT FILE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: UC PACKS
                  ============================================================== */}
              {activeTab === "uc_packs" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD UC PACK */}
                  <div className="lg:col-span-1 glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider font-h">
                      <Link2 size={16} /> Add UC Pack
                    </div>
                    <form className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">UC AMOUNT</label>
                        <input type="text" placeholder="e.g. 8,000 UC" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">BONUS UC</label>
                        <input type="text" placeholder="e.g. 60" className="input-field" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">SELLING PRICE (₹)</label>
                          <input type="text" placeholder="e.g. 7,500" className="input-field" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">OUR OFFER PRICE (₹)</label>
                          <input type="text" placeholder="e.g. 6,500" className="input-field" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PURCHASE METHOD</label>
                        <select className="input-field">
                          <option>View Login UC (Facebook / X)</option>
                          <option>Player ID (In-Game)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">STATUS</label>
                          <select className="input-field">
                            <option>Available</option>
                            <option>Out of Stock</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                          <select className="input-field">
                            <option>None</option>
                            <option>Best Value</option>
                            <option>Hot</option>
                          </select>
                        </div>
                      </div>
                      <button type="button" className="btn btn-gold w-full mt-2 justify-center py-3">SAVE PACK</button>
                    </form>
                  </div>

                  {/* UC PACK LIST */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-[var(--color-border)] font-h text-sm font-bold tracking-wider text-white">
                      UC Price List
                    </div>
                    <div className="p-6">
                      <div className="bg-[var(--color-gold-dim)] border border-[var(--color-gold)]/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] rounded-lg p-4 flex gap-3 text-[11px] text-[var(--color-gold)] font-mono">
                        <ShieldAlert size={16} className="shrink-0" />
                        Note: UC prices fluctuate based on market demand and availability. Update prices regularly to reflect the current market rate.
                      </div>
                      
                      <div className="mt-6 flex flex-col gap-4">
                        <div className="p-4 border border-[var(--color-border)] rounded-xl flex items-center justify-between hover:bg-white/5 transition cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-white font-h">8100</span>
                              <span className="bg-[var(--color-gold)] text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">BEST VALUE</span>
                              <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">🔑 View Login</span>
                            </div>
                            <span className="text-[10px] text-[var(--color-muted)]">Market: <span className="line-through">₹7500</span></span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-green-500 font-black font-h text-lg tracking-wider">₹6500</span>
                            <div className="flex gap-2">
                              <button className="text-[var(--color-gold)] hover:text-white transition"><Edit size={14}/></button>
                              <button className="text-red-400 hover:text-white transition"><Trash2 size={14}/></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: XSUIT GIFTS
                  ============================================================== */}
              {activeTab === "xsuit_gifts" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD XSUIT GIFT */}
                  <div className="lg:col-span-1 glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider font-h">
                      <Zap size={16} /> Add Xsuit Gift
                    </div>
                    <form className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">XSUIT NAME</label>
                        <input type="text" placeholder="e.g. Poseidon X-Suit" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">OFFER PRICE (₹)</label>
                        <input type="text" placeholder="e.g. 15000" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <select className="input-field">
                          <option>None</option>
                          <option>Hot</option>
                          <option>Sale</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">IMAGE SOURCE</label>
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center gap-2 text-[11px] text-[var(--color-gold)] cursor-pointer">
                            <input type="radio" name="xsuit_img_src" defaultChecked className="accent-[var(--color-gold)]" /> File Upload
                          </label>
                          <label className="flex items-center gap-2 text-[11px] text-white cursor-pointer">
                            <input type="radio" name="xsuit_img_src" className="accent-[var(--color-gold)]" /> Drive Image ID
                          </label>
                        </div>
                        <div className="border border-dashed border-[var(--color-border)] rounded-lg p-6 flex items-center justify-center text-[10px] text-[var(--color-muted)] cursor-pointer hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition">
                          Click to Upload Xsuit Image
                        </div>
                      </div>
                      <button type="button" className="btn btn-gold w-full mt-2 justify-center py-3">SAVE XSUIT</button>
                    </form>
                  </div>

                  {/* XSUIT LIST */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-[var(--color-border)] font-h text-sm font-bold tracking-wider text-white">
                      Xsuit Gift List
                    </div>
                    <div className="p-6 flex items-center justify-center h-full min-h-[400px]">
                      <span className="text-[10px] text-[var(--color-muted)] font-mono">No Xsuit Gifts listed yet.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: CARS
                  ============================================================== */}
              {activeTab === "cars" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD CAR GIFT */}
                  <div className="lg:col-span-1 glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider font-h">
                      <Gamepad2 size={16} /> Add Supercar Gift
                    </div>
                    <form className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">SUPERCAR NAME</label>
                        <input type="text" placeholder="e.g. Lamborghini Aventador" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">OFFER PRICE (₹)</label>
                        <input type="text" placeholder="e.g. 15000" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <select className="input-field">
                          <option>None</option>
                          <option>Hot</option>
                          <option>Sale</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">CARD TYPE</label>
                        <select className="input-field">
                          <option>One-Card</option>
                          <option>Three-Card</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">IMAGE SOURCE</label>
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center gap-2 text-[11px] text-[var(--color-gold)] cursor-pointer">
                            <input type="radio" name="car_img_src" defaultChecked className="accent-[var(--color-gold)]" /> File Upload
                          </label>
                          <label className="flex items-center gap-2 text-[11px] text-white cursor-pointer">
                            <input type="radio" name="car_img_src" className="accent-[var(--color-gold)]" /> Drive Image ID
                          </label>
                        </div>
                        <div className="border border-dashed border-[var(--color-border)] rounded-lg p-6 flex items-center justify-center text-[10px] text-[var(--color-muted)] cursor-pointer hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition">
                          Click to Upload Supercar Image
                        </div>
                      </div>
                      <button type="button" className="btn btn-gold w-full mt-2 justify-center py-3">SAVE CAR</button>
                    </form>
                  </div>

                  {/* CAR LIST */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-[var(--color-border)] font-h text-sm font-bold tracking-wider text-white">
                      Supercar Gift List
                    </div>
                    <div className="p-6 flex items-center justify-center h-full min-h-[400px]">
                      <span className="text-[10px] text-[var(--color-muted)] font-mono">No Supercars listed yet.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: PROOFS
                  ============================================================== */}
              {activeTab === "proofs" && (
                <div className="flex flex-col gap-6">
                  <div className="glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider text-sm font-h">
                      <Camera size={16} /> Upload New Proof
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      <div className="col-span-1 lg:col-span-1">
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">TITLE</label>
                        <input type="text" placeholder="e.g. Payment Proof, Deal Feedback" className="input-field" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">MONTH</label>
                        <select className="input-field"><option>June</option></select>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">YEAR</label>
                        <select className="input-field"><option>2026</option></select>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">IMAGE SOURCE</label>
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center gap-2 text-[11px] text-[var(--color-gold)] cursor-pointer">
                            <input type="radio" name="proof_img_src" defaultChecked className="accent-[var(--color-gold)]" /> File Upload
                          </label>
                          <label className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] cursor-pointer">
                            <input type="radio" name="proof_img_src" className="accent-[var(--color-gold)]" /> Drive Image ID
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">IMAGE INPUT</label>
                        <div className="border border-dashed border-[var(--color-border)] rounded-lg p-3 flex items-center justify-center text-[10px] text-[var(--color-muted)] cursor-pointer hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition h-[42px]">
                          Click to choose file
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button className="btn btn-gold w-48 justify-center py-3 text-[10px]">UPLOAD PROOF</button>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[300px]">
                    <Camera size={48} className="text-white/5 mb-4" />
                    <p className="text-[11px] text-[var(--color-muted)] font-mono">No proofs uploaded yet. Use the upload panel above to get started.</p>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: REVIEWS
                  ============================================================== */}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6">
                  {/* STATS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-[var(--color-gold)] mb-1">{reviewsList.length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">TOTAL</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-green-500 mb-1">{reviewsList.filter(r => r.status === 'approved').length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">APPROVED</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-orange-500 mb-1">{reviewsList.filter(r => r.status === 'pending').length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">PENDING</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-red-500 mb-1">{reviewsList.filter(r => r.status === 'rejected').length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">REJECTED</span>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[400px]">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-black/20">
                      <span className="font-h text-[13px] font-bold text-white tracking-wider">Review Management</span>
                      <span className="text-[10px] text-[var(--color-muted)] font-mono">Reviews submitted by buyers - No manual entries</span>
                    </div>
                    {reviewsList.length > 0 ? (
                      <div className="table-wrap m-4">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Author Name</th>
                              <th>Star Rating</th>
                              <th>Comment</th>
                              <th>Status</th>
                              <th>Submitted</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviewsList.map((rev) => (
                              <tr key={rev.id}>
                                <td className="font-semibold text-white">{rev.name}</td>
                                <td className="font-bold text-[var(--color-gold)] font-mono">{rev.rating} / 5 ★</td>
                                <td className="max-w-[300px] truncate text-xs">{rev.comment || "No comment left"}</td>
                                <td>
                                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                                    rev.status === "approved" 
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                      : rev.status === "pending" 
                                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                                  }`}>
                                    {rev.status}
                                  </span>
                                </td>
                                <td className="text-xs text-[var(--color-muted)]">{new Date(rev.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div className="flex gap-2">
                                    {rev.status !== "approved" && (
                                      <button onClick={() => handleReviewStatus(rev.id, "approved")} className="p-2 hover:bg-white/5 rounded-lg text-green-400 hover:text-white transition" title="Approve Review">
                                        <Check size={14} />
                                      </button>
                                    )}
                                    {rev.status !== "rejected" && (
                                      <button onClick={() => handleReviewStatus(rev.id, "rejected")} className="p-2 hover:bg-white/5 rounded-lg text-red-400 hover:text-white transition" title="Reject Review">
                                        <X size={14} />
                                      </button>
                                    )}
                                    <button onClick={() => handleDeleteReview(rev.id)} className="p-2 hover:bg-white/5 rounded-lg text-red-400 hover:text-white transition" title="Delete Review">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-grow opacity-60 mt-10">
                        <MessageSquare size={36} className="text-[var(--color-muted)] mb-4" />
                        <span className="text-[11px] text-[var(--color-muted)] font-mono">No buyer reviews yet. Share your review link after each successful deal.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: FEEDBACK
                  ============================================================== */}
              {activeTab === "customer_feedback" && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* CSAT CARD */}
                    <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl">
                      <div className="w-32 h-32 rounded-full border-[6px] border-[var(--color-gold)] flex flex-col items-center justify-center mb-6">
                         <span className="text-[40px] font-black font-h text-white leading-none">5.0</span>
                         <span className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest mt-1">STORE CSAT</span>
                      </div>
                      <h3 className="text-white font-bold text-[13px] tracking-wider font-h mb-2">Constructive CSAT Index</h3>
                      <p className="text-[11px] text-[var(--color-muted)] font-mono text-center max-w-[250px]">Calculated from {feedbackList.length} store improvement ratings.</p>
                    </div>
                    {/* CRM ACTION CENTER */}
                    <div className="glass-panel rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider text-sm font-h border-b border-white/5 pb-4">
                        <Users size={16} className="text-[var(--color-gold)]" /> CRM Action Center
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black font-h text-red-500 mb-2">{feedbackList.filter(f => f.status === 'unread').length}</span>
                          <span className="text-[9px] font-bold text-[var(--color-muted)] tracking-widest uppercase">UNREAD FEEDBACK</span>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-6 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black font-h text-emerald-500 mb-2">{feedbackList.filter(f => f.status !== 'unread').length}</span>
                          <span className="text-[9px] font-bold text-[var(--color-muted)] tracking-widest uppercase">READ / PROCESSED</span>
                        </div>
                      </div>
                      <div className="bg-[var(--color-gold-dim)] border border-[var(--color-gold)]/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] border-dashed rounded-lg p-3 text-[10px] text-[var(--color-muted)] leading-relaxed">
                        <span className="text-[var(--color-gold)] font-bold">💡 What Customers Want:</span> Review specific requested items in cards below. Click the WhatsApp button to fulfill requests directly!
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[300px]">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-black/20">
                      <span className="font-h text-[13px] font-bold text-white tracking-wider flex items-center gap-2"><MessageSquare size={14} className="text-blue-400"/> Customer Feedback Registry</span>
                      <span className="text-[10px] text-[var(--color-muted)] font-mono">{feedbackList.length} submitted suggestions</span>
                    </div>
                    {feedbackList.length > 0 ? (
                      <div className="table-wrap m-4">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Client Name</th>
                              <th>Mobile Phone</th>
                              <th>Stars</th>
                              <th>Review Text</th>
                              <th>Desired Items</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feedbackList.map((fb) => (
                              <tr key={fb.id}>
                                <td className="font-semibold text-white">{fb.name}</td>
                                <td className="font-mono text-xs">{fb.phone}</td>
                                <td className="font-bold text-[var(--color-gold)] font-mono">{fb.stars} ★</td>
                                <td className="max-w-[250px] truncate text-xs">{fb.comment}</td>
                                <td className="text-xs text-[var(--color-muted)]">{fb.desiredItems || "—"}</td>
                                <td>
                                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                                    fb.status === "unread" 
                                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                      : "bg-white/5 text-[var(--color-muted)] border border-white/10"
                                  }`}>
                                    {fb.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="flex gap-2">
                                    {fb.status === "unread" && (
                                      <button onClick={() => handleFeedbackStatus(fb.id, "read")} className="p-2 hover:bg-white/5 rounded-lg text-emerald-400 hover:text-white transition" title="Mark as Read">
                                        <Check size={14} />
                                      </button>
                                    )}
                                    {fb.phone && fb.phone !== "Not provided" && (
                                      <a 
                                        href={`https://wa.me/${fb.phone.replace(/[^0-9]/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 hover:bg-white/5 rounded-lg text-emerald-400 hover:text-white transition flex items-center justify-center" 
                                        title="Reply on WhatsApp"
                                      >
                                        <MessageCircle size={14} />
                                      </a>
                                    )}
                                    <button onClick={() => handleFeedbackStatus(fb.id, "archived")} className="p-2 hover:bg-white/5 rounded-lg text-[var(--color-muted)] hover:text-white transition" title="Archive Log">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-grow opacity-60 mt-10">
                         <span className="text-[11px] text-[var(--color-muted)] font-mono">No customer feedbacks submitted yet. Share the link <span className="text-[var(--color-gold)] font-bold">/feedback</span> with your clients to start collecting suggestions!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: PAYLINKS
                  ============================================================== */}
              {activeTab === "payments" && (
                <div className="flex flex-col gap-6">
                  {/* DEFAULT PAYMENT TOOLS */}
                  <div className="glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider text-sm font-h border-b border-white/5 pb-4">
                      <Zap size={16} className="text-[var(--color-gold)]" /> DEFAULT PAYMENT TOOLS
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                       <div>
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PAYEE NAME (EDIT)</label>
                          <input type="text" placeholder="MATHEESWARAN R" className="input-field" />
                       </div>
                       <div>
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PAYEE UPI ID (EDIT)</label>
                          <input type="text" placeholder="maddyxpay@ybl" className="input-field" />
                       </div>
                       <div>
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">BANK DETAILS ACCESS PIN (OPTIONAL)</label>
                          <input type="text" placeholder="e.g. 1536" className="input-field" />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                       <div className="col-span-2">
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">BANK DETAILS (EDIT)</label>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Bank Name" className="input-field" />
                            <input type="text" placeholder="Account Holder" className="input-field" />
                          </div>
                       </div>
                       <div className="col-span-3 flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">&nbsp;</label>
                            <input type="text" placeholder="Account Number" className="input-field" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">&nbsp;</label>
                            <input type="text" placeholder="IFSC Code" className="input-field" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">&nbsp;</label>
                            <input type="text" placeholder="Branch" className="input-field" />
                          </div>
                       </div>
                    </div>
                    <button className="btn btn-gold w-56 justify-center py-2.5 text-[10px]">SAVE PAYMENT TOOLS</button>
                  </div>

                  {/* Payment Manager Generator */}
                  <div className="glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm font-h">
                        <Zap size={16} className="text-[var(--color-gold)]" /> Payment Manager Generator
                      </div>
                      <span className="text-[9px] font-mono text-[var(--color-muted)]">SECURE CHECKOUT GENERATION</span>
                    </div>
                    <form onSubmit={handleCreatePayLink} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="col-span-1">
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">TRANSACTION TYPE</label>
                          <select className="input-field border-white/20"><option>Account (MBSA)</option></select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">TRANSACTION ID</label>
                          <input type="text" value="# MBSA404" className="input-field text-white font-bold bg-white/5 border-white/20" readOnly />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">CUSTOMER NAME</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={payLinkForm.customerName}
                              onChange={e => setPayLinkForm({ ...payLinkForm, customerName: e.target.value })}
                              placeholder="e.g. Surya" 
                              className="input-field pl-8 border-white/20" 
                            />
                            <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gold)]" />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">AMOUNT (₹)</label>
                          <input 
                            type="number" 
                            required
                            value={payLinkForm.amount}
                            onChange={e => setPayLinkForm({ ...payLinkForm, amount: e.target.value })}
                            placeholder="₹ 0.00" 
                            className="input-field text-[var(--color-gold)] font-bold border-white/20" 
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">EXPIRY TIME</label>
                          <select 
                            value={payLinkForm.expiresHours}
                            onChange={e => setPayLinkForm({ ...payLinkForm, expiresHours: Number(e.target.value) })}
                            className="input-field border-white/20"
                          >
                            <option value={1}>10 Minutes</option>
                            <option value={3}>1 Hour</option>
                            <option value={6}>3 Hours</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="col-span-1">
                           <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">ACCESS PIN (OPTIONAL)</label>
                           <div className="relative">
                             <input 
                               type="text" 
                               maxLength={6}
                               value={payLinkForm.pin}
                               onChange={e => setPayLinkForm({ ...payLinkForm, pin: e.target.value.replace(/[^0-9]/g, "") })}
                               placeholder="None" 
                               className="input-field pl-8 border-white/20" 
                             />
                             <ShieldAlert size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gold)]" />
                           </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">PAYMENT NOTE / REFERENCE</label>
                        <input 
                          type="text" 
                          value={payLinkForm.note}
                          onChange={e => setPayLinkForm({ ...payLinkForm, note: e.target.value })}
                          placeholder="e.g. Account Purchase - Level 75..." 
                          className="input-field border-white/20" 
                        />
                      </div>

                      <button type="submit" className="btn btn-gold w-full justify-center py-3 mt-2 text-[11px] uppercase">
                         <Zap size={14} /> GENERATE SECURE PAYMENT LINK
                      </button>
                    </form>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-[var(--color-gold)] mb-1">{paymentLinksList.length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">TOTAL</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-emerald-500 mb-1">{paymentLinksList.filter(l => l.status === 'active').length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">ACTIVE</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-red-500 mb-1">{paymentLinksList.filter(l => l.status !== 'active').length}</span>
                      <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-widest uppercase">REVOKED</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[300px]">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-black/20">
                      <span className="font-h text-[13px] font-bold text-white tracking-wider flex items-center gap-2">Master Payment Registry</span>
                      <span className="text-[10px] text-[var(--color-muted)] font-mono">{paymentLinksList.length} total links</span>
                    </div>
                    {paymentLinksList.length > 0 ? (
                      <div className="table-wrap m-4">
                        <table className="admin-table font-sans">
                          <thead>
                            <tr>
                              <th>LINK ID</th>
                              <th>STATUS</th>
                              <th>CUSTOMER</th>
                              <th>AMOUNT</th>
                              <th>EXPIRES</th>
                              <th>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentLinksList.map((link) => (
                              <tr key={link.id}>
                                <td>
                                  <strong className="text-[var(--color-gold)] text-xs font-mono">#{link.transactionId}</strong>
                                </td>
                                <td>
                                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                                    {link.status === "active" ? "ACTIVE" : "INACTIVE"}
                                  </span>
                                </td>
                                <td>
                                  <strong className="text-[var(--color-muted)] uppercase text-xs tracking-wider">{link.customerName}</strong>
                                </td>
                                <td className="font-bold text-emerald-500 font-mono">₹{Number(link.amount).toLocaleString("en-IN")}</td>
                                <td>
                                  <div className="flex flex-col">
                                    <span className="text-xs text-[var(--color-muted)]">2 Jun, 09:30 pm <span className="text-red-400 text-[10px]">(EXPIRED)</span></span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex gap-2">
                                    <button onClick={() => copyPayLinkCheckout(link.id)} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[var(--color-gold)] hover:bg-white/10 transition text-[10px] font-bold tracking-wider flex items-center gap-1">
                                      <Copy size={12} /> COPY
                                    </button>
                                    <button onClick={() => handleRevokePayLink(link.id)} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-red-400 hover:bg-white/10 transition text-[10px] font-bold tracking-wider flex items-center gap-1">
                                      <Trash2 size={12} /> DELETE
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-grow opacity-60 mt-10">
                        <span className="text-[11px] text-[var(--color-muted)] font-mono">No payment links generated.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: ACTIVITY LOG
                  ============================================================== */}
              {activeTab === "activity_log" && (
                <div className="glass-panel rounded-2xl p-8 shadow-xl min-h-[600px]">
                  <div className="flex items-center gap-2 mb-8 text-white font-bold tracking-wider text-sm font-h border-b border-white/5 pb-4">
                    <RefreshCw size={16} className="text-[var(--color-gold)]" /> Admin Activity Audit Trail
                  </div>
                  
                  <div className="flex flex-col gap-8 relative pl-6 border-l-2 border-white/10">
                    {/* Dummy Logs like the image */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]"></div>
                      <h4 className="text-sm font-bold text-white mb-1">Admin logged into Supabase Control Panel</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-mono">Logged by Admin (Owner) • Just now • Action: Security</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]"></div>
                      <h4 className="text-sm font-bold text-white mb-1">Fetched latest reviews and product catalog</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-mono">Logged by Admin (Owner) • 5 mins ago • Action: Catalog</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]"></div>
                      <h4 className="text-sm font-bold text-white mb-1">Saved new product item: Accounts listings synced</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-mono">Logged by Admin (Owner) • 1 hour ago • Action: Inventory</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]"></div>
                      <h4 className="text-sm font-bold text-white mb-1">Payment manager UPI configuration updated</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-mono">Logged by Admin (Owner) • 3 hours ago • Action: Settings</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]"></div>
                      <h4 className="text-sm font-bold text-white mb-1">Verified active buyer payment link expiry</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-mono">Logged by Loader (Suresh) • 6 hours ago • Action: Payments</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold)]"></div>
                      <h4 className="text-sm font-bold text-white mb-1">Approved customer rating review: 5 stars published</h4>
                      <p className="text-[10px] text-[var(--color-muted)] font-mono">Logged by Admin (Owner) • Yesterday • Action: Reviews</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
              {/* ==============================================================
                  TAB: ADMIN CONTROLS
                  ============================================================== */}
              {activeTab === "admin_controls" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD NEW ADMIN */}
                  <div className="col-span-1 glass-panel rounded-2xl p-6 shadow-xl h-fit">
                    <div className="flex items-center gap-2 mb-6 text-[var(--color-gold)] font-bold tracking-wider text-sm font-h">
                      <Key size={16} /> Add New Admin
                    </div>
                    <form className="flex flex-col gap-5">
                      <div>
                        <label className="block text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider mb-2">ADMIN EMAIL ADDRESS</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            placeholder="e.g. sethu@mbsx.store" 
                            className="input-field pl-9" 
                          />
                          <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gold)]" />
                        </div>
                      </div>
                      <button type="button" className="btn btn-gold w-full justify-center py-3 text-[11px]">AUTHORIZE ADMIN</button>
                    </form>
                    
                    <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-[10px] text-[var(--color-muted)] leading-relaxed">
                      <div className="font-bold text-blue-400 mb-1 flex items-center gap-1"><ShieldAlert size={12} /> Security Note:</div>
                      Adding an email creates/assigns a verified <strong className="text-white">admin custom claim</strong> in Firebase Auth. The new administrator can log in directly and manage all aspects of the transaction panel securely.
                    </div>
                  </div>

                  {/* ACTIVE ADMINISTRATORS */}
                  <div className="col-span-2 glass-panel rounded-2xl p-6 shadow-xl h-fit">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm font-h">
                        <ShieldAlert size={16} className="text-[var(--color-gold)]" /> Active Administrators
                      </div>
                      <button className="text-[9px] font-bold border border-white/10 px-4 py-1.5 rounded hover:bg-white/5 transition text-white uppercase tracking-wider">
                        REFRESH LIST
                      </button>
                    </div>
                    
                    <div className="table-wrap">
                      <table className="admin-table text-left w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="py-3 px-4 text-[9px] font-bold text-[var(--color-muted)] uppercase tracking-wider">EMAIL ADDRESS</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-[var(--color-muted)] uppercase tracking-wider">ROLE & CLAIM</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-[var(--color-muted)] uppercase tracking-wider">ADDED DATE</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-[var(--color-muted)] uppercase tracking-wider text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 hover:bg-white/5 transition group">
                            <td className="py-4 px-4 text-xs text-white font-semibold">lokesh0212004@gmail.com</td>
                            <td className="py-4 px-4">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-2 py-1 rounded">ADMIN</span>
                            </td>
                            <td className="py-4 px-4 text-[10px] text-[var(--color-muted)] font-mono">18 May 2026</td>
                            <td className="py-4 px-4 text-right">
                              <button className="text-[9px] font-bold border border-red-500/20 text-red-400 px-4 py-1.5 rounded hover:bg-red-500 hover:text-white transition uppercase tracking-wider">
                                REVOKE
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </main>

      <style>{`
        /* Global rules for layout custom widgets */
        .keypad-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          font-family: var(--font-h);
          border-radius: 8px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        .keypad-btn:active {
          transform: scale(0.95);
          background: rgba(255, 215, 0, 0.15);
          border-color: var(--color-gold);
        }
        .keypad-btn.action {
          background: rgba(255, 255, 255, 0.01);
          color: var(--color-muted);
          font-weight: 600;
        }
        .keypad-btn.action:active {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
      `}</style>

    </div>
  );
}
