/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X, Menu } from "lucide-react";
import { UserButton, SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

const navLinks = [
  { to: "/", label: "Home" },
  {
    label: "Accounts",
    subLinks: [
      { to: "/buy", label: "Buy" },
      { to: "/sell", label: "Sell" },
      { to: "/exchange", label: "Exchange" },
    ],
  },
  {
    label: "In-Game",
    subLinks: [
      { to: "/services/uc", label: "UC Purchase" },
      { to: "/services/xsuit", label: "X-Suit Gift" },
      { to: "/services/supercar", label: "Supercar Gift" },
    ],
  },
  {
    label: "Reviews",
    subLinks: [
      { to: "/reviews", label: "Buyer Reviews" },
      { to: "/proofs", label: "Proof & Feedback" },
      { to: "/feedback", label: "Customer Feedback" },
    ],
  },
  { to: "/connectwithus", label: "Connect" },
  { to: "/terms", label: "Terms & Conditions" },
];

const tickerItems = [
  { text: "Safe & Verified Accounts", emoji: "🛡️" },
  { text: "2000+ Happy Buyers", emoji: "👑" },
  { text: "₹60 Lakhs+ Worth Sold", emoji: "💰" },
  { text: "Secure Single Logins", emoji: "🔒" },
  { text: "UPI · Bank · USDT · Cash", emoji: "💳" },
  { text: "Trusted Since 2019", emoji: "🌟" },
  { text: "Budget to Premium Range", emoji: "⚡" },
  { text: "Face-to-Face Deals Available", emoji: "🤝" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const navRef = useRef<HTMLElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded({});
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const userRole = user?.publicMetadata?.role as string || "USER";
  const isPermanentAdmin = user?.primaryEmailAddress?.emailAddress === "maddybgmistoreog@gmail.com";
  const isAdmin = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER", "CONTENT_MANAGER"].includes(userRole);
  const displayRole = isPermanentAdmin ? "SUPER ADMIN" : userRole.replace("_", " ");

  const doubled = [...tickerItems, ...tickerItems];

  const deskLinkStyle = "text-gray-300 hover:text-white font-sans text-[14px] font-medium tracking-wide px-4 py-2 transition-colors duration-200 inline-flex items-center cursor-pointer whitespace-nowrap rounded-full hover:bg-white/5";
  const activeLinkStyle = "text-white bg-white/10";

  const mobileLinkStyle = "text-gray-300 text-[15px] font-sans font-medium px-4 py-3.5 rounded-xl block transition-colors duration-150 hover:bg-white/5";

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8, 10, 15, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid transparent",
        boxShadow: scrolled ? "0 10px 30px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      {/* ── Main Nav Bar ── */}
      <nav className="flex items-center justify-between h-[64px] px-[5%] max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/logo.png"
            alt="Maddy BGMI Store"
            className="h-[38px] w-auto"
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-1.5 list-none m-0 p-0">
          {navLinks.map((l) => (
            <li key={l.label || l.to} className="relative group/nav py-3">
              {l.subLinks ? (
                <>
                  <div className={`${deskLinkStyle} group-hover/nav:text-white group-hover/nav:bg-white/5`}>
                    {l.label}
                    <ChevronDown
                      size={14}
                      className="ml-1 opacity-60 flex-shrink-0 transition-transform group-hover/nav:rotate-180"
                    />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 hidden group-hover/nav:block bg-[#111520]/80 backdrop-blur-2xl border border-white/10 rounded-[18px] p-2 min-w-[200px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] animate-fade-in before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 z-50">
                    {l.subLinks.map((s) => (
                      <Link
                        key={s.to}
                        href={s.to}
                        className={`block px-4 py-2.5 text-[14px] font-sans font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-[10px] transition-all duration-150 ${
                          pathname === s.to ? "text-white bg-white/10" : ""
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={l.to}
                  className={`${deskLinkStyle} ${
                    pathname === l.to ? activeLinkStyle : ""
                  }`}
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}

          {isAdmin && (
            <li className="relative group/adminNav py-3 ml-2">
              <div className={`${deskLinkStyle} text-white font-semibold group-hover/adminNav:bg-white/5`}>
                Manage <ChevronDown size={14} className="ml-1 opacity-60 transition-transform group-hover/adminNav:rotate-180" />
              </div>
              <div className="absolute top-[calc(100%+4px)] right-0 hidden group-hover/adminNav:block bg-[#111520]/80 backdrop-blur-2xl border border-white/10 rounded-[18px] p-2 min-w-[180px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] animate-fade-in before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 z-50">
                <a
                  href={process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://admin.maddybgmistore.in"}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-2.5 text-[14px] font-sans font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-[10px] transition-all"
                >
                  Admin Panel
                </a>
                <a
                  href={process.env.NODE_ENV === "development" ? "http://localhost:3001/transactions" : "https://admin.maddybgmistore.in/transactions"}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-2.5 text-[14px] font-sans font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-[10px] transition-all mt-1"
                >
                  Transactions Panel
                </a>
              </div>
            </li>
          )}

          {/* Clerk Session Handlers */}
          <SignedIn>
            <li className="ml-2 flex items-center gap-2">
              <UserButton afterSignOutUrl="/" />
              <div className="flex flex-col leading-none text-left">
                <span className="text-[13px] font-bold text-white font-h">
                  {user?.firstName || user?.username || "User"}
                </span>
                <span className="text-[9px] text-gold uppercase font-bold tracking-[0.5px]">
                  {displayRole}
                </span>
              </div>
            </li>
          </SignedIn>

          <SignedOut>
            <li className="ml-2 flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="btn btn-outline py-1.5 px-4 text-[11px] tracking-[1px]">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-gold py-1.5 px-4 text-[11px] tracking-[1px]">
                  Sign Up
                </button>
              </SignUpButton>
            </li>
          </SignedOut>
        </ul>

      </nav>




    </header>
  );
}
