import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, CheckCircle2, ChevronRight, ChevronLeft, Hash, Calendar, Coins, DollarSign, Phone, Search, FileText, FileOutput, Table } from 'lucide-react';
import { createUcTransaction, generateNextUcId } from '../../services/transactionService';
import { generateCustomerPDF, generateInternalPDF } from '../../lib/pdfGenerator';
import { exportToExcel } from '../../lib/excelExport';
import * as api from '../../services/api';
import { supabase } from '../../utils/supabase';
import { toast } from 'sonner';

const SELLER_PHONE = '+91 9025391516';
const UC_METHODS = ['View Login Method', 'Character ID Method', 'Midasbuy', 'In-Game Topup', 'Redeem Method'];
const STEPS = [
  { id: 0, label: 'Deal Info',  icon: Hash },
  { id: 1, label: 'UC Details', icon: Coins },
  { id: 2, label: 'Delivery',   icon: Calendar },
  { id: 3, label: 'Financials', icon: DollarSign },
  { id: 4, label: 'Contacts',   icon: Phone },
];

// ── Searchable dropdown ────────────────────────────────────────────────────
function SearchDropdown({ options, value, onChange, placeholder, renderOption, getLabel }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const filtered = options.filter(o => (getLabel ? getLabel(o) : o).toLowerCase().includes(q.toLowerCase()));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="input" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }} onClick={() => setOpen(o => !o)}>
        <span style={{ color: value ? 'var(--text)' : 'var(--muted)' }}>{value ? (getLabel ? getLabel(value) : value) : placeholder}</span>
        <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, background: 'var(--bg3)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)', marginTop: '4px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '8px' }}>
              <input className="input" style={{ fontSize: '13px', padding: '8px 12px' }} placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} onClick={e => e.stopPropagation()} autoFocus />
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '13px' }}>No results</div>
              ) : filtered.map((opt, i) => (
                <div key={i} onClick={() => { onChange(opt); setOpen(false); setQ(''); }}
                  style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '14px', background: value === opt ? 'var(--gold-dim)' : 'transparent', color: value === opt ? 'var(--gold)' : 'var(--text)', transition: 'background .15s' }}
                  onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}>
                  {renderOption ? renderOption(opt) : opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Label = ({ children }) => <label className="slabel" style={{ display: 'block', marginBottom: '6px' }}>{children}</label>;

export default function CreateUcTransaction({ onBack }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState(null);
  const [nextId, setNextId] = useState('Loading...');
  const [ucPacks, setUcPacks] = useState([]);
  const [packsLoading, setPacksLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPack, setSelectedPack] = useState(null);
  const [numPacks, setNumPacks] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (step === STEPS.length - 1) {
      setCanSubmit(false);
      const t = setTimeout(() => setCanSubmit(true), 600);
      return () => clearTimeout(t);
    }
  }, [step]);


  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      transaction_date: new Date().toISOString().split('T')[0],
      mode_of_deal: 'WhatsApp',
      mode_of_payment: 'Full Payment via UPI / Bank Transfer',
      payment_status: 'Fully Paid',
      delivery_status: 'Delivered',
      loader_phone: '+91',
      uc_seller_phone: '+91',
      seller_phone: '+91',
      buyer_phone: '+91',
      loader_phone_countryCode: '+91',
      uc_seller_phone_countryCode: '+91',
      seller_phone_countryCode: '+91',
      buyer_phone_countryCode: '+91',
    }
  });

  useEffect(() => {
    generateNextUcId()
      .then(id => { setNextId(id); setValue('transaction_id', id); })
      .catch(() => { setNextId('MBSUC001'); setValue('transaction_id', 'MBSUC001'); });

    supabase.from('uc_prices').select('*').order('offer_price', { ascending: true })
      .then(({ data }) => { setUcPacks(data || []); setPacksLoading(false); })
      .catch(() => setPacksLoading(false));
  }, []);

  const costPrice = parseFloat(watch('owner_price')) || 0;
  const soldPrice = parseFloat(watch('sold_price')) || 0;
  const profit = soldPrice - costPrice;

  const countryCodes = {
    loader_phone: watch('loader_phone_countryCode') || '+91',
    uc_seller_phone: watch('uc_seller_phone_countryCode') || '+91',
    seller_phone: watch('seller_phone_countryCode') || '+91',
    buyer_phone: watch('buyer_phone_countryCode') || '+91',
  };
  const packUcValue = selectedPack ? (Number(selectedPack.uc_amount?.toString().replace(/[^0-9]/g, '')) || 0) : 0;
  const totalUc = packUcValue * (numPacks || 0);

  const onSubmit = async (data) => {
    if (!selectedMethod) { toast.error('Please select a UC Method.'); setStep(1); return; }
    setIsSubmitting(true);
    try {
      const cleanPhone = (val, key) => {
        const prefix = countryCodes[key] || '+91';
        if (!val || val === prefix) return '';
        return val;
      };
      const packLabel = selectedPack ? selectedPack.uc_amount : '';
      const mainData = {
        transaction_id: nextId,
        transaction_type: 'UC',
        transaction_date: data.transaction_date,
        mode_of_deal: data.mode_of_deal,
        mode_of_payment: data.mode_of_payment,
        payment_status: data.payment_status,
        owner_price: costPrice,
        sold_price: soldPrice,
        profit,
        buyer_phone: cleanPhone(data.buyer_phone, 'buyer_phone'),
        owner_phone: cleanPhone(data.loader_phone, 'loader_phone'),
        seller_phone: cleanPhone(data.seller_phone, 'seller_phone'),
        reseller_phone: cleanPhone(data.uc_seller_phone, 'uc_seller_phone'),
      };
      const detailData = {
        uc_method: selectedMethod,
        uc_pack: packLabel,
        num_packs: numPacks,
        total_uc: totalUc,
        delivery_date: data.delivery_date || null,
        delivery_time: data.delivery_time || null,
        delivery_status: data.delivery_status,
      };
      const saved = await createUcTransaction(mainData, detailData);
      setSavedTransaction({ ...saved, ...mainData, uc_transactions: [detailData] });
      toast.success(`UC Transaction ${nextId} saved!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };

  // ── Success ─────────────────────────────────────────────────────────────
  if (savedTransaction) {
    const det = savedTransaction.uc_transactions?.[0] || {};
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#000' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>UC Transaction Saved!</h2>
          <div style={{ display: 'inline-block', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '8px 20px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: 'var(--gold)' }}>#{savedTransaction.transaction_id}</span>
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: '28px', fontSize: '14px' }}>
            💎 <strong style={{ color: 'var(--text)' }}>{det.uc_pack}</strong> × {det.num_packs} packs = <strong style={{ color: 'var(--gold)' }}>{Number(det.total_uc).toLocaleString('en-IN')} UC</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {[{ label: 'Sold Price', val: `₹${soldPrice.toLocaleString('en-IN')}`, color: 'var(--text)' }, { label: 'Cost Price', val: `₹${costPrice.toLocaleString('en-IN')}`, color: 'var(--muted)' }, { label: 'Profit', val: `₹${profit.toLocaleString('en-IN')}`, color: profit >= 0 ? 'var(--green)' : 'var(--red)' }].map(s => (
              <div key={s.label} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            <button className="btn btn-outline" onClick={() => generateCustomerPDF(savedTransaction)} style={{ flexDirection: 'column', gap: '6px', padding: '14px 8px' }}><FileText size={20} style={{ color: 'var(--gold)' }} /><span style={{ fontSize: '11px' }}>Customer PDF</span></button>
            <button className="btn btn-outline" onClick={() => generateInternalPDF(savedTransaction)} style={{ flexDirection: 'column', gap: '6px', padding: '14px 8px' }}><FileOutput size={20} style={{ color: 'var(--orange)' }} /><span style={{ fontSize: '11px' }}>Internal PDF</span></button>
            <button className="btn btn-outline" onClick={() => exportToExcel([savedTransaction], savedTransaction.transaction_id)} style={{ flexDirection: 'column', gap: '6px', padding: '14px 8px' }}><Table size={20} style={{ color: 'var(--green)' }} /><span style={{ fontSize: '11px' }}>Export Excel</span></button>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => { setSavedTransaction(null); setStep(0); setSelectedMethod(''); setSelectedPack(null); setNumPacks(1); generateNextUcId().then(id => { setNextId(id); setValue('transaction_id', id); }); }}>+ New UC Transaction</button>
            <button className="btn btn-gold" onClick={onBack}>Back to Transactions</button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Step Content ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={grid}>
            <div><Label>Transaction ID</Label><div className="input" style={{ background: 'var(--bg2)', color: 'var(--gold)', fontFamily: 'monospace', fontWeight: 700, fontSize: '16px' }}>#{nextId}</div></div>
            <div><Label>Transaction Date</Label><input type="date" className="input" {...register('transaction_date', { required: true })} /></div>
            <div><Label>Mode of Deal</Label><select className="input" {...register('mode_of_deal')}>{['WhatsApp', 'Telegram', 'Instagram', 'Face to Face'].map(o => <option key={o}>{o}</option>)}</select></div>
            <div><Label>Mode of Payment</Label><select className="input" {...register('mode_of_payment')}>{['Full Payment via UPI / Bank Transfer', 'Full Payment in Cash', 'Half Payment in UPI / Bank Transfer & Half in Cash', 'Easy Monthly Instalment (EMI)'].map(o => <option key={o}>{o}</option>)}</select></div>
            <div><Label>Payment Status</Label><select className="input" {...register('payment_status')}>{['Fully Paid', 'Pending', 'Pending EMI'].map(o => <option key={o}>{o}</option>)}</select></div>
          </div>
        );

      case 1:
        return (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* UC Method */}
            <div>
              <Label>UC Method</Label>
              <SearchDropdown options={UC_METHODS} value={selectedMethod} onChange={setSelectedMethod} placeholder="Select UC Method..." />
            </div>

            {/* UC Pack — from Supabase */}
            <div>
              <Label>UC Pack {packsLoading && <span style={{ color: 'var(--muted)', fontSize: '11px' }}>(Loading...)</span>}</Label>
              <SearchDropdown
                options={ucPacks}
                value={selectedPack}
                onChange={setSelectedPack}
                placeholder={packsLoading ? 'Loading UC packs...' : 'Select UC Pack...'}
                getLabel={p => p ? `${p.uc_amount}${p.bonus_uc > 0 ? ` + ${p.bonus_uc} Bonus` : ''} — ₹${Number(p.offer_price).toLocaleString('en-IN')}` : ''}
                renderOption={p => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💎 {p.uc_amount}{p.bonus_uc > 0 ? <span style={{ color: 'var(--gold)', fontSize: '12px', marginLeft: '6px' }}>+{p.bonus_uc} Bonus</span> : null}</span>
                    <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '13px' }}>₹{Number(p.offer_price).toLocaleString('en-IN')}</span>
                  </div>
                )}
              />
            </div>

            {/* Pack count + Total */}
            <div style={grid}>
              <div>
                <Label>Number of Packs</Label>
                <input type="number" min="1" className="input" value={numPacks} onChange={e => setNumPacks(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div>
                <Label>Total UC Amount (Auto-Calculated)</Label>
                <div className="input" style={{ background: 'var(--gold-dim)', borderColor: 'var(--border-gold)', color: 'var(--gold)', fontWeight: 700, fontSize: '18px' }}>
                  💎 {totalUc > 0 ? totalUc.toLocaleString('en-IN') + ' UC' : '—'}
                </div>
              </div>
            </div>

            {/* Pack details preview */}
            {selectedPack && (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
                <p className="slabel" style={{ marginBottom: '10px' }}>Pack Summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  {[
                    { label: 'UC Per Pack', val: selectedPack.uc_amount },
                    { label: 'Bonus UC', val: selectedPack.bonus_uc > 0 ? `+${selectedPack.bonus_uc}` : 'None' },
                    { label: 'Offer Price', val: `₹${Number(selectedPack.offer_price).toLocaleString('en-IN')}` },
                    { label: 'Method', val: selectedPack.method || 'Any' },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>{label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={grid}>
            <div><Label>Delivery Date</Label><input type="date" className="input" {...register('delivery_date')} /></div>
            <div><Label>Delivery Time</Label><input type="time" className="input" {...register('delivery_time')} /></div>
            <div><Label>Delivery Status</Label>
              <select className="input" {...register('delivery_status')}>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={grid}>
            <div><Label>Cost Price (₹)</Label><input type="number" className="input" placeholder="0.00" {...register('owner_price')} /></div>
            <div><Label>Sold Price (₹)</Label><input type="number" className="input" placeholder="0.00" {...register('sold_price')} /></div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Label>Net Profit (Auto-Calculated)</Label>
              <div className="input" style={{ background: profit >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: profit >= 0 ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)', color: profit >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700, fontSize: '22px' }}>
                ₹ {profit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={grid}>
            {[
              { label: 'Loader Phone Number',    key: 'loader_phone' },
              { label: 'UC Seller Phone Number', key: 'uc_seller_phone' },
              { label: 'Seller Phone Number',    key: 'seller_phone' },
              { label: 'Buyer Phone Number',     key: 'buyer_phone' },
            ].map(({ label, key }) => {
              const prefix = countryCodes[key] || '+91';
              const prefixLen = prefix.length;
              return (
                <div key={key}>
                  <Label>{label}</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Country Code Dropdown */}
                    <select
                      {...register(`${key}_countryCode`, {
                        onChange: (e) => {
                          const newPrefix = e.target.value;
                          const currentPhone = watch(key) || '';
                          const restDigits = currentPhone.replace(/^\+(91|1|44)/, '');
                          setValue(key, newPrefix + restDigits);
                        }
                      })}
                      style={{
                        padding: '6px',
                        backgroundColor: "#111520",
                        color: "#fff",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        opacity: 0.9,
                        cursor: "pointer"
                      }}
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>

                    {/* Phone Number Input with Dynamic Locked prefix */}
                    <input
                      className="input"
                      placeholder="98765 09876"
                      maxLength={prefixLen + 10}
                      onKeyDown={(e) => {
                        const selectionStart = e.target.selectionStart;
                        if (e.key === 'Backspace' && selectionStart <= prefixLen) {
                          e.preventDefault();
                        }
                        if (e.key === 'Delete' && selectionStart < prefixLen) {
                          e.preventDefault();
                        }
                      }}
                      {...register(key, {
                        required: false,
                        onChange: (e) => {
                          let val = e.target.value;
                          if (!val.startsWith(prefix)) {
                            val = prefix + val.replace(/^\+?[0-9]*/, '');
                          }
                          const rest = val.substring(prefixLen).replace(/[^0-9]/g, '');
                          val = prefix + rest;
                          if (val.length > prefixLen + 10) {
                            val = val.substring(0, prefixLen + 10);
                          }
                          e.target.value = val;
                          setValue(key, val);
                        },
                        validate: (val) => {
                          if (!val || val === prefix) return true;
                          const rest = val.substring(prefixLen);
                          if (rest.length === 0) return true;
                          if (rest.length === 10 && /^[0-9]+$/.test(rest)) return true;
                          return `Enter a valid 10-digit number starting with ${prefix}`;
                        }
                      })}
                    />
                  </div>
                  {errors[key] && (
                    <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>
                      {errors[key].message || 'This field is required'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <button onClick={onBack} className="btn btn-outline" style={{ width: 'fit-content', padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={15} /> Back to Transactions
      </button>

      <div className="card" style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>New UC Order Transaction</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>BGMI UC Purchase — Step {step + 1} of {STEPS.length}</p>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: 'var(--gold)', background: 'var(--gold-dim)', padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>#{nextId}</div>
      </div>

      {/* Step Nav */}
      <div style={{ display: 'flex', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-gold)', overflow: 'hidden' }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon; const isActive = step === i; const isDone = step > i;
          return (
            <button key={s.id} type="button" onClick={() => setStep(i)} style={{ flex: 1, padding: '13px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: isActive ? 'var(--gold-dim)' : 'transparent', borderRight: i < STEPS.length - 1 ? '1px solid var(--border-gold)' : 'none', cursor: 'pointer', borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent', transition: 'all .2s' }}>
              <Icon size={15} style={{ color: isDone ? 'var(--green)' : isActive ? 'var(--gold)' : 'var(--muted)' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: isDone ? 'var(--green)' : isActive ? 'var(--gold)' : 'var(--muted)', letterSpacing: '0.5px' }}>{isDone ? '✓ ' : ''}{s.label}</span>
            </button>
          );
        })}
      </div>

      <form onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }} className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {React.createElement(STEPS[step].icon, { size: 17, style: { color: 'var(--gold)' } })} {STEPS[step].label}
            </h3>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px' }}>
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 0 ? 0.4 : 1 }}>
            <ChevronLeft size={16} /> Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !canSubmit} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (!canSubmit && !isSubmitting) ? 0.5 : 1 }}>
              {isSubmitting ? <><span style={{ width: '15px', height: '15px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> Saving...</> : <><Save size={16} /> Save Transaction</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
