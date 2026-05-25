import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, Save, CheckCircle2, ChevronRight, ChevronLeft,
  Hash, Calendar, CreditCard, Link2, Key, Shield, DollarSign,
  Phone, User, FileText, Download, FileOutput, Table
} from 'lucide-react';
import { createAccountTransaction, generateNextTransactionId } from '../../services/transactionService';
import { generateCustomerPDF, generateInternalPDF } from '../../lib/pdfGenerator';
import { exportToExcel } from '../../lib/excelExport';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 0, label: 'Deal Info', icon: Hash },
  { id: 1, label: 'Login Details', icon: Key },
  { id: 2, label: 'Guarantee', icon: Shield },
  { id: 3, label: 'Financials', icon: DollarSign },
  { id: 4, label: 'Contacts', icon: Phone },
];

const inp = 'input';
const sel = 'input'; // reuse same class for selects via select.input in CSS

const Label = ({ children }) => (
  <label className="slabel" style={{ display: 'block', marginBottom: '6px' }}>{children}</label>
);

const Field = ({ children, span }) => (
  <div style={{ gridColumn: span ? '1 / -1' : undefined }}>{children}</div>
);

export default function CreateTransaction({ onBack }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedTransaction, setSavedTransaction] = useState(null);
  const [nextId, setNextId] = useState('Loading...');
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
      transaction_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      mode_of_deal: 'WhatsApp',
      mode_of_payment: 'Full Payment via UPI / Bank Transfer',
      payment_status: 'Fully Paid',
      secondary_login_provider: 'Null',
      guarantee_plan: 'Not Applicable',
      primary_mothermail_status: 'Given To Customer',
      secondary_mothermail_status: 'Given To Customer',
      primary_guarantee_void: 'date',
      secondary_guarantee_void: 'date',
      owner_phone: '+91',
      seller_phone: '+91',
      reseller_phone: '+91',
      buyer_phone: '+91',
      owner_phone_countryCode: '+91',
      seller_phone_countryCode: '+91',
      reseller_phone_countryCode: '+91',
      buyer_phone_countryCode: '+91',
    }
  });

  useEffect(() => {
    generateNextTransactionId()
      .then(id => { setNextId(id); setValue('transaction_id', id); })
      .catch(() => { setNextId('MBSA403'); setValue('transaction_id', 'MBSA403'); });

  }, []);

  const costPrice = parseFloat(watch('owner_price')) || 0;
  const soldPrice = parseFloat(watch('sold_price')) || 0;
  const profit = soldPrice - costPrice;
  const primaryVoid = watch('primary_guarantee_void');
  const secondaryVoid = watch('secondary_guarantee_void');

  const countryCodes = {
    owner_phone: watch('owner_phone_countryCode') || '+91',
    seller_phone: watch('seller_phone_countryCode') || '+91',
    reseller_phone: watch('reseller_phone_countryCode') || '+91',
    buyer_phone: watch('buyer_phone_countryCode') || '+91',
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const cleanPhone = (val, key) => {
        const prefix = countryCodes[key] || '+91';
        if (!val || val === prefix) return '';
        return val;
      };
      const mainData = {
        transaction_id: data.transaction_id,
        transaction_type: 'Account',
        transaction_date: data.transaction_date,
        mode_of_deal: data.mode_of_deal,
        mode_of_payment: data.mode_of_payment,
        payment_status: data.payment_status,
        owner_price: costPrice,
        sold_price: soldPrice,
        profit: profit,
        buyer_phone: cleanPhone(data.buyer_phone, 'buyer_phone'),
        owner_phone: cleanPhone(data.owner_phone, 'owner_phone'),
        seller_phone: cleanPhone(data.seller_phone, 'seller_phone'),
        reseller_phone: cleanPhone(data.reseller_phone, 'reseller_phone'),
      };
      const detailData = {
        product_link: data.product_link,
        primary_login_provider: data.primary_login_provider,
        primary_credentials: data.primary_credentials,
        secondary_login_provider: data.secondary_login_provider,
        secondary_credentials: data.secondary_credentials,
        primary_mothermail_status: data.primary_mothermail_status,
        secondary_mothermail_status: data.secondary_mothermail_status,
        guarantee_plan: data.guarantee_plan,
        primary_unlink_date: data.primary_unlink_date || null,
        secondary_unlink_date: data.secondary_unlink_date || null,
        primary_guarantee_void: data.primary_guarantee_void,
        primary_guarantee_void_date: data.primary_guarantee_void === 'date' ? (data.primary_guarantee_void_date || null) : null,
        secondary_guarantee_void: data.secondary_guarantee_void,
        secondary_guarantee_void_date: data.secondary_guarantee_void === 'date' ? (data.secondary_guarantee_void_date || null) : null,
        owner_proof_link: data.owner_proof_link,
      };
      const saved = await createAccountTransaction(mainData, detailData);
      setSavedTransaction({ ...saved, ...mainData, account_transactions: [detailData] });
      toast.success(`Transaction ${data.transaction_id} saved successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save transaction. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' };

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (savedTransaction) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}
      >
        <div className="card" style={{ padding: '48px 40px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#000' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Transaction Saved!
          </h2>
          <div style={{ display: 'inline-block', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '8px 20px', marginBottom: '32px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: 'var(--gold)' }}>
              #{savedTransaction.transaction_id}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {[
              { label: 'Sold Price', val: `₹${Number(savedTransaction.sold_price).toLocaleString('en-IN')}`, color: 'var(--green)' },
              { label: 'Cost Price', val: `₹${Number(savedTransaction.owner_price).toLocaleString('en-IN')}`, color: 'var(--muted)' },
              { label: 'Profit', val: `₹${Number(savedTransaction.profit).toLocaleString('en-IN')}`, color: profit >= 0 ? 'var(--green)' : 'var(--red)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg2)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
            <button className="btn btn-outline" onClick={() => generateCustomerPDF(savedTransaction)} style={{ flexDirection: 'column', gap: '6px', padding: '16px 12px' }}>
              <FileText size={22} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '12px' }}>Customer PDF</span>
            </button>
            <button className="btn btn-outline" onClick={() => generateInternalPDF(savedTransaction)} style={{ flexDirection: 'column', gap: '6px', padding: '16px 12px' }}>
              <FileOutput size={22} style={{ color: 'var(--orange)' }} />
              <span style={{ fontSize: '12px' }}>Internal PDF</span>
            </button>
            <button className="btn btn-outline" onClick={() => exportToExcel([savedTransaction], savedTransaction.transaction_id)} style={{ flexDirection: 'column', gap: '6px', padding: '16px 12px' }}>
              <Table size={22} style={{ color: 'var(--green)' }} />
              <span style={{ fontSize: '12px' }}>Export Excel</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => { setSavedTransaction(null); setStep(0); generateNextTransactionId().then(id => setValue('transaction_id', id)); }}>
              + New Transaction
            </button>
            <button className="btn btn-gold" onClick={onBack}>
              Back to Transactions
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── STEP CONTENT ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── STEP 0: Deal Info ─────────────────────────────────────────────────
      case 0:
        return (
          <div style={grid}>
            <Field>
              <Label>Transaction ID</Label>
              <div className={inp} style={{ background: 'var(--bg2)', color: 'var(--gold)', fontFamily: 'monospace', fontWeight: 700, fontSize: '16px' }}>
                #{nextId}
                <input type="hidden" {...register('transaction_id')} />
              </div>
            </Field>
            <Field>
              <Label>Transaction Date</Label>
              <input type="date" className={inp} {...register('transaction_date', { required: true })} />
            </Field>
            <Field>
              <Label>Mode of Deal</Label>
              <select className={inp} {...register('mode_of_deal')}>
                {['WhatsApp', 'Telegram', 'Instagram', 'Face to Face'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field>
              <Label>Mode of Payment</Label>
              <select className={inp} {...register('mode_of_payment')}>
                {[
                  'Full Payment via UPI / Bank Transfer',
                  'Full Payment in Cash',
                  'Half Payment in UPI / Bank Transfer & Half in Cash',
                  'Easy Monthly Instalment (EMI)',
                ].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field>
              <Label>Payment Status</Label>
              <select className={inp} {...register('payment_status')}>
                {['Fully Paid', 'Pending', 'Pending EMI'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field>
              <Label>Product / Listing Link</Label>
              <input className={inp} placeholder="PlayerAuctions / Drive / Image link..." {...register('product_link')} />
            </Field>
          </div>
        );

      // ── STEP 1: Login Details ─────────────────────────────────────────────
      case 1:
        return (
          <div style={{ display: 'grid', gap: '28px' }}>
            {/* Primary */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)', padding: '24px' }}>
              <p className="slabel" style={{ marginBottom: '16px' }}>🔑 Primary Login</p>
              <div style={grid}>
                <Field>
                  <Label>Primary Login Provider</Label>
                  <select className={inp} {...register('primary_login_provider')}>
                    {['Facebook', 'X (Twitter)', 'Google PlayGames', 'Apple ID', 'Game Center', 'WhatsApp'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field>
                  <Label>Primary Mothermail Status</Label>
                  <select className={inp} {...register('primary_mothermail_status')}>
                    {['Given To Customer', 'Not Given To Customer'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field span>
                  <Label>Primary Login Credentials</Label>
                  <textarea className={inp} rows={4} placeholder={"Email / Username\nPassword\nRecovery Details"} {...register('primary_credentials')} style={{ resize: 'vertical', minHeight: '90px' }} />
                </Field>
              </div>
            </div>

            {/* Secondary */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px' }}>
              <p className="slabel" style={{ marginBottom: '16px' }}>🔗 Secondary Login</p>
              <div style={grid}>
                <Field>
                  <Label>Secondary Login Provider</Label>
                  <select className={inp} {...register('secondary_login_provider')}>
                    {['Null (Single Login Only)', 'Facebook', 'X (Twitter)', 'Google PlayGames', 'Apple ID', 'Game Center', 'WhatsApp'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field>
                  <Label>Secondary Mothermail Status</Label>
                  <select className={inp} {...register('secondary_mothermail_status')}>
                    {['Given To Customer', 'Not Given To Customer'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field span>
                  <Label>Secondary Login Credentials</Label>
                  <textarea className={inp} rows={4} placeholder={"Email / Username\nPassword\nRecovery Details"} {...register('secondary_credentials')} style={{ resize: 'vertical', minHeight: '90px' }} />
                </Field>
              </div>
            </div>
          </div>
        );

      // ── STEP 2: Guarantee ─────────────────────────────────────────────────
      case 2:
       // inside your component
const guaranteePlan = watch('guarantee_plan'); // react-hook-form watch

return (
  <div style={{ display: 'grid', gap: '28px' }}>
    <Field span>
      <Label>Guarantee Plan</Label>
      <select className={inp} {...register('guarantee_plan')}>
        {[
          'Not Applicable',
          '37 Days For Primary Login',
          '22 Days For Primary Login',
          '37 Days For Secondary Login',
          '22 Days For Secondary Login',
          '75 Days For Primary & Secondary Logins',
        ].map(o => <option key={o}>{o}</option>)}
      </select>
    </Field>

    {/* Primary Dates */}
    {guaranteePlan !== 'Not Applicable' && (
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)', padding: '24px' }}>
        <p className="slabel" style={{ marginBottom: '16px' }}>Primary Login — Dates</p>
        <div style={grid}>
          <Field>
            <Label>Primary Unlink Eligible Date</Label>
            <input type="date" className={inp} {...register('primary_unlink_date')} />
          </Field>
          <Field>
            <Label>Primary Guarantee Void Date</Label>
            <div style={{ display: 'grid', gap: '8px' }}>
              <select className={inp} {...register('primary_guarantee_void')}>
                <option value="date">Set a Date</option>
                <option value="no_guarantee">No Guarantee</option>
              </select>
              {primaryVoid === 'date' && (
                <input type="date" className={inp} {...register('primary_guarantee_void_date')} />
              )}
            </div>
          </Field>
        </div>
      </div>
    )}

    {/* Secondary Dates */}
    {guaranteePlan !== 'Not Applicable' && (
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px' }}>
        <p className="slabel" style={{ marginBottom: '16px' }}>Secondary Login — Dates</p>
        <div style={grid}>
          <Field>
            <Label>Secondary Unlink Eligible Date</Label>
            <input type="date" className={inp} {...register('secondary_unlink_date')} />
          </Field>
          <Field>
            <Label>Secondary Guarantee Void Date</Label>
            <div style={{ display: 'grid', gap: '8px' }}>
              <select className={inp} {...register('secondary_guarantee_void')}>
                <option value="date">Set a Date</option>
                <option value="no_guarantee">No Guarantee</option>
              </select>
              {secondaryVoid === 'date' && (
                <input type="date" className={inp} {...register('secondary_guarantee_void_date')} />
              )}
            </div>
          </Field>
        </div>
      </div>
    )}
  </div>
);


      // ── STEP 3: Financials ────────────────────────────────────────────────
      case 3:
        return (
          <div style={grid}>
            <Field>
              <Label>Cost Price (₹)</Label>
              <input type="number" className={inp} placeholder="0.00" {...register('owner_price')} />
            </Field>
            <Field>
              <Label>Sold Price (₹)</Label>
              <input type="number" className={inp} placeholder="0.00" {...register('sold_price')} />
            </Field>
            <Field span>
              <Label>Net Profit (Auto-Calculated)</Label>
              <div className={inp} style={{ background: profit >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: profit >= 0 ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)', color: profit >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700, fontSize: '22px' }}>
                ₹ {profit.toLocaleString('en-IN')}
              </div>
            </Field>
          </div>
        );

      // ── STEP 4: Contacts ──────────────────────────────────────────────────
      case 4:
        return (
          <div style={grid}>
            {[
              { label: 'Account Owner Phone', key: 'owner_phone' },
              { label: 'Seller Phone Number', key: 'seller_phone' },
              { label: 'Reseller Phone Number', key: 'reseller_phone' },
              { label: 'Buyer Phone Number', key: 'buyer_phone' },
            ].map(({ label, key }) => {
              const prefix = countryCodes[key] || '+91';
              const prefixLen = prefix.length;
              return (
                <Field key={key}>
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
                      className={inp}
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
                </Field>
              );
            })}
<Field span>
  <Label>Account Owner Proof Link (Drive / Screenshot)</Label>
  <input
    className={inp}
    placeholder="https://drive.google.com/..."
    {...register('owner_proof_link')}
  />
</Field>

        
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '28px' }}>
      {/* Back */}
      <button onClick={onBack} className="btn btn-outline" style={{ width: 'fit-content', padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={15} /> Back to Transactions
      </button>

      {/* Header card */}
      <div className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>
            New Account Transaction
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>BGMI Account Sale — Step {step + 1} of {STEPS.length}</p>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: 'var(--gold)', background: 'var(--gold-dim)', padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
          #{nextId}
        </div>
      </div>

      {/* Step Navigator */}
      <div style={{ display: 'flex', gap: '0', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-gold)', overflow: 'hidden' }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === i;
          const isDone = step > i;
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              style={{
                flex: 1, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                background: isActive ? 'var(--gold-dim)' : 'transparent',
                borderRight: i < STEPS.length - 1 ? '1px solid var(--border-gold)' : 'none',
                cursor: 'pointer', transition: 'all .2s',
                borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
              }}
            >
              <Icon size={16} style={{ color: isDone ? 'var(--green)' : isActive ? 'var(--gold)' : 'var(--muted)' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: isDone ? 'var(--green)' : isActive ? 'var(--gold)' : 'var(--muted)', letterSpacing: '0.5px' }}>
                {isDone ? '✓ ' : ''}{s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form card */}
      <form onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="card"
            style={{ padding: '32px' }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {React.createElement(STEPS[step].icon, { size: 18, style: { color: 'var(--gold)' } })}
              {STEPS[step].label}
            </h3>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="btn btn-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !canSubmit}
              className="btn btn-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (!canSubmit && !isSubmitting) ? 0.5 : 1 }}
            >
              {isSubmitting ? (
                <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Saving...</>
              ) : (
                <><Save size={16} /> Save Transaction</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
