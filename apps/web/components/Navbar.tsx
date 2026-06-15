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
    label: "Company",
    subLinks: [
      { to: "/about", label: "About Us" },
      { to: "/why-trust-us", label: "Why Trust Us" },
      { to: "/success-stories", label: "Success Stories" },
      { to: "/locations", label: "Our Locations" },
    ],
  },
  {
    label: "Guides",
    subLinks: [
      { to: "/blog", label: "Blog / Guides" },
      { to: "/guides/valuation", label: "Account Valuation" },
    ],
  },
  {
    label: "Reviews",
    subLinks: [
      { to: "/reviews", label: "Buyer Reviews" },
      { to: "/proofs", label: "Proofs" },
      { to: "/feedback", label: "Customer Feedback" },
    ],
  },
  { to: "/connectwithus", label: "Connect" },
];



export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleMobileExpand = (label: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleMobileOpen = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;
    setMobileOpen((prev) => !prev);
  };

  // Reset mobile menu state on window resize / orientation change to landscape/desktop
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileExpanded({});
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    // Call handler immediately on mount / orientation check
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

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
      const target = e.target as Node;
      const clickedInsideNav = navRef.current && navRef.current.contains(target);
      const clickedInsideDrawer = drawerRef.current && drawerRef.current.contains(target);
      if (!clickedInsideNav && !clickedInsideDrawer) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [mobileOpen]);

  const userRole = (user?.publicMetadata?.role as string) || "USER";
  const isPermanentAdmin = 
    user?.primaryEmailAddress?.emailAddress === "contact@maddybgmistore.in" ||
    user?.primaryEmailAddress?.emailAddress === "maddybgmistoreog@gmail.com" ||
    user?.primaryEmailAddress?.emailAddress === "r.mateshwaran.io@gmail.com";
  const showAdminPanel = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN"].includes(userRole);
  const showTransactionsPanel = isPermanentAdmin || ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER"].includes(userRole);
  const isAdmin = showAdminPanel || showTransactionsPanel;
  const displayRole = isPermanentAdmin ? "SUPER ADMIN" : userRole.replace("_", " ");

  const deskLinkStyle = "text-gray-300 hover:text-white font-sans text-[14px] font-medium tracking-wide px-4 py-2 transition-colors duration-200 inline-flex items-center cursor-pointer whitespace-nowrap rounded-full hover:bg-white/5";
  const activeLinkStyle = "text-white bg-white/10";

  return (
    <>
      <header
        ref={navRef}
      className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
      style={{
        background: scrolled || mobileOpen ? "rgba(8, 10, 15, 0.95)" : "transparent",
        backdropFilter: scrolled || mobileOpen ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled || mobileOpen ? "blur(20px)" : "none",
        borderBottom: scrolled || mobileOpen ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
        boxShadow: scrolled || mobileOpen ? "0 10px 30px rgba(0, 0, 0, 0.2)" : "none",
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
        <ul className="ag-nav-desktop hidden lg:flex items-center gap-1.5 list-none m-0 p-0">
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
                  Control Center
                </a>
                {showAdminPanel && (
                  <a
                    href={process.env.NODE_ENV === "development" ? "http://localhost:3001/panel" : "https://admin.maddybgmistore.in/panel"}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2.5 text-[14px] font-sans font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-[10px] transition-all mt-1"
                  >
                    Admin Panel
                  </a>
                )}
                {showTransactionsPanel && (
                  <a
                    href={process.env.NODE_ENV === "development" ? "http://localhost:3001/transactions" : "https://admin.maddybgmistore.in/transactions"}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2.5 text-[14px] font-sans font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-[10px] transition-all mt-1"
                  >
                    Transactions Panel
                  </a>
                )}
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

        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden text-gray-300 hover:text-white p-2 focus:outline-none transition-colors duration-200"
          onClick={toggleMobileOpen}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </nav>
    </header>

    {/* Mobile Navigation Drawer Wrapper */}
    <div className={`ag-nav-mobile ag-drawer-container lg:hidden fixed inset-0 z-[9999] layer-overlay transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"}`}>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div
        ref={drawerRef}
        className={`ag-drawer fixed top-0 right-0 bottom-0 w-[85%] sm:w-[340px] bg-[#080a0f]/95 backdrop-blur-2xl border-l border-white/10 z-[9999] overflow-y-auto px-6 py-6 transition-transform duration-300 ease-out flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <img
                src="/logo.png"
                alt="Maddy BGMI Store"
                className="h-[32px] w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <div key={l.label || l.to} className="border-b border-white/5 pb-1">
                {l.subLinks ? (
                  <>
                    <button
                      onClick={() => toggleMobileExpand(l.label)}
                      className="w-full flex items-center justify-between text-gray-300 hover:text-white font-sans text-[15px] font-semibold py-2.5 px-2"
                    >
                      <span>{l.label}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${mobileExpanded[l.label] ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileExpanded[l.label] && (
                      <div className="pl-4 flex flex-col gap-1 mt-0.5 mb-2 animate-fade-in">
                        {l.subLinks.map((s) => (
                          <Link
                            key={s.to}
                            href={s.to}
                            onClick={() => setMobileOpen(false)}
                            className={`text-gray-400 hover:text-white text-[13.5px] font-sans font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 ${
                              pathname === s.to ? "text-white bg-white/10" : ""
                            }`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-gray-300 hover:text-white font-sans text-[15px] font-semibold py-2.5 px-2 block rounded-lg hover:bg-white/5 ${
                      pathname === l.to ? "text-white bg-white/10" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                )}
              </div>
            ))}

            {isAdmin && (
              <div className="border-b border-white/5 pb-1">
                <button
                  onClick={() => toggleMobileExpand("Manage")}
                  className="w-full flex items-center justify-between text-white font-sans text-[15px] font-semibold py-2.5 px-2"
                >
                  <span>Manage</span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${mobileExpanded["Manage"] ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded["Manage"] && (
                  <div className="pl-4 flex flex-col gap-1 mt-0.5 mb-2">
                    <a
                      href={process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://admin.maddybgmistore.in"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-400 hover:text-white text-[13.5px] font-sans font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 block"
                    >
                      Control Center
                    </a>
                    {showAdminPanel && (
                      <a
                        href={process.env.NODE_ENV === "development" ? "http://localhost:3001/panel" : "https://admin.maddybgmistore.in/panel"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="text-gray-400 hover:text-white text-[13.5px] font-sans font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 block"
                      >
                        Admin Panel
                      </a>
                    )}
                    {showTransactionsPanel && (
                      <a
                        href={process.env.NODE_ENV === "development" ? "http://localhost:3001/transactions" : "https://admin.maddybgmistore.in/transactions"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="text-gray-400 hover:text-white text-[13.5px] font-sans font-medium py-1.5 px-3 rounded-lg hover:bg-white/5 block"
                      >
                        Transactions Panel
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Auth Buttons / User Button */}
        <div className="mt-8 pt-6 border-t border-white/10 pb-8 flex flex-col gap-4">
          <SignedIn>
            <div className="flex items-center gap-3 px-2">
              <UserButton afterSignOutUrl="/" />
              <div className="flex flex-col leading-none text-left">
                <span className="text-[14px] font-bold text-white font-h">
                  {user?.firstName || user?.username || "User"}
                </span>
                <span className="text-[10px] text-gold uppercase font-bold tracking-[0.5px] mt-0.5">
                  {displayRole}
                </span>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex flex-col gap-3" onClick={() => setMobileOpen(false)}>
              <SignInButton mode="modal">
                <button
                  className="btn btn-outline w-full justify-center py-2.5 text-[12px] tracking-[1px] font-sans"
                >
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="btn btn-gold w-full justify-center py-2.5 text-[12px] tracking-[1px] font-sans"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
    </>
  );
}
