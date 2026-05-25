import { useState, useEffect } from "react";
import { Trophy, Shield, Sparkles, AlertCircle, Wifi, Compass } from "lucide-react";

export default function InitialPageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // High-fidelity cinematic tactical status messages
  const statusMessages = [
    { text: "ESTABLISHING SECURE CONNECTION...", speed: 18 },
    { text: "VERIFYING ENCRYPTED SUPABASE DB DATA...", speed: 35 },
    { text: "DECRYPTION OK. KEY STRENGTH: 2048-BIT...", speed: 52 },
    { text: "LOADING ELITE X-SUIT & SUPERCAR CATALOG...", speed: 70 },
    { text: "SECURING ESCROW & FACE-TO-FACE VAULTS...", speed: 85 },
    { text: "COMPILING BRAND INTERFACES & LENIS SMOOTHING...", speed: 95 },
    { text: "SYSTEMS 100% ONLINE. REDIRECTING...", speed: 100 }
  ];

  // Particle background generator (Floating tactical embers)
  const particles = Array.from({ length: 18 }).map((_, idx) => {
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * -6;
    const left = Math.random() * 100;
    return { id: idx, size, duration, delay, left };
  });

  useEffect(() => {
    let currentProgress = 0;
    
    // Smooth deterministic count up taking ~3.5 seconds to complete.
    // Perfectly timed to be engaging without being tedious.
    const interval = setInterval(() => {
      currentProgress = Math.min(currentProgress + 1, 100);
      setProgress(currentProgress);

      // Check if we should advance the tactical message log
      const matchedMessageIndex = statusMessages.findIndex(
        (m, idx) => currentProgress <= m.speed && (idx === 0 || currentProgress > statusMessages[idx - 1].speed)
      );

      if (matchedMessageIndex !== -1) {
        setStatusIndex(matchedMessageIndex);
        const prefix = matchedMessageIndex === statusMessages.length - 1 ? "[ READY ] " : "[ SYNC ] ";
        const messageText = statusMessages[matchedMessageIndex].text;
        setTerminalLogs(prev => {
          const logText = prefix + messageText;
          if (prev.includes(logText)) return prev;
          return [...prev.slice(-3), logText];
        });
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Wait briefly at 100% to let user see "SYSTEMS 100% ONLINE"
        setTimeout(() => {
          setIsFadingOut(true);
          // Wait for fadeout animation to complete (600ms)
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
        }, 500);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#080A0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "var(--font-b)",
        color: "#fff",
        pointerEvents: "all",
        animation: isFadingOut ? "loaderFadeOut 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "none"
      }}
    >
      {/* Cinematic Grid Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          pointerEvents: "none",
          opacity: 0.8
        }}
      />

      {/* Cybernetic Horizontal Scanline */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "4px",
          background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)",
          boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
          animation: "scanline 6s linear infinite",
          pointerEvents: "none"
        }}
      />

      {/* Ambient Pulsing Glow behind emblem */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.07) 0%, rgba(255, 107, 53, 0.02) 50%, transparent 70%)",
          animation: "ambientPulse 3s ease-in-out infinite alternate",
          pointerEvents: "none"
        }}
      />

      {/* Floating Tactical Embers */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: "-20px",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: Math.random() > 0.4 ? "var(--gold)" : "var(--orange)",
            opacity: Math.random() * 0.4 + 0.3,
            boxShadow: `0 0 10px ${Math.random() > 0.4 ? "var(--gold)" : "var(--orange)"}`,
            animation: `driftUp ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            pointerEvents: "none"
          }}
        />
      ))}

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          padding: "8px 20px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 215, 0, 0.15)",
          color: "rgba(255, 255, 255, 0.6)",
          fontFamily: "var(--font-h)",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.3s ease",
          zIndex: 100
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255, 215, 0, 0.07)";
          e.currentTarget.style.borderColor = "var(--gold)";
          e.currentTarget.style.color = "var(--gold)";
          e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.15)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.15)";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        SKIP INTRO →
      </button>

      {/* Main Content Layout */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "90%",
          maxWidth: "480px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Cinematic Golden Shield Emblem */}
        <div
          style={{
            position: "relative",
            width: "90px",
            height: "90px",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Rotating outer rings */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px dashed rgba(255, 215, 0, 0.25)",
              animation: "spinRing 15s linear infinite"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 107, 53, 0.15)",
              borderTopColor: "var(--gold)",
              animation: "spinRingReverse 4s linear infinite"
            }}
          />

          {/* Inner core badge with brand logo */}
          <div
            style={{
              width: "66px",
              height: "66px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(8, 10, 15, 0.9) 0%, rgba(14, 17, 24, 0.95) 100%)",
              border: "1px solid rgba(255, 215, 0, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 12px rgba(255, 215, 0, 0.25), 0 0 25px rgba(255, 215, 0, 0.2)",
              overflow: "hidden"
            }}
          >
            <img 
              src="/logo.png" 
              alt="MBS Logo" 
              style={{ 
                width: "44px", 
                height: "auto", 
                objectFit: "contain", 
                filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.45))" 
              }} 
            />
          </div>

          {/* Floating tiny spark */}
          <Sparkles
            size={14}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "var(--gold)",
              animation: "glowPulse 1.5s infinite alternate"
            }}
          />
        </div>

        {/* Tactical Title */}
        <h2
          style={{
            fontFamily: "var(--font-h)",
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "3px",
            marginBottom: "4px",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #fff 40%, #e2e8f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          MADDY <span className="g">BGMI</span> STORE
        </h2>

        <p
          style={{
            fontFamily: "var(--font-h)",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--muted)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "45px"
          }}
        >
          TACTICAL SECURE MARKETPLACE
        </p>

        {/* HUD Indicator Details */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "8px",
            padding: "0 2px"
          }}
        >
          <div style={{ textAlign: "left" }}>
            <span
              style={{
                fontFamily: "var(--font-h)",
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--gold)",
                letterSpacing: "1.5px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <Wifi size={10} /> SYSTEM INITIALIZATION
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-h)",
                fontSize: "11px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.5px",
                marginTop: "2px"
              }}
            >
              {statusMessages[statusIndex]?.text || "BOOTING SYSTEM..."}
            </span>
          </div>

          <div
            style={{
              fontFamily: "var(--font-h)",
              fontSize: "24px",
              fontWeight: 900,
              color: "var(--gold)",
              letterSpacing: "0.5px",
              lineHeight: 1,
              textShadow: "0 0 10px rgba(255, 215, 0, 0.4)"
            }}
          >
            {progress}%
          </div>
        </div>

        {/* Premium Cinematic Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "12px",
            background: "rgba(14, 17, 24, 0.8)",
            border: "1px solid rgba(255, 215, 0, 0.22)",
            borderRadius: "6px",
            padding: "2px",
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.8), 0 0 15px rgba(255, 215, 0, 0.03)",
            position: "relative",
            overflow: "hidden",
            marginBottom: "35px"
          }}
        >
          {/* Animated Neon glowing progress fill */}
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: "3px",
              background: "linear-gradient(90deg, var(--gold) 0%, var(--orange) 100%)",
              boxShadow: "0 0 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 107, 53, 0.4)",
              transition: "width 0.15s cubic-bezier(0.1, 0.8, 0.2, 1)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Glossy inner diagonal pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
                backgroundSize: "8px 8px",
                opacity: 0.3
              }}
            />

            {/* Sweep light flare scanner */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "-50px",
                width: "40px",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                transform: "skewX(-30deg)",
                animation: "flareSweep 2.5s infinite"
              }}
            />
          </div>
        </div>

        {/* Tactical Sub-Terminal Log Output */}
        <div
          style={{
            width: "100%",
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(255,255,255,0.03)",
            borderRadius: "10px",
            padding: "12px 18px",
            textAlign: "left",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              paddingBottom: "6px",
              marginBottom: "8px"
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-h)",
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "1px"
              }}
            >
              CONSOLE OUTPUT LOGS
            </span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: progress >= 100 ? "var(--green)" : "var(--gold)",
                boxShadow: `0 0 8px ${progress >= 100 ? "var(--green)" : "var(--gold)"}`,
                animation: "blink 1s infinite alternate"
              }}
            />
          </div>

          <div
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              minHeight: "52px"
            }}
          >
            {terminalLogs.length === 0 ? (
              <div style={{ color: "rgba(255, 215, 0, 0.6)" }}>[ BOOT ] TACTICAL ENGINES CONNECTED.</div>
            ) : (
              terminalLogs.map((log, index) => {
                let color = "rgba(255,255,255,0.45)";
                if (log.includes("[ READY ]")) color = "rgba(0, 255, 136, 0.85)";
                else if (log.includes("[ BOOT ]")) color = "rgba(255, 215, 0, 0.7)";
                
                return (
                  <div key={index} style={{ color }}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Embedded High-Performance Keyframes & Animations */}
      <style>{`
        @keyframes loaderFadeOut {
          0% { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.03); filter: blur(4px); pointer-events: none; }
        }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        @keyframes ambientPulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinRingReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes glowPulse {
          0% { opacity: 0.4; filter: drop-shadow(0 0 2px var(--gold)); }
          100% { opacity: 1; filter: drop-shadow(0 0 8px var(--gold)); }
        }
        @keyframes driftUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes flareSweep {
          0% { left: -100px; }
          60% { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes blink {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
