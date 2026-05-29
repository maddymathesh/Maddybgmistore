import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, User, ThumbsUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerFeedback() {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Aarav Patel', phone: '+91 90253 91516', rating: 5, comment: 'Incredible Glacier level 5 account. Safe primary unlink hand-over and fast support!', tag: 'Account', date: 'Today' },
    { id: 2, name: 'Siddharth Sharma', phone: '+91 88210 39512', rating: 5, comment: 'UC store pack (325 UC) completed within 6 minutes. Super reliable prices!', tag: 'UC Store', date: 'Today' },
    { id: 3, name: 'Kabir Mehta', phone: '+91 70144 91803', rating: 5, comment: 'Supercar gift went flawlessly. Aventador SVJ credited safely.', tag: 'Supercar', date: 'Yesterday' },
    { id: 4, name: 'Rohan Joshi', phone: '+91 99423 01844', rating: 4, comment: 'X-suit gifted safely, took about 2 hours due to in-game friend wait list.', tag: 'X-Suit', date: '2 days ago' }
  ]);

  const [replies, setReplies] = useState({});

  const handleReplySubmit = (id, text) => {
    if (!text.trim()) return;
    setReplies(prev => ({
      ...prev,
      [id]: text
    }));
    toast.success('Reply saved successfully!');
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Customer Reviews & Trust</h2>
        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>Review star ratings, buyer whatsapp feedback logs and trust performance index.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
        
        {/* Customer Trust CSAT Rating card */}
        <div className="card" style={{ border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
          <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="100%" height="100%" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--gold)" strokeWidth="3" strokeDasharray="98 2" strokeDashoffset="25" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text)' }}>4.9</span>
              <span style={{ fontSize: '9.5px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CSAT Rating</span>
            </div>
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text)' }}>Excellent Client Trust Index</h4>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, maxWidth: '240px', lineHeight: '1.4' }}>
            Calculated across 1,240 post-deal customer evaluations and support logs.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', width: '100%', margin: '20px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold)', margin: 0 }}>98.2%</p>
              <p style={{ fontSize: '10px', color: 'var(--muted)', margin: 0 }}>Satisfied Deals</p>
            </div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#2ecc71', margin: 0 }}>1.2k+</p>
              <p style={{ fontSize: '10px', color: 'var(--muted)', margin: 0 }}>Reviews Tracked</p>
            </div>
          </div>
        </div>

        {/* Live Star Reviews */}
        <div className="card" style={{ border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: 'var(--gold)' }} /> WhatsApp Support Feed & Star Reviews
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {reviews.map(review => {
              const hasReplied = replies[review.id];
              return (
                <div key={review.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                        <User size={12} style={{ color: 'var(--gold)' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>{review.name}</span>
                    </div>
                    <span style={{ fontSize: '9px', background: 'rgba(255,215,0,0.1)', color: 'var(--gold)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {review.tag}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} size={11} fill="var(--gold)" stroke="none" />
                    ))}
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text)', margin: '4px 0 8px', fontStyle: 'italic', lineHeight: '1.4' }}>
                    "{review.comment}"
                  </p>

                  {hasReplied ? (
                    <div style={{ background: 'var(--bg3)', padding: '8px 10px', borderRadius: '4px', borderLeft: '2.5px solid var(--gold)', marginTop: '8px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold)', margin: 0 }}>MBSx Store Official Response:</p>
                      <p style={{ fontSize: '11.5px', color: 'var(--text)', margin: '2px 0 0' }}>{hasReplied}</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = e.target.elements.replyText.value;
                        handleReplySubmit(review.id, val);
                        e.target.reset();
                      }}
                      style={{ display: 'flex', gap: '6px', marginTop: '10px' }}
                    >
                      <input
                        name="replyText"
                        type="text"
                        placeholder="Write store response..."
                        className="input"
                        style={{ flex: 1, height: '28px', fontSize: '11px', padding: '0 8px' }}
                      />
                      <button type="submit" className="btn btn-gold" style={{ height: '28px', padding: '0 8px', fontSize: '10px' }}>
                        Reply
                      </button>
                    </form>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--muted)' }}>
                    <span>Phone: {review.phone.slice(0, 7)}*****</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
