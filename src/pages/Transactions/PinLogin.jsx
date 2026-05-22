import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Gamepad2 } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import toast from 'react-hot-toast';

export default function PinLogin() {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const login = useTransactionStore((state) => state.login);

  // Load persistent rate-limiting/lockout states
  const [attempts, setAttempts] = useState(() => {
    return parseInt(localStorage.getItem('mbs_pin_attempts') || '0', 10);
  });
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    return parseInt(localStorage.getItem('mbs_pin_lockout_until') || '0', 10);
  });
  const [timeLeft, setTimeLeft] = useState(0);

  // Focus input on load
  useEffect(() => {
    if (timeLeft === 0 && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [timeLeft]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;

    const checkLockout = () => {
      const now = Date.now();
      if (now < lockoutUntil) {
        setTimeLeft(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setTimeLeft(0);
        setAttempts(0);
        setLockoutUntil(0);
        localStorage.removeItem('mbs_pin_attempts');
        localStorage.removeItem('mbs_pin_lockout_until');
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleChange = (e, index) => {
    if (timeLeft > 0) return;
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    if (index === 3 && value) {
      handleLogin(newPin.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (timeLeft > 0) return;
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleLogin = async (fullPin) => {
    if (timeLeft > 0) {
      toast.error(`Locked out. Try again in ${timeLeft}s.`);
      return;
    }

    if (fullPin.length === 4) {
      const success = await login(fullPin);
      if (!success) {
        setIsShaking(true);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('mbs_pin_attempts', String(newAttempts));

        if (newAttempts >= 5) {
          const blockDuration = 60 * 1000; // 60 seconds lockout
          const unlockTime = Date.now() + blockDuration;
          setLockoutUntil(unlockTime);
          localStorage.setItem('mbs_pin_lockout_until', String(unlockTime));
          toast.error('Too many failed attempts. Device locked out for 60 seconds.', {
            style: {
              background: '#ef4444',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          });
        } else {
          toast.error(`Invalid PIN. ${5 - newAttempts} attempts remaining.`, {
            style: {
              background: '#ef4444',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          });
        }
        setTimeout(() => {
          setIsShaking(false);
          setPin(['', '', '', '']);
          if (newAttempts < 5 && inputRefs[0].current) {
            inputRefs[0].current.focus();
          }
        }, 500);
      } else {
        setAttempts(0);
        setLockoutUntil(0);
        localStorage.removeItem('mbs_pin_attempts');
        localStorage.removeItem('mbs_pin_lockout_until');
        toast.success('Access Granted.', {
          style: {
            background: '#3b82f6',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        });
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card"
        style={{ width: '100%', maxWidth: '440px', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginBottom: '24px' }}>
          <Lock size={32} />
        </div>

        <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
          Admin Authentication
        </h1>

        {timeLeft > 0 ? (
          <div style={{ width: '100%', color: "var(--red)", textAlign: "center", marginBottom: "32px", fontSize: "13px", fontWeight: "600", background: "rgba(239, 68, 68, 0.08)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.15)", lineHeight: "1.6" }}>
            ⚠️ Security Lockout Triggered.<br />
            Brute force lockout active. Try again in {timeLeft}s.
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '32px' }}>
            Enter the management PIN to securely access the MBSx panel.
          </p>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(pin.join('')); }} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
            {pin.map((digit, i) => (
              <motion.input
                key={i}
                ref={inputRefs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={timeLeft > 0}
                onChange={e => handleChange(e, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className="input"
                style={{
                  width: '56px', height: '64px', textAlign: 'center', fontSize: '24px', fontWeight: 700,
                  background: timeLeft > 0 ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg2)',
                  borderColor: timeLeft > 0 ? 'rgba(255,255,255,0.05)' : (digit ? 'var(--gold)' : 'var(--border-gold)'),
                  boxShadow: digit && timeLeft === 0 ? '0 0 15px rgba(255, 215, 0, 0.1)' : 'none',
                  cursor: timeLeft > 0 ? 'not-allowed' : 'text'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={pin.join('').length !== 4 || timeLeft > 0}
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '16px', cursor: (pin.join('').length !== 4 || timeLeft > 0) ? 'not-allowed' : 'pointer' }}
          >
            {timeLeft > 0 ? `Locked Out (${timeLeft}s)` : 'Authenticate Securely'}
          </button>
        </form>

        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--muted)', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} style={{ color: 'var(--green)' }} /> 256-bit Secure
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gamepad2 size={14} style={{ color: 'var(--gold)' }} /> System V2.0
          </div>
        </div>
      </motion.div>
    </div>
  );
}
