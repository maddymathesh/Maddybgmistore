/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  LayoutDashboard, Gamepad2, Star, MessageSquare, CreditCard,
  Settings, Plus, Edit, Trash2, Check, X, ShieldAlert,
  Loader2, RefreshCw, MessageCircle, Copy,
  TrendingUp, Users, Zap, Camera, Key, User,
  Menu, Coins, Gift, Car, FileCheck, History, Crown, Gem,
  Clock, Lock, AlertCircle, XCircle, CheckCircle, Slash, Tag,
  Sparkles, Flame, PlusCircle, Award, Timer, BadgeCheck, Trophy, Target,
  ShieldCheck, Archive, Eye, EyeOff, Search, ExternalLink,
  ArrowLeft, Receipt
} from "lucide-react";

import {
  getAdminMetrics,
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  getAdminReviews, updateReviewStatus, deleteReview,
  getFeedbackLogs, updateFeedbackStatus,
  getPaymentLinks, createPaymentLink, revokePaymentLink, deletePaymentLink, markPaymentAsPaid,
  getAdminPaymentSettings, updateAdminPaymentSettings,
  getTransactionsRegistry,
  getAdminActivityLogs, getActiveAdmins, addAdmin, revokeAdmin,
  getUcPacks, createUcPack, updateUcPack, deleteUcPack,
  getXsuitGifts, createXsuitGift, updateXsuitGift, deleteXsuitGift,
  getSupercars, createSupercar, updateSupercar, deleteSupercar,
  getProofs, createProof, deleteProof
} from "../actions";

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

const SIDEBAR_CATEGORIES = [
  {
    category: "OVERVIEW & CONTROL",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "activity_log", label: "Activity Log", icon: History },
      { id: "admin_controls", label: "Admin Controls", icon: Settings },
    ]
  },
  {
    category: "CATALOG SHOWROOM",
    items: [
      { id: "accounts", label: "Accounts", icon: Gamepad2 },
      { id: "uc_packs", label: "UC Packs", icon: Coins },
      { id: "xsuit_gifts", label: "Xsuit Gifts", icon: Gift },
      { id: "cars", label: "Cars", icon: Car },
      { id: "description_factory", label: "Description Factory", icon: Zap },
    ]
  },
  {
    category: "CUSTOMER ENGAGEMENTS",
    items: [
      { id: "customer_feedback", label: "Customer Feedback", icon: MessageSquare },
      { id: "reviews", label: "Reviews", icon: Star },
      { id: "proofs", label: "Proofs", icon: FileCheck },
      { id: "payments", label: "Payments", icon: CreditCard },
    ]
  }
];

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.05 13.605c-.015-2.42 1.974-3.574 2.064-3.626-1.125-1.645-2.875-1.87-3.51-1.902-1.503-.153-2.93.882-3.693.882-.764 0-1.94-.85-3.18-.828-1.614.022-3.107.937-3.935 2.378-1.678 2.91-.428 7.217 1.205 9.584.795 1.157 1.733 2.455 2.983 2.408 1.198-.047 1.666-.77 3.11-.77 1.444 0 1.884.77 3.134.747 1.272-.02 2.08-1.18 2.868-2.34 1.002-1.465 1.415-2.88 1.434-2.955-.03-.013-2.673-1.025-2.68-3.582M15.42 5.48c.646-.78 1.08-1.865.96-2.95-.928.037-2.05.62-2.71 1.402-.53.618-1.045 1.72-.907 2.785.105.008.22.015.334.015.864 0 1.66-.465 2.323-1.252"/>
  </svg>
);

const GameCenterLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <circle cx="8" cy="9" r="4.5" fill="#FF3B30" opacity="0.85" />
    <circle cx="16" cy="9" r="4.5" fill="#007AFF" opacity="0.85" />
    <circle cx="8" cy="15" r="4.5" fill="#4CD964" opacity="0.85" />
    <circle cx="16" cy="15" r="4.5" fill="#FFCC00" opacity="0.85" />
    <circle cx="12" cy="12" r="4" fill="#5856D6" opacity="0.85" />
  </svg>
);

const PRIMARY_LOGIN_OPTIONS = [
  { value: "X", label: "X / Twitter", icon: XLogo, color: "#fff", bg: "rgba(255,255,255,0.05)" },
  { value: "Facebook", label: "Facebook", icon: FacebookLogo, color: "#4A9FFF", bg: "rgba(24,119,242,0.1)" },
  { value: "Google Playgames", label: "Google Playgames", icon: (props: any) => <Gamepad2 {...props} size={16} />, color: "#34A853", bg: "rgba(52,168,83,0.1)" },
  { value: "Whats app", label: "Whats app", icon: WhatsAppLogo, color: "#25D366", bg: "rgba(37,211,102,0.1)" },
  { value: "Apple ID", label: "Apple ID", icon: AppleLogo, color: "#fff", bg: "rgba(255,255,255,0.05)" },
  { value: "Game Center", label: "Game Center", icon: GameCenterLogo, color: "#00A3FF", bg: "rgba(0,163,255,0.1)" }
];

const SECONDARY_LOGIN_OPTIONS = [
  { value: "None", label: "No Login", icon: (props: any) => <X {...props} size={16} />, color: "#8b949e", bg: "rgba(255,255,255,0.05)" },
  ...PRIMARY_LOGIN_OPTIONS
];

const CATEGORY_OPTIONS = [
  { value: "Budget", label: "Budget", icon: Coins },
  { value: "Mid Range", label: "Mid Range", icon: TrendingUp },
  { value: "Premium", label: "Premium", icon: Crown },
  { value: "Ultra Premium", label: "Ultra Premium", icon: Gem }
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available", icon: CheckCircle, color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  { value: "coming_soon", label: "Coming Soon", icon: Clock, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  { value: "reserved", label: "Reserved", icon: Lock, color: "#c084fc", bg: "rgba(192,132,252,0.1)" },
  { value: "on_hold", label: "On Hold", icon: AlertCircle, color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  { value: "sold", label: "Sold", icon: XCircle, color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  { value: "ready_to_exchange", label: "Ready to Exchange", icon: RefreshCw, color: "#22d3ee", bg: "rgba(34,211,238,0.1)" }
];

const PROMO_TAG_OPTIONS = [
  { value: "None", label: "No Tag", icon: Slash, color: "#8b949e", bg: "rgba(255,255,255,0.05)" },
  { value: "Deal of the Day", label: "Deal of the Day", icon: Tag, color: "#ff4757", bg: "rgba(255,71,87,0.1)" },
  { value: "Ultra Premium", label: "Ultra Premium", icon: Sparkles, color: "#ffb8b8", bg: "rgba(255,184,184,0.1)" },
  { value: "Hot", label: "Hot", icon: Flame, color: "#ff6b81", bg: "rgba(255,107,129,0.1)" },
  { value: "Trending", label: "Trending", icon: TrendingUp, color: "#ffa502", bg: "rgba(255,165,2,0.1)" },
  { value: "New Arrival", label: "New Arrival", icon: PlusCircle, color: "#2ed573", bg: "rgba(46,213,115,0.1)" },
  { value: "Rare Collection", label: "Rare Collection", icon: Award, color: "#eccc68", bg: "rgba(236,204,104,0.1)" },
  { value: "Limited Stock", label: "Limited Stock", icon: Timer, color: "#ff7f50", bg: "rgba(255,127,80,0.1)" },
  { value: "Best Seller", label: "Best Seller", icon: BadgeCheck, color: "#70a1ff", bg: "rgba(112,161,255,0.1)" },
  { value: "Pro Collector", label: "Pro Collector", icon: Gamepad2, color: "#1e90ff", bg: "rgba(30,144,255,0.1)" },
  { value: "Triple Conqueror", label: "Triple Conqueror", icon: Trophy, color: "#ffa502", bg: "rgba(255,165,2,0.1)" },
  { value: "Bgmi Partner", label: "Bgmi Partner", icon: Users, color: "#2ed573", bg: "rgba(46,213,115,0.1)" },
  { value: "Top 100", label: "Top 100", icon: Target, color: "#ff4757", bg: "rgba(255,71,87,0.1)" },
  { value: "High Value", label: "High Value", icon: Coins, color: "#ffd700", bg: "rgba(255,215,0,0.1)" },
  { value: "Exclusive", label: "Exclusive", icon: ShieldCheck, color: "#c084fc", bg: "rgba(192,132,252,0.1)" },
  { value: "Premium Inventory", label: "Premium Inventory", icon: Archive, color: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
  { value: "Supercar Collector", label: "Supercar Collector", icon: Car, color: "#ff6b81", bg: "rgba(255,107,129,0.1)" },
  { value: "Xsuit Collector", label: "Xsuit Collector", icon: Gift, color: "#ffa502", bg: "rgba(255,165,2,0.1)" },
  { value: "GunLabs Lover", label: "GunLabs Lover", icon: Zap, color: "#ffd700", bg: "rgba(255,215,0,0.1)" }
];

const UC_PROMO_TAG_OPTIONS = [
  { value: "None", label: "No Tag", icon: Slash, color: "#8b949e", bg: "rgba(255,255,255,0.05)" },
  { value: "Hot", label: "Hot", icon: Flame, color: "#ff6b81", bg: "rgba(255,107,129,0.1)" },
  { value: "Best Value", label: "Best Value", icon: Award, color: "#ffd700", bg: "rgba(255,215,0,0.1)" },
  { value: "Deal of the Day", label: "Deal of the Day", icon: Tag, color: "#ff4757", bg: "rgba(255,71,87,0.1)" },
  { value: "Featured", label: "Featured", icon: Crown, color: "#ffa502", bg: "rgba(255,165,2,0.1)" },
  { value: "Recommended", label: "Recommended", icon: Sparkles, color: "#2ed573", bg: "rgba(46,213,115,0.1)" },
  { value: "Limited Time", label: "Limited Time", icon: Timer, color: "#ff7f50", bg: "rgba(255,127,80,0.1)" }
];

const UC_STATUS_OPTIONS = [
  { value: "Available", label: "Available", icon: CheckCircle, color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  { value: "Coming Soon", label: "Coming Soon", icon: Clock, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  { value: "Limited Stock", label: "Limited Stock", icon: Timer, color: "#ff9f43", bg: "rgba(255,159,67,0.1)" },
  { value: "Out of Stock", label: "Out of Stock", icon: XCircle, color: "#ff4757", bg: "rgba(255,71,87,0.1)" },
  { value: "Hidden", label: "Hidden", icon: EyeOff, color: "#a4b0be", bg: "rgba(164,176,190,0.1)" }
];

const UC_METHOD_OPTIONS = [
  { value: "view_login", label: "Login (X/FB)", icon: Key, color: "#ffd700", bg: "rgba(255,215,0,0.1)" },
  { value: "character_id", label: "Character ID", icon: Gamepad2, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" }
];

function LinkTimer({ expiresAt, status }: { expiresAt: Date | string; status: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (status !== "active") {
      setTimeLeft("");
      return;
    }

    const calculateTime = () => {
      const difference = new Date(expiresAt).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }
      
      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, status]);

  if (status === "paid") {
    return (
      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-sans">
        PAID
      </span>
    );
  }
  if (status === "revoked") {
    return (
      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 uppercase font-sans">
        REVOKED
      </span>
    );
  }
  if (status === "expired" || timeLeft === "Expired") {
    return (
      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-sans">
        EXPIRED
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 w-fit animate-pulse font-sans">
        {timeLeft || "Calculating..."}
      </span>
      <span className="text-[9px] text-muted mt-1 font-sans">
        {new Date(expiresAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();

  // All hooks MUST be declared before any conditional returns (Rules of Hooks)
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // States for DB data
  const [metrics, setMetrics] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [reviewRatingFilter, setReviewRatingFilter] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [selectedFullReview, setSelectedFullReview] = useState<any | null>(null);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [paymentLinksList, setPaymentLinksList] = useState<any[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<any>({
    payeeName: "",
    payeeUpiId: "",
    bankName: "",
    accountType: "SAVINGS ACCOUNT",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    defaultPin: ""
  });
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);
  const [activityLogsList, setActivityLogsList] = useState<any[]>([]);
  const [activeAdminsList, setActiveAdminsList] = useState<any[]>([]);
  
  // New Catalog States
  const [ucPacksList, setUcPacksList] = useState<any[]>([]);
  const [xsuitsList, setXsuitsList] = useState<any[]>([]);
  const [supercarsList, setSupercarsList] = useState<any[]>([]);
  const [proofsList, setProofsList] = useState<any[]>([]);

  // Description Factory State
  const [rawDescription, setRawDescription] = useState("");
  const [previewPlatform, setPreviewPlatform] = useState<"whatsapp" | "telegram" | "instagram">("whatsapp");
  const [parsedData, setParsedData] = useState({
    mythics: 0,
    xsuits: 0,
    guns: 0,
    vehicles: 0,
    level: "—",
    collector: 0,
    fashion: "0/100",
    ultimateFashion: 0,
    logins: "—",
    price: ""
  });

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Compute admin status (client-side guard; middleware is the real enforcer)
  const isPermanentAdmin = 
    user?.primaryEmailAddress?.emailAddress === "contact@maddybgmistore.in" || 
    user?.primaryEmailAddress?.emailAddress === "maddybgmistoreog@gmail.com" || 
    user?.primaryEmailAddress?.emailAddress === "r.mateshwaran.io@gmail.com";
  const userRole = (user?.publicMetadata?.role as string) || "USER";
  const isAdmin = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN"].includes(userRole);
  const isSuperAdmin = isPermanentAdmin || userRole === "SUPER_ADMIN";

  // Safe wrapper: catches individual server action throws so one failure doesn't kill the batch
  const safeCall = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      console.error("[Dashboard] Individual action failed:", err);
      return fallback;
    }
  };

  // Fallback metrics object when the metrics query fails
  const FALLBACK_METRICS = {
    totalViews: 0,
    products: { total: 0, available: 0, sold: 0 },
    reviews: { total: 0, pending: 0, approved: 0 },
    feedback: { unread: 0 },
    analytics: { count: 0, revenue: 0, profit: 0 }
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [
        metricsRes,
        productsRes,
        reviewsRes,
        feedbackRes,
        payLinksRes,
        _txnRes,
        logsRes,
        adminsRes,
        ucRes,
        xsuitRes,
        supercarRes,
        proofsRes,
        paymentSettingsRes
      ] = await Promise.all([
        safeCall(() => getAdminMetrics(), { success: false } as any),
        safeCall(() => getAdminProducts(), { success: false, products: [] } as any),
        safeCall(() => getAdminReviews(), { success: false, reviews: [] } as any),
        safeCall(() => getFeedbackLogs(), { success: false, feedback: [] } as any),
        safeCall(() => getPaymentLinks(), { success: false, paymentLinks: [] } as any),
        safeCall(() => getTransactionsRegistry(), { success: false, transactions: [] } as any),
        safeCall(() => getAdminActivityLogs(), { success: false, logs: [] } as any),
        safeCall(() => getActiveAdmins(), { success: false, admins: [] } as any),
        safeCall(() => getUcPacks(), { success: false, ucPacks: [] } as any),
        safeCall(() => getXsuitGifts(), { success: false, xsuitGifts: [] } as any),
        safeCall(() => getSupercars(), { success: false, supercars: [] } as any),
        safeCall(() => getProofs(), { success: false, proofs: [] } as any),
        safeCall(() => getAdminPaymentSettings(), { success: false, settings: null } as any)
      ]);

      // Always set metrics (use fallback if the query failed) so dashboard renders
      if (metricsRes.success && metricsRes.metrics) {
        setMetrics(metricsRes.metrics);
      } else {
        console.warn("[Dashboard] Metrics fetch failed, using fallback");
        setMetrics(FALLBACK_METRICS);
      }
      if (productsRes.success) setProductsList(productsRes.products || []);
      if (reviewsRes.success) setReviewsList(reviewsRes.reviews || []);
      if (feedbackRes.success) setFeedbackList(feedbackRes.feedback || []);
      if (payLinksRes.success) setPaymentLinksList(payLinksRes.paymentLinks || []);
      if (logsRes.success) setActivityLogsList(logsRes.logs || []);
      if (adminsRes.success) setActiveAdminsList(adminsRes.admins || []);
      if (ucRes.success) setUcPacksList(ucRes.ucPacks || []);
      if (xsuitRes.success) setXsuitsList(xsuitRes.xsuitGifts || []);
      if (supercarRes.success) setSupercarsList(supercarRes.supercars || []);
      if (proofsRes.success) setProofsList(proofsRes.proofs || []);
      if (paymentSettingsRes.success && paymentSettingsRes.settings) {
        setPaymentSettings(paymentSettingsRes.settings);
        setIsSettingsCollapsed(!!paymentSettingsRes.settings.payeeName);
      }
    } catch (_err) {
      console.error("Failed to load dashboard details:", _err);
      toast.error("Failed to sync some dashboard items");
      // Even on total failure, still set fallback metrics so dashboard renders
      if (!metrics) setMetrics(FALLBACK_METRICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user && isAdmin) {
      loadDashboardData();
    } else if (isLoaded) {
      // Clerk finished loading but user isn't admin — clear the spinner
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, isLoaded, user, isAdmin]);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // --- STOCKS FORM STATE ---
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Budget",
    status: "available",
    youtubeUrl: "",
    primaryLogin: "Facebook",
    secondaryLogin: "None (Single Login)",
    unlinkGuarantee: "Not Applicable",
    tag: "None",
    imageUrls: [] as string[]
  });

  const resetProductForm = () => {
    setProductForm({
      title: "",
      description: "",
      price: "",
      category: "Budget",
      status: "available",
      youtubeUrl: "",
      primaryLogin: "Facebook",
      secondaryLogin: "None (Single Login)",
      unlinkGuarantee: "Not Applicable",
      tag: "None",
      imageUrls: []
    });
    setEditingProduct(null);
  };

  // --- CATALOG FORMS ---
  const [editingUcPack, setEditingUcPack] = useState<any>(null);
  const [ucPackForm, setUcPackForm] = useState({ 
    name: "",
    ucAmount: "", 
    marketPrice: "", 
    offerPrice: "", 
    bonusUc: "", 
    method: "view_login", 
    tag: "None",
    status: "Available"
  });
  const [ucSearchQuery, setUcSearchQuery] = useState("");
  const [ucStatusFilter, setUcStatusFilter] = useState("all");
  const [ucMethodFilter, setUcMethodFilter] = useState("all");

  const resetUcPackForm = () => {
    setUcPackForm({
      name: "",
      ucAmount: "",
      marketPrice: "",
      offerPrice: "",
      bonusUc: "",
      method: "view_login",
      tag: "None",
      status: "Available"
    });
    setEditingUcPack(null);
  };
  const [xsuitForm, setXsuitForm] = useState({ name: "", sellingPrice: "", offerPrice: "", tag: "None", imageUrl: "" });
  const [xsuitImageFile, setXsuitImageFile] = useState<File | null>(null);
  const [uploadingXsuitImage, setUploadingXsuitImage] = useState(false);
  const [editingXsuit, setEditingXsuit] = useState<any | null>(null);

  const resetXsuitForm = () => {
    setXsuitForm({ name: "", sellingPrice: "", offerPrice: "", tag: "None", imageUrl: "" });
    setXsuitImageFile(null);
    setEditingXsuit(null);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkvyv4ooq";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "mbs_reviews";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errText}`);
    }

    const data = await response.json();
    return data.secure_url;
  };
  const [supercarForm, setSupercarForm] = useState({ name: "", sellingPrice: "", offerPrice: "", type: "1-Card", imageUrl: "", tag: "None", applicableVehicle: "UAZ" });
  const [supercarImageFile, setSupercarImageFile] = useState<File | null>(null);
  const [uploadingSupercarImage, setUploadingSupercarImage] = useState(false);
  const [editingSupercar, setEditingSupercar] = useState<any | null>(null);

  const resetSupercarForm = () => {
    setSupercarForm({ name: "", sellingPrice: "", offerPrice: "", type: "1-Card", imageUrl: "", tag: "None", applicableVehicle: "UAZ" });
    setSupercarImageFile(null);
    setEditingSupercar(null);
  };
  const [proofForm, setProofForm] = useState(() => {
    const d = new Date();
    const currentMonth = d.toLocaleString("en-US", { month: "long" });
    const currentYear = d.getFullYear().toString();
    return { title: "", imageUrl: "", month: currentMonth, year: currentYear, category: "Payment", transactionId: "" };
  });
  const [proofImageFile, setProofImageFile] = useState<File | null>(null);
  const [uploadingProofImage, setUploadingProofImage] = useState(false);

  const resetProofForm = () => {
    const d = new Date();
    const currentMonth = d.toLocaleString("en-US", { month: "long" });
    const currentYear = d.getFullYear().toString();
    setProofForm({ title: "", imageUrl: "", month: currentMonth, year: currentYear, category: "Payment", transactionId: "" });
    setProofImageFile(null);
  };

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
          resetProductForm();
          triggerRefresh();
        } else {
          toast.error("Failed to update product");
        }
      } else {
        const res = await createProduct(productForm);
        if (res.success) {
          toast.success("Product created successfully!");
          resetProductForm();
          triggerRefresh();
        } else {
          toast.error(res.error || "Failed to create product");
        }
      }
    } catch (_err) {
      toast.error("Failed to submit product form");
    }
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

  // --- CATALOG HANDLERS ---
  const handleUcPackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: ucPackForm.name,
        ucAmount: parseInt(ucPackForm.ucAmount.toString().replace(/,/g, '')),
        offerPrice: ucPackForm.offerPrice.toString().replace(/,/g, ''),
        marketPrice: ucPackForm.marketPrice ? ucPackForm.marketPrice.toString().replace(/,/g, '') : undefined,
        bonusUc: ucPackForm.bonusUc ? parseInt(ucPackForm.bonusUc.toString().replace(/,/g, '')) : 0,
        method: ucPackForm.method,
        tag: ucPackForm.tag,
        status: ucPackForm.status
      };

      if (editingUcPack) {
        const res = await updateUcPack(editingUcPack.id, payload);
        if (res.success) {
          toast.success("UC Pack updated successfully!");
          resetUcPackForm();
          triggerRefresh();
        } else {
          toast.error(res.error || "Failed to update UC Pack");
        }
      } else {
        const res = await createUcPack(payload);
        if (res.success) {
          toast.success("UC Pack added successfully!");
          resetUcPackForm();
          triggerRefresh();
        } else {
          toast.error(res.error || "Failed to add UC Pack");
        }
      }
    } catch (_err) {
      toast.error("Error submitting UC Pack form");
    }
  };

  const handleEditUcPack = (pack: any) => {
    setEditingUcPack(pack);
    setUcPackForm({
      name: pack.name || "",
      ucAmount: pack.ucAmount.toString(),
      marketPrice: pack.marketPrice ? pack.marketPrice.toString() : "",
      offerPrice: pack.offerPrice.toString(),
      bonusUc: pack.bonusUc ? pack.bonusUc.toString() : "",
      method: pack.method,
      tag: pack.tag || "None",
      status: pack.status || "Available"
    });
  };

  const handleDuplicateUcPack = async (pack: any) => {
    try {
      const res = await createUcPack({
        name: pack.name || "",
        ucAmount: pack.ucAmount,
        marketPrice: pack.marketPrice || undefined,
        offerPrice: pack.offerPrice,
        bonusUc: pack.bonusUc || 0,
        method: pack.method,
        tag: pack.tag || "None",
        status: pack.status || "Available"
      });
      if (res.success) {
        toast.success("UC Pack duplicated successfully!");
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to duplicate UC Pack");
      }
    } catch (_err) {
      toast.error("Error duplicating UC Pack");
    }
  };

  const handleToggleUcPackVisibility = async (pack: any) => {
    try {
      const nextStatus = pack.status === "Hidden" ? "Available" : "Hidden";
      const res = await updateUcPack(pack.id, { status: nextStatus });
      if (res.success) {
        toast.success(`UC Pack visibility updated to ${nextStatus}`);
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to toggle visibility");
      }
    } catch (_err) {
      toast.error("Error toggling visibility");
    }
  };

  const handleDeleteUcPack = async (id: string) => {
    if (!confirm("Delete this UC Pack?")) return;
    try {
      const res = await deleteUcPack(id);
      if (res.success) { 
        toast.success("UC Pack deleted"); 
        if (editingUcPack?.id === id) {
          resetUcPackForm();
        }
        triggerRefresh(); 
      }
      else toast.error("Failed to delete UC Pack");
    } catch (_err) { toast.error("Error deleting UC Pack"); }
  };

  const handleXsuitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xsuitForm.name.trim()) {
      toast.error("Xsuit Name is required");
      return;
    }
    if (!xsuitForm.sellingPrice.trim()) {
      toast.error("Selling Price is required");
      return;
    }
    if (!xsuitForm.offerPrice.trim()) {
      toast.error("Offer Price is required");
      return;
    }
    if (!xsuitForm.imageUrl && !xsuitImageFile) {
      toast.error("Image is required");
      return;
    }

    setUploadingXsuitImage(true);
    try {
      let finalImageUrl = xsuitForm.imageUrl;
      if (xsuitImageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(xsuitImageFile);
        } catch {
          toast.error("Failed to upload image to Cloudinary");
          setUploadingXsuitImage(false);
          return;
        }
      }

      const payload = {
        xsuitName: xsuitForm.name,
        sellingPrice: xsuitForm.sellingPrice.replace(/,/g, ''),
        offerPrice: xsuitForm.offerPrice.replace(/,/g, ''),
        imageUrl: finalImageUrl,
        promoTag: xsuitForm.tag
      };

      let res;
      if (editingXsuit) {
        res = await updateXsuitGift(editingXsuit.id, payload);
      } else {
        res = await createXsuitGift(payload);
      }

      if (res.success) {
        toast.success(editingXsuit ? "X-Suit Gift updated successfully!" : "X-Suit Gift added successfully!");
        resetXsuitForm();
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to save X-Suit Gift");
      }
    } catch (_err) {
      toast.error("Error saving X-Suit Gift");
    } finally {
      setUploadingXsuitImage(false);
    }
  };

  const handleDeleteXsuit = async (id: string) => {
    if (!confirm("Delete this X-Suit Gift?")) return;
    try {
      const res = await deleteXsuitGift(id);
      if (res.success) {
        toast.success("X-Suit deleted");
        if (editingXsuit?.id === id) {
          resetXsuitForm();
        }
        triggerRefresh();
      }
      else toast.error("Failed to delete X-Suit");
    } catch (_err) { toast.error("Error deleting X-Suit"); }
  };

  const handleSupercarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supercarForm.name.trim()) {
      toast.error("Supercar Name is required");
      return;
    }
    if (!supercarForm.sellingPrice.trim()) {
      toast.error("Selling Price is required");
      return;
    }
    if (!supercarForm.offerPrice.trim()) {
      toast.error("Offer Price is required");
      return;
    }
    if (!supercarForm.imageUrl && !supercarImageFile) {
      toast.error("Image is required");
      return;
    }

    setUploadingSupercarImage(true);
    try {
      let finalImageUrl = supercarForm.imageUrl;
      if (supercarImageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(supercarImageFile);
        } catch {
          toast.error("Failed to upload image to Cloudinary");
          setUploadingSupercarImage(false);
          return;
        }
      }

      const payload = {
        supercarName: supercarForm.name,
        sellingPrice: supercarForm.sellingPrice.replace(/,/g, ''),
        offerPrice: supercarForm.offerPrice.replace(/,/g, ''),
        carType: supercarForm.type,
        imageUrl: finalImageUrl,
        promoTag: supercarForm.tag,
        applicableVehicle: supercarForm.applicableVehicle || "UAZ"
      };

      let res;
      if (editingSupercar) {
        res = await updateSupercar(editingSupercar.id, payload);
      } else {
        res = await createSupercar(payload);
      }

      if (res.success) {
        toast.success(editingSupercar ? "Supercar Gift updated successfully!" : "Supercar Gift added successfully!");
        resetSupercarForm();
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to save Supercar Gift");
      }
    } catch (_err) {
      toast.error("Error saving Supercar Gift");
    } finally {
      setUploadingSupercarImage(false);
    }
  };

  const handleDeleteSupercar = async (id: string) => {
    if (!confirm("Delete this Supercar Gift?")) return;
    try {
      const res = await deleteSupercar(id);
      if (res.success) {
        toast.success("Supercar deleted");
        if (editingSupercar?.id === id) {
          resetSupercarForm();
        }
        triggerRefresh();
      }
      else toast.error("Failed to delete Supercar");
    } catch (_err) { toast.error("Error deleting Supercar"); }
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofForm.title.trim()) {
      toast.error("Proof Title is required");
      return;
    }
    if (!proofForm.imageUrl && !proofImageFile) {
      toast.error("Proof image is required");
      return;
    }

    setUploadingProofImage(true);
    try {
      let finalImageUrl = proofForm.imageUrl;
      if (proofImageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(proofImageFile);
        } catch {
          toast.error("Failed to upload proof image to Cloudinary");
          setUploadingProofImage(false);
          return;
        }
      }

      const res = await createProof({
        title: proofForm.title,
        imageUrl: finalImageUrl,
        month: proofForm.month,
        year: proofForm.year,
        category: proofForm.category,
        transactionId: proofForm.transactionId ? proofForm.transactionId.trim() : undefined
      });

      if (res.success) {
        toast.success("Proof added successfully!");
        resetProofForm();
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to add Proof");
      }
    } catch (_err) {
      toast.error("Error adding Proof");
    } finally {
      setUploadingProofImage(false);
    }
  };

  const handleDeleteProof = async (id: string) => {
    if (!confirm("Delete this Proof?")) return;
    try {
      const res = await deleteProof(id);
      if (res.success) { toast.success("Proof deleted"); triggerRefresh(); }
      else toast.error("Failed to delete Proof");
    } catch (_err) { toast.error("Error deleting Proof"); }
  };

  // --- PAYMENT LINKS GENERATOR ---
  const generateTxnId = (type: string, customName?: string) => {
    let prefix = "MBSO";
    if (type === "Account") prefix = "MBSA";
    else if (type === "UC") prefix = "MBSU";
    else if (type === "Xsuit") prefix = "MBSX";
    else if (type === "Supercar") prefix = "MBSC";
    else if (type === "Other" && customName) {
      const cleaned = customName.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (cleaned.length >= 2) {
        prefix = `MBS${cleaned.slice(0, 2)}`;
      } else {
        prefix = "MBSO";
      }
    }
    return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const [payLinkForm, setPayLinkForm] = useState({
    transactionType: "Account",
    customType: "",
    transactionId: "",
    customerName: "",
    amount: "",
    note: "",
    pin: "",
    expiresHours: 1
  });

  useEffect(() => {
    if (!payLinkForm.transactionId) {
      setPayLinkForm(prev => ({ ...prev, transactionId: generateTxnId(prev.transactionType, prev.customType) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePayLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payLinkForm.customerName || !payLinkForm.amount || !payLinkForm.transactionId) {
      toast.error("Name, amount, and transaction ID are required");
      return;
    }
    if (payLinkForm.pin && !/^\d{4,6}$/.test(payLinkForm.pin)) {
      toast.error("Access PIN must be 4 to 6 digits");
      return;
    }

    try {
      const res = await createPaymentLink({
        transactionId: payLinkForm.transactionId,
        customerName: payLinkForm.customerName,
        amount: payLinkForm.amount,
        note: payLinkForm.note,
        pin: payLinkForm.pin || undefined,
        expiresHours: Number(payLinkForm.expiresHours)
      });

      if (res.success && res.paymentLink) {
        toast.success("Payment Link Generated!");
        const newType = "Account";
        setPayLinkForm({
          transactionType: newType,
          customType: "",
          transactionId: generateTxnId(newType),
          customerName: "",
          amount: "",
          note: "",
          pin: "",
          expiresHours: 1
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

  const handleDeletePayLink = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this payment link from the registry?")) return;
    try {
      const res = await deletePaymentLink(id);
      if (res.success) {
        toast.success("Payment link deleted successfully");
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to delete payment link");
      }
    } catch (_err) {
      toast.error("Error deleting payment link");
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    if (!confirm("Are you sure you want to mark this payment as successfully PAID? This will bypass verification and activate checkout confirmation state.")) return;
    try {
      const res = await markPaymentAsPaid(id);
      if (res.success) {
        toast.success("Payment marked as PAID successfully!");
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (_err) {
      toast.error("Error updating status to PAID");
    }
  };

  const getCustomerOrigin = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      if (origin.includes("localhost:3001")) {
        return "http://localhost:3000";
      }
      if (origin.includes("admin.maddybgmistore.in")) {
        return "https://maddybgmistore.in";
      }
      return origin;
    }
    return "https://maddybgmistore.in";
  };

  const viewPayLinkCheckout = (id: string) => {
    const origin = getCustomerOrigin();
    window.open(`${origin}/pay/${id}`, "_blank");
  };

  const copyPayLinkCheckout = (id: string) => {
    const origin = getCustomerOrigin();
    const url = `${origin}/pay/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Checkout link copied to clipboard!");
    });
  };

  const handleSavePaymentSettings = async () => {
    if (!paymentSettings.payeeName || !paymentSettings.payeeUpiId) {
      toast.error("Payee Name and Payee UPI ID are required");
      return;
    }
    if (!paymentSettings.payeeUpiId.includes("@")) {
      toast.error("Invalid Payee UPI ID format");
      return;
    }
    if (paymentSettings.defaultPin && !/^\d{4,6}$/.test(paymentSettings.defaultPin)) {
      toast.error("Default Access PIN must be between 4 and 6 digits");
      return;
    }

    try {
      const res = await updateAdminPaymentSettings({
        payeeName: paymentSettings.payeeName,
        payeeUpiId: paymentSettings.payeeUpiId,
        bankName: paymentSettings.bankName || "",
        accountType: paymentSettings.accountType || "SAVINGS ACCOUNT",
        accountHolder: paymentSettings.accountHolder || "",
        accountNumber: paymentSettings.accountNumber || "",
        ifscCode: paymentSettings.ifscCode || "",
        branch: paymentSettings.branch || "",
        defaultPin: paymentSettings.defaultPin || ""
      });

      if (res.success) {
        toast.success("Default payment details updated!");
        setIsSettingsCollapsed(true);
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to update payment settings");
      }
    } catch (err) {
      console.error("Failed to save payment tools:", err);
      toast.error("Error saving payment tools");
    }
  };

  // --- GLOBAL SETTINGS ---
  // Unused state hooks (txnForm, settingsForm) removed to resolve ESLint warnings

  // --- ADMIN CONTROLS HANDLERS ---
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<string>("ADMIN");

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    try {
      const res = await addAdmin(newAdminEmail, newAdminRole);
      if (res.success) {
        toast.success("Admin authorized successfully");
        setNewAdminEmail("");
        setNewAdminRole("ADMIN");
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to add admin");
      }
    } catch (_err) {
      toast.error("Error adding admin");
    }
  };

  const handleRevokeAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this user's admin access?")) return;
    try {
      const res = await revokeAdmin(id);
      if (res.success) {
        toast.success("Admin access revoked");
        triggerRefresh();
      } else {
        toast.error(res.error || "Failed to revoke admin");
      }
    } catch (_err) {
      toast.error("Error revoking admin");
    }
  };

  // Description Factory V3 Parser & Structurer
  const parseRawBGMI = (text: string) => {
    if (!text.trim()) {
      return {
        mythics: 0,
        gunLabsCount: 0,
        gunLabs: [],
        xsuitsCount: 0,
        xsuits: [],
        vehiclesCount: 0,
        vehicles: [],
        level: "—",
        collector: "0",
        logins: "—",
        price: "",
        stockTag: "#AVAILABLE"
      };
    }

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const lowerText = text.toLowerCase();

    // 1. Detect Mythics
    let mythics = 0;
    const mythicMatch = lowerText.match(/(\d+)\s*(mythic|fashion)/);
    if (mythicMatch && mythicMatch[1]) mythics = parseInt(mythicMatch[1]);

    // 2. Detect Gun Labs
    const gunLabs: string[] = [];
    const gunModels = ["m416", "glacier", "ump", "akm", "scar", "m762", "s12k", "p90", "dbs", "vector", "m24", "slr", "thompson", "uzi", "amr", "m249", "groza", "pp19", "dp28", "mg3", "sks", "mk47"];
    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      if (gunModels.some(model => lineLower.includes(model)) && (lineLower.includes("lvl") || lineLower.includes("level") || lineLower.includes("max") || lineLower.includes("upgrad") || lineLower.includes("kill feed") || lineLower.includes("hit"))) {
        gunLabs.push(line);
      }
    });
    let gunLabsCount = gunLabs.length;
    const gunCountMatch = lowerText.match(/(\d+)\s*(gun\s*lab|weapons|upgraded\s*gun|labs)/);
    if (gunCountMatch && gunCountMatch[1]) {
      gunLabsCount = Math.max(gunLabsCount, parseInt(gunCountMatch[1]));
    }

    // 3. Detect X-Suits
    const xsuits: string[] = [];
    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      if (lineLower.includes("xsuit") || lineLower.includes("x-suit")) {
        xsuits.push(line);
      }
    });
    let xsuitsCount = xsuits.length;
    const xsuitCountMatch = lowerText.match(/(\d+)\s*x\s*[-]?\s*suit/);
    if (xsuitCountMatch && xsuitCountMatch[1]) {
      xsuitsCount = Math.max(xsuitsCount, parseInt(xsuitCountMatch[1]));
    }

    // 4. Detect Vehicles
    const vehicles: string[] = [];
    const carBrands = ["lambo", "lamborghini", "koenigsegg", "aston", "ferrari", "bugatti", "ssc", "pagani", "tesla", "mclaren", "dacia", "uaz", "buggy", "mirado"];
    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      if (carBrands.some(brand => lineLower.includes(brand)) || lineLower.includes("supercar") || lineLower.includes("vehicle") || lineLower.includes("upgraded car")) {
        vehicles.push(line);
      }
    });
    let vehiclesCount = vehicles.length;
    const vehicleCountMatch = lowerText.match(/(\d+)\s*(supercar|vehicle|car|upgraded\s*vehicle)/);
    if (vehicleCountMatch && vehicleCountMatch[1]) {
      vehiclesCount = Math.max(vehiclesCount, parseInt(vehicleCountMatch[1]));
    }

    // 5. Detect Level
    let level = "—";
    const levelMatch = lowerText.match(/(?:level|lvl)\s*[-]?\s*(\d+)/);
    if (levelMatch && levelMatch[1]) level = levelMatch[1];

    // 6. Detect Pro Collector
    let collector = "0";
    const collectorMatch = lowerText.match(/(?:collector|pro)\s*[-]?\s*(\d+)/);
    if (collectorMatch && collectorMatch[1]) collector = collectorMatch[1];

    // 7. Detect Logins
    const logins: string[] = [];
    const loginKeywords = ["facebook", "fb", "twitter", "x", "google", "gmail", "playgames", "apple", "gamecenter"];
    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      if (loginKeywords.some(kw => lineLower.includes(kw)) || lineLower.includes("login") || lineLower.includes("link")) {
        logins.push(line);
      }
    });
    let loginsStr = logins.length > 0 ? logins.join(" / ") : "—";
    if (loginsStr === "—") {
      const foundLogins: string[] = [];
      if (lowerText.includes("facebook") || lowerText.includes("fb")) foundLogins.push("Facebook");
      if (lowerText.includes("twitter") || lowerText.includes("x")) foundLogins.push("Twitter (X)");
      if (lowerText.includes("google") || lowerText.includes("gmail") || lowerText.includes("playgames")) foundLogins.push("Google");
      if (foundLogins.length > 0) loginsStr = foundLogins.join(" + ");
    }

    // 8. Detect Price
    let price = "";
    const priceMatches = lowerText.match(/(?:price|cost|inr|₹)\s*[:|-]?\s*(\d+[\d,]*)/);
    if (priceMatches && priceMatches[1]) {
      price = priceMatches[1].replace(/,/g, "");
    } else {
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (line) {
          const numMatch = line.match(/^\d{4,6}$/);
          if (numMatch && numMatch[0]) {
            price = numMatch[0];
            break;
          }
        }
      }
    }

    // 9. Detect Stock Tag
    let stockTag = "#AVAILABLE";
    if (lowerText.includes("sold")) stockTag = "#SOLDOUT";
    else if (lowerText.includes("reserved")) stockTag = "#RESERVED";
    else if (lowerText.includes("hold")) stockTag = "#ONHOLD";
    else if (lowerText.includes("exchange")) stockTag = "#EXCHANGED";

    return {
      mythics,
      gunLabsCount,
      gunLabs,
      xsuitsCount,
      xsuits,
      vehiclesCount,
      vehicles,
      level,
      collector,
      logins: loginsStr,
      price,
      stockTag
    };
  };

  const autoStructureText = () => {
    if (!rawDescription.trim()) {
      toast.error("Please enter some raw specification text first!");
      return;
    }

    const parsed = parseRawBGMI(rawDescription);
    const randomId = "MSID" + Math.floor(100 + Math.random() * 900);
    
    // Format highlights
    let highlights = "";
    const parts = [];
    if (parsed.mythics > 0) parts.push(`${parsed.mythics} Mythics`);
    if (parsed.xsuitsCount > 0) parts.push(`${parsed.xsuitsCount} X-Suit${parsed.xsuitsCount > 1 ? "s" : ""}`);
    if (parsed.gunLabsCount > 0) parts.push(`${parsed.gunLabsCount} Gun Labs`);
    if (parsed.vehiclesCount > 0) parts.push(`${parsed.vehiclesCount} Upgraded Cars`);
    
    if (parts.length > 0) {
      highlights = `➥ Bgmi ${parts.join(" + ")}✨`;
    } else {
      highlights = "➥ Premium BGMI Account with Upgraded Skins✨";
    }

    const structuredParts = [
      `#${randomId}`,
      parsed.stockTag,
      "",
      "‼️❤️ Premium Deal Of The Day ❤️‼️",
      "",
      "🔥 HIGHLIGHTS",
      highlights,
      "",
      "⭐ STATS",
      `🙎‍♂️ Account Level - ${parsed.level}`,
      `✅ Pro Collector - (${parsed.collector})`,
      `👘 Mythic Fashion - (${parsed.mythics}/100)`,
      `👘 Ultimate Mythic Fashion - (0)`,
    ];

    if (parsed.xsuits.length > 0) {
      structuredParts.push("");
      structuredParts.push("🤴 X-SUITS");
      parsed.xsuits.forEach(xs => structuredParts.push(`• ${xs}`));
    } else if (parsed.xsuitsCount > 0) {
      structuredParts.push("");
      structuredParts.push("🤴 X-SUITS");
      structuredParts.push(`• ${parsed.xsuitsCount} Upgradeable X-Suit(s)`);
    }

    if (parsed.gunLabs.length > 0) {
      structuredParts.push("");
      structuredParts.push("🔫 GUN LABS");
      parsed.gunLabs.forEach(gun => structuredParts.push(`• ${gun}`));
    } else if (parsed.gunLabsCount > 0) {
      structuredParts.push("");
      structuredParts.push("🔫 GUN LABS");
      structuredParts.push(`• ${parsed.gunLabsCount} Upgraded Gun Skins`);
    }

    if (parsed.vehicles.length > 0) {
      structuredParts.push("");
      structuredParts.push("🚗 VEHICLES");
      parsed.vehicles.forEach(veh => structuredParts.push(`• ${veh}`));
    } else if (parsed.vehiclesCount > 0) {
      structuredParts.push("");
      structuredParts.push("🚗 VEHICLES");
      structuredParts.push(`• ${parsed.vehiclesCount} Supercars/Upgraded Vehicles`);
    }

    structuredParts.push("");
    structuredParts.push("🔐 LOGINS");
    structuredParts.push(`• Logins: ${parsed.logins} ✅`);

    if (parsed.price) {
      structuredParts.push("");
      structuredParts.push("💰 PRICE");
      structuredParts.push(`• Price - ₹${Number(parsed.price).toLocaleString("en-IN")} INR ✅`);
    } else {
      structuredParts.push("");
      structuredParts.push("💰 PRICE");
      structuredParts.push("• Price - ₹— INR ✅");
    }

    structuredParts.push("");
    structuredParts.push("📩 CONTACT");
    structuredParts.push("• DM WHATSAPP: wa.me/+919025391516");

    setRawDescription(structuredParts.join("\n"));
    toast.success("Specifications structured successfully!");
  };

  const handleLoadTemplate = (type: "account" | "sold" | "transaction" | "review" | "exchange") => {
    let t = "";
    if (type === "account") {
      t = "43 mythics\n13 gun labs\nignis xsuit lvl 4\ngaladria xsuit lvl 1\nm416 glacier lvl 7\nm416 shinobikami maxed\nump lvl 4\nsupercar dacia yellow\nfacebook\ntwitter\naccount level 78\npro collector 53\n9999";
    } else if (type === "sold") {
      t = "#MSID369\n#SOLDOUT\n\n🎉 Premium BGMI Account SOLD successfully!\n\nThank you for choosing Maddy BGMI Store. Trust is our absolute priority. Join our VIP broadcast for daily hot listings! 🔥";
    } else if (type === "transaction") {
      t = "#MSID777\n#TRANSACTION\n\n🤝 MIDDLEMAN TRANSACTION COMPLETED\n\n• Buyer: @maddy_buyer\n• Seller: @reseller_pro\n• Deal Value: ₹22,500\n• Status: Account secured & Payout released ✅";
    } else if (type === "review") {
      t = "#CLIENTREVIEW\n\n⭐ 5-STAR RATING FROM CLIENT\n\n\"Best BGMI store! Got my account instantly after UPI payment verification. Highly recommended for safe deals!\"\n\n🏆 MBS - Buy & Sell with 100% Security.";
    } else if (type === "exchange") {
      t = "#EXCHANGE\n#AVAILABLE\n\n🔄 ACCOUNT EXCHANGE DEAL STATUS\n\n• Target Account: 50+ Mythics with Mummy Set\n• Offered Account: 42 Mythics + M416 Glacier Max\n• Upgrade Cash: ₹8,000 paid by buyer ✅";
    }
    setRawDescription(t);
    toast.success(`Loaded ${type.toUpperCase()} template!`);
  };

  const injectTextAtCursor = (tagText: string) => {
    const textarea = document.getElementById("raw-desc-input") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const newVal = currentVal.substring(0, start) + tagText + currentVal.substring(end);
    setRawDescription(newVal);
    
    // Focus back & adjust cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tagText.length;
    }, 10);
  };

  const handleCopyPlatform = (platform: "whatsapp" | "telegram" | "instagram") => {
    if (!rawDescription.trim()) {
      toast.error("Nothing to copy!");
      return;
    }
    
    let formatted = rawDescription;
    if (platform === "whatsapp") {
      formatted = rawDescription.split("\n").map(line => {
        if (!line.trim()) return "";
        if (line.startsWith("*") && line.endsWith("*")) return line;
        return `*${line}*`;
      }).join("\n");
    } else if (platform === "telegram") {
      formatted = rawDescription.split("\n").map(line => {
        if (!line.trim()) return "";
        if (line.startsWith("**") && line.endsWith("**")) return line;
        return `**${line}**`;
      }).join("\n");
    } else if (platform === "instagram") {
      formatted = rawDescription.split("\n").map(line => {
        if (!line.trim()) return "";
        return line.replace(/[*_]{1,2}/g, "");
      }).join("\n");
    }

    navigator.clipboard.writeText(formatted);
    toast.success(`Copied ${platform.toUpperCase()} format to clipboard!`);
  };

  const handleDownloadTxt = () => {
    if (!rawDescription.trim()) {
      toast.error("Nothing to download!");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([rawDescription], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "bgmi_description.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded TXT file!");
  };

  useEffect(() => {
    const parsed = parseRawBGMI(rawDescription);
    setParsedData({
      mythics: parsed.mythics,
      xsuits: parsed.xsuitsCount,
      guns: parsed.gunLabsCount,
      vehicles: parsed.vehiclesCount,
      level: parsed.level,
      collector: parseInt(parsed.collector) || 0,
      fashion: parsed.mythics > 0 ? `${parsed.mythics}/100` : "0/100",
      ultimateFashion: 0,
      logins: parsed.logins,
      price: parsed.price
    });
  }, [rawDescription]);


  // Unused handleSettingsSubmit removed to resolve ESLint warning

  // While Clerk is loading, show spinner
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 size={36} className="animate-spin text-gold" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg text-white font-sans">
        <ShieldAlert size={48} className="text-gold" />
        <h1 className="font-h text-2xl font-black">Authentication Required</h1>
        <p className="text-sm text-muted font-mono">Please sign in to access the Admin Panel.</p>
        <Link href="/login" className="btn btn-gold px-6 py-2.5 text-sm">Sign In</Link>
      </div>
    );
  }

  // Logged in but not authorized for Admin Panel
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg text-white font-sans">
        <ShieldAlert size={48} className="text-red-500" />
        <h1 className="font-h text-2xl font-black text-red-400">Access Denied</h1>
        <p className="text-sm text-muted font-mono">You do not have access to the Admin Panel.</p>
        <Link href="/" className="btn btn-gold px-6 py-2.5 text-sm">← Back to Control Center</Link>
      </div>
    );
  }

  // --- REVIEWS MODERATION FILTERING & PAGINATION ---
  const approvedReviews = reviewsList.filter(r => r.status === "approved");
  const averageRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
    : 5.0;

  const filteredReviews = reviewsList.filter(rev => {
    const searchLower = reviewSearch.toLowerCase();
    const matchesSearch = 
      rev.name.toLowerCase().includes(searchLower) || 
      (rev.comment || "").toLowerCase().includes(searchLower);
    const matchesStatus = reviewStatusFilter === "all" || rev.status === reviewStatusFilter;
    const matchesRating = reviewRatingFilter === 0 || rev.rating === reviewRatingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const reviewItemsPerPage = 10;
  const reviewTotalPages = Math.ceil(filteredReviews.length / reviewItemsPerPage);
  const paginatedReviews = filteredReviews.slice(reviewPage * reviewItemsPerPage, (reviewPage + 1) * reviewItemsPerPage);

  return (
    <div className="flex min-h-screen bg-bg text-[#eaeaea] font-sans overflow-hidden">
      
      {/* Sidebar Overlay Backdrop on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR SECTION */}
      <aside className={`fixed inset-y-0 left-0 z-50 glass-panel border-r border-white/5 flex flex-col transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="leading-tight">
            {!isSidebarCollapsed ? (
              <>
                <span className="font-h font-black tracking-wide text-2xl text-white flex items-center gap-2">
                  Admin <span className="text-gold">Panel</span>
                </span>
                <Link href="/" className="text-[10px] text-muted uppercase tracking-widest font-bold mt-1 flex items-center gap-1 hover:text-gold transition-colors no-underline">
                  <ArrowLeft size={10} /> Back to Control Center
                </Link>
              </>
            ) : (
              <span className="font-h font-black text-2xl text-gold animate-pulse">A</span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cross-navigation */}
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/transactions"
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/15 transition-all duration-200 no-underline ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Transactions Panel"
          >
            <Receipt size={16} />
            {!isSidebarCollapsed && (
              <>
                Transactions Panel
                <ExternalLink size={12} className="ml-auto opacity-50" />
              </>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6 scrollbar-thin">
          {SIDEBAR_CATEGORIES.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-1.5">
              {!isSidebarCollapsed && (
                <span className="px-4 text-[9px] font-black text-muted/60 tracking-[0.15em] uppercase block mb-2 font-h">
                  {cat.category}
                </span>
              )}
              <div className="space-y-1">
                {cat.items
                  .filter(item => item.id !== "admin_controls" || isSuperAdmin)
                  .map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as ActiveTab);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold tracking-wide ${active ? 'bg-gold-dim text-gold shadow-inner border border-gold/15' : 'text-muted hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title={item.label}
                    >
                      <Icon size={16} />
                      {!isSidebarCollapsed && item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 flex flex-col gap-3">
          {/* Collapse toggle (Desktop only) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {isSidebarCollapsed ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
            {!isSidebarCollapsed && "Collapse Sidebar"}
          </button>

          <div className="w-full flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
            <UserButton afterSignOutUrl="/login" />
            {!isSidebarCollapsed && <span className="text-[10px] text-muted font-bold">LOGGED IN</span>}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 h-screen relative">
        
        {/* Sticky Header */}
        <header className="h-20 shrink-0 border-b border-white/5 glass-panel sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-h font-bold text-lg lg:text-xl tracking-wide flex items-center gap-2 text-white">
              {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.icon && React.createElement(SIDEBAR_ITEMS.find(i => i.id === activeTab)!.icon, { size: 20, className: "text-gold" })}
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
              <Loader2 size={36} className="animate-spin text-gold" />
              <p className="text-sm text-muted font-mono uppercase tracking-widest">Hydrating dashboard workspaces...</p>
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
                    <div className="glass-panel border border-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp size={80} className="text-gold" /></div>
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-1">Total Sales Revenue</span>
                      <strong className="text-4xl font-h font-black text-white">₹{Number(metrics.analytics.revenue).toLocaleString("en-IN")}</strong>
                      <span className="text-xs text-muted block mt-2 font-mono">Mapped from logged transactions</span>
                    </div>

                    <div className="glass-panel border border-green-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Users size={80} className="text-green-500" /></div>
                      <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block mb-1">Total Profit</span>
                      <strong className="text-4xl font-h font-black text-white">₹{Number(metrics.analytics.profit).toLocaleString("en-IN")}</strong>
                      <span className="text-xs text-muted block mt-2 font-mono">Difference of owner vs sold price</span>
                    </div>

                    <div className="glass-panel border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><LayoutDashboard size={80} className="text-blue-500" /></div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Counter Site Views</span>
                      <strong className="text-4xl font-h font-black text-white">{metrics.totalViews.toLocaleString()}</strong>
                      <span className="text-xs text-muted block mt-2 font-mono">Live counter tracked on public portal</span>
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
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">{stat.label}</span>
                        <strong className="text-2xl font-h font-extrabold text-white block">{stat.val}</strong>
                        <span className="text-xs text-muted block mt-1">{stat.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* QUICK TIPS PANEL */}
                  <div className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] rounded-2xl p-6 flex gap-4 items-start">
                    <ShieldAlert className="text-gold shrink-0" size={24} />
                    <div>
                      <h4 className="font-h font-bold text-white uppercase text-sm tracking-wider mb-1">Administrator Safety Protocol</h4>
                      <p className="text-xs text-muted leading-relaxed">
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
                    <div className="flex items-center gap-2 mb-6 text-gold font-bold tracking-wider font-h">
                      {editingProduct ? <Edit size={16} /> : <Plus size={16} />}
                      {editingProduct ? "Edit Product" : "Add Product"}
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
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">Listing Price (₹)</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-gold font-bold text-sm pointer-events-none select-none">₹</span>
                          <input 
                            type="number" 
                            required 
                            value={productForm.price} 
                            onChange={e => setProductForm({ ...productForm, price: e.target.value })} 
                            placeholder="0" 
                            className="input-field font-mono text-white text-sm" 
                            style={{ paddingLeft: "2.25rem" }}
                          />
                        </div>
                        
                        {/* Quick Presets / Increments */}
                        <div className="flex gap-2 flex-wrap mt-2">
                          {[1000, 5000, 10000, 50000].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                const currentPrice = Number(productForm.price) || 0;
                                setProductForm({ ...productForm, price: (currentPrice + preset).toString() });
                              }}
                              className="text-[9px] font-extrabold font-h uppercase tracking-wider px-2.5 py-1.5 rounded bg-white/5 border border-white/10 hover:border-gold hover:bg-gold/10 text-muted hover:text-white transition"
                            >
                              +{preset.toLocaleString("en-IN")}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setProductForm({ ...productForm, price: "" })}
                            className="text-[9px] font-extrabold font-h uppercase tracking-wider px-2.5 py-1.5 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 transition ml-auto"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">CATEGORY / TIER</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                          {CATEGORY_OPTIONS.map((opt) => {
                            const isSelected = productForm.category === opt.value;
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setProductForm({ ...productForm, category: opt.value })}
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                }}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all gap-1.5 ${
                                  isSelected
                                    ? "bg-gold/15 text-white shadow-[0_0_12px_rgba(255,215,0,0.15)]"
                                    : "bg-white/2 hover:bg-white/5 text-muted hover:text-white"
                                }`}
                              >
                                <IconComponent 
                                  size={18} 
                                  style={{ color: isSelected ? "var(--color-gold)" : "currentColor" }} 
                                />
                                <span className="text-[10px] font-extrabold font-h uppercase tracking-wider">{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PRIMARY LOGIN</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {PRIMARY_LOGIN_OPTIONS.map((opt) => {
                            const isSelected = productForm.primaryLogin === opt.value;
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setProductForm({ ...productForm, primaryLogin: opt.value })}
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                }}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? "bg-gold/15 text-white shadow-[0_0_12px_rgba(255,215,0,0.15)]"
                                    : "bg-white/2 hover:bg-white/5 text-muted hover:text-white"
                                }`}
                              >
                                <div 
                                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" 
                                  style={{ background: opt.bg, color: opt.color }}
                                >
                                  <IconComponent />
                                </div>
                                <span className="flex-1 text-[11px] font-bold font-h truncate">{opt.label}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? "border-gold" : "border-white/30"
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">SECONDARY LOGIN</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {SECONDARY_LOGIN_OPTIONS.map((opt) => {
                            const isSelected = productForm.secondaryLogin === opt.value || 
                              (opt.value === "None" && (!productForm.secondaryLogin || productForm.secondaryLogin === "None" || productForm.secondaryLogin === "None (Single Login)"));
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setProductForm({ ...productForm, secondaryLogin: opt.value === "None" ? "None (Single Login)" : opt.value })}
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                }}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? "bg-gold/15 text-white shadow-[0_0_12px_rgba(255,215,0,0.15)]"
                                    : "bg-white/2 hover:bg-white/5 text-muted hover:text-white"
                                }`}
                              >
                                <div 
                                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" 
                                  style={{ background: opt.bg, color: opt.color }}
                                >
                                  <IconComponent />
                                </div>
                                <span className="flex-1 text-[11px] font-bold font-h truncate">{opt.label}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? "border-gold" : "border-white/30"
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <div className="grid grid-cols-2 gap-2 mt-1 max-h-48 overflow-y-auto pr-1 border border-white/5 rounded-xl p-2 bg-black/10">
                          {PROMO_TAG_OPTIONS.map((opt) => {
                            const isSelected = productForm.tag === opt.value || 
                              (opt.value === "None" && (!productForm.tag || productForm.tag === "None"));
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setProductForm({ ...productForm, tag: opt.value })}
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                }}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                  isSelected
                                    ? "bg-gold/15 text-white shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                    : "bg-white/2 hover:bg-white/5 text-muted hover:text-white"
                                }`}
                              >
                                <div 
                                  className="w-6 h-6 rounded flex items-center justify-center shrink-0" 
                                  style={{ background: opt.bg, color: opt.color }}
                                >
                                  <IconComponent size={12} />
                                </div>
                                <span className="flex-1 text-[10px] font-bold font-h truncate">{opt.label}</span>
                                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? "border-gold" : "border-white/30"
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">AVAILABILITY STATUS</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {STATUS_OPTIONS.map((opt) => {
                            const isSelected = productForm.status === opt.value;
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setProductForm({ ...productForm, status: opt.value })}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                                    : "bg-white/2 hover:bg-white/5 text-muted hover:text-white"
                                }`}
                                style={{
                                  backgroundColor: isSelected ? opt.bg : undefined,
                                  borderColor: isSelected ? opt.color : "rgba(255,255,255,0.08)"
                                }}
                              >
                                <div 
                                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" 
                                  style={{ background: opt.bg, color: opt.color }}
                                >
                                  <IconComponent size={14} />
                                </div>
                                <span className="flex-1 text-[11px] font-bold font-h truncate">{opt.label}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0`}
                                  style={{ borderColor: isSelected ? opt.color : "rgba(255,255,255,0.3)" }}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {editingProduct && (
                          <button 
                            type="button" 
                            onClick={resetProductForm} 
                            className="btn border border-white/10 hover:bg-white/5 text-white flex-1 justify-center py-3"
                          >
                            CANCEL
                          </button>
                        )}
                        <button type="submit" className="btn btn-gold flex-[2] justify-center py-3">
                          {editingProduct ? "SAVE CHANGES" : "SAVE PRODUCT"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* INVENTORY LIST */}
                  <div className="lg:col-span-2">
                    <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-100">
                      <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
                        <span className="font-h text-[13px] font-bold text-white tracking-wider">Account Inventory</span>
                        <span className="text-[10px] text-muted font-mono">{productsList.length} items</span>
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
                                        <span className="font-bold text-gold font-mono text-[11px]">₹{Number(prod.price).toLocaleString("en-IN")}</span>
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
                                      }} className="p-2 bg-white/5 border border-white/10 rounded-md text-gold hover:bg-white/10 transition">
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
                                <td className="text-center py-8 text-muted font-mono text-xs">No products listed. Add one to begin!</td>
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
              {activeTab === "description_factory" && (() => {
                const renderPreviewText = (text: string, platform: "whatsapp" | "telegram" | "instagram") => {
                  if (!text.trim()) return <span className="text-muted/50 italic font-sans">No description generated yet. Paste specifications and click Generate!</span>;
                  
                  if (platform === "whatsapp") {
                    return text.split("\n").map((line, idx) => {
                      let content = line;
                      const isBold = content.startsWith("*") && content.endsWith("*");
                      if (isBold) {
                        content = content.substring(1, content.length - 1);
                      }
                      return (
                        <span key={idx} className={`block ${isBold ? 'font-extrabold text-white font-sans' : 'font-sans'}`}>
                          {content || "\u00A0"}
                        </span>
                      );
                    });
                  } else if (platform === "telegram") {
                    return text.split("\n").map((line, idx) => {
                      let content = line;
                      const isBold = content.startsWith("**") && content.endsWith("**");
                      if (isBold) {
                        content = content.substring(2, content.length - 2);
                      }
                      return (
                        <span key={idx} className={`block ${isBold ? 'font-extrabold text-white font-sans' : 'font-sans'}`}>
                          {content || "\u00A0"}
                        </span>
                      );
                    });
                  } else {
                    return text.split("\n").map((line, idx) => {
                      const cleaned = line.replace(/[*_]{1,2}/g, "");
                      return (
                        <span key={idx} className="block text-slate-300 font-sans">
                          {cleaned || "\u00A0"}
                        </span>
                      );
                    });
                  }
                };

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT PANEL: INPUT, TEMPLATES, CONTROLS (xl:col-span-7) */}
                    <div className="xl:col-span-7 flex flex-col gap-5">
                      {/* Header with Templates Selection */}
                      <div className="glass-panel rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2 font-bold tracking-wider font-h text-gold">
                            <Zap size={16} /> Description Factory V3
                            <span className="text-[8px] bg-gold text-black px-1.5 py-0.5 rounded ml-2 uppercase font-black font-sans">Seller Mode</span>
                          </div>
                          <div className="text-[9px] font-bold text-muted font-sans bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                            ⚡ Speed Posting Active
                          </div>
                        </div>

                        {/* Templates row */}
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-[9px] text-muted font-bold uppercase tracking-wider mr-1 font-sans">Templates:</span>
                          {[
                            { id: "account", label: "Account Listing" },
                            { id: "sold", label: "Sold Post" },
                            { id: "transaction", label: "Transaction Post" },
                            { id: "review", label: "Review Post" },
                            { id: "exchange", label: "Exchange Post" }
                          ].map((btn) => (
                            <button
                              key={btn.id}
                              type="button"
                              onClick={() => handleLoadTemplate(btn.id as any)}
                              className="text-[10px] font-sans font-bold bg-white/5 hover:bg-gold/10 hover:text-gold border border-white/5 hover:border-gold/20 px-3 py-1.5 rounded transition cursor-pointer select-none"
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Textarea Input */}
                      <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <Edit size={12} className="text-gold" /> Paste specifications / raw copy
                          </label>
                          <span className="text-[9px] font-mono text-muted">{rawDescription.length} chars</span>
                        </div>
                        <textarea 
                          id="raw-desc-input"
                          value={rawDescription}
                          onChange={e => setRawDescription(e.target.value)}
                          className="w-full h-112 bg-black/40 border border-white/10 rounded-lg p-3.5 text-xs text-muted font-mono resize-none focus:outline-none focus:border-gold transition leading-relaxed"
                          placeholder="Paste raw text here. E.g.:&#10;43 mythics&#10;13 gun labs&#10;ignis xsuit lvl 4&#10;green lambo&#10;facebook / twitter&#10;9999"
                        ></textarea>

                        {/* Interactive Tags Row */}
                        <div className="flex flex-col gap-2.5 border-t border-white/5 pt-3">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[9px] text-muted font-bold uppercase tracking-wider mr-2">Promo Tags:</span>
                            {["🔥 HOT", "⭐ ULTRA PREMIUM", "💎 RARE", "🚀 TRENDING", "👑 FEATURED", "⚡ BEST SELLER"].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => injectTextAtCursor(tag + " ")}
                                className="text-[9.5px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded transition cursor-pointer select-none"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[9px] text-muted font-bold uppercase tracking-wider mr-2">Status Tags:</span>
                            {["#AVAILABLE", "#COMINGSOON", "#RESERVED", "#ONHOLD", "#SOLDOUT", "#EXCHANGED"].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => injectTextAtCursor(tag + " ")}
                                className="text-[9.5px] font-bold bg-white/5 hover:bg-white/10 text-slate-400 px-2.5 py-1 rounded transition cursor-pointer select-none"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Detected Stats Display */}
                      <div className="glass-panel rounded-xl p-4">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3.5">Detected Assets State (Live)</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                          <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-center">
                            <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Mythics</div>
                            <div className="text-sm font-black font-h text-gold">{parsedData.mythics}</div>
                          </div>
                          <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-center">
                            <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">X-Suits</div>
                            <div className="text-sm font-black font-h text-gold">{parsedData.xsuits}</div>
                          </div>
                          <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-center">
                            <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Gun Labs</div>
                            <div className="text-sm font-black font-h text-gold">{parsedData.guns}</div>
                          </div>
                          <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-center">
                            <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Vehicles</div>
                            <div className="text-sm font-black font-h text-gold">{parsedData.vehicles}</div>
                          </div>
                          <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-center">
                            <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Price</div>
                            <div className="text-sm font-black font-h text-green-400 truncate">
                              {parsedData.price ? `₹${Number(parsedData.price).toLocaleString("en-IN")}` : "—"}
                            </div>
                          </div>
                          <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-center">
                            <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Logins</div>
                            <div className="text-[10px] font-extrabold text-gold truncate mt-0.5">{parsedData.logins}</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="grid grid-cols-3 gap-3">
                        <button 
                          onClick={autoStructureText}
                          className="col-span-2 btn btn-gold justify-center text-xs py-3.5 tracking-wider font-extrabold"
                        >
                          <Sparkles size={14} className="text-gold" /> AUTO STRUCTURE SPECS (GENERATE)
                        </button>
                        <button 
                          onClick={() => { setRawDescription(""); toast.success("Cleared input!"); }}
                          className="btn bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 justify-center text-xs py-3.5"
                        >
                          <Trash2 size={14} /> CLEAR INPUT
                        </button>
                      </div>
                    </div>

                    {/* RIGHT PANEL: LIVE PREVIEWS & COPY (xl:col-span-5) */}
                    <div className="xl:col-span-5 flex flex-col gap-5">
                      {/* Platform Selector Tabs */}
                      <div className="glass-panel rounded-xl p-2 flex gap-1 border border-white/5">
                        {[
                          { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, activeColor: "bg-green-500/15 text-green-400 border-green-500/20" },
                          { id: "telegram", label: "Telegram", icon: Zap, activeColor: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
                          { id: "instagram", label: "Instagram", icon: Camera, activeColor: "bg-pink-500/15 text-pink-400 border-pink-500/20" }
                        ].map((tab) => {
                          const isTabActive = previewPlatform === tab.id;
                          const TabIcon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setPreviewPlatform(tab.id as any)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition border cursor-pointer select-none ${
                                isTabActive 
                                  ? `${tab.activeColor} shadow-inner` 
                                  : "bg-transparent border-transparent text-muted hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <TabIcon size={13} />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Preview Area Container */}
                      <div className="flex-1 min-h-[440px] flex items-center justify-center bg-black/35 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        {/* Simulated WhatsApp Phone */}
                        {previewPlatform === "whatsapp" && (
                          <div className="w-[300px] h-[450px] bg-[#0b141a] rounded-[2.5rem] border-[6px] border-[#222e35] shadow-2xl flex flex-col overflow-hidden relative font-sans">
                            {/* Chat Wallpaper Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                            
                            {/* Header */}
                            <div className="bg-[#202c33] h-12 flex items-center px-4 gap-3 shrink-0 relative z-10">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-black">MB</div>
                              <div className="flex flex-col">
                                <span className="text-white text-[11px] font-bold flex items-center gap-1">
                                  Maddy Store Channel <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex items-center justify-center text-[7px] text-black font-black">✓</span>
                                </span>
                                <span className="text-[8px] text-muted">Official VIP Broadcast</span>
                              </div>
                            </div>

                            {/* Chat Body */}
                            <div className="grow p-3.5 overflow-y-auto relative z-10 flex flex-col justify-start">
                              <div className="bg-[#005c4b] rounded-xl rounded-tr-none p-3.5 max-w-[92%] shadow-md text-[10.5px] text-slate-100 leading-relaxed font-mono self-end relative">
                                {/* Bubble corner tail */}
                                <div className="absolute -right-1.5 top-0 w-2.5 h-2.5 bg-[#005c4b] [clip-path:polygon(0_0,0_100%,100%_0)]"></div>
                                <div className="whitespace-pre-wrap">
                                  {renderPreviewText(rawDescription, "whatsapp")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Simulated Telegram Message */}
                        {previewPlatform === "telegram" && (
                          <div className="w-[300px] h-[450px] bg-[#0e1621] rounded-[2.5rem] border-[6px] border-[#222e35] shadow-2xl flex flex-col overflow-hidden relative font-sans">
                            {/* Header */}
                            <div className="bg-[#182533] h-12 flex items-center px-4 gap-3 shrink-0 border-b border-[#101921]">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-black">M</div>
                              <div className="flex flex-col">
                                <span className="text-white text-[11px] font-extrabold flex items-center gap-1">
                                  Maddy BGMI Store VIP <span className="w-3 h-3 rounded-full bg-blue-400 flex items-center justify-center text-[8px] text-black font-bold">✓</span>
                                </span>
                                <span className="text-[8.5px] text-[#7f91a4]">45,820 subscribers</span>
                              </div>
                            </div>

                            {/* Chat Body */}
                            <div className="grow p-3.5 overflow-y-auto flex flex-col justify-start">
                              <div className="bg-[#182533] rounded-2xl p-3.5 max-w-[95%] shadow-md border border-[#202f3e] text-[10.5px] leading-relaxed font-mono text-slate-200">
                                <div className="whitespace-pre-wrap">
                                  {renderPreviewText(rawDescription, "telegram")}
                                </div>
                                <div className="flex justify-between items-center mt-3 text-[8.5px] text-[#7f91a4] border-t border-white/5 pt-2">
                                  <span>👁 12.4K views</span>
                                  <span>22:38</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Simulated Instagram Post Caption */}
                        {previewPlatform === "instagram" && (
                          <div className="w-[300px] h-[450px] bg-black rounded-[2.5rem] border-[6px] border-[#222e35] shadow-2xl flex flex-col overflow-hidden relative font-sans text-white">
                            {/* Header */}
                            <div className="h-11 border-b border-white/10 flex items-center px-4 gap-2.5 shrink-0">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-pink-500 p-[1.5px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[9px] font-black text-gold">MB</div>
                              </div>
                              <span className="text-[10px] font-bold">maddy_bgmi_store</span>
                            </div>

                            {/* Image Placeholder */}
                            <div className="h-44 bg-gradient-to-tr from-gold/30 to-amber-700/30 border-b border-white/10 flex flex-col items-center justify-center gap-1 shrink-0 p-4 text-center">
                              <Sparkles size={24} className="text-gold animate-pulse" />
                              <span className="text-[11px] font-black tracking-widest uppercase text-white font-h">Maddy Store Deal</span>
                              <span className="text-[7.5px] text-gold/85 tracking-widest font-mono">{"GENERATE -> COPY -> EXPORT"}</span>
                            </div>

                            {/* Caption Body */}
                            <div className="grow p-3.5 overflow-y-auto">
                              <div className="text-[10px] leading-relaxed font-mono">
                                <span className="font-bold text-white mr-1.5 font-sans">maddy_bgmi_store</span>
                                <div className="whitespace-pre-wrap inline-block">
                                  {renderPreviewText(rawDescription, "instagram")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Copy and Actions Console */}
                      <div className="flex flex-col gap-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-muted font-sans flex items-center gap-1">
                          <LayoutDashboard size={11} className="text-gold" /> Export Posting Dashboard
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button 
                            onClick={() => handleCopyPlatform("whatsapp")}
                            className="btn bg-[#25d366]/10 hover:bg-[#25d366] text-[#25d366] hover:text-white border border-[#25d366]/20 justify-center text-[10px] py-3 font-extrabold"
                          >
                            <Copy size={11} /> WHATSAPP
                          </button>
                          <button 
                            onClick={() => handleCopyPlatform("telegram")}
                            className="btn bg-[#0088cc]/10 hover:bg-[#0088cc] text-[#0088cc] hover:text-white border border-[#0088cc]/20 justify-center text-[10px] py-3 font-extrabold"
                          >
                            <Copy size={11} /> TELEGRAM
                          </button>
                          <button 
                            onClick={() => handleCopyPlatform("instagram")}
                            className="btn bg-[#e1306c]/10 hover:bg-[#e1306c] text-[#e1306c] hover:text-white border border-[#e1306c]/20 justify-center text-[10px] py-3 font-extrabold"
                          >
                            <Copy size={11} /> INSTAGRAM
                          </button>
                        </div>
                        <button 
                          onClick={handleDownloadTxt}
                          className="btn btn-outline justify-center text-[10px] py-3.5 font-bold tracking-wider text-slate-300 border-white/10 hover:bg-white/5"
                        >
                          <Check size={11} /> DOWNLOAD AS STANDARD TXT FILE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ==============================================================
                  TAB: UC PACKS
                  ============================================================== */}
              {activeTab === "uc_packs" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD/EDIT UC PACK */}
                  <div className="lg:col-span-1 glass-panel rounded-2xl p-6 shadow-xl h-fit">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-gold font-bold tracking-wider font-h">
                        {editingUcPack ? <Edit size={16} /> : <Plus size={16} />}
                        {editingUcPack ? "Edit UC Pack" : "Add UC Pack"}
                      </div>
                      {editingUcPack && (
                        <button 
                          onClick={resetUcPackForm}
                          className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded font-bold hover:bg-red-500/20 transition flex items-center gap-1"
                        >
                          <X size={10} /> Cancel
                        </button>
                      )}
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={handleUcPackSubmit}>
                      {/* QUICK PRESETS */}
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">QUICK PRESETS</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "60 UC", amount: "60", bonus: "0", name: "60 UC" },
                            { label: "325 UC", amount: "300", bonus: "25", name: "300 + 25 UC" },
                            { label: "660 UC", amount: "600", bonus: "60", name: "600 + 60 UC" },
                            { label: "1800 UC", amount: "1500", bonus: "300", name: "1500 + 300 UC" },
                            { label: "3850 UC", amount: "3000", bonus: "850", name: "3000 + 850 UC" },
                            { label: "8100 UC", amount: "6000", bonus: "2100", name: "6000 + 2100 UC" }
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setUcPackForm({
                                ...ucPackForm,
                                ucAmount: preset.amount,
                                bonusUc: preset.bonus,
                                name: preset.name
                              })}
                              className="text-[10px] font-sans font-bold bg-white/5 hover:bg-gold/10 hover:text-gold border border-white/5 hover:border-gold/20 px-3 py-1.5 rounded transition select-none cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* PACK NAME */}
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PACK NAME</label>
                        <input 
                          type="text" 
                          value={ucPackForm.name} 
                          onChange={e => setUcPackForm({ ...ucPackForm, name: e.target.value })} 
                          placeholder="e.g. 330 UC + 30 Bonus" 
                          className="input-field font-sans text-white text-sm" 
                          required 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">UC AMOUNT</label>
                          <div className="relative flex items-center">
                            <Coins className="absolute left-4 text-gold/60 pointer-events-none select-none" size={16} />
                            <input 
                              type="text" 
                              value={ucPackForm.ucAmount} 
                              onChange={e => setUcPackForm({ ...ucPackForm, ucAmount: e.target.value })} 
                              placeholder="8000" 
                              className="input-field !pl-11 font-mono text-white text-sm" 
                              required 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">BONUS UC</label>
                          <div className="relative flex items-center">
                            <Gift className="absolute left-4 text-gold/60 pointer-events-none select-none" size={16} />
                            <input 
                              type="text" 
                              value={ucPackForm.bonusUc} 
                              onChange={e => setUcPackForm({ ...ucPackForm, bonusUc: e.target.value })} 
                              placeholder="60" 
                              className="input-field !pl-11 font-mono text-white text-sm" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">SELLING PRICE (₹)</label>
                          <div className="relative flex items-center">
                            <Tag className="absolute left-4 text-gold/60 pointer-events-none select-none" size={14} />
                            <input 
                              type="text" 
                              value={ucPackForm.marketPrice} 
                              onChange={e => setUcPackForm({ ...ucPackForm, marketPrice: e.target.value })} 
                              placeholder="7500" 
                              className="input-field !pl-11 font-mono text-white text-sm" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">OFFER PRICE (₹)</label>
                          <div className="relative flex items-center">
                            <Zap className="absolute left-4 text-gold/60 pointer-events-none select-none" size={14} />
                            <input 
                              type="text" 
                              value={ucPackForm.offerPrice} 
                              onChange={e => setUcPackForm({ ...ucPackForm, offerPrice: e.target.value })} 
                              placeholder="6500" 
                              className="input-field !pl-11 font-mono text-white text-sm" 
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      {/* PURCHASE METHOD BUTTONS */}
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PURCHASE METHOD</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {UC_METHOD_OPTIONS.map((opt) => {
                            const isSelected = ucPackForm.method === opt.value;
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setUcPackForm({ ...ucPackForm, method: opt.value as any })}
                                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-bold transition select-none cursor-pointer"
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                  background: isSelected ? opt.bg : "rgba(255,255,255,0.02)",
                                  color: isSelected ? opt.color : "var(--color-text-muted)"
                                }}
                              >
                                <IconComponent size={14} />
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* PROMO TAG BUTTONS */}
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                          {UC_PROMO_TAG_OPTIONS.map((opt) => {
                            const isSelected = ucPackForm.tag === opt.value;
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setUcPackForm({ ...ucPackForm, tag: opt.value })}
                                className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg border text-[10px] font-bold transition select-none cursor-pointer"
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                  background: isSelected ? opt.bg : "rgba(255,255,255,0.02)",
                                  color: isSelected ? opt.color : "var(--color-text-muted)"
                                }}
                              >
                                <IconComponent size={10} />
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* STATUS GRID */}
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">AVAILABILITY STATUS</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                          {UC_STATUS_OPTIONS.map((opt) => {
                            const isSelected = ucPackForm.status === opt.value;
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setUcPackForm({ ...ucPackForm, status: opt.value })}
                                className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg border text-[10px] font-bold transition select-none cursor-pointer"
                                style={{
                                  borderColor: isSelected ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                  background: isSelected ? opt.bg : "rgba(255,255,255,0.02)",
                                  color: isSelected ? opt.color : "var(--color-text-muted)"
                                }}
                              >
                                <IconComponent size={10} />
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button type="submit" className="btn btn-gold w-full mt-2 justify-center py-3 font-sans font-bold text-xs tracking-wider">
                        {editingUcPack ? "SAVE CHANGES" : "CREATE UC PACK"}
                      </button>
                    </form>
                  </div>

                  {/* UC PACK LIST & WORKSPACE */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Search and Filter Controls */}
                    <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 text-white/30" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search UC Packs by amount, tag..."
                          value={ucSearchQuery}
                          onChange={(e) => setUcSearchQuery(e.target.value)}
                          className="input-field !pl-11 w-full"
                        />
                      </div>
                      <div className="flex w-full sm:w-auto gap-2">
                        <select 
                          value={ucStatusFilter}
                          onChange={(e) => setUcStatusFilter(e.target.value)}
                          className="input-field text-xs py-2 h-fit"
                        >
                          <option value="all">All Statuses</option>
                          {UC_STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>

                        <select 
                          value={ucMethodFilter}
                          onChange={(e) => setUcMethodFilter(e.target.value)}
                          className="input-field text-xs py-2 h-fit"
                        >
                          <option value="all">All Methods</option>
                          <option value="view_login">Login (X/FB)</option>
                          <option value="character_id">Character ID</option>
                        </select>
                      </div>
                    </div>

                    {/* Catalog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ucPacksList
                        .filter((pack: any) => {
                          const matchesSearch = 
                            pack.ucAmount.toString().includes(ucSearchQuery) ||
                            (pack.tag && pack.tag.toLowerCase().includes(ucSearchQuery.toLowerCase())) ||
                            pack.method.toLowerCase().includes(ucSearchQuery.toLowerCase());
                          const matchesStatus = ucStatusFilter === "all" || pack.status === ucStatusFilter;
                          const matchesMethod = ucMethodFilter === "all" || pack.method === ucMethodFilter;
                          return matchesSearch && matchesStatus && matchesMethod;
                        })
                        .map((pack: any) => {
                          // Safe parsing numbers
                          const offer = parseFloat(pack.offerPrice) || 0;
                          const market = pack.marketPrice ? parseFloat(pack.marketPrice) : 0;
                          const savings = market > offer ? market - offer : 0;
                          const discount = market > 0 && savings > 0 ? Math.round((savings / market) * 100) : 0;
                          
                          // Find promo option styling
                          const promoOpt = UC_PROMO_TAG_OPTIONS.find(o => o.value === pack.tag) || { color: "#8b949e", bg: "rgba(255,255,255,0.05)" };
                          
                          // Find status option styling
                          const statusOpt = UC_STATUS_OPTIONS.find(o => o.value === pack.status) || { label: pack.status || "Available", color: "#4ade80", bg: "rgba(74,222,128,0.1)" };

                          return (
                            <div 
                              key={pack.id} 
                              className="glass-panel hover:border-gold/30 transition-all duration-300 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 border"
                              style={{
                                borderColor: editingUcPack?.id === pack.id ? "var(--color-gold)" : "rgba(255,255,255,0.06)",
                                background: editingUcPack?.id === pack.id ? "rgba(255,215,0,0.02)" : "rgba(10,12,18,0.4)"
                              }}
                            >
                              <div className="flex flex-col gap-2.5">
                                {/* Badges Header */}
                                <div className="flex justify-between items-center gap-2">
                                  <span 
                                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                    style={{
                                      color: statusOpt.color,
                                      backgroundColor: statusOpt.bg,
                                      borderColor: `${statusOpt.color}20`
                                    }}
                                  >
                                    {statusOpt.label}
                                  </span>
                                  {pack.tag && pack.tag !== "None" && (
                                    <span 
                                      className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border"
                                      style={{
                                        color: promoOpt.color,
                                        backgroundColor: promoOpt.bg,
                                        borderColor: `${promoOpt.color}20`
                                      }}
                                    >
                                      {pack.tag}
                                    </span>
                                  )}
                                </div>

                                {/* Title with UC Coin */}
                                <div className="flex items-center gap-2.5 mt-1">
                                  <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/10">
                                    <Coins size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-extrabold text-base text-white font-h leading-none">
                                      {pack.name ? pack.name : `${Number(pack.ucAmount).toLocaleString("en-IN")} UC`}
                                    </span>
                                    {pack.bonusUc && pack.bonusUc > 0 ? (
                                      <span className="text-[10px] text-gold font-bold flex items-center gap-1 mt-0.5">
                                        <Gift size={10} /> +{pack.bonusUc} Bonus UC
                                      </span>
                                    ) : (
                                      <span className="text-[9px] text-muted font-bold mt-0.5">Standard Pack</span>
                                    )}
                                  </div>
                                </div>

                                {/* Pricing Metrics */}
                                <div className="grid grid-cols-2 gap-3 mt-1.5 p-3 rounded-xl bg-white/2 border border-white/5">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-muted uppercase font-bold tracking-wider mb-0.5">Offer Price</span>
                                    <span className="text-sm font-black text-green-400 font-mono">
                                      ₹{Number(pack.offerPrice).toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[9px] text-muted uppercase font-bold tracking-wider mb-0.5">Market Price</span>
                                    <span className="text-xs font-bold text-muted/80 line-through font-mono">
                                      {pack.marketPrice ? `₹${Number(pack.marketPrice).toLocaleString("en-IN")}` : "—"}
                                    </span>
                                  </div>
                                </div>

                                {/* Save Details */}
                                {discount > 0 && (
                                  <div className="text-[10px] text-[#4ade80] font-mono font-bold bg-[#4ade80]/5 px-2.5 py-1.5 rounded-lg border border-[#4ade80]/10 flex items-center justify-between">
                                    <span>💸 SAVINGS DETECTED</span>
                                    <span>Save ₹{savings.toLocaleString("en-IN")} ({discount}% OFF)</span>
                                  </div>
                                )}
                              </div>

                              {/* Footer Actions */}
                              <div className="border-t border-white/5 pt-3.5 flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1 text-muted text-[10px]">
                                  <Clock size={11} />
                                  <span className="font-mono">
                                    {pack.updatedAt ? new Date(pack.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Recently"}
                                  </span>
                                  <span className="text-white/10 mx-1">|</span>
                                  <span className="text-[9px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                                    {pack.method === "character_id" ? <Gamepad2 size={10} /> : <Key size={10} />}
                                    {pack.method === "character_id" ? "Character ID" : "Login (X/FB)"}
                                  </span>
                                </div>
                                
                                <div className="flex gap-1.5">
                                  <button 
                                    onClick={() => handleToggleUcPackVisibility(pack)}
                                    className="p-2 bg-white/3 hover:bg-white/8 text-muted hover:text-white border border-white/5 hover:border-white/10 rounded-xl transition duration-200 select-none cursor-pointer"
                                    title="Toggle Hide/Show"
                                  >
                                    {pack.status === "Hidden" ? <EyeOff size={13} className="text-red-400" /> : <Eye size={13} className="text-green-400" />}
                                  </button>
                                  <button 
                                    onClick={() => handleDuplicateUcPack(pack)}
                                    className="p-2 bg-white/3 hover:bg-white/8 text-muted hover:text-gold border border-white/5 hover:border-gold/10 rounded-xl transition duration-200 select-none cursor-pointer"
                                    title="Duplicate Pack"
                                  >
                                    <Copy size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleEditUcPack(pack)}
                                    className="p-2 bg-white/3 hover:bg-white/8 text-gold border border-white/5 hover:border-gold/20 rounded-xl transition duration-200 select-none cursor-pointer"
                                    title="Edit Details"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUcPack(pack.id)}
                                    className="p-2 bg-white/3 hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-white/5 hover:border-red-500/20 rounded-xl transition duration-200 select-none cursor-pointer"
                                    title="Delete Forever"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {ucPacksList.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-xs text-muted font-mono bg-white/2 rounded-2xl border border-white/5">
                          No UC Packs registered in database.
                        </div>
                      )}
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
                      <Zap size={16} /> {editingXsuit ? "Edit Xsuit Gift" : "Add Xsuit Gift"}
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={handleXsuitSubmit}>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">XSUIT NAME</label>
                        <input type="text" value={xsuitForm.name} onChange={e => setXsuitForm({ ...xsuitForm, name: e.target.value })} placeholder="e.g. Poseidon X-Suit" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">SELLING PRICE (MARKET PRICE) (₹)</label>
                        <input type="text" value={xsuitForm.sellingPrice} onChange={e => setXsuitForm({ ...xsuitForm, sellingPrice: e.target.value })} placeholder="e.g. 20000" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">OFFER PRICE (OUR PRICE) (₹)</label>
                        <input type="text" value={xsuitForm.offerPrice} onChange={e => setXsuitForm({ ...xsuitForm, offerPrice: e.target.value })} placeholder="e.g. 15000" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "None", label: "None", icon: "" },
                            { id: "🔥 Hot", label: "Hot", icon: "🔥" },
                            { id: "⭐ Featured", label: "Featured", icon: "⭐" },
                            { id: "💎 Premium", label: "Premium", icon: "💎" },
                            { id: "⚡ Best Value", label: "Best Value", icon: "⚡" },
                            { id: "🎉 Deal of the Day", label: "Deal", icon: "🎉" }
                          ].map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => setXsuitForm({ ...xsuitForm, tag: tag.id })}
                              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                xsuitForm.tag === tag.id
                                  ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                  : "bg-black/20 border-border text-muted hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {tag.icon && <span>{tag.icon}</span>}
                              <span>{tag.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">XSUIT IMAGE</label>
                        <div className="flex flex-col gap-3">
                          {(xsuitForm.imageUrl || xsuitImageFile) ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-black/40">
                              <img 
                                src={xsuitImageFile ? URL.createObjectURL(xsuitImageFile) : xsuitForm.imageUrl} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  setXsuitImageFile(null);
                                  setXsuitForm({ ...xsuitForm, imageUrl: "" });
                                }}
                                className="absolute top-2 right-2 bg-black/60 text-red-400 hover:text-white p-1.5 rounded-full transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border rounded-xl cursor-pointer hover:bg-white/5 transition bg-black/20">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera size={24} className="text-muted mb-2" />
                                <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Upload Image</p>
                              </div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setXsuitImageFile(e.target.files[0]);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                      </div>
                      <button type="submit" className="btn btn-gold w-full mt-2 justify-center py-3" disabled={uploadingXsuitImage}>
                        {uploadingXsuitImage ? (
                          <>
                            <Loader2 size={16} className="animate-spin mr-2" />
                            UPLOADING...
                          </>
                        ) : (
                          editingXsuit ? "UPDATE XSUIT" : "SAVE XSUIT"
                        )}
                      </button>
                      {editingXsuit && (
                        <button 
                          type="button" 
                          onClick={resetXsuitForm}
                          className="btn bg-white/5 hover:bg-white/10 text-white w-full justify-center py-3 border border-border"
                          disabled={uploadingXsuitImage}
                        >
                          CANCEL EDIT
                        </button>
                      )}
                    </form>
                  </div>

                  {/* XSUIT LIST */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-border font-h text-sm font-bold tracking-wider text-white">
                      Xsuit Gift List ({xsuitsList.length})
                    </div>
                    <div className="p-6 h-full">
                      {xsuitsList.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[100px]">
                          <span className="text-[10px] text-muted font-mono">No Xsuit Gifts listed yet.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {xsuitsList.map(xsuit => (
                            <div key={xsuit.id} className="p-4 border border-border rounded-xl flex items-center justify-between hover:bg-white/5 transition">
                              <div className="flex items-center gap-3">
                                {xsuit.imageUrl ? (
                                  <img src={xsuit.imageUrl} alt={xsuit.xsuitName} className="w-12 h-12 rounded-lg object-cover border border-border" />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center"><Zap size={16} className="text-muted"/></div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-white text-sm">{xsuit.xsuitName}</span>
                                  {xsuit.promoTag !== "None" && <span className="text-gold text-[10px] font-bold">{xsuit.promoTag}</span>}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-muted text-[11px] line-through font-mono">₹{parseFloat(xsuit.sellingPrice).toLocaleString("en-IN")}</span>
                                <span className="text-green-500 font-bold font-mono">₹{parseFloat(xsuit.offerPrice).toLocaleString("en-IN")}</span>
                                <div className="flex gap-2 mt-2">
                                  <button 
                                    onClick={() => {
                                      setEditingXsuit(xsuit);
                                      setXsuitForm({
                                        name: xsuit.xsuitName,
                                        sellingPrice: xsuit.sellingPrice,
                                        offerPrice: xsuit.offerPrice,
                                        tag: xsuit.promoTag,
                                        imageUrl: xsuit.imageUrl
                                      });
                                      setXsuitImageFile(null);
                                    }} 
                                    className="text-gold hover:text-white transition"
                                  >
                                    <Edit size={14}/>
                                  </button>
                                  <button onClick={() => handleDeleteXsuit(xsuit.id)} className="text-red-400 hover:text-white transition">
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                      <Gamepad2 size={16} /> {editingSupercar ? "Edit Supercar Gift" : "Add Supercar Gift"}
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={handleSupercarSubmit}>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">SUPERCAR NAME</label>
                        <input type="text" value={supercarForm.name} onChange={e => setSupercarForm({ ...supercarForm, name: e.target.value })} placeholder="e.g. Lamborghini Aventador" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">SELLING PRICE (MARKET PRICE) (₹)</label>
                        <input type="text" value={supercarForm.sellingPrice} onChange={e => setSupercarForm({ ...supercarForm, sellingPrice: e.target.value })} placeholder="e.g. 20000" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">OFFER PRICE (OUR PRICE) (₹)</label>
                        <input type="text" value={supercarForm.offerPrice} onChange={e => setSupercarForm({ ...supercarForm, offerPrice: e.target.value })} placeholder="e.g. 15000" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PROMO TAG</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "None", label: "None", icon: "" },
                            { id: "🔥 Hot", label: "Hot", icon: "🔥" },
                            { id: "⭐ Featured", label: "Featured", icon: "⭐" },
                            { id: "💎 Premium", label: "Premium", icon: "💎" },
                            { id: "⚡ Best Value", label: "Best Value", icon: "⚡" },
                            { id: "🎉 Deal of the Day", label: "Deal", icon: "🎉" }
                          ].map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => setSupercarForm({ ...supercarForm, tag: tag.id })}
                              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                supercarForm.tag === tag.id
                                  ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                  : "bg-black/20 border-border text-muted hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {tag.icon && <span>{tag.icon}</span>}
                              <span>{tag.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">CAR TYPE</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "1-Card", label: "1-Card", icon: CreditCard },
                            { id: "2-Card", label: "2-Card", icon: Sparkles },
                            { id: "3-Card", label: "3-Card", icon: Crown }
                          ].map((type) => {
                            const IconComp = type.icon;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setSupercarForm({ ...supercarForm, type: type.id })}
                                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                  supercarForm.type === type.id
                                    ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                    : "bg-black/20 border-border text-muted hover:border-white/20 hover:text-white"
                                }`}
                              >
                                <IconComp size={12} className={supercarForm.type === type.id ? "text-gold" : "text-muted"} />
                                <span>{type.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">APPLICABLE VEHICLE</label>
                        <div className="flex flex-col gap-2.5 bg-black/20 p-3 rounded-xl border border-border">
                          {/* UAZ Vehicles */}
                          <div>
                            <span className="text-[9px] font-bold text-gold/80 uppercase tracking-wider block mb-1 font-mono">UAZ</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: "UAZ", label: "UAZ" },
                                { id: "OPEN UAZ", label: "OPEN UAZ" }
                              ].map((veh) => (
                                <button
                                  key={veh.id}
                                  type="button"
                                  onClick={() => setSupercarForm({ ...supercarForm, applicableVehicle: veh.id })}
                                  className={`py-2 px-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    supercarForm.applicableVehicle === veh.id
                                      ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                      : "bg-black/30 border-border text-muted hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {veh.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sedan Vehicles */}
                          <div>
                            <span className="text-[9px] font-bold text-gold/80 uppercase tracking-wider block mb-1 font-mono">SEDAN</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: "Dacia", label: "Dacia" },
                                { id: "Mirado", label: "Mirado" },
                                { id: "Coupe", label: "Coupe" },
                                { id: "Roadster", label: "Roadster" }
                              ].map((veh) => (
                                <button
                                  key={veh.id}
                                  type="button"
                                  onClick={() => setSupercarForm({ ...supercarForm, applicableVehicle: veh.id })}
                                  className={`py-2 px-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    supercarForm.applicableVehicle === veh.id
                                      ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                      : "bg-black/30 border-border text-muted hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {veh.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Buggy */}
                          <div>
                            <span className="text-[9px] font-bold text-gold/80 uppercase tracking-wider block mb-1 font-mono">BUGGY</span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {[
                                { id: "Buggy", label: "Buggy" }
                              ].map((veh) => (
                                <button
                                  key={veh.id}
                                  type="button"
                                  onClick={() => setSupercarForm({ ...supercarForm, applicableVehicle: veh.id })}
                                  className={`py-2 px-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    supercarForm.applicableVehicle === veh.id
                                      ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                      : "bg-black/30 border-border text-muted hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {veh.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">SUPERCAR IMAGE</label>
                        <div className="flex flex-col gap-3">
                          {(supercarForm.imageUrl || supercarImageFile) ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-black/40">
                              <img 
                                src={supercarImageFile ? URL.createObjectURL(supercarImageFile) : supercarForm.imageUrl} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  setSupercarImageFile(null);
                                  setSupercarForm({ ...supercarForm, imageUrl: "" });
                                }}
                                className="absolute top-2 right-2 bg-black/60 text-red-400 hover:text-white p-1.5 rounded-full transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border rounded-xl cursor-pointer hover:bg-white/5 transition bg-black/20">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera size={24} className="text-muted mb-2" />
                                <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Upload Image</p>
                              </div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setSupercarImageFile(e.target.files[0]);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                      </div>
                      <button type="submit" className="btn btn-gold w-full mt-2 justify-center py-3" disabled={uploadingSupercarImage}>
                        {uploadingSupercarImage ? (
                          <>
                            <Loader2 size={16} className="animate-spin mr-2" />
                            UPLOADING...
                          </>
                        ) : (
                          editingSupercar ? "UPDATE CAR" : "SAVE CAR"
                        )}
                      </button>
                      {editingSupercar && (
                        <button 
                          type="button" 
                          onClick={resetSupercarForm}
                          className="btn bg-white/5 hover:bg-white/10 text-white w-full justify-center py-3 border border-border"
                          disabled={uploadingSupercarImage}
                        >
                          CANCEL EDIT
                        </button>
                      )}
                    </form>
                  </div>

                  {/* CAR LIST */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-border font-h text-sm font-bold tracking-wider text-white">
                      Supercar Gift List ({supercarsList.length})
                    </div>
                    <div className="p-6 h-full">
                      {supercarsList.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[100px]">
                          <span className="text-[10px] text-muted font-mono">No Supercars listed yet.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {supercarsList.map(car => (
                            <div key={car.id} className="p-4 border border-border rounded-xl flex items-center justify-between hover:bg-white/5 transition">
                              <div className="flex items-center gap-3">
                                {car.imageUrl ? (
                                  <img src={car.imageUrl} alt={car.supercarName} className="w-12 h-12 rounded-lg object-cover border border-border" />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center"><Car size={16} className="text-muted"/></div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-white text-sm">{car.supercarName}</span>
                                  <div className="flex gap-1.5 items-center flex-wrap">
                                    <span className="text-muted text-[9px] uppercase font-semibold">{car.carType}</span>
                                    {car.promoTag !== "None" && <span className="text-gold text-[9px] font-bold">{car.promoTag}</span>}
                                    <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      {car.applicableVehicle || "UAZ"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-muted text-[11px] line-through font-mono">₹{parseFloat(car.sellingPrice).toLocaleString("en-IN")}</span>
                                <span className="text-green-500 font-bold font-mono">₹{parseFloat(car.offerPrice).toLocaleString("en-IN")}</span>
                                <div className="flex gap-2 mt-2">
                                  <button 
                                    onClick={() => {
                                      setEditingSupercar(car);
                                      setSupercarForm({
                                        name: car.supercarName,
                                        sellingPrice: car.sellingPrice,
                                        offerPrice: car.offerPrice,
                                        type: car.carType,
                                        tag: car.promoTag,
                                        imageUrl: car.imageUrl,
                                        applicableVehicle: car.applicableVehicle || "UAZ"
                                      });
                                      setSupercarImageFile(null);
                                    }} 
                                    className="text-gold hover:text-white transition"
                                  >
                                    <Edit size={14}/>
                                  </button>
                                  <button onClick={() => handleDeleteSupercar(car.id)} className="text-red-400 hover:text-white transition">
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* ==============================================================
                  TAB: PROOFS
                  ============================================================== */}
              {activeTab === "proofs" && (
                <div className="flex flex-col gap-6">
                  <form className="glass-panel rounded-2xl p-6 shadow-xl" onSubmit={handleProofSubmit}>
                    <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider text-sm font-h">
                      <Camera size={16} /> Upload New Proof
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Metadata inputs & Category selector */}
                      <div className="lg:col-span-2 flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">TITLE</label>
                            <input 
                              type="text" 
                              value={proofForm.title} 
                              onChange={e => setProofForm({ ...proofForm, title: e.target.value })} 
                              placeholder="e.g. Middleman Verification Details" 
                              className="input-field font-sans" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">TRANSACTION ID (OPTIONAL)</label>
                            <input 
                              type="text" 
                              value={proofForm.transactionId} 
                              onChange={e => setProofForm({ ...proofForm, transactionId: e.target.value })} 
                              placeholder="e.g. MBSA403" 
                              className="input-field font-sans" 
                            />
                          </div>
                        </div>

                        {/* Category selection */}
                        <div>
                          <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PROOF TYPE / CATEGORY</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {[
                              { value: "Payment", label: "Payment", icon: Coins },
                              { value: "Account Sale", label: "Account Sale", icon: ShieldCheck },
                              { value: "Gift Gifting", label: "Gift Gifting", icon: Gift },
                              { value: "Middleman", label: "Middleman", icon: BadgeCheck },
                              { value: "Exchange", label: "Exchange", icon: RefreshCw },
                              { value: "Other", label: "Other", icon: Camera }
                            ].map((cat) => {
                              const IconComp = cat.icon;
                              const isActive = proofForm.category === cat.value;
                              return (
                                <button
                                  key={cat.value}
                                  type="button"
                                  onClick={() => setProofForm({ ...proofForm, category: cat.value })}
                                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all select-none cursor-pointer ${
                                    isActive
                                      ? "bg-gold/15 border-gold text-gold font-extrabold shadow-md shadow-gold/5"
                                      : "bg-black/20 border-border text-muted hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  <IconComp size={11} className={isActive ? "text-gold" : "text-muted"} />
                                  <span>{cat.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Image Upload Box */}
                        <div>
                          <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">PROOF IMAGE</label>
                          <div className="flex flex-col gap-3">
                            {(proofForm.imageUrl || proofImageFile) ? (
                              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-black/40">
                                <img 
                                  src={proofImageFile ? URL.createObjectURL(proofImageFile) : proofForm.imageUrl} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setProofImageFile(null);
                                    setProofForm({ ...proofForm, imageUrl: "" });
                                  }}
                                  className="absolute top-2 right-2 bg-black/60 text-red-400 hover:text-white p-1.5 rounded-full transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border rounded-xl cursor-pointer hover:bg-white/5 transition bg-black/20">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Camera size={24} className="text-muted mb-2" />
                                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Upload Image File</p>
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setProofImageFile(e.target.files[0]);
                                    }
                                  }}
                                  className="hidden" 
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Date Selection */}
                      <div className="lg:col-span-1">
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">DEAL DATE (MONTH & YEAR)</label>
                        <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col gap-3.5">
                          {/* Years Row */}
                          <div className="flex gap-2 items-center">
                            <span className="text-[9px] text-muted font-bold uppercase tracking-wider mr-2">Year:</span>
                            {["2025", "2026", "2027"].map((y) => (
                              <button
                                key={y}
                                type="button"
                                onClick={() => setProofForm({ ...proofForm, year: y })}
                                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border select-none cursor-pointer ${
                                  proofForm.year === y
                                    ? "bg-gold/15 border-gold text-gold font-extrabold"
                                    : "bg-white/2 border-white/5 text-muted hover:text-white"
                                }`}
                              >
                                {y}
                              </button>
                            ))}
                          </div>
                          {/* Months Grid */}
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                            ].map((m) => {
                              const label = m.substring(0, 3);
                              const isSelected = proofForm.month === m;
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setProofForm({ ...proofForm, month: m })}
                                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border text-center select-none cursor-pointer ${
                                    isSelected
                                      ? "bg-gold/15 border-gold text-gold font-extrabold"
                                      : "bg-white/2 border-white/5 text-muted hover:text-white"
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-start">
                      <button 
                        type="submit" 
                        className="btn btn-gold w-48 justify-center py-3.5 text-xs font-bold tracking-wider"
                        disabled={uploadingProofImage}
                      >
                        {uploadingProofImage ? (
                          <>
                            <Loader2 size={14} className="animate-spin mr-2" />
                            UPLOADING...
                          </>
                        ) : (
                          "UPLOAD PROOF"
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col">
                    <div className="mb-6 border-b border-border pb-4 font-h text-sm font-bold tracking-wider text-white">
                      Proof Gallery ({proofsList.length})
                    </div>
                    {proofsList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center min-h-75">
                        <Camera size={48} className="text-white/5 mb-4" />
                        <p className="text-[11px] text-muted font-mono">No proofs uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {proofsList.map(proof => {
                          const catStyles: Record<string, { color: string, bg: string }> = {
                            "Payment": { color: "#ffd700", bg: "rgba(255,215,0,0.1)" },
                            "Account Sale": { color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
                            "Gift Gifting": { color: "#ff9f43", bg: "rgba(255,159,67,0.1)" },
                            "Middleman": { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
                            "Exchange": { color: "#ff7f50", bg: "rgba(255,127,80,0.1)" }
                          };
                          const currentStyle = catStyles[proof.category] || { color: "#a4b0be", bg: "rgba(164,176,190,0.1)" };

                          return (
                            <div key={proof.id} className="relative group rounded-xl overflow-hidden border border-border bg-black/40 flex flex-col justify-between">
                              <div className="relative aspect-square md:h-32 w-full overflow-hidden border-b border-border">
                                <img src={proof.imageUrl} alt={proof.title || "Deal Proof"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 z-10">
                                  <a href={proof.imageUrl} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition" title="Open Full Image">
                                    <ExternalLink size={14} />
                                  </a>
                                  <button onClick={() => handleDeleteProof(proof.id)} className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-lg transition" title="Delete Proof">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                
                                {/* Category Badge */}
                                <div className="absolute top-2 left-2 z-20">
                                  <span 
                                    className="text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                    style={{
                                      color: currentStyle.color,
                                      backgroundColor: currentStyle.bg,
                                      borderColor: `${currentStyle.color}20`
                                    }}
                                  >
                                    {proof.category || "Payment"}
                                  </span>
                                </div>

                                {/* Transaction ID if present */}
                                {proof.transactionId && (
                                  <div className="absolute top-2 right-2 z-20 bg-black/70 border border-white/10 rounded px-1.5 py-0.5 text-[7px] text-white font-mono uppercase font-black">
                                    #{proof.transactionId}
                                  </div>
                                )}
                              </div>
                              <div className="p-3 bg-[#10121a]/80 flex flex-col gap-0.5">
                                <p className="text-[10px] text-white font-bold truncate leading-tight">{proof.title || "Deal Proof"}</p>
                                <p className="text-[8.5px] text-gold font-mono uppercase tracking-wider">{proof.month} {proof.year}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
                      <span className="text-3xl font-black font-h text-gold mb-1">{averageRating.toFixed(1)} / 5 ★</span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">AVG RATING</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-white mb-1">{reviewsList.length}</span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">TOTAL SUBMISSIONS</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-green-500 mb-1">{approvedReviews.length}</span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">APPROVED</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-orange-500 mb-1">{reviewsList.filter(r => r.status === 'pending').length}</span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">PENDING</span>
                    </div>
                  </div>

                  {/* SEARCH & FILTERS */}
                  <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
                    <div className="relative w-full md:w-80">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Search size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder="Search author name or comments..."
                        value={reviewSearch}
                        onChange={(e) => {
                          setReviewSearch(e.target.value);
                          setReviewPage(0);
                        }}
                        className="input-field pl-9 text-xs py-2 w-full"
                      />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <div className="w-1/2 md:w-36">
                        <select
                          value={reviewStatusFilter}
                          onChange={(e) => {
                            setReviewStatusFilter(e.target.value);
                            setReviewPage(0);
                          }}
                          className="input-field text-xs py-2 h-fit w-full"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="w-1/2 md:w-36">
                        <select
                          value={reviewRatingFilter}
                          onChange={(e) => {
                            setReviewRatingFilter(Number(e.target.value));
                            setReviewPage(0);
                          }}
                          className="input-field text-xs py-2 h-fit w-full"
                        >
                          <option value={0}>All Ratings</option>
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                      {(reviewSearch || reviewStatusFilter !== "all" || reviewRatingFilter !== 0) && (
                        <button
                          onClick={() => {
                            setReviewSearch("");
                            setReviewStatusFilter("all");
                            setReviewRatingFilter(0);
                            setReviewPage(0);
                          }}
                          className="btn bg-white/5 border border-border text-xs px-3 hover:bg-white/10"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-100">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
                      <span className="font-h text-[13px] font-bold text-white tracking-wider">Review Management</span>
                      <span className="text-[10px] text-muted font-mono">Reviews submitted by buyers - No manual entries</span>
                    </div>
                    {paginatedReviews.length > 0 ? (
                      <div className="flex flex-col">
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
                              {paginatedReviews.map((rev) => (
                                <tr key={rev.id}>
                                  <td className="font-semibold text-white">{rev.name}</td>
                                  <td className="font-bold text-gold font-mono">{rev.rating} / 5 ★</td>
                                  <td className="max-w-75 text-xs text-[#eaeaea]">
                                    {(rev.comment && rev.comment.length > 60) ? (
                                      <div className="flex flex-col gap-1 items-start">
                                        <span className="truncate max-w-full">{rev.comment.substring(0, 60)}...</span>
                                        <button 
                                          onClick={() => setSelectedFullReview(rev)}
                                          className="text-[10px] text-gold font-bold hover:underline"
                                        >
                                          Read Full
                                        </button>
                                      </div>
                                    ) : (
                                      rev.comment || "No comment left"
                                    )}
                                  </td>
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
                                  <td className="text-xs text-muted">{new Date(rev.createdAt).toLocaleDateString()}</td>
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
                        {/* Pagination controls */}
                        {reviewTotalPages > 1 && (
                          <div className="p-4 border-t border-border flex justify-between items-center bg-black/10 mx-4 mb-4 rounded-xl border border-border">
                            <button
                              onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                              disabled={reviewPage === 0}
                              className="btn bg-white/5 border border-border text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-white/10 py-1.5 px-3 rounded-lg text-xs"
                            >
                              Previous
                            </button>
                            <span className="text-xs text-muted font-mono">
                              Page {reviewPage + 1} of {reviewTotalPages} (Showing {filteredReviews.length} total)
                            </span>
                            <button
                              onClick={() => setReviewPage(p => Math.min(reviewTotalPages - 1, p + 1))}
                              disabled={reviewPage >= reviewTotalPages - 1}
                              className="btn bg-white/5 border border-border text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-white/10 py-1.5 px-3 rounded-lg text-xs"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center grow opacity-60 py-12">
                        <MessageSquare size={36} className="text-muted mb-4" />
                        <span className="text-[11px] text-muted font-mono">
                          {reviewsList.length === 0 
                            ? "No buyer reviews yet. Share your review link after each successful deal." 
                            : "No reviews match the selected filters."}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expandable full comment modal */}
                  {selectedFullReview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                      <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden border border-gold/30 shadow-2xl p-6 relative">
                        <button
                          onClick={() => setSelectedFullReview(null)}
                          className="absolute top-4 right-4 text-muted hover:text-white transition"
                        >
                          <X size={18} />
                        </button>
                        <h4 className="font-h text-sm font-bold text-white tracking-wider mb-4 uppercase text-gold">
                          Full Review Details
                        </h4>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center pb-3 border-b border-border">
                            <div>
                              <div className="font-bold text-white text-sm">{selectedFullReview.name}</div>
                              <div className="text-[10px] text-muted font-mono">{new Date(selectedFullReview.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="text-gold font-bold text-sm font-mono">{selectedFullReview.rating} / 5 ★</div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1">Status</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                              selectedFullReview.status === "approved" 
                                ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                : selectedFullReview.status === "pending" 
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {selectedFullReview.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Comment</span>
                            <p className="text-xs text-white/90 leading-relaxed font-mono bg-white/2 p-3 rounded-lg border border-white/5 break-words max-h-60 overflow-y-auto">
                              {selectedFullReview.comment || "No comment left"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                      <div className="w-32 h-32 rounded-full border-[6px] border-gold flex flex-col items-center justify-center mb-6">
                         <span className="text-[40px] font-black font-h text-white leading-none">5.0</span>
                         <span className="text-[10px] font-bold text-gold uppercase tracking-widest mt-1">STORE CSAT</span>
                      </div>
                      <h3 className="text-white font-bold text-[13px] tracking-wider font-h mb-2">Constructive CSAT Index</h3>
                      <p className="text-[11px] text-muted font-mono text-center max-w-62.5">Calculated from {feedbackList.length} store improvement ratings.</p>
                    </div>
                    {/* CRM ACTION CENTER */}
                    <div className="glass-panel rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center gap-2 mb-6 text-white font-bold tracking-wider text-sm font-h border-b border-white/5 pb-4">
                        <Users size={16} className="text-gold" /> CRM Action Center
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black font-h text-red-500 mb-2">{feedbackList.filter(f => f.status === 'unread').length}</span>
                          <span className="text-[9px] font-bold text-muted tracking-widest uppercase">UNREAD FEEDBACK</span>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-6 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black font-h text-emerald-500 mb-2">{feedbackList.filter(f => f.status !== 'unread').length}</span>
                          <span className="text-[9px] font-bold text-muted tracking-widest uppercase">READ / PROCESSED</span>
                        </div>
                      </div>
                      <div className="bg-gold-dim border border-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.05)] border-dashed rounded-lg p-3 text-[10px] text-muted leading-relaxed">
                        <span className="text-gold font-bold">💡 What Customers Want:</span> Review specific requested items in cards below. Click the WhatsApp button to fulfill requests directly!
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-75">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
                      <span className="font-h text-[13px] font-bold text-white tracking-wider flex items-center gap-2"><MessageSquare size={14} className="text-blue-400"/> Customer Feedback Registry</span>
                      <span className="text-[10px] text-muted font-mono">{feedbackList.length} submitted suggestions</span>
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
                                <td className="font-bold text-gold font-mono">{fb.stars} ★</td>
                                <td className="max-w-62.5 truncate text-xs">{fb.comment}</td>
                                <td className="text-xs text-muted">{fb.desiredItems || "—"}</td>
                                <td>
                                  <div className="flex flex-col">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider w-fit ${
                                      fb.status === "unread" 
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                        : "bg-white/5 text-muted border border-white/10"
                                    }`}>
                                      {fb.status}
                                    </span>
                                    {fb.status !== "unread" && fb.readBy && (
                                      <span className="text-[8px] text-muted font-mono mt-1 font-semibold max-w-[120px] truncate" title={`Read by: ${fb.readBy}`}>
                                        by {fb.readBy}
                                      </span>
                                    )}
                                  </div>
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
                                    <button onClick={() => handleFeedbackStatus(fb.id, "archived")} className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition" title="Archive Log">
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
                      <div className="flex flex-col items-center justify-center grow opacity-60 mt-10">
                         <span className="text-[11px] text-muted font-mono">No customer feedbacks submitted yet. Share the link <span className="text-gold font-bold">/feedback</span> with your clients to start collecting suggestions!</span>
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
                  {/* DEFAULT PAYMENT DETAILS */}
                  <div className="glass-panel rounded-2xl p-6 shadow-xl">
                    {isSettingsCollapsed ? (
                      <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold tracking-wider text-sm font-h">
                          <Zap size={16} className="text-gold animate-pulse" /> DEFAULT PAYMENT DETAILS
                          <span className="text-[10px] text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded border border-green-500/20 font-normal">
                            Active Payee: {paymentSettings.payeeName || "Not Configured"} ({paymentSettings.payeeUpiId || "No UPI"})
                          </span>
                        </div>
                        <button 
                          onClick={() => setIsSettingsCollapsed(false)} 
                          className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-md text-[10px] font-bold tracking-wider uppercase transition"
                        >
                          Modify Details
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                          <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm font-h">
                            <Zap size={16} className="text-gold" /> DEFAULT PAYMENT DETAILS
                          </div>
                          <button 
                            onClick={() => setIsSettingsCollapsed(true)} 
                            className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-md text-[10px] font-bold tracking-wider uppercase transition"
                          >
                            Collapse
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">PAYEE NAME (EDIT)</label>
                              <input 
                                type="text" 
                                placeholder="MATHEESWARAN R" 
                                className="input-field" 
                                value={paymentSettings.payeeName || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, payeeName: e.target.value })} 
                              />
                           </div>
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">PAYEE UPI ID (EDIT)</label>
                              <input 
                                type="text" 
                                placeholder="maddyxpay@ybl" 
                                className="input-field" 
                                value={paymentSettings.payeeUpiId || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, payeeUpiId: e.target.value })} 
                              />
                           </div>
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">BANK DETAILS ACCESS PIN (OPTIONAL)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 1536" 
                                className="input-field" 
                                value={paymentSettings.defaultPin || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, defaultPin: e.target.value })} 
                              />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">BANK NAME</label>
                              <input 
                                type="text" 
                                placeholder="FEDERAL BANK" 
                                className="input-field" 
                                value={paymentSettings.bankName || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })} 
                              />
                           </div>
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">ACCOUNT HOLDER NAME</label>
                              <input 
                                type="text" 
                                placeholder="MATHESHWARAN R" 
                                className="input-field" 
                                value={paymentSettings.accountHolder || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, accountHolder: e.target.value })} 
                              />
                           </div>
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">ACCOUNT NUMBER</label>
                              <input 
                                type="text" 
                                placeholder="23550100026910" 
                                className="input-field" 
                                value={paymentSettings.accountNumber || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })} 
                              />
                           </div>
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">IFSC CODE</label>
                              <input 
                                type="text" 
                                placeholder="FDRL0002355" 
                                className="input-field" 
                                value={paymentSettings.ifscCode || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, ifscCode: e.target.value })} 
                              />
                           </div>
                           <div>
                              <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">BRANCH</label>
                              <input 
                                type="text" 
                                placeholder="Alagusenai" 
                                className="input-field" 
                                value={paymentSettings.branch || ""} 
                                onChange={e => setPaymentSettings({ ...paymentSettings, branch: e.target.value })} 
                              />
                           </div>
                        </div>
                        <button onClick={handleSavePaymentSettings} className="btn btn-gold w-56 justify-center py-2.5 text-[10px]">SAVE PAYMENT DETAILS</button>
                      </>
                    )}
                  </div>                    {/* Payment Link Generator */}
                  <div className="glass-panel rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm font-h">
                        <Zap size={16} className="text-gold" /> Payment Link Generator
                      </div>
                      <span className="text-[9px] font-mono text-muted">SECURE CHECKOUT GENERATION</span>
                    </div>
                    <form onSubmit={handleCreatePayLink} className="flex flex-col gap-5">
                      {/* Transaction Type Selectable Chips */}
                      <div>
                        <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">TRANSACTION TYPE</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {[
                            { value: "Account", label: "Account", prefix: "MBSA" },
                            { value: "UC", label: "UC Purchase", prefix: "MBSU" },
                            { value: "Xsuit", label: "X-Suit Gift", prefix: "MBSX" },
                            { value: "Supercar", label: "Supercar Gift", prefix: "MBSC" },
                            { value: "Other", label: "Custom / Other", prefix: "MBSO" },
                          ].map(opt => {
                            const isSelected = payLinkForm.transactionType === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setPayLinkForm(prev => ({
                                    ...prev,
                                    transactionType: opt.value,
                                    transactionId: generateTxnId(opt.value, prev.customType)
                                  }));
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                                  isSelected
                                    ? "bg-gold/10 border-gold text-gold"
                                    : "bg-white/5 border-white/10 text-muted hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {opt.label} ({opt.prefix})
                              </button>
                            );
                          })}
                        </div>
                        {payLinkForm.transactionType === "Other" && (
                          <div className="mt-3 w-full max-w-xs">
                            <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">CUSTOM TYPE NAME</label>
                            <input
                              type="text"
                              placeholder="e.g. Gift Pack"
                              className="input-field border-white/20 font-bold"
                              value={payLinkForm.customType}
                              onChange={e => {
                                const customVal = e.target.value;
                                setPayLinkForm(prev => ({
                                  ...prev,
                                  customType: customVal,
                                  transactionId: generateTxnId("Other", customVal)
                                }));
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">TRANSACTION ID</label>
                          <input 
                            type="text" 
                            required
                            value={payLinkForm.transactionId}
                            onChange={e => setPayLinkForm(prev => ({ ...prev, transactionId: e.target.value }))}
                            className="input-field text-white font-bold bg-white/5 border-white/20 font-mono" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">CUSTOMER NAME</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={payLinkForm.customerName}
                              onChange={e => setPayLinkForm({ ...payLinkForm, customerName: e.target.value })}
                              placeholder="e.g. Surya" 
                              className="input-field pl-8 border-white/20" 
                            />
                            <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">AMOUNT (₹)</label>
                          <input 
                            type="number" 
                            required
                            value={payLinkForm.amount}
                            onChange={e => setPayLinkForm({ ...payLinkForm, amount: e.target.value })}
                            placeholder="₹ 0.00" 
                            className="input-field text-gold font-bold border-white/20" 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">EXPIRY TIME</label>
                          <select 
                            value={payLinkForm.expiresHours}
                            onChange={e => setPayLinkForm({ ...payLinkForm, expiresHours: Number(e.target.value) })}
                            className="input-field border-white/20"
                          >
                            <option value={0.0833}>5 Minutes</option>
                            <option value={0.1667}>10 Minutes</option>
                            <option value={0.25}>15 Minutes</option>
                            <option value={0.5}>30 Minutes</option>
                            <option value={0.75}>45 Minutes</option>
                            <option value={1}>60 Minutes (1 Hour)</option>
                            <option value={1.25}>75 Minutes (1h 15m)</option>
                            <option value={1.5}>90 Minutes (1h 30m)</option>
                            <option value={1.75}>105 Minutes (1h 45m)</option>
                            <option value={2}>120 Minutes (2 Hours)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">ACCESS PIN (OPTIONAL)</label>
                           <div className="relative">
                             <input 
                               type="text" 
                               maxLength={6}
                               value={payLinkForm.pin}
                               onChange={e => setPayLinkForm({ ...payLinkForm, pin: e.target.value.replace(/[^0-9]/g, "") })}
                               placeholder="None" 
                               className="input-field pl-8 border-white/20" 
                             />
                             <ShieldAlert size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                           </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted font-bold uppercase tracking-wider mb-2">PAYMENT NOTE / REFERENCE</label>
                          <input 
                            type="text" 
                            value={payLinkForm.note}
                            onChange={e => setPayLinkForm({ ...payLinkForm, note: e.target.value })}
                            placeholder="e.g. Account Purchase - Level 75..." 
                            className="input-field border-white/20" 
                          />
                        </div>
                      </div>
 
                      <button type="submit" className="btn btn-gold w-full justify-center py-3 mt-2 text-[11px] uppercase">
                         <Zap size={14} /> GENERATE SECURE PAYMENT LINK
                      </button>
                    </form>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-gold mb-1">{paymentLinksList.length}</span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">TOTAL</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-emerald-500 mb-1">
                        {paymentLinksList.filter(l => l.status === 'active' && new Date(l.expiresAt) > new Date()).length}
                      </span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">ACTIVE</span>
                    </div>
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black font-h text-red-500 mb-1">
                        {paymentLinksList.filter(l => l.status === 'revoked').length}
                      </span>
                      <span className="text-[10px] font-bold text-muted tracking-widest uppercase">REVOKED</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-75">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-black/20">
                      <span className="font-h text-[13px] font-bold text-white tracking-wider flex items-center gap-2">Master Payment Registry</span>
                      <span className="text-[10px] text-muted font-mono">{paymentLinksList.length} total links</span>
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
                            {paymentLinksList.map((link) => {
                              const isExpired = link.status === "active" && new Date(link.expiresAt) < new Date();
                              const finalStatus = isExpired ? "expired" : link.status;

                              return (
                                <tr key={link.id}>
                                  <td>
                                    <strong className="text-gold text-xs font-mono">#{link.transactionId}</strong>
                                  </td>
                                  <td>
                                    {finalStatus === "active" ? (
                                      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                        ACTIVE
                                      </span>
                                    ) : finalStatus === "expired" ? (
                                      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                                        EXPIRED
                                      </span>
                                    ) : finalStatus === "paid" ? (
                                      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                                        PAID
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                                        REVOKED
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <strong className="text-muted uppercase text-xs tracking-wider">{link.customerName}</strong>
                                  </td>
                                  <td className="font-bold text-emerald-500 font-mono">₹{Number(link.amount).toLocaleString("en-IN")}</td>
                                  <td>
                                    <LinkTimer expiresAt={link.expiresAt} status={finalStatus} />
                                  </td>
                                  <td>
                                    <div className="flex gap-1.5 font-sans">
                                      <button 
                                        onClick={() => viewPayLinkCheckout(link.id)} 
                                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-sky-400 hover:bg-white/10 transition text-[9px] font-bold tracking-wider flex items-center gap-1"
                                      >
                                        <Eye size={11} /> VIEW
                                      </button>
                                      <button 
                                        onClick={() => copyPayLinkCheckout(link.id)} 
                                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gold hover:bg-white/10 transition text-[9px] font-bold tracking-wider flex items-center gap-1"
                                      >
                                        <Copy size={11} /> COPY
                                      </button>
                                      {finalStatus === "active" && (
                                        <button 
                                          onClick={() => handleMarkAsPaid(link.id)} 
                                          className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-md text-emerald-400 transition text-[9px] font-bold tracking-wider flex items-center gap-1"
                                          title="Mark payment as successfully completed"
                                        >
                                          <CheckCircle size={11} /> SUCCESS
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleRevokePayLink(link.id)} 
                                        disabled={finalStatus !== "active"}
                                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-amber-500 hover:bg-white/10 transition text-[9px] font-bold tracking-wider flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <Slash size={11} /> REVOKE
                                      </button>
                                      <button 
                                        onClick={() => handleDeletePayLink(link.id)} 
                                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-red-400 hover:bg-white/10 transition text-[9px] font-bold tracking-wider flex items-center gap-1"
                                      >
                                        <Trash2 size={11} /> DELETE
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center grow opacity-60 mt-10">
                        <span className="text-[11px] text-muted font-mono">No payment links generated.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: ACTIVITY LOG
                  ============================================================== */}
              {activeTab === "activity_log" && (
                <div className="glass-panel rounded-2xl p-8 shadow-xl min-h-150">
                  <div className="flex items-center gap-2 mb-8 text-white font-bold tracking-wider text-sm font-h border-b border-white/5 pb-4">
                    <RefreshCw size={16} className="text-gold" /> Admin Activity Audit Trail
                  </div>
                  
                  <div className="flex flex-col gap-8 relative pl-6 border-l-2 border-white/10">
                    {activityLogsList.length > 0 ? (
                      activityLogsList.map((log) => (
                        <div className="relative" key={log.id}>
                          <div className="absolute -left-7.75 top-1 w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_var(--color-gold)]"></div>
                          <h4 className="text-sm font-bold text-white mb-1">{log.description}</h4>
                          <p className="text-[10px] text-muted font-mono flex flex-wrap items-center gap-1.5">
                            <span>Logged by</span>
                            <span className="text-white font-semibold">{log.adminEmail}</span>
                            {log.adminRole && (
                              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded font-mono ${
                                log.adminRole === "SUPER_ADMIN"
                                  ? "text-gold bg-gold/10 border border-gold/20"
                                  : log.adminRole === "ADMIN"
                                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/20"
                                  : log.adminRole === "TRANSACTION_MANAGER"
                                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                  : "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                              }`}>
                                {log.adminRole.replace("_", " ")}
                              </span>
                            )}
                            <span>•</span>
                            <span>{new Date(log.createdAt).toLocaleString()}</span>
                            <span>•</span>
                            <span>Action:</span>
                            <span className="text-gold font-semibold uppercase">{log.actionType}</span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-muted font-mono opacity-60">No activity logs found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB: ADMIN CONTROLS
                  ============================================================== */}
              {activeTab === "admin_controls" && isSuperAdmin && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ADD NEW ADMIN */}
                  <div className="col-span-1 glass-panel rounded-2xl p-6 shadow-xl h-fit">
                    <div className="flex items-center gap-2 mb-6 text-gold font-bold tracking-wider text-sm font-h">
                      <Key size={16} /> Add New Admin
                    </div>
                    <form className="flex flex-col gap-5" onSubmit={handleAddAdmin}>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">ADMIN EMAIL ADDRESS</label>
                        <div className="relative">
                           <input 
                            type="email" 
                            placeholder="e.g. sethu@mbsx.store" 
                            className="input-field pl-9" 
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                          />
                          <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted font-bold uppercase tracking-wider mb-2">ASSIGN ROLE & PRIVILEGES</label>
                        <select 
                          value={newAdminRole}
                          onChange={(e) => setNewAdminRole(e.target.value)}
                          className="input-field border-white/20 font-bold"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER ADMIN</option>
                          <option value="TRANSACTION_MANAGER">TRANSACTION MANAGER</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-gold w-full justify-center py-3 text-[11px]">AUTHORIZE ADMIN</button>
                    </form>
                    
                    <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-[10px] text-muted leading-relaxed">
                      <div className="font-bold text-blue-400 mb-1 flex items-center gap-1"><ShieldAlert size={12} /> Security Note:</div>
                      Adding an email creates/assigns a verified <strong className="text-white">admin custom claim</strong> in Clerk Auth. The new administrator can log in directly and manage all aspects of the transaction panel securely.
                    </div>
                  </div>

                  {/* ACTIVE ADMINISTRATORS */}
                  <div className="col-span-2 glass-panel rounded-2xl p-6 shadow-xl h-fit">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm font-h">
                        <ShieldAlert size={16} className="text-gold" /> Active Administrators
                      </div>
                      <button onClick={triggerRefresh} className="text-[9px] font-bold border border-white/10 px-4 py-1.5 rounded hover:bg-white/5 transition text-white uppercase tracking-wider">
                        REFRESH LIST
                      </button>
                    </div>
                    
                    <div className="table-wrap">
                      <table className="admin-table text-left w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="py-3 px-4 text-[9px] font-bold text-muted uppercase tracking-wider">EMAIL ADDRESS</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-muted uppercase tracking-wider">ROLE & CLAIM</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-muted uppercase tracking-wider">ADDED DATE</th>
                            <th className="py-3 px-4 text-[9px] font-bold text-muted uppercase tracking-wider text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeAdminsList.map((admin) => (
                            <tr className="border-b border-white/5 hover:bg-white/5 transition group" key={admin.id}>
                              <td className="py-4 px-4 text-xs text-white font-semibold">{admin.email}</td>
                              <td className="py-4 px-4">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded font-mono ${
                                  admin.role === "SUPER_ADMIN"
                                    ? "text-gold bg-gold/10 border border-gold/20"
                                    : admin.role === "ADMIN"
                                    ? "text-sky-400 bg-sky-500/10 border border-sky-500/20"
                                    : admin.role === "TRANSACTION_MANAGER"
                                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                    : "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                                }`}>
                                  {admin.role.replace("_", " ")}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[10px] text-muted font-mono">{admin.addedDate}</td>
                              <td className="py-4 px-4 text-right">
                                {["contact@maddybgmistore.in", "maddybgmistoreog@gmail.com", "r.mateshwaran.io@gmail.com"].includes(admin.email) ? (
                                  <span className="text-[9px] font-bold text-red-900 px-4 py-1.5 uppercase tracking-wider cursor-not-allowed">
                                    REVOKE
                                  </span>
                                ) : (
                                  <button onClick={() => handleRevokeAdmin(admin.id)} className="text-[9px] font-bold border border-red-500/20 text-red-400 px-4 py-1.5 rounded hover:bg-red-500 hover:text-white transition uppercase tracking-wider">
                                    REVOKE
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
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
