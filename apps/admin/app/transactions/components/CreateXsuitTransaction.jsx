"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, Save, CheckCircle2, ChevronRight, ChevronLeft,
  Hash, Calendar, Gift, DollarSign, Phone, Camera,
  FileText, FileOutput, Table, Search
} from 'lucide-react';
import { createXsuitTransaction, updateXsuitTransaction, generateNextXsuitId } from '../../services/transactionService';
import { generateCustomerPDF, generateInternalPDF } from '../../lib/pdfGenerator';
import { exportToExcel } from '../../lib/excelExport';
import { toast } from 'sonner';

const XSUIT_NAMES = [
  'Galadria', 'Ignis', 'Marmoris', 'Astral Splendor',
  'Golden Pharaoh', 'Blood Raven', 'Stygian Liege', 'Avalanche', 'Poseidon'
];

const STEPS = [
  { id: 0, label: 'Deal Info',   icon: Hash },
  { id: 1, label: 'XSuit Info', icon: Gift },
  { id: 2, label: 'Delivery',   icon: Calendar },
  { id: 3, label: 'Financials', icon: DollarSign },
  { id: 4, label: 'Contacts',   icon: Phone },
];

const Label = ({ children }) => (
  <label className="block text-[11px] uppercase tracking-widest font-bold text-[var(--color-muted)] mb-2.5 ml-1 font-mono">{children}</label>
);

const Field = ({ children, span }) => (
  <div className={`flex flex-col ${span ? 'col-span-full' : ''}`}>{children}</div>
);

// Searchable XSuit dropdown
function XSuitSelect({ value, onChange, selectClasses, inputClasses }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = XSUIT_NAMES.filter(n => n.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      {custom ? (
        <div className="flex gap-2">
          <input
            className={inputClasses}
            placeholder="Enter custom XSuit name..."
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          <button type="button" className="btn btn-outline border-white/5 hover:border-yellow-500/30 px-4 py-2 text-xs"
            onClick={() => { setCustom(false); onChange(''); setQuery(''); }}>
            ← List
          </button>
        </div>
      ) : (
        <>
          <div
            className={selectClasses}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
            onClick={() => setOpen(o => !o)}
          >
            <span className={value ? 'text-white' : 'text-gray-500 font-sans'}>{value || 'Select XSuit...'}</span>
            <Search size={14} className="text-gray-500 flex-shrink-0" />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 right-0 z-50 bg-[#080a0f] border border-white/10 rounded-2xl mt-1 overflow-hidden shadow-2xl"
              >
                <div className="p-2">
                  <input
                    className={inputClasses}
                    placeholder="Search XSuit..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    autoFocus
                  />
                </div>
                <div className="max-h-[180px] overflow-y-auto scrollbar-thin">
                  {filtered.map(name => (
                    <div
                      key={name}
                      onClick={() => { onChange(name); setOpen(false); setQuery(''); }}
                      className={`px-4 py-2.5 cursor-pointer text-xs font-bold transition-all ${value === name ? 'bg-yellow-500/10 text-yellow-500' : 'text-white hover:bg-white/5'}`}
                    >
                      {name}
                    </div>
                  ))}
                  <div
                    onClick={() => { setCustom(true); setOpen(false); onChange(''); }}
                    className="px-4 py-2.5 cursor-pointer text-xs text-yellow-500 border-t border-white/5 font-bold hover:bg-white/5"
                  >
                    + Enter custom XSuit name
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function CreateXsuitTransaction({ onBack, initialData }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState(null);
  const [nextId, setNextId] = useState('Loading...');
  const [xsuitName, setXsuitName] = useState(initialData?.xsuit_transactions?.[0]?.xsuit_name || '');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (step === STEPS.length - 1) {
      setCanSubmit(false);
      const t = setTimeout(() => setCanSubmit(true), 600);
      return () => clearTimeout(t);
    }
  }, [step]);

  const detail = initialData?.xsuit_transactions?.[0] || {};
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData ? {
      ...initialData,
      ...detail,
      transaction_date: initialData.transaction_date ? new Date(initialData.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      delivery_date: detail.delivery_date ? new Date(detail.delivery_date).toISOString().split('T')[0] : '',
      gifter_phone_countryCode: initialData.owner_phone ? (initialData.owner_phone.startsWith('+1') ? '+1' : initialData.owner_phone.startsWith('+44') ? '+44' : '+91') : '+91',
      seller_phone_countryCode: initialData.seller_phone ? (initialData.seller_phone.startsWith('+1') ? '+1' : initialData.seller_phone.startsWith('+44') ? '+44' : '+91') : '+91',
      reseller_phone_countryCode: initialData.reseller_phone ? (initialData.reseller_phone.startsWith('+1') ? '+1' : initialData.reseller_phone.startsWith('+44') ? '+44' : '+91') : '+91',
      buyer_phone_countryCode: initialData.buyer_phone ? (initialData.buyer_phone.startsWith('+1') ? '+1' : initialData.buyer_phone.startsWith('+44') ? '+44' : '+91') : '+91',
      gifter_phone: initialData.owner_phone ? initialData.owner_phone.replace(/^\+(91|1|44)/, '') : '',
      seller_phone: initialData.seller_phone ? initialData.seller_phone.replace(/^\+(91|1|44)/, '') : '',
      reseller_phone: initialData.reseller_phone ? initialData.reseller_phone.replace(/^\+(91|1|44)/, '') : '',
      buyer_phone: initialData.buyer_phone ? initialData.buyer_phone.replace(/^\+(91|1|44)/, '') : '',
    } : {
      transaction_date: new Date().toISOString().split('T')[0],
      mode_of_deal: 'WhatsApp',
      mode_of_payment: 'Full Payment via UPI / Bank Transfer',
      payment_status: 'Paid',
      gift_status: 'Delivered',
      gifter_phone: '',
      seller_phone: '',
      reseller_phone: '',
      buyer_phone: '',
      gifter_phone_countryCode: '+91',
      seller_phone_countryCode: '+91',
      reseller_phone_countryCode: '+91',
      buyer_phone_countryCode: '+91',
    }
  });

  useEffect(() => {
    if (initialData) {
      setNextId(initialData.transaction_id);
    } else {
      generateNextXsuitId()
        .then(id => { setNextId(id); setValue('transaction_id', id); })
        .catch(() => { setNextId('MBSXS001'); setValue('transaction_id', 'MBSXS001'); });
    }
  }, [initialData, setValue]);

  const costPrice = parseFloat(watch('owner_price')) || 0;
  const soldPrice = parseFloat(watch('sold_price')) || 0;
  const profit = soldPrice - costPrice;

  const countryCodes = {
    gifter_phone: watch('gifter_phone_countryCode') || '+91',
    seller_phone: watch('seller_phone_countryCode') || '+91',
    reseller_phone: watch('reseller_phone_countryCode') || '+91',
    buyer_phone: watch('buyer_phone_countryCode') || '+91',
  };

  const onSubmit = async (data) => {
    if (!xsuitName) { toast.error('Please select or enter an XSuit name.'); setStep(1); return; }
    setIsSubmitting(true);
    try {
      const cleanPhone = (val, key) => {
        const prefix = countryCodes[key] || '+91';
        if (!val) return '';
        return prefix + val.replace(/[^0-9]/g, '');
      };
      const mainData = {
        transaction_id: nextId,
        transaction_type: 'XSuit',
        transaction_date: data.transaction_date,
        mode_of_deal: data.mode_of_deal,
        mode_of_payment: data.mode_of_payment,
        payment_status: data.payment_status,
        owner_price: costPrice,
        sold_price: soldPrice,
        profit: profit,
        buyer_phone: cleanPhone(data.buyer_phone, 'buyer_phone'),
        owner_phone: cleanPhone(data.gifter_phone, 'gifter_phone'),
        seller_phone: cleanPhone(data.seller_phone, 'seller_phone'),
        reseller_phone: cleanPhone(data.reseller_phone, 'reseller_phone'),
      };
      const detailData = {
        xsuit_name: xsuitName,
        gifter_ig_name: data.gifter_ig_name,
        gifter_ig_id: data.gifter_ig_id,
        buyer_ig_name: data.buyer_ig_name,
        buyer_ig_id: data.buyer_ig_id,
        delivery_date: data.delivery_date || null,
        delivery_time: data.delivery_time || null,
        gift_status: data.gift_status,
      };
      let saved;
      if (initialData) {
        saved = await updateXsuitTransaction(initialData.id, mainData, detail.id, detailData);
      } else {
        saved = await createXsuitTransaction(mainData, detailData);
      }
      setSavedTransaction({ ...saved, ...mainData, xsuit_transactions: [detailData] });
      toast.success(`XSuit Transaction ${nextId} ${initialData ? 'updated' : 'saved'}!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#080a0f]/60 border border-white/5 rounded-xl h-11 px-4 text-xs font-mono text-white focus:outline-none focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-gray-500";
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`;

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (savedTransaction) {
    const det = savedTransaction.xsuit_transactions?.[0] || {};
    const profitMargin = soldPrice > 0 ? ((profit / soldPrice) * 100).toFixed(1) : "0.0";
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-[700px] mx-auto text-center">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-yellow-500/5 blur-[100px] pointer-events-none"></div>

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-h text-3xl font-black text-white mb-2 uppercase tracking-wide">{initialData ? 'XSuit Gift Updated!' : 'XSuit Gift Saved!'}</h2>
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/15 rounded-xl px-6 py-2.5 mb-8 shadow-inner">
            <span className="font-mono text-xl font-bold text-yellow-500">#{savedTransaction.transaction_id}</span>
          </div>
          <p className="text-xs text-[var(--color-muted)] mb-8 font-mono">
            🎁 <strong className="text-white">{det.xsuit_name}</strong> — Status: <strong className={det.gift_status === 'Delivered' ? 'text-emerald-400' : 'text-yellow-500'}>{det.gift_status}</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Sold Price', val: `₹${soldPrice.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
              { label: 'Cost Price', val: `₹${costPrice.toLocaleString('en-IN')}`, color: 'text-gray-400' },
              { label: 'Profit (Margin)', val: `₹${profit.toLocaleString('en-IN')} (${profitMargin}%)`, color: profit >= 0 ? 'text-emerald-400' : 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-black/40 rounded-2xl p-5 border border-white/5 shadow-inner">
                <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-bold mb-2 font-mono">{s.label}</div>
                <div className={`text-xl font-black font-mono ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <button className="btn btn-outline border-white/5 hover:border-yellow-500/30 flex-col gap-3 py-5 rounded-2xl group transition-all" onClick={() => generateCustomerPDF(savedTransaction)}><FileText size={26} className="text-yellow-500 group-hover:scale-110 transition-transform" /><span className="text-[11px] font-bold text-white uppercase tracking-wider">Customer PDF</span></button>
            <button className="btn btn-outline border-white/5 hover:border-orange-500/30 flex-col gap-3 py-5 rounded-2xl group transition-all" onClick={() => generateInternalPDF(savedTransaction)}><FileOutput size={26} className="text-orange-400 group-hover:scale-110 transition-transform" /><span className="text-[11px] font-bold text-white uppercase tracking-wider">Internal PDF</span></button>
            <button className="btn btn-outline border-white/5 hover:border-emerald-500/30 flex-col gap-3 py-5 rounded-2xl group transition-all" onClick={() => exportToExcel([savedTransaction], savedTransaction.transaction_id)}><Table size={26} className="text-emerald-400 group-hover:scale-110 transition-transform" /><span className="text-[11px] font-bold text-white uppercase tracking-wider">Export Excel</span></button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-outline border-white/5 hover:bg-white/5 px-8 py-3 rounded-xl text-xs" onClick={() => { setSavedTransaction(null); setStep(0); setXsuitName(''); generateNextXsuitId().then(id => { setNextId(id); setValue('transaction_id', id); }); }}>
              + New XSuit Transaction
            </button>
            <button className="btn btn-gold px-8 py-3 rounded-xl text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold" onClick={onBack}>Back to Transactions</button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── STEP CONTENT ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field>
              <Label>Transaction ID</Label>
              <div className="w-full bg-[#080a0f]/60 border border-white/5 rounded-xl py-3 px-4 text-sm font-mono font-bold text-yellow-500 shadow-inner flex items-center justify-between">
                <span>#{nextId}</span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] font-black">Auto-Generated</span>
              </div>
            </Field>
            <Field>
              <Label>Transaction Date</Label>
              <input type="date" className={inputClasses} {...register('transaction_date', { required: true })} />
            </Field>
            <Field>
              <Label>Mode of Deal</Label>
              <div className="relative">
                <select className={selectClasses} {...register('mode_of_deal')}>
                  {['WhatsApp', 'Telegram', 'Instagram', 'Face to Face'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
            <Field>
              <Label>Mode of Payment</Label>
              <div className="relative">
                <select className={selectClasses} {...register('mode_of_payment')}>
                  {['Full Payment via UPI / Bank Transfer', 'Full Payment in Cash', 'Half Payment in UPI / Bank Transfer & Half in Cash', 'Easy Monthly Instalment (EMI)'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
            <Field>
              <Label>Payment Status</Label>
              <div className="relative">
                <select className={selectClasses} {...register('payment_status')}>
                  {['Paid', 'Pending Payment', 'Disputed', 'Refunded', 'Cancelled'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Field>
              <Label>XSuit Name</Label>
              <XSuitSelect value={xsuitName} onChange={setXsuitName} selectClasses={selectClasses} inputClasses={inputClasses} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <h4 className="text-xs uppercase text-yellow-500 font-bold tracking-widest mb-6 flex items-center gap-2 font-mono"><Camera size={14} /> Gifter In-Game Details</h4>
                <div className="flex flex-col gap-4">
                  <Field>
                    <Label>Gifter In-Game Name</Label>
                    <input className={inputClasses} placeholder="e.g. MBSxGIFTER" {...register('gifter_ig_name')} />
                  </Field>
                  <Field>
                    <Label>Gifter In-Game ID (Numeric)</Label>
                    <input className={inputClasses} placeholder="e.g. 5123456789" type="number" {...register('gifter_ig_id')} />
                  </Field>
                </div>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-500"></div>
                <h4 className="text-xs uppercase text-gray-400 font-bold tracking-widest mb-6 flex items-center gap-2 font-mono"><Camera size={14} /> Buyer In-Game Details</h4>
                <div className="flex flex-col gap-4">
                  <Field>
                    <Label>Buyer In-Game Name</Label>
                    <input className={inputClasses} placeholder="e.g. MBSxBUYER" {...register('buyer_ig_name')} />
                  </Field>
                  <Field>
                    <Label>Buyer In-Game ID (Numeric)</Label>
                    <input className={inputClasses} placeholder="e.g. 5987654321" type="number" {...register('buyer_ig_id')} />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field>
              <Label>Delivery Date</Label>
              <input type="date" className={inputClasses} {...register('delivery_date')} />
            </Field>
            <Field>
              <Label>Delivery Time</Label>
              <input type="time" className={inputClasses} {...register('delivery_time')} />
            </Field>
            <Field>
              <Label>Gift Status</Label>
              <div className="relative">
                <select className={selectClasses} {...register('gift_status')}>
                  <option value="Delivered" className="bg-[#0b0e14]">Delivered</option>
                  <option value="Pending" className="bg-[#0b0e14]">Pending</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
          </div>
        );

      case 3:
        const marginPct = soldPrice > 0 ? ((profit / soldPrice) * 100).toFixed(1) : "0.0";
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field>
              <Label>Cost Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold font-mono text-xs">₹</span>
                <input type="number" className={`${inputClasses} pl-8`} placeholder="0.00" {...register('owner_price')} />
              </div>
            </Field>
            <Field>
              <Label>Sold Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold font-mono text-xs">₹</span>
                <input type="number" className={`${inputClasses} pl-8`} placeholder="0.00" {...register('sold_price')} />
              </div>
            </Field>
            <Field span>
              <Label>Net Profit (Auto-Calculated)</Label>
              <div className={`w-full border rounded-3xl py-8 px-10 text-4xl flex justify-between items-center font-black shadow-2xl tracking-wide font-mono relative overflow-hidden ${profit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${profit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`} />
                <span className="relative z-10 flex items-center gap-3">
                  ₹ {profit.toLocaleString('en-IN')}
                  <span className="text-2xl opacity-60">{profit >= 0 ? '▲' : '▼'}</span>
                </span>
                <div className="relative z-10 text-right flex flex-col items-end">
                  <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>Profit Margin</span>
                  <span className="text-xl font-mono font-bold">{marginPct}%</span>
                </div>
              </div>
            </Field>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Gifter Phone Number', key: 'gifter_phone' },
              { label: 'Seller Phone Number', key: 'seller_phone' },
              { label: 'Reseller Phone Number', key: 'reseller_phone' },
              { label: 'Buyer Phone Number', key: 'buyer_phone' },
            ].map(({ label, key }) => {
              const prefix = countryCodes[key] || '+91';
              const prefixLen = prefix.length;
              return (
                <Field key={key}>
                  <Label>{label}</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <select
                        {...register(`${key}_countryCode`)}
                        className={`${selectClasses} px-3 text-center`}
                      >
                        <option value="+91" className="bg-[#0b0e14]">+91</option>
                        <option value="+1" className="bg-[#0b0e14]">+1</option>
                        <option value="+44" className="bg-[#0b0e14]">+44</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
                    </div>

                    <input
                      className={`${inputClasses} flex-1`}
                      placeholder="9876509876"
                      maxLength={10}
                      {...register(key, {
                        required: false,
                        onChange: (e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length > 10) val = val.substring(0, 10);
                          e.target.value = val;
                          setValue(key, val);
                        },
                        validate: (val) => {
                          if (!val) return true;
                          if (val.length === 10 && /^[0-9]+$/.test(val)) return true;
                          return `Enter a valid 10-digit number`;
                        }
                      })}
                    />
                  </div>
                  {errors[key] && (
                    <p className="text-[var(--color-red)] text-[11px] font-bold mt-1.5 ml-1">
                      {errors[key].message || 'This field is required'}
                    </p>
                  )}
                </Field>
              );
            })}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-8">
      <button onClick={onBack} className="btn btn-outline border-white/5 text-[var(--color-muted)] hover:text-white hover:border-yellow-500/30 w-fit px-5 py-2.5 text-xs flex items-center gap-2 transition-all">
        <ArrowLeft size={16} /> Back to Transactions
      </button>

      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.01] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-h text-2xl font-black text-white mb-1 uppercase tracking-wide">
            {initialData ? 'Edit XSuit Gift Transaction' : 'New XSuit Gift Transaction'}
          </h2>
          <p className="text-[var(--color-muted)] text-xs font-mono">BGMI In-Game Gift — Step {step + 1} of {STEPS.length}</p>
        </div>
        <div className="font-mono text-xl font-bold text-yellow-500 bg-yellow-500/10 px-5 py-2 rounded-xl border border-yellow-500/15 shadow-inner relative z-10 font-mono">
          #{nextId}
        </div>
      </div>

      {/* Step Nav */}
      <div className="flex flex-col sm:flex-row bg-[#080a0f] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === i;
          const isDone = step > i;
          return (
            <button key={s.id} type="button" onClick={() => setStep(i)}
              className={`flex-1 p-5 flex flex-col items-center gap-2 transition-all cursor-pointer ${isActive ? 'bg-yellow-500/5 border-b-2 border-b-yellow-500' : 'bg-transparent border-b-2 border-b-transparent hover:bg-white/5'} ${i < STEPS.length - 1 ? 'sm:border-r border-r-white/5' : ''}`}>
              <Icon size={16} className={isDone ? 'text-emerald-400' : isActive ? 'text-yellow-500' : 'text-[var(--color-muted)]'} />
              <span className={`text-[9px] font-bold tracking-widest uppercase font-mono ${isDone ? 'text-emerald-400' : isActive ? 'text-yellow-500' : 'text-[var(--color-muted)]'}`}>
                {isDone ? '✓ ' : ''}{s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
            className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-8 pb-4 border-b border-white/5 flex items-center gap-3 font-h uppercase tracking-wider">
              <span className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/15">
                {React.createElement(STEPS[step].icon, { size: 16, className: "text-yellow-500" })}
              </span>
              {STEPS[step].label}
            </h3>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Nav Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 px-2">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className={`btn btn-outline border-white/5 text-white px-6 py-3 flex items-center gap-2 rounded-xl text-xs ${step === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}>
            <ChevronLeft size={16} /> Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} className="btn btn-gold px-8 py-3 flex items-center gap-2 rounded-xl text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !canSubmit} className={`btn btn-gold px-8 py-3 flex items-center gap-2 rounded-xl text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold ${(!canSubmit && !isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isSubmitting
                ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin inline-block" /> Saving...</>
                : <><Save size={16} /> Save Transaction</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
