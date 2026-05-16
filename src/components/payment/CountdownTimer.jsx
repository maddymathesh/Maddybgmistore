import { useEffect, useMemo, useState } from "react";

const FULL_DURATION_SECONDS = 10 * 60;

function getSecondsLeft(expiresAt) {
  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 1000));
}

export default function CountdownTimer({ expiresAt, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsLeft(expiresAt));

  useEffect(() => {
    setSecondsLeft(getSecondsLeft(expiresAt));

    const timer = window.setInterval(() => {
      const next = getSecondsLeft(expiresAt);
      setSecondsLeft(next);
      if (next <= 0) {
        window.clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const isCritical = secondsLeft <= 60;

  const progress = useMemo(() => {
    return Math.max(0, Math.min(1, secondsLeft / FULL_DURATION_SECONDS));
  }, [secondsLeft]);

  const strokeDasharray = 314;
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    <div className="relative grid place-items-center">
      <div className={`absolute h-32 w-32 rounded-full blur-2xl ${isCritical ? "bg-red-500/30" : "bg-cyan-400/25"}`} />
      <svg className="relative h-36 w-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={isCritical ? "#ef4444" : "#22d3ee"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700"
          style={{ filter: `drop-shadow(0 0 10px ${isCritical ? "rgba(239,68,68,.8)" : "rgba(34,211,238,.8)"})` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={`font-mono text-3xl font-black ${isCritical ? "text-red-300" : "text-cyan-200"}`}>
          {minutes}:{seconds}
        </div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          expires in
        </div>
      </div>
    </div>
  );
}
