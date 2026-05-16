import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, UserSquare2, Gift, Car, Coins, Save, CheckCircle2 } from 'lucide-react';
import { createTransaction } from '../../services/transactionService';
import toast from 'react-hot-toast';

const TYPES = [
  { id: 'Account', label: 'BGMI Account', icon: UserSquare2 },
  { id: 'XSuit', label: 'XSuit Gift', icon: Gift },
  { id: 'Supercar', label: 'Supercar Gift', icon: Car },
  { id: 'UC', label: 'UC Transfer', icon: Coins }
];

export default function CreateTransaction({ onBack }) {
  const [selectedType, setSelectedType] = useState('Account');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`,
      transaction_date: new Date().toISOString().split('T')[0],
      payment_status: 'Pending',
      mode_of_deal: 'Telegram',
    }
  });

  const ownerPrice = watch('owner_price') || 0;
  const soldPrice = watch('sold_price') || 0;
  const profit = Number(soldPrice) - Number(ownerPrice);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Split data into main table and detail table
      const mainData = {
        transaction_id: data.transaction_id,
        transaction_type: selectedType,
        mode_of_deal: data.mode_of_deal,
        transaction_date: data.transaction_date,
        owner_price: Number(data.owner_price),
        sold_price: Number(data.sold_price),
        profit: profit,
        buyer_phone: data.buyer_phone,
        payment_status: data.payment_status,
      };

      const detailData = { ...data };
      // Remove main table fields from detail data to avoid duplication/errors
      Object.keys(mainData).forEach(key => delete detailData[key]);

      await createTransaction(selectedType, mainData, detailData);
      toast.success(`${selectedType} Transaction created successfully!`);
      onBack();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "input";
  const labelClass = "slabel";

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <button 
        onClick={onBack}
        className="btn-outline"
        style={{ padding: '8px 16px', fontSize: '12px', width: 'fit-content' }}
      >
        <ArrowLeft size={16} /> Back to Transactions
      </button>

      {/* Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {TYPES.map(type => {
          const Icon = type.icon;
          const isActive = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type.id); reset({ transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`, transaction_date: new Date().toISOString().split('T')[0], payment_status: 'Pending', mode_of_deal: 'Telegram' }); }}
              className="card"
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                borderColor: isActive ? 'var(--gold)' : 'var(--border-gold)',
                background: isActive ? 'var(--gold-dim)' : 'var(--card)',
                padding: '24px',
              }}
            >
              {isActive && <CheckCircle2 size={16} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--gold)' }} />}
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'var(--gold)' : 'var(--bg2)', color: isActive ? '#000' : 'var(--muted)' }}>
                <Icon size={24} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: isActive ? 'var(--gold)' : 'var(--muted)' }}>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{selectedType} Details</span>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--muted)' }}>{watch('transaction_id')}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Common Fields */}
          <div>
            <label className={labelClass}>Transaction Date</label>
            <input type="date" {...register('transaction_date', { required: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mode of Deal</label>
            <select {...register('mode_of_deal')} className={inputClass}>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Direct">Direct</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Payment Status</label>
            <select {...register('payment_status')} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border)', margin: '8px 0' }} />

          {/* Dynamic Fields based on Type */}
          {selectedType === 'Account' && (
            <>
              <div>
                <label className={labelClass}>Product Link</label>
                <input type="url" {...register('product_link')} placeholder="https://" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Primary Login</label>
                <select {...register('primary_login_provider')} className={inputClass}>
                  <option value="Facebook">Facebook</option>
                  <option value="Google PlayGames">Google PlayGames</option>
                  <option value="Apple ID">Apple ID</option>
                  <option value="Game Center">Game Center</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Secondary Login</label>
                <select {...register('secondary_login_provider')} className={inputClass}>
                  <option value="Null">Null (Single Login)</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google PlayGames">Google PlayGames</option>
                  <option value="Apple ID">Apple ID</option>
                  <option value="Game Center">Game Center</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Mothermail Status</label>
                <select {...register('mothermail_status')} className={inputClass}>
                  <option value="Given">Given</option>
                  <option value="Not Given">Not Given</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Guarantee Plan</label>
                <select {...register('guarantee_plan')} className={inputClass}>
                  <option value="Single & Safe Login">Single & Safe Login</option>
                  <option value="37 Days Secondary">37 Days Secondary</option>
                  <option value="22 Days Secondary">22 Days Secondary</option>
                  <option value="75 Days Both">75 Days Both</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Unlink Eligible Date</label>
                <input type="date" {...register('unlink_eligible_date')} className={inputClass} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className={labelClass}>Credentials (Email:Password:Recovery)</label>
                <textarea {...register('credentials')} rows={3} className={inputClass} placeholder="user@gmail.com:pass123:recov@gmail.com" />
              </div>
            </>
          )}

          {selectedType === 'XSuit' && (
            <>
              <div><label className={labelClass}>Owner IG ID</label><input {...register('owner_ig_id')} className={inputClass} /></div>
              <div><label className={labelClass}>Owner IG Name</label><input {...register('owner_ig_name')} className={inputClass} /></div>
              <div><label className={labelClass}>Delivery Date</label><input type="date" {...register('delivery_date')} className={inputClass} /></div>
              <div><label className={labelClass}>Buyer IG ID</label><input {...register('buyer_ig_id')} className={inputClass} /></div>
              <div><label className={labelClass}>Buyer IG Name</label><input {...register('buyer_ig_name')} className={inputClass} /></div>
            </>
          )}

          {selectedType === 'Supercar' && (
            <>
              <div><label className={labelClass}>Owner IG ID</label><input {...register('owner_ig_id')} className={inputClass} /></div>
              <div><label className={labelClass}>Owner IG Name</label><input {...register('owner_ig_name')} className={inputClass} /></div>
              <div><label className={labelClass}>Delivery Date</label><input type="date" {...register('delivery_date')} className={inputClass} /></div>
              <div><label className={labelClass}>Buyer IG ID</label><input {...register('buyer_ig_id')} className={inputClass} /></div>
              <div><label className={labelClass}>Buyer IG Name</label><input {...register('buyer_ig_name')} className={inputClass} /></div>
            </>
          )}

          {selectedType === 'UC' && (
            <>
              <div><label className={labelClass}>UC Quantity</label><input type="number" {...register('uc_quantity')} className={inputClass} /></div>
              <div><label className={labelClass}>BGMI ID</label><input {...register('bgmi_id')} className={inputClass} /></div>
              <div><label className={labelClass}>Delivery Date</label><input type="date" {...register('delivery_date')} className={inputClass} /></div>
            </>
          )}

          <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border)', margin: '8px 0' }} />

          {/* Financials & Contacts */}
          <div>
            <label className={labelClass}>Owner Price (₹)</label>
            <input type="number" {...register('owner_price', { required: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sold Price (₹)</label>
            <input type="number" {...register('sold_price', { required: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Profit (₹)</label>
            <div className="input" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold)', color: 'var(--gold)', fontWeight: 700 }}>
              ₹{profit.toLocaleString()}
            </div>
          </div>
          
          <div><label className={labelClass}>Buyer Phone</label><input {...register('buyer_phone', { required: true })} className={inputClass} placeholder="+91..." /></div>
          {selectedType === 'Account' && (
            <>
              <div><label className={labelClass}>Owner Phone</label><input {...register('owner_phone')} className={inputClass} /></div>
              <div><label className={labelClass}>Reseller Phone</label><input {...register('reseller_phone')} className={inputClass} /></div>
            </>
          )}
        </div>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onBack} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn btn-gold">
            {isSubmitting ? 'Saving...' : <><Save size={18} /> Complete Transaction</>}
          </button>
        </div>
      </form>
    </div>
  );
}
