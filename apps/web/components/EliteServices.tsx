"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, Sparkles, Car, Coins, Zap, Lock, Info, Users, Flame, CheckCircle, Star } from "lucide-react";

type Tab = "uc" | "xsuit" | "supercar";

export default function EliteServices() {
  const [activeTab, setActiveTab] = useState<Tab>("uc");
  const [ucMethod, setUcMethod] = useState<"viewLogin" | "characterId">("viewLogin");

  return (
    <section className="section-padded">
      <div className="text-center mb-10">
        <div className="section-label" style={{ letterSpacing: "1px" }}>
          ⚡ ADDITIONAL CATALOG & ELITE SERVICES
        </div>
      </div>

      <div className="elite-tabs-container">
        <button
          className={`elite-tab ${activeTab === "uc" ? "active" : ""}`}
          onClick={() => setActiveTab("uc")}
          style={{ borderColor: activeTab === "uc" ? "#3b82f6" : "rgba(255,255,255,0.1)" }}
        >
          <Link2 size={16} /> UC Purchase
        </button>
        <button
          className={`elite-tab ${activeTab === "xsuit" ? "active" : ""}`}
          onClick={() => setActiveTab("xsuit")}
          style={{ borderColor: activeTab === "xsuit" ? "#a855f7" : "rgba(255,255,255,0.1)" }}
        >
          <Sparkles size={16} /> X-Suit Gifting
        </button>
        <button
          className={`elite-tab ${activeTab === "supercar" ? "active" : ""}`}
          onClick={() => setActiveTab("supercar")}
          style={{ borderColor: activeTab === "supercar" ? "#ea580c" : "rgba(255,255,255,0.1)" }}
        >
          <Car size={16} /> Supercar Gifting
        </button>
      </div>

      <div className="elite-content-grid">
        {activeTab === "uc" && (
          <>
            {/* Left Card */}
            <div className="elite-card elite-left">
              <div className="elite-badge" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
                PREMIUM SERVICE
              </div>
              <h3 className="elite-title">
                <Coins className="elite-icon" style={{ color: "#60a5fa" }} /> UC Purchase
              </h3>
              <p className="elite-desc">
                Purchase BGMI UC safely through secure login methods or direct Character ID top-up options with fast delivery and trusted handling.
              </p>

              <div className="uc-method-toggle">
                <button
                  className={`uc-method-btn ${ucMethod === "viewLogin" ? "active" : ""}`}
                  onClick={() => setUcMethod("viewLogin")}
                >
                  <Lock size={14} /> View Login
                </button>
                <button
                  className={`uc-method-btn ${ucMethod === "characterId" ? "active" : ""}`}
                  onClick={() => setUcMethod("characterId")}
                >
                  <Zap size={14} /> Character ID
                </button>
              </div>
            </div>

            {/* Right Card */}
            <div className="elite-card elite-right">
              <div className="elite-right-header">
                <h4 className="elite-right-title">
                  {ucMethod === "viewLogin" ? (
                    <><Lock size={16} style={{ color: "#60a5fa" }} /> View Login UC Procedure</>
                  ) : (
                    <><Zap size={16} style={{ color: "#f97316" }} /> Character ID UC Procedure</>
                  )}
                </h4>
                <div className="elite-right-badge" style={{ background: ucMethod === "viewLogin" ? "rgba(59,130,246,0.1)" : "rgba(249,115,22,0.1)", color: ucMethod === "viewLogin" ? "#60a5fa" : "#f97316" }}>
                  Estimated Delivery: {ucMethod === "viewLogin" ? "6-24 Hours" : "6-12 Hours"}
                </div>
              </div>

              <div className="elite-steps">
                {ucMethod === "viewLogin" ? (
                  <>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.3)" }}>01</div>
                      <div className="step-content">
                        <h5>Contact Us</h5>
                        <p>Message us on WhatsApp or Telegram and tell us which UC pack you want to purchase.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.3)" }}>02</div>
                      <div className="step-content">
                        <h5>Make Payment</h5>
                        <p>Complete your payment securely using UPI, Bank Transfer, or any accepted payment method.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.3)" }}>03</div>
                      <div className="step-content">
                        <h5>Share Login Credentials</h5>
                        <p>Provide your Facebook or X (Twitter) login credentials securely. Your information is kept fully confidential and deleted immediately after the purchase process.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.3)" }}>04</div>
                      <div className="step-content">
                        <h5>UC Purchase Process</h5>
                        <p>We log into your account, purchase the UC, and safely log out without changing any account settings or personal information.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.3)" }}>05</div>
                      <div className="step-content">
                        <h5>Confirmation</h5>
                        <p>Once the UC has been added successfully, we will notify you immediately. Delivery usually takes between 6 to 24 hours.</p>
                      </div>
                    </div>
                    <div className="elite-info-box" style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
                      <div className="info-box-title" style={{ color: "#60a5fa" }}><CheckCircle size={14} /> Accepted Login Methods</div>
                      <div className="info-box-tags">
                        <span className="info-tag">Facebook Login</span>
                        <span className="info-tag">X (Twitter) Login</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }}>01</div>
                      <div className="step-content">
                        <h5>Contact Us</h5>
                        <p>Reach out to us on WhatsApp or Telegram and mention the UC pack you want.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }}>02</div>
                      <div className="step-content">
                        <h5>Make Payment</h5>
                        <p>Complete payment through UPI, Bank Transfer, or other supported payment methods.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }}>03</div>
                      <div className="step-content">
                        <h5>Share Your Character ID</h5>
                        <p>Send us your BGMI Character ID. No login credentials are required, making this the safest top-up method.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }}>04</div>
                      <div className="step-content">
                        <h5>Verification & UC Delivery</h5>
                        <p>We verify your Character ID and send UC directly to your account. In many cases, delivery is completed even faster than the estimated time.</p>
                      </div>
                    </div>
                    <div className="elite-step">
                      <div className="step-num" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }}>05</div>
                      <div className="step-content">
                        <h5>Confirmation</h5>
                        <p>We will notify you once the UC has been successfully delivered.</p>
                      </div>
                    </div>
                    <div className="elite-info-box" style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.2)" }}>
                      <div className="info-box-title" style={{ color: "#f97316", fontWeight: "600", fontSize: "13px" }}><Zap size={14} /> No login credentials required — only your Character ID. Fastest and safest UC purchase method.</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="elite-cta-container">
              <Link href="/services/uc" className="elite-cta-btn" style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)", color: "#60a5fa" }}>
                CLICK HERE TO PURCHASE UC →
              </Link>
            </div>
          </>
        )}

        {activeTab === "xsuit" && (
          <>
            {/* Left Card */}
            <div className="elite-card elite-left">
              <div className="elite-badge" style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" }}>
                ELITE GEAR
              </div>
              <h3 className="elite-title">
                <Sparkles className="elite-icon" style={{ color: "#c084fc" }} /> X-Suit Gifting Deals
              </h3>
              <p className="elite-desc">
                Get premium BGMI X-Suits safely through the official gifting system at competitive pricing.
              </p>
            </div>

            {/* Right Card */}
            <div className="elite-card elite-right">
              <div className="elite-right-header">
                <h4 className="elite-right-title">
                  <Star size={16} style={{ color: "#c084fc" }} /> Gifting Procedure & Conditions
                </h4>
                <div className="elite-right-badge" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>
                  72-Hour Friendship Rule
                </div>
              </div>

              <div className="elite-steps-with-reqs">
                <div className="elite-steps">
                  <div className="step-label">STEP-BY-STEP PROCESS</div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}>01</div>
                    <div className="step-content">
                      <h5>Choose Your X-Suit</h5>
                      <p>Select the X-Suit you want to purchase and confirm availability with us.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}>02</div>
                    <div className="step-content">
                      <h5>Complete Payment</h5>
                      <p>Make payment securely using any supported payment method.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}>03</div>
                    <div className="step-content">
                      <h5>Share Your In-Game ID</h5>
                      <p>Send us your BGMI Character ID after payment confirmation.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}>04</div>
                    <div className="step-content">
                      <h5>Accept Friend Request</h5>
                      <p>Accept our in-game friend request to begin the gifting process.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}>05</div>
                    <div className="step-content">
                      <h5>Wait for Official Gifting Eligibility</h5>
                      <p>BGMI requires a 72-hour friendship period before gifting becomes available.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", borderColor: "rgba(168,85,247,0.3)" }}>06</div>
                    <div className="step-content">
                      <h5>Receive Your X-Suit</h5>
                      <p>Once eligible, your selected X-Suit will be gifted directly to your account.</p>
                    </div>
                  </div>
                </div>

                <div className="elite-reqs">
                  <div className="reqs-box" style={{ borderColor: "rgba(168,85,247,0.2)" }}>
                    <h5 style={{ color: "#c084fc" }}><Info size={14} /> OFFICIAL BGMI REQUIREMENTS</h5>
                    <ul>
                      <li><Users size={14} /> Must be friends for at least 72 hours</li>
                      <li><Flame size={14} /> Synergy level must be 50 or above</li>
                      <li><Zap size={14} /> Account level must be 10 or higher</li>
                    </ul>
                    <div className="reqs-note">
                      * These are official BGMI gifting requirements and cannot be bypassed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elite-cta-container">
              <Link href="/services/xsuit" className="elite-cta-btn" style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "#c084fc" }}>
                CLICK HERE TO PURCHASE X-SUIT →
              </Link>
            </div>
          </>
        )}

        {activeTab === "supercar" && (
          <>
            {/* Left Card */}
            <div className="elite-card elite-left">
              <div className="elite-badge" style={{ background: "rgba(234,88,12,0.15)", color: "#fb923c", border: "1px solid rgba(234,88,12,0.3)" }}>
                EXOTIC LUXURY
              </div>
              <h3 className="elite-title">
                <Car className="elite-icon" style={{ color: "#fb923c" }} /> Supercar Gifting Events
              </h3>
              <p className="elite-desc">
                Unlock premium BGMI supercars through secure gifting events with multiple card options available.
              </p>
            </div>

            {/* Right Card */}
            <div className="elite-card elite-right">
              <div className="elite-right-header">
                <h4 className="elite-right-title">
                  <Star size={16} style={{ color: "#fb923c" }} /> Gifting Procedure & Conditions
                </h4>
                <div className="elite-right-badge" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c" }}>
                  72-Hour Friendship Rule
                </div>
              </div>

              <div className="elite-steps-with-reqs">
                <div className="elite-steps">
                  <div className="step-label">STEP-BY-STEP PROCESS</div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c", borderColor: "rgba(234,88,12,0.3)" }}>01</div>
                    <div className="step-content">
                      <h5>Choose Your Supercar Package</h5>
                      <p>Select your preferred Supercar and choose between 1-Card, 2-Card, or 3-Card variants.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c", borderColor: "rgba(234,88,12,0.3)" }}>02</div>
                    <div className="step-content">
                      <h5>Complete Payment</h5>
                      <p>Confirm your order by making payment through any supported method.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c", borderColor: "rgba(234,88,12,0.3)" }}>03</div>
                    <div className="step-content">
                      <h5>Share Your In-Game ID</h5>
                      <p>Send your BGMI Character ID after payment confirmation.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c", borderColor: "rgba(234,88,12,0.3)" }}>04</div>
                    <div className="step-content">
                      <h5>Accept Friend Request</h5>
                      <p>Accept our official in-game friend request.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c", borderColor: "rgba(234,88,12,0.3)" }}>05</div>
                    <div className="step-content">
                      <h5>Wait for Official Gifting Eligibility</h5>
                      <p>A mandatory 72-hour friendship period is required by BGMI before gifting can be completed.</p>
                    </div>
                  </div>
                  <div className="elite-step">
                    <div className="step-num" style={{ background: "rgba(234,88,12,0.1)", color: "#fb923c", borderColor: "rgba(234,88,12,0.3)" }}>06</div>
                    <div className="step-content">
                      <h5>Receive Your Supercar Gift</h5>
                      <p>Once eligible, the selected Supercar package will be gifted directly to your account.</p>
                    </div>
                  </div>
                </div>

                <div className="elite-reqs">
                  <div className="reqs-box" style={{ borderColor: "rgba(234,88,12,0.2)" }}>
                    <h5 style={{ color: "#fb923c" }}><Info size={14} /> OFFICIAL BGMI REQUIREMENTS</h5>
                    <ul>
                      <li><Users size={14} /> Must be friends for at least 72 hours</li>
                      <li><Flame size={14} /> Synergy level must be 50 or above</li>
                      <li><Zap size={14} /> Account level must be 10 or higher</li>
                    </ul>
                    <div className="reqs-note">
                      * Standard BGMI gifting rules apply to all gifting events.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="elite-cta-container">
              <Link href="/services/supercargifts" className="elite-cta-btn" style={{ background: "rgba(234,88,12,0.1)", borderColor: "rgba(234,88,12,0.3)", color: "#fb923c" }}>
                CLICK HERE TO PURCHASE SUPERCAR →
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        .elite-tabs-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        @media (max-width: 640px) {
          .elite-tabs-container {
            justify-content: flex-start;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 4px;
            gap: 8px;
          }
          .elite-tabs-container::-webkit-scrollbar { display: none; }
        }
        .elite-tab {
          display: flex; align-items: center; gap: 8px;
          background: transparent;
          color: var(--color-muted);
          font-family: var(--font-h);
          font-size: 13px; font-weight: 700;
          padding: 10px 20px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          min-height: 44px;
        }
        @media (max-width: 640px) {
          .elite-tab {
            font-size: 11px;
            padding: 8px 14px;
            flex-shrink: 0;
          }
        }
        .elite-tab:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .elite-tab.active {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .elite-content-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
          position: relative;
        }
        @media (max-width: 900px) {
          .elite-content-grid {
            grid-template-columns: 1fr;
          }
        }

        .elite-card {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 32px;
        }
        @media (max-width: 640px) {
          .elite-card { padding: 20px 16px; border-radius: 14px; }
        }
        .elite-left {
          display: flex;
          flex-direction: column;
        }
        .elite-badge {
          display: inline-block;
          font-size: 10px; font-weight: 800;
          letter-spacing: 1px; padding: 4px 10px;
          border-radius: 6px; margin-bottom: 24px;
          align-self: flex-start;
        }
        .elite-title {
          font-family: var(--font-h); font-size: 24px; font-weight: 800;
          color: #fff; margin: 0 0 16px;
          display: flex; align-items: center; gap: 10px;
        }
        @media (max-width: 640px) {
          .elite-title { font-size: 18px; gap: 8px; }
        }
        .elite-desc {
          color: var(--color-muted); font-size: 14px; line-height: 1.7;
          margin-bottom: 30px;
        }
        .uc-method-toggle {
          display: flex; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 4px;
          margin-top: auto;
        }
        .uc-method-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; font-weight: 600; padding: 10px 0;
          color: var(--color-muted); border-radius: 6px;
          transition: all 0.2s; border: none; background: transparent; cursor: pointer;
        }
        .uc-method-btn.active {
          background: #3b82f6; color: #fff;
        }

        .elite-right {
          padding: 32px;
        }
        .elite-right-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (max-width: 600px) {
          .elite-right-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
        .elite-right-title {
          font-family: var(--font-h); font-size: 16px; font-weight: 700; color: #fff;
          display: flex; align-items: center; gap: 8px; margin: 0;
        }
        .elite-right-badge {
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;
        }

        .elite-steps-with-reqs {
          display: grid; grid-template-columns: 1fr 300px; gap: 40px;
        }
        @media (max-width: 900px) {
          .elite-steps-with-reqs { grid-template-columns: 1fr; gap: 30px; }
        }

        .step-label {
          font-size: 11px; font-weight: 700; color: var(--color-muted); letter-spacing: 1px;
          margin-bottom: 16px;
        }
        .elite-steps {
          display: flex; flex-direction: column; gap: 16px;
        }
        .elite-step {
          display: flex; gap: 16px; align-items: flex-start;
        }
        .step-num {
          width: 24px; height: 24px; border-radius: 50%; border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 2px;
        }
        .step-content h5 {
          font-family: var(--font-h); font-size: 14px; font-weight: 700; color: #fff;
          margin: 0 0 6px;
        }
        .step-content p {
          color: var(--color-muted); font-size: 13px; line-height: 1.6; margin: 0;
        }

        .elite-info-box {
          margin-top: 8px; padding: 16px; border-radius: 8px; border: 1px solid;
        }
        .info-box-title {
          display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700;
          margin-bottom: 12px;
        }
        .info-box-tags { display: flex; gap: 8px; }
        .info-tag {
          font-size: 11px; font-weight: 600; padding: 4px 10px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;
        }

        .elite-reqs { }
        .reqs-box {
          border: 1px solid; border-radius: 12px; padding: 20px;
          background: rgba(0,0,0,0.2);
        }
        .reqs-box h5 {
          display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700;
          letter-spacing: 0.5px; margin: 0 0 16px;
        }
        .reqs-box ul {
          list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-direction: column; gap: 12px;
        }
        .reqs-box li {
          display: flex; align-items: center; gap: 8px; color: #fff; font-size: 13px; font-weight: 500;
        }
        .reqs-box li svg { color: var(--color-muted); }
        .reqs-note {
          font-size: 11px; color: var(--color-muted); font-style: italic; line-height: 1.5;
        }

        .elite-cta-container {
          grid-column: 1 / -1;
          display: flex; justify-content: center; margin-top: 10px;
        }
        .elite-cta-btn {
          font-size: 12px; font-weight: 800; letter-spacing: 1px; border: 1px solid;
          padding: 14px 32px; border-radius: 10px; text-decoration: none;
          transition: all 0.2s;
          min-height: 48px;
          text-align: center;
        }
        @media (max-width: 640px) {
          .elite-cta-btn { font-size: 11px; padding: 12px 20px; width: 100%; display: block; }
          .elite-cta-container { padding: 0 4%; }
        }
        .elite-cta-btn:hover { background: rgba(255,255,255,0.05) !important; color: #fff !important; }
      `}</style>
    </section>
  );
}


