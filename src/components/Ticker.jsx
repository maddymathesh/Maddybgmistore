const items = [
  "⚡ Safe & Verified Accounts",
  "🏆 2000+ Happy Buyers",
  "💰 ₹60 Lakhs+ Worth Sold",
  "🔒 Secure Single Logins",
  "📱 UPI · Bank · USDT · Cash",
  "⭐ Trusted Since 2019",
  "🎮 Budget to Premium Range",
  "🛡️ Face-to-Face Deals Available",
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">{item}</span>
        ))}
      </div>
    </div>
  );
}
