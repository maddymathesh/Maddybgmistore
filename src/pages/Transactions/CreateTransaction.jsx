import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, UserSquare2, Gift, Car, Coins, Save, CheckCircle2 } from 'lucide-react';
import { createTransaction } from '../../services/transactionService';
import toast from 'react-hot-toast';

const TYPES = [
  { id: 'Account', label: 'BGMI Account', icon: UserSquare2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'XSuit', label: 'XSuit Gift', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'Supercar', label: 'Supercar Gift', icon: Car, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'UC', label: 'UC Transfer', icon: Coins, color: 'text-amber-500', bg: 'bg-amber-500/10' }
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

  const inputClass = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all";
  const labelClass = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Transactions
      </button>

      {/* Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TYPES.map(type => {
          const Icon = type.icon;
          const isActive = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type.id); reset({ transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`, transaction_date: new Date().toISOString().split('T')[0], payment_status: 'Pending', mode_of_deal: 'Telegram' }); }}
              className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-[#111] border-white/20 shadow-xl' 
                  : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              {isActive && (
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 ${type.bg}`} />
              )}
              {isActive && <CheckCircle2 size={16} className={`absolute top-3 right-3 ${type.color}`} />}
              <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isActive ? type.bg : 'bg-white/5'}`}>
                <Icon size={24} className={isActive ? type.color : 'text-white/40'} />
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
        <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/5 pb-4 flex items-center justify-between">
          <span>{selectedType} Details</span>
          <span className="text-sm font-mono text-white/40">{watch('transaction_id')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="col-span-1 md:col-span-3 border-t border-white/5 my-2" />

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
              <div className="col-span-1 md:col-span-3">
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

          <div className="col-span-1 md:col-span-3 border-t border-white/5 my-2" />

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
            <div className="w-full bg-blue-500/10 border border-blue-500/20 rounded-xl py-3 px-4 text-sm font-bold text-blue-400">
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

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-4">
          <button type="button" onClick={onBack} className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : <><Save size={18} /> Complete Transaction</>}
          </button>
        </div>
      </form>
    </div>
  );
}
