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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 shadow-2xl shadow-blue-900/20"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"
          >
            <ShieldCheck size={32} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            System Access
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 text-sm flex items-center gap-2"
          >
            <Gamepad2 size={16} /> Enter your 4-digit security PIN
          </motion.p>
        </div>

        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-4 mb-10"
        >
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-16 h-20 bg-[#111] border-2 border-white/10 focus:border-blue-500 rounded-2xl text-center text-3xl font-bold text-white shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Lock size={12} /> Protected by 256-bit AES encryption
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
