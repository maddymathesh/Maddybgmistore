import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── SVG Icons ─────────────────────────────────────────────── */
const WaIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TgIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const IgIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YtIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/* ─── Channel data ───────────────────────────────────────────── */
const links = [
  {
    label: "WHATSAPP GROUP",
    href: "https://chat.whatsapp.com/Itiwa47TCSoJnlmNvJalVG",
    bg: "bg-[#25D366]",
    glow: "rgba(37,211,102,0.45)",
    Icon: WaIcon,
  },
  {
    label: "WHATSAPP CHANNEL",
    href: "https://whatsapp.com/channel/0029VaAqUqaInlqnZZteEl2x",
    bg: "bg-[#25D366]",
    glow: "rgba(37,211,102,0.45)",
    Icon: WaIcon,
  },
  {
    label: "TELEGRAM CHANNEL",
    href: "https://t.me/maddy_bgmistore",
    bg: "bg-[#229ED9]",
    glow: "rgba(34,158,217,0.45)",
    Icon: TgIcon,
  },
  {
    label: "INSTAGRAM PAGE",
    href: "https://www.instagram.com/maddy_bgmistore/",
    bg: "bg-gradient-to-r from-[#f9a825] via-[#e91e8c] to-[#9c27b0]",
    glow: "rgba(233,30,140,0.45)",
    Icon: IgIcon,
  },
  {
    label: "YOUTUBE CHANNEL",
    href: "https://www.youtube.com/channel/UCvQJ9PCTM4-hNpKH8R8lJTw",
    bg: "bg-[#FF0000]",
    glow: "rgba(255,0,0,0.45)",
    Icon: YtIcon,
  },
];

export default function ConnectWithUs() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          minHeight: "95vh",
          overflow: "hidden", display: "flex",
          alignItems: "center", justifyContent: "center",
          flexDirection: "column",
        }}>
          {/* Background image */}
          <img
            src="/connect-banner.jpg"
            alt="BGMI Community Connect" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              filter: "brightness(0.6)",
            }}
          />
          {/* Gradient overlays — top + bottom fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.95) 100%)",
          }} />
          {/* Subtle vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(255,215,0,0.04) 0%, transparent 60%)",
          }} />

          {/* HEADING SECTION CONTENT */}
          <div className="text-center mb-10 w-full max-w-2xl px-5" style={{ position: "relative", zIndex: 2 }}>
            <p className="badge" style={{ marginBottom: "20px" }}>
              MADDY <span style={{ color: "var(--gold)", marginLeft: "4px" }}>BGMI STORE</span>
            </p>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "16px",
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}>
              Connect <span style={{ color: "var(--gold)" }}>With Us</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.9)", fontSize: "clamp(15px, 2vw, 19px)",
              maxWidth: "520px", margin: "20px auto", lineHeight: 1.6,
              textShadow: "0 1px 10px rgba(0,0,0,0.5)",
            }}>
              Join our official channels for the latest listings, exclusive updates, and successful deal proofs.
            </p>
          </div>

          {/* ── BUTTONS ─────────────────────────────────────────── */}
          <div className="w-full max-w-[420px] md:max-w-[500px] gap-3 sm:gap-4 px-4 sm:px-5 mx-auto"
            style={{ 
              position: "relative", zIndex: 2, 
              display: "flex", 
              flexDirection: "column"
            }}
          >
          {links.map(({ label, href, bg, glow, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`
                ${bg}
                flex items-center justify-center gap-3 sm:gap-4
                h-[56px] sm:h-[62px] rounded-xl
                text-white font-black text-[12px] sm:text-[13px] tracking-[1px] sm:tracking-[1.5px] uppercase
                transition-all duration-200
                hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]
              `}
              style={{
                width: "100%",
                padding: "0 20px",
                fontFamily: "var(--font-h)",
                boxShadow: `0 8px 24px ${glow}`,
              }}
            >
              <span className="flex items-center justify-center w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]">
                <Icon />
              </span>
              <span style={{ flex: 1, textAlign: "center", transform: "translateX(-12px)" }}>{label}</span>
            </a>
          ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
