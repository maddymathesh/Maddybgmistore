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

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  const handleChange = (e, index) => {
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
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleLogin = (fullPin) => {
    if (fullPin.length === 4) {
      const success = login(fullPin);
      if (!success) {
        setIsShaking(true);
        toast.error('Invalid PIN. Access Denied.', {
          style: {
            background: '#ef4444',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        });
        setTimeout(() => {
          setIsShaking(false);
          setPin(['', '', '', '']);
          inputRefs[0].current.focus();
        }, 500);
      } else {
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
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '32px' }}>
          Enter the management PIN to securely access the MBSx panel.
        </p>

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
                onChange={e => handleChange(e, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className="input"
                style={{
                  width: '56px', height: '64px', textAlign: 'center', fontSize: '24px', fontWeight: 700,
                  background: 'var(--bg2)', borderColor: digit ? 'var(--gold)' : 'var(--border-gold)',
                  boxShadow: digit ? '0 0 15px rgba(255, 215, 0, 0.1)' : 'none'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={pin.join('').length !== 4}
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
          >
            Authenticate Securely
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
