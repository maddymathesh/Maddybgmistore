import React from "react";

export default function SkeletonLoader() {
  return (
    <>
      <div className="skeleton-card">
        <div className="skeleton-video shimmer" />
        <div className="skeleton-body">
          <div className="skeleton-title shimmer" />
          <div className="skeleton-badges">
            <div className="skeleton-badge shimmer" />
            <div className="skeleton-badge shimmer" />
          </div>
          <div className="skeleton-desc">
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line shimmer" style={{ width: '85%' }} />
            <div className="skeleton-line shimmer" style={{ width: '60%' }} />
          </div>
          <div className="skeleton-footer">
            <div className="skeleton-price shimmer" />
            <div className="skeleton-buttons">
              <div className="skeleton-btn shimmer" />
              <div className="skeleton-btn shimmer" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .skeleton-card {
          background: var(--card);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          opacity: 0.85;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .skeleton-video {
          position: relative;
          padding-top: 56.25%;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid var(--border);
        }

        .skeleton-body {
          padding: 25px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 15px;
        }

        .skeleton-title {
          height: 22px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          width: 70%;
        }

        .skeleton-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .skeleton-badge {
          height: 18px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 100px;
          width: 80px;
        }

        .skeleton-desc {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }

        .skeleton-line {
          height: 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          width: 100%;
        }

        .skeleton-footer {
          border-top: 1px solid var(--border);
          padding-top: 20px;
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-price {
          height: 35px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          width: 120px;
        }

        .skeleton-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .skeleton-btn {
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
        }

        /* Shimmer Animation Effect */
        .shimmer {
          position: relative;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.02);
        }

        .shimmer::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.03) 20%,
            rgba(255, 255, 255, 0.06) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
          content: '';
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
