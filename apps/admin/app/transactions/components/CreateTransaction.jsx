"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, Save, CheckCircle2, ChevronRight, ChevronLeft, ChevronDown,
  Hash, Calendar, CreditCard, Link2, Key, Shield, DollarSign,
  Phone, User, FileText, Download, FileOutput, Table, Copy, 
  ExternalLink, MessageCircle, Folder, Activity, ShoppingCart, ShieldCheck,
  Gamepad2, Mail, Slash, Ban, Link, Clock
} from 'lucide-react';
import { createAccountTransaction, updateAccountTransaction, generateNextTransactionId } from '../../services/transactionService';
import { generateCustomerPDF, generateInternalPDF } from '../../lib/pdfGenerator';
import { exportToExcel } from '../../lib/excelExport';
import { toast } from 'sonner';
import { FAMOUS_COUNTRY_CODES, COUNTRY_CODE_REGEX, extractCountryCode } from '../../utils/formatters';
import { useUser } from '@clerk/nextjs';

const STEPS = [
  { id: 0, label: 'Deal Info', icon: Hash },
  { id: 1, label: 'Contacts', icon: Phone },
  { id: 2, label: 'Login Details', icon: Key },
  { id: 3, label: 'Unlink Timeline', icon: Clock },
  { id: 4, label: 'Unlink Guarantee', icon: Shield },
  { id: 5, label: 'Financials', icon: DollarSign },
  { id: 6, label: 'Docs & Notes', icon: Folder },
];

const Label = ({ children }) => (
  <label className="block text-[11px] uppercase tracking-widest font-bold text-[var(--color-muted)] mb-2.5 ml-1 font-mono">{children}</label>
);

const Field = ({ children, span, className }) => (
  <div className={`flex flex-col ${span ? 'col-span-full' : ''} ${className || ''}`}>{children}</div>
);

const WhatsAppIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const XIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const AppleIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M17.05 13.605c-.015-2.42 1.974-3.574 2.064-3.626-1.125-1.645-2.875-1.87-3.51-1.902-1.503-.153-2.93.882-3.693.882-.764 0-1.94-.85-3.18-.828-1.614.022-3.107.937-3.935 2.378-1.678 2.91-.428 7.217 1.205 9.584.795 1.157 1.733 2.455 2.983 2.408 1.198-.047 1.666-.77 3.11-.77 1.444 0 1.884.77 3.134.747 1.272-.02 2.08-1.18 2.868-2.34 1.002-1.465 1.415-2.88 1.434-2.955-.03-.013-2.673-1.025-2.68-3.582M15.42 5.48c.646-.78 1.08-1.865.96-2.95-.928.037-2.05.62-2.71 1.402-.53.618-1.045 1.72-.907 2.785.105.008.22.015.334.015.864 0 1.66-.465 2.323-1.252"/>
  </svg>
);

const GameCenterIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
    <circle cx="8" cy="9" r="4.5" fill="#FF3B30" opacity="0.85" />
    <circle cx="16" cy="9" r="4.5" fill="#007AFF" opacity="0.85" />
    <circle cx="8" cy="15" r="4.5" fill="#4CD964" opacity="0.85" />
    <circle cx="16" cy="15" r="4.5" fill="#FFCC00" opacity="0.85" />
    <circle cx="12" cy="12" r="4" fill="#5856D6" opacity="0.85" />
  </svg>
);

const loginProviders = [
  { value: 'Facebook', label: 'Facebook', icon: FacebookIcon, color: '#4A9FFF', bg: 'rgba(24,119,242,0.1)' },
  { value: 'X (Twitter)', label: 'X (Twitter)', icon: XIcon, color: '#fff', bg: 'rgba(255,255,255,0.05)' },
  { value: 'Google PlayGames', label: 'Google PlayGames', icon: Gamepad2, color: '#34A853', bg: 'rgba(52,168,83,0.1)' },
  { value: 'Apple ID', label: 'Apple ID', icon: AppleIcon, color: '#fff', bg: 'rgba(255,255,255,0.05)' },
  { value: 'Game Center', label: 'Game Center', icon: GameCenterIcon, color: '#00A3FF', bg: 'rgba(0,163,255,0.1)' },
  { value: 'WhatsApp', label: 'WhatsApp', icon: WhatsAppIcon, color: '#25D366', bg: 'rgba(37,211,102,0.1)' },
];

const ProviderIconSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-1">
      {loginProviders.map(provider => {
        const Icon = provider.icon;
        const isSelected = value === provider.value;
        return (
          <button
            key={provider.value}
            type="button"
            onClick={() => onChange(provider.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2 ${
              isSelected
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold scale-[1.02] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'border-white/5 bg-white/[0.02] text-[var(--color-muted)] hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200"
              style={{ backgroundColor: provider.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: provider.color }} />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-center">{provider.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const scenarioOptions = [
  { value: 'Empty', label: 'Empty', icon: Slash, bg: 'rgba(255,255,255,0.05)', color: '#888' },
  { value: 'Show Login Providers (Disabled)', label: 'Disabled', icon: Ban, bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  { value: 'Social media Logins (Provided)', label: 'Provided', icon: Link, bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
];

const ScenarioIconSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
      {scenarioOptions.map(option => {
        const Icon = option.icon;
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-start p-3 rounded-xl border transition-all duration-200 gap-3 ${
              isSelected
                ? 'border-[var(--color-muted)] bg-white/5 text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                : 'border-white/5 bg-white/[0.02] text-[var(--color-muted)] hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200"
              style={{ backgroundColor: option.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: option.color }} />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-mono text-left leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const emailTypeOptions = [
  { value: 'Creation Mail', label: 'Creation Mail', icon: Mail, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  { value: 'Linked Mail', label: 'Linked Mail', icon: Link2, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  { value: 'N/A', label: 'N/A', icon: Slash, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
];

const EmailTypeSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mt-1">
      {emailTypeOptions.map(option => {
        const Icon = option.icon;
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-2 ${
              isSelected
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold scale-[1.02] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'border-white/5 bg-white/[0.02] text-[var(--color-muted)] hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200"
              style={{ backgroundColor: option.bg }}
            >
              <Icon className="w-4 h-4" style={{ color: option.color }} />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-center">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function CreateTransaction({ onBack, initialData }) {
  const { user } = useUser();
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

  const detail = initialData?.account_transactions?.[0] || {};
  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: initialData ? {
      ...initialData,
      ...detail,
      transaction_date: initialData.transaction_date ? new Date(initialData.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      primary_unlink_plan: detail.primary_unlink_plan || '30 Days',
      primary_custom_days: detail.primary_custom_days || '',
      secondary_unlink_plan: detail.secondary_unlink_plan || 'No Guarantee',
      secondary_custom_days: detail.secondary_custom_days || '',
      terms_and_conditions: detail.terms_and_conditions || '',
      primary_unlink_eligible_date: detail.primary_unlink_eligible_date ? new Date(detail.primary_unlink_eligible_date).toISOString().split('T')[0] : '',
      primary_unlink_expiry_date: detail.primary_unlink_expiry_date ? new Date(detail.primary_unlink_expiry_date).toISOString().split('T')[0] : '',
      secondary_unlink_eligible_date: detail.secondary_unlink_eligible_date ? new Date(detail.secondary_unlink_eligible_date).toISOString().split('T')[0] : '',
      secondary_unlink_expiry_date: detail.secondary_unlink_expiry_date ? new Date(detail.secondary_unlink_expiry_date).toISOString().split('T')[0] : '',
      shared_date: detail.shared_date ? new Date(detail.shared_date).toISOString().split('T')[0] : '',
      owner_phone_countryCode: extractCountryCode(initialData.owner_contact_info || initialData.owner_phone),
      seller_phone_countryCode: extractCountryCode(initialData.seller_contact_info || initialData.seller_phone),
      reseller_phone_countryCode: extractCountryCode(initialData.reseller_contact_info || initialData.reseller_phone),
      buyer_phone_countryCode: extractCountryCode(initialData.buyer_contact_info || initialData.buyer_phone),
      owner_name: initialData.owner_name || '',
      seller_name: initialData.seller_name || '',
      reseller_name: initialData.reseller_name || '',
      buyer_name: initialData.buyer_name || '',
      owner_contact_type: initialData.owner_contact_type || 'WhatsApp',
      seller_contact_type: initialData.seller_contact_type || 'WhatsApp',
      reseller_contact_type: initialData.reseller_contact_type || 'WhatsApp',
      buyer_contact_type: initialData.buyer_contact_type || 'WhatsApp',
      owner_contact_info: initialData.owner_contact_info ? initialData.owner_contact_info.replace(COUNTRY_CODE_REGEX, '') : (initialData.owner_phone ? initialData.owner_phone.replace(COUNTRY_CODE_REGEX, '') : ''),
      seller_contact_info: initialData.seller_contact_info ? initialData.seller_contact_info.replace(COUNTRY_CODE_REGEX, '') : (initialData.seller_phone ? initialData.seller_phone.replace(COUNTRY_CODE_REGEX, '') : ''),
      reseller_contact_info: initialData.reseller_contact_info ? initialData.reseller_contact_info.replace(COUNTRY_CODE_REGEX, '') : (initialData.reseller_phone ? initialData.reseller_phone.replace(COUNTRY_CODE_REGEX, '') : ''),
      buyer_contact_info: initialData.buyer_contact_info ? initialData.buyer_contact_info.replace(COUNTRY_CODE_REGEX, '') : (initialData.buyer_phone ? initialData.buyer_phone.replace(COUNTRY_CODE_REGEX, '') : ''),
    } : {
      transaction_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      mode_of_deal: 'WhatsApp',
      mode_of_payment: 'Full Payment via UPI / Bank Transfer',
      payment_status: 'Pending Payment',
      
      account_title: '',
      stock_id: '',
      category: 'Mid-Range',
      listing_source: 'WhatsApp',
      
      secondary_login_provider: 'Null (Single Login Only)',
      // Dynamic Login Fields
      primary_email_id: '',
      primary_email_type: 'Select', // 'Select', 'Creation Mail', 'Linked Mail', 'N/A'
      primary_login_username: '',
      primary_login_password: '',
      primary_recovery_email: '',
      primary_recovery_phone: '',
      primary_dob: '',
      primary_2fa_status: 'Off',
      primary_authenticator_status: 'Off',
      primary_backup_codes: '',
      primary_passkey_status: 'Off',
      primary_passkey_details: '',
      primary_trusted_number: '',
      primary_mail_verify_date: '',
      primary_mail_verify_time: '',
      primary_mail_associated_date: '',
      primary_mail_associated_time: '',
      primary_mail_associated_ip: '',
      
      secondary_login_scenario: 'Empty', // 'Empty', 'Show Login Providers (Disabled)', 'Social media Logins (Provided)'
      secondary_disabled_date: '',
      secondary_disabled_time: '',
      secondary_disabled_reason: '',
      secondary_email_id: '',
      secondary_email_type: 'Select',
      secondary_login_username: '',
      secondary_login_password: '',
      secondary_recovery_email: '',
      secondary_recovery_phone: '',
      secondary_dob: '',
      secondary_2fa_status: 'Off',
      secondary_authenticator_status: 'Off',
      secondary_backup_codes: '',
      secondary_passkey_status: 'Off',
      secondary_passkey_details: '',
      secondary_trusted_number: '',
      secondary_mail_verify_date: '',
      secondary_mail_verify_time: '',
      secondary_mail_associated_date: '',
      secondary_mail_associated_time: '',
      secondary_mail_associated_ip: '',
      
      primary_unlink_plan: '30 Days',
      primary_custom_days: '',
      secondary_unlink_plan: 'No Guarantee',
      secondary_custom_days: '',
      terms_and_conditions: '',
      primary_unlink_eligible_date: '',
      primary_unlink_expiry_date: '',
      secondary_unlink_eligible_date: '',
      secondary_unlink_expiry_date: '',
      guarantee_notes: '',
      
      owner_name: '',
      seller_name: '',
      reseller_name: '',
      buyer_name: '',
      owner_contact_type: 'WhatsApp',
      seller_contact_type: 'WhatsApp',
      reseller_contact_type: 'WhatsApp',
      buyer_contact_type: 'WhatsApp',
      owner_contact_info: '',
      seller_contact_info: '',
      reseller_contact_info: '',
      buyer_contact_info: '',
      owner_phone_countryCode: '+91',
      seller_phone_countryCode: '+91',
      reseller_phone_countryCode: '+91',
      buyer_phone_countryCode: '+91',
      
      owner_price: '',
      sold_price: '',
      commission: '',
      additional_expenses: '',
    }
  });

  useEffect(() => {
    if (user) {
      const currentBy = getValues('credentials_shared_by');
      if (!currentBy) {
        setValue('credentials_shared_by', user.fullName || user.firstName || 'Super Admin');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setValue]);

  useEffect(() => {
    if (initialData) {
      setNextId(initialData.transaction_id);
    } else {
      generateNextTransactionId()
        .then(id => { setNextId(id); setValue('transaction_id', id); })
        .catch(() => { setNextId('MBSA403'); setValue('transaction_id', 'MBSA403'); });
    }
  }, [initialData, setValue]);

  const costPrice = parseFloat(watch('owner_price')) || 0;
  const soldPrice = parseFloat(watch('sold_price')) || 0;
  const commission = parseFloat(watch('commission')) || 0;
  const additionalExpenses = parseFloat(watch('additional_expenses')) || 0;
  const profit = soldPrice - costPrice - commission - additionalExpenses;
  
  const primaryVoid = watch('primary_guarantee_void');
  const secondaryVoid = watch('secondary_guarantee_void');
  
  const currentPaymentStatus = watch('payment_status');
  const primaryProvider = watch('primary_login_provider');
  const secondaryProvider = watch('secondary_login_provider');
  const credsStatus = watch('credentials_shared_status');

  const countryCodes = {
    owner_contact_info: watch('owner_phone_countryCode') || '+91',
    seller_contact_info: watch('seller_phone_countryCode') || '+91',
    reseller_contact_info: watch('reseller_phone_countryCode') || '+91',
    buyer_contact_info: watch('buyer_phone_countryCode') || '+91',
  };

  const [expandedRoles, setExpandedRoles] = useState({
    owner: false,
    seller: false,
    reseller: false,
    buyer: false,
  });

  const toggleRole = (role) => setExpandedRoles(prev => ({ ...prev, [role]: !prev[role] }));

  const getUnlinkHealth = (plan, customDaysValue) => {
    if (!plan || plan === 'No Guarantee') return { status: 'No Guarantee', days: '-', expiryStr: '-', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    
    const txDate = watch('transaction_date');
    if (!txDate) return { status: 'Unknown', days: '-', expiryStr: '-', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    
    let totalDays = 0;
    if (plan === '7 Days') totalDays = 7;
    else if (plan === '15 Days') totalDays = 15;
    else if (plan === '30 Days') totalDays = 30;
    else if (plan === '37 Days') totalDays = 37;
    else if (plan === '60 Days') totalDays = 60;
    else if (plan === 'Custom') totalDays = parseInt(customDaysValue) || 0;
    
    if (totalDays === 0) return { status: 'No Guarantee', days: '-', expiryStr: '-', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };

    const start = new Date(txDate);
    const expiry = new Date(start.getTime() + (totalDays * 24 * 60 * 60 * 1000));
    const today = new Date();
    
    // Set hours to 0 to compare just the dates accurately
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const expiryStr = expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (diffDays < 0) return { status: 'Expired', days: 0, expiryStr, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    return { status: 'Active', days: diffDays, expiryStr, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  };

  const handleCopy = (text, type) => {
    if (!text) return toast.error(`No ${type} to copy`);
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const openContactAction = (roleKey) => {
    const type = watch(`${roleKey}_contact_type`);
    let info = watch(`${roleKey}_contact_info`);
    if (!info) return toast.error("No contact info provided");
    
    if (type === 'WhatsApp') {
      const prefix = watch(`${roleKey}_phone_countryCode`) || '+91';
      info = (prefix + info).replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${info}`, '_blank');
    } else if (type === 'Telegram') {
      window.open(`https://t.me/${info.replace('@', '')}`, '_blank');
    } else if (type === 'Instagram') {
      window.open(`https://instagram.com/${info.replace('@', '')}`, '_blank');
    } else if (type === 'Email') {
      window.open(`mailto:${info}`, '_blank');
    } else {
      navigator.clipboard.writeText(info);
      toast.success("Contact info copied to clipboard");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const cleanPhone = (val, key) => {
        const prefix = countryCodes[key] || '+91';
        if (!val) return '';
        return prefix + val.replace(/[^0-9]/g, '');
      };

      const formatCredentials = (prefix, formData) => {
        const provider = formData[`${prefix}_login_provider`];
        if (!provider || provider === 'Null (Single Login Only)' || provider === 'Select Provider') return '';
        if (prefix === 'secondary' && formData.secondary_login_scenario === 'Show Login Providers (Disabled)') {
          const date = formData.secondary_disabled_date || '';
          const time = formData.secondary_disabled_time || '';
          const reason = formData.secondary_disabled_reason || 'No Reason';
          let msg = `[DISABLED`;
          if (date || time) msg += ` on ${date} ${time}`.trim();
          msg += `: ${reason}]`;
          return msg;
        }
        
        const lines = [];
        
        const is2faOn = formData[`${prefix}_2fa_status`] === 'On';
        const isAuthOn = formData[`${prefix}_authenticator_status`] === 'On';
        const isPasskeyOn = formData[`${prefix}_passkey_status`] === 'On';
        
        if (provider === 'WhatsApp') {
          if (formData[`${prefix}_login_username`]) lines.push(`Phone: ${formData[`${prefix}_login_username`]}`);
          if (formData[`${prefix}_login_password`]) lines.push(`PIN: ${formData[`${prefix}_login_password`]}`);
        } else {
          // Facebook, X (Twitter), Google PlayGames, Apple ID, Game Center
          const mailType = formData[`${prefix}_email_type`];
          const hasEmailDetails = mailType === 'Creation Mail' || mailType === 'Linked Mail';

          if (provider !== 'Google PlayGames' && formData[`${prefix}_email_id`] && mailType !== 'N/A' && mailType !== 'Select') {
            lines.push(`Email ID: ${formData[`${prefix}_email_id`]} (${mailType})`);
          }

          if (hasEmailDetails) {
            if (formData[`${prefix}_mail_verify_date`] || formData[`${prefix}_mail_verify_time`]) {
              lines.push(`Verification: ${formData[`${prefix}_mail_verify_date`]} ${formData[`${prefix}_mail_verify_time`]}`.trim());
            }
            if (formData[`${prefix}_mail_associated_date`] || formData[`${prefix}_mail_associated_time`] || formData[`${prefix}_mail_associated_ip`]) {
              const actionText = mailType === 'Creation Mail' ? 'Account Created' : 'Mail Linked';
              lines.push(`${actionText}: ${formData[`${prefix}_mail_associated_date`]} ${formData[`${prefix}_mail_associated_time`]} (IP: ${formData[`${prefix}_mail_associated_ip`]})`.trim());
            }
          }
          if (formData[`${prefix}_login_username`]) {
            lines.push(`${provider} Login ID: ${formData[`${prefix}_login_username`]}`);
          }
          if (formData[`${prefix}_login_password`]) lines.push(`Password: ${formData[`${prefix}_login_password`]}`);
          if (formData[`${prefix}_recovery_email`]) lines.push(`Recovery Email(s): ${formData[`${prefix}_recovery_email`]}`);
          
          if (provider === 'Apple ID' || provider === 'Game Center') {
            if (formData[`${prefix}_trusted_number`]) lines.push(`Trusted No: ${formData[`${prefix}_trusted_number`]}`);
          } else {
            if (formData[`${prefix}_recovery_phone`]) lines.push(`Recovery Phone: ${formData[`${prefix}_recovery_phone`]}`);
          }
          if (formData[`${prefix}_dob`]) lines.push(`DOB: ${formData[`${prefix}_dob`]}`);
          
          lines.push(`2FA Status: ${formData[`${prefix}_2fa_status`] || 'Off'}`);
          lines.push(`Authenticator: ${formData[`${prefix}_authenticator_status`] || 'Off'}`);
          if (formData[`${prefix}_authenticator_status`] === 'On' && formData[`${prefix}_authenticator_details`]) {
            lines.push(`Authenticator Details: ${formData[`${prefix}_authenticator_details`]}`);
          }
          
          lines.push(`Passkey: ${formData[`${prefix}_passkey_status`] || 'Off'}`);
          if (isPasskeyOn && formData[`${prefix}_passkey_details`]) {
            lines.push(`Passkey Details: ${formData[`${prefix}_passkey_details`]}`);
          }
          
          lines.push(`Backup Codes Toggle: ${formData[`${prefix}_backup_codes_status`] || 'Off'}`);
          if (formData[`${prefix}_backup_codes_status`] === 'On' && formData[`${prefix}_backup_codes`]) {
            lines.push(`Backup Codes:\n${formData[`${prefix}_backup_codes`]}`);
          }
        }
        
        let formatted = lines.join('\n');
        if (formData[`${prefix}_credentials`]) {
          formatted += (formatted.length > 0 ? '\n\n-- Raw / Additional Data --\n' : '') + formData[`${prefix}_credentials`];
        }
        
        return formatted;
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
        commission: commission,
        additional_expenses: additionalExpenses,
        profit: profit,
      };

      const detailData = {
        account_title: data.account_title,
        stock_id: data.stock_id,
        category: data.category,
        listing_source: data.listing_source,
        product_link: data.product_link,

        owner_name: data.owner_name,
        owner_contact_type: data.owner_contact_type,
        owner_contact_info: data.owner_contact_type === 'WhatsApp' && data.owner_contact_info ? ((data.owner_phone_countryCode || '+91') + data.owner_contact_info) : data.owner_contact_info,
        seller_name: data.seller_name,
        seller_contact_type: data.seller_contact_type,
        seller_contact_info: data.seller_contact_type === 'WhatsApp' && data.seller_contact_info ? ((data.seller_phone_countryCode || '+91') + data.seller_contact_info) : data.seller_contact_info,
        reseller_name: data.reseller_name,
        reseller_contact_type: data.reseller_contact_type,
        reseller_contact_info: data.reseller_contact_type === 'WhatsApp' && data.reseller_contact_info ? ((data.reseller_phone_countryCode || '+91') + data.reseller_contact_info) : data.reseller_contact_info,
        buyer_name: data.buyer_name,
        buyer_contact_type: data.buyer_contact_type,
        buyer_contact_info: data.buyer_contact_type === 'WhatsApp' && data.buyer_contact_info ? ((data.buyer_phone_countryCode || '+91') + data.buyer_contact_info) : data.buyer_contact_info,

        primary_login_provider: data.primary_login_provider,
        primary_credentials: formatCredentials('primary', data),
        secondary_login_provider: data.secondary_login_scenario === 'Empty' ? 'Null (Single Login Only)' : data.secondary_login_provider,
        secondary_credentials: data.secondary_login_scenario === 'Empty' ? '' : formatCredentials('secondary', data),
        primary_mothermail_status: data.primary_mothermail_status,
        secondary_mothermail_status: data.secondary_login_scenario === 'Empty' ? 'Not Shared' : data.secondary_mothermail_status,
        
        credentials_shared_status: data.credentials_shared_status || 'Shared',
        credentials_shared_platform: data.credentials_shared_platform || 'WhatsApp',
        credentials_shared_by: data.credentials_shared_by,
        shared_date: data.shared_date || null,
        shared_time: data.shared_time,

        primary_unlink_plan: data.primary_unlink_plan,
        primary_custom_days: data.primary_custom_days ? parseInt(data.primary_custom_days, 10) : null,
        secondary_unlink_plan: data.secondary_unlink_plan,
        secondary_custom_days: data.secondary_custom_days ? parseInt(data.secondary_custom_days, 10) : null,
        terms_and_conditions: data.terms_and_conditions,
        primary_unlink_eligible_date: data.primary_unlink_eligible_date || null,
        primary_unlink_expiry_date: data.primary_unlink_expiry_date || null,
        secondary_unlink_eligible_date: data.secondary_unlink_eligible_date || null,
        secondary_unlink_expiry_date: data.secondary_unlink_expiry_date || null,
        guarantee_notes: data.guarantee_notes,

        internal_notes: data.internal_notes,
        payment_proof_link: data.payment_proof_link,
        buyer_proof_link: data.buyer_proof_link,
        seller_proof_link: data.seller_proof_link,
        account_proof_link: data.account_proof_link,
        chat_proof_link: data.chat_proof_link,
        drive_link: data.drive_link,
      };
      
      let saved;
      if (initialData) {
        saved = await updateAccountTransaction(initialData.id, mainData, detail.id, detailData);
      } else {
        saved = await createAccountTransaction(mainData, detailData);
      }
      setSavedTransaction({ ...saved, ...mainData, account_transactions: [detailData] });
      toast.success(`Transaction ${data.transaction_id} ${initialData ? 'updated' : 'saved'} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save transaction. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#080a0f]/60 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-white focus:outline-none focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-gray-500";
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`;

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (savedTransaction) {
    const profitMargin = soldPrice > 0 ? ((profit / soldPrice) * 100).toFixed(1) : "0.0";
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-[700px] mx-auto text-center mt-20">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-yellow-500/5 blur-[100px] pointer-events-none"></div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <CheckCircle2 size={40} className="drop-shadow-sm" />
          </div>
          <h2 className="font-h text-3xl font-black text-white mb-2 uppercase tracking-wide">
            {initialData ? 'Transaction Updated!' : 'Transaction Saved!'}
          </h2>
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/15 rounded-xl px-6 py-2.5 mb-10 shadow-inner">
            <span className="font-mono text-xl font-bold text-yellow-500">#{savedTransaction.transaction_id}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Sold Price', val: `₹${Number(savedTransaction.sold_price).toLocaleString('en-IN')}`, color: 'text-emerald-400' },
              { label: 'Cost Price', val: `₹${Number(savedTransaction.owner_price).toLocaleString('en-IN')}`, color: 'text-gray-400' },
              { label: 'Profit (Margin)', val: `₹${Number(savedTransaction.profit).toLocaleString('en-IN')} (${profitMargin}%)`, color: profit >= 0 ? 'text-emerald-400' : 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-black/40 rounded-2xl p-5 border border-white/5 shadow-inner">
                <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-bold mb-2 font-mono">{s.label}</div>
                <div className={`text-xl font-black font-mono ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <button className="btn btn-outline border-white/5 hover:border-yellow-500/30 flex-col gap-3 py-5 rounded-2xl group transition-all" onClick={() => generateCustomerPDF(savedTransaction)}>
              <FileText size={26} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Customer PDF</span>
            </button>
            <button className="btn btn-outline border-white/5 hover:border-orange-500/30 flex-col gap-3 py-5 rounded-2xl group transition-all" onClick={() => generateInternalPDF(savedTransaction)}>
              <FileOutput size={26} className="text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Internal PDF</span>
            </button>
            <button className="btn btn-outline border-white/5 hover:border-emerald-500/30 flex-col gap-3 py-5 rounded-2xl group transition-all" onClick={() => exportToExcel([savedTransaction], savedTransaction.transaction_id)}>
              <Table size={26} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Export Excel</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-outline border-white/5 hover:bg-white/5 px-8 py-3 rounded-xl text-xs" onClick={() => { setSavedTransaction(null); setStep(0); generateNextTransactionId().then(id => setValue('transaction_id', id)); }}>
              + New Transaction
            </button>
            <button className="btn btn-gold px-8 py-3 rounded-xl text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold" onClick={onBack}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field span>
              <Label>Account Title</Label>
              <input className={inputClasses} placeholder="e.g. BGMI 100 Mythics + Glacier + Ignis X-Suit" {...register('account_title')} />
            </Field>
            <Field>
              <Label>Transaction ID</Label>
              <div className="w-full bg-[#080a0f]/60 border border-white/5 rounded-xl py-3 px-4 text-sm font-mono font-bold text-yellow-500 shadow-inner flex items-center justify-between">
                <span>#{nextId}</span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] font-black">Auto-Generated</span>
                <input type="hidden" {...register('transaction_id')} />
              </div>
            </Field>
            <Field>
              <Label>Stock ID (Optional)</Label>
              <input className={inputClasses} placeholder="e.g. STK-1045" {...register('stock_id')} />
            </Field>
            <Field>
              <Label>Transaction Date</Label>
              <div className="relative group">
                <input type="date" className={`${inputClasses} absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`} {...register('transaction_date', { required: true })} />
                <div className={`${inputClasses} flex items-center justify-between pointer-events-none group-hover:border-yellow-500/30`}>
                  <span>{watch('transaction_date') ? new Date(watch('transaction_date')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date'}</span>
                  <Calendar size={16} className="text-[var(--color-muted)] group-hover:text-yellow-500 transition-colors" />
                </div>
              </div>
            </Field>
            <Field>
              <Label>Category</Label>
              <div className="relative">
                <select className={selectClasses} {...register('category')}>
                  {['Budget', 'Mid-Range', 'Premium', 'Ultra-Premium'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
            <Field>
              <Label>Listing Source</Label>
              <div className="relative">
                <select className={selectClasses} {...register('listing_source')}>
                  {['WhatsApp', 'Telegram', 'Instagram', 'Website', 'Direct Customer'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
            <Field>
              <Label>Product / Listing Link</Label>
              <div className="flex gap-2">
                <input className={`${inputClasses} flex-1`} placeholder="URL to listing or drive..." {...register('product_link')} />
                <button type="button" onClick={() => { const link = watch('product_link'); if(link) window.open(link, '_blank'); else toast.error('No link provided'); }} className="btn btn-outline border-white/5 hover:border-yellow-500/30 px-4 rounded-xl flex items-center justify-center bg-black/20">
                  <ExternalLink size={16} className="text-[var(--color-muted)] hover:text-white transition-colors" />
                </button>
              </div>
            </Field>
          </div>
        );

      // ── STEP 1: Contacts ──────────────────────────────────────────────────
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { label: 'Account Owner', role: 'owner' },
              { label: 'Seller', role: 'seller' },
              { label: 'Reseller', role: 'reseller' },
              { label: 'Buyer', role: 'buyer' },
            ].map(({ label, role }) => {
              const isExpanded = expandedRoles[role] || watch(`${role}_name`) || watch(`${role}_contact_info`);
              const cType = watch(`${role}_contact_type`);
              
              return (
                <div key={role} className="bg-black/20 border border-white/5 rounded-2xl relative overflow-hidden transition-all duration-300">
                  <div className={`absolute top-0 left-0 w-1 h-full ${isExpanded ? 'bg-yellow-500/50' : 'bg-white/10'}`}></div>
                  
                  {/* Header / Toggle */}
                  <button type="button" onClick={() => toggleRole(role)} className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <h4 className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 font-mono ml-2 transition-colors ${isExpanded ? 'text-white' : 'text-gray-500'}`}>
                      <User size={12} className={isExpanded ? 'text-yellow-500' : 'text-gray-500'} /> {label}
                    </h4>
                    {isExpanded ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
                  </button>

                  {/* Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 ml-2 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <Field>
                        <Label>Name</Label>
                        <input className={inputClasses} placeholder="Enter name" {...register(`${role}_name`)} />
                      </Field>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <Field className="xl:col-span-1">
                          <Label>Contact Type</Label>
                          <div className="relative">
                            <select className={selectClasses} {...register(`${role}_contact_type`)}>
                              {['WhatsApp', 'Telegram', 'Instagram', 'Discord', 'Facebook', 'Email', 'Other'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
                          </div>
                        </Field>
                        
                        <Field className="xl:col-span-2">
                          <Label>Contact Information</Label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            {cType === 'WhatsApp' ? (
                              <div className="flex flex-1 items-center gap-2">
                                <div className="relative w-24 flex-shrink-0">
                                  <select {...register(`${role}_phone_countryCode`)} className={`${selectClasses} px-2 text-center text-xs`}>
                                    {FAMOUS_COUNTRY_CODES.map(c => <option key={c} value={c} className="bg-[#0b0e14]">{c}</option>)}
                                  </select>
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none border-l-[3px] border-r-[3px] border-t-[3px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
                                </div>
                                <input className={`${inputClasses} flex-1`} placeholder="9876509876" maxLength={10} {...register(`${role}_contact_info`, { required: false, onChange: (e) => { let val = e.target.value.replace(/[^0-9]/g, ''); if (val.length > 10) val = val.substring(0, 10); e.target.value = val; setValue(`${role}_contact_info`, val); } })} />
                              </div>
                            ) : (
                              <div className="flex-1">
                                <input className={inputClasses} placeholder={cType === 'Email' ? "email@example.com" : cType === 'Other' ? "Custom info" : "@username"} {...register(`${role}_contact_info`)} />
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <button type="button" onClick={() => {
                                let info = watch(`${role}_contact_info`);
                                if (cType === 'WhatsApp') info = (watch(`${role}_phone_countryCode`) || '+91') + (info || '');
                                handleCopy(info, label);
                              }} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-gray-400 hover:text-white flex-1 sm:flex-none flex justify-center"><Copy size={16} /></button>
                              <button type="button" onClick={() => openContactAction(role)} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-all border border-emerald-500/20 text-emerald-500 flex-1 sm:flex-none flex justify-center"><ExternalLink size={16} /></button>
                            </div>
                          </div>
                        </Field>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      // ── STEP 2: Login Details ─────────────────────────────────────────────
      case 2: {
        const renderProviderFields = (prefix) => {
          const provider = watch(`${prefix}_login_provider`);
          if (!provider || provider === 'Null (Single Login Only)' || provider === 'Select Provider') return null;

          const is2faOn = watch(`${prefix}_2fa_status`) === 'On';
          const isAuthOn = watch(`${prefix}_authenticator_status`) === 'On';
          const isPasskeyOn = watch(`${prefix}_passkey_status`) === 'On';
          const emailType = provider === 'Google PlayGames' ? 'Creation Mail' : watch(`${prefix}_email_type`);

          const fields = [];
          
          if (provider === 'WhatsApp') {
            fields.push(
              <div key="basics" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field><Label>Phone Number</Label><input className={inputClasses} placeholder="+91..." {...register(`${prefix}_login_username`)} /></Field>
                <Field><Label>2-Step PIN</Label><input className={inputClasses} placeholder="123456" {...register(`${prefix}_login_password`)} /></Field>
              </div>
            );
          } else {
            // Facebook, X (Twitter), Google PlayGames, Apple ID, Game Center
            fields.push(
              <div key="basics" className="grid grid-cols-1 gap-4">
                {provider !== 'Google PlayGames' ? (
                  <Field>
                    <Label>Email ID Type</Label>
                    <input type="hidden" {...register(`${prefix}_email_type`)} />
                    <EmailTypeSelector
                      value={emailType}
                      onChange={(val) => setValue(`${prefix}_email_type`, val, { shouldValidate: true, shouldDirty: true })}
                    />
                  </Field>
                ) : (
                  <input type="hidden" value="Creation Mail" {...register(`${prefix}_email_type`)} />
                )}

                {provider !== 'Google PlayGames' && emailType !== 'N/A' && emailType !== 'Select' && (
                  <Field className="animate-in fade-in zoom-in duration-200">
                    <Label>{emailType} Address</Label>
                    <input className={inputClasses} placeholder="email@example.com" {...register(`${prefix}_email_id`)} />
                  </Field>
                )}

                {(emailType === 'Creation Mail' || emailType === 'Linked Mail') && (
                  <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in zoom-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <Label>{emailType} Verified Date</Label>
                        <input type="date" className={inputClasses} {...register(`${prefix}_mail_verify_date`)} />
                      </Field>
                      <Field>
                        <Label>{emailType} Verified Time</Label>
                        <input type="time" className={inputClasses} {...register(`${prefix}_mail_verify_time`)} />
                      </Field>
                    </div>

                    <div>
                      <Label className="mb-3 text-yellow-500/80">Account Creation Details</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field>
                          <Label>Creation Date</Label>
                          <input type="date" className={inputClasses} {...register(`${prefix}_mail_associated_date`)} />
                        </Field>
                        <Field>
                          <Label>Creation Time</Label>
                          <input type="time" className={inputClasses} {...register(`${prefix}_mail_associated_time`)} />
                        </Field>
                        <Field>
                          <Label>Creation IP</Label>
                          <input className={inputClasses} placeholder="192.168.1.1" {...register(`${prefix}_mail_associated_ip`)} />
                        </Field>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <Field>
                    <Label>{provider === 'Apple ID' ? 'Apple ID' : `${provider} Login ID`}</Label>
                    <input className={inputClasses} placeholder={provider === 'Apple ID' ? "appleid@example.com" : "Email address, mobile number or username"} {...register(`${prefix}_login_username`)} />
                  </Field>
                  <Field><Label>Password</Label><input className={inputClasses} placeholder="password" {...register(`${prefix}_login_password`)} /></Field>
                </div>
              </div>,
              <div key="recovery" className="grid grid-cols-1 gap-4">
                <Field><Label>Recovery Email(s)</Label><input className={inputClasses} placeholder="email1@..., email2@..." {...register(`${prefix}_recovery_email`)} /></Field>
                {provider === 'Apple ID' || provider === 'Game Center' ? (
                  <Field><Label>Trusted Number</Label><input className={inputClasses} placeholder="+91..." {...register(`${prefix}_trusted_number`)} /></Field>
                ) : (
                  <Field><Label>Recovery Phone</Label><input className={inputClasses} placeholder="+91..." {...register(`${prefix}_recovery_phone`)} /></Field>
                )}
              </div>,
              <div key="security_2fa" className="grid grid-cols-1 gap-4">
                <Field><Label>2-Step Verification</Label><div className="relative"><select className={selectClasses} {...register(`${prefix}_2fa_status`)}><option className="bg-[#0b0e14]">Off</option><option className="bg-[#0b0e14]">On</option></select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div></div></Field>
              </div>
            );

            if (is2faOn) {
              fields.push(
                <div key="security_extended" className="grid grid-cols-1 gap-4 animate-in fade-in zoom-in duration-200">
                  <Field><Label>Authenticator</Label><div className="relative"><select className={selectClasses} {...register(`${prefix}_authenticator_status`)}><option className="bg-[#0b0e14]">Off</option><option className="bg-[#0b0e14]">On</option></select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div></div></Field>
                  {watch(`${prefix}_authenticator_status`) === 'On' && (
                    <Field className="animate-in fade-in zoom-in duration-200"><Label>Authenticator Details</Label><input className={inputClasses} placeholder="Enter details" {...register(`${prefix}_authenticator_details`)} /></Field>
                  )}
                  <Field><Label>Passkey</Label><div className="relative"><select className={selectClasses} {...register(`${prefix}_passkey_status`)}><option className="bg-[#0b0e14]">Off</option><option className="bg-[#0b0e14]">On</option></select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div></div></Field>
                  {watch(`${prefix}_passkey_status`) === 'On' && (
                    <Field key="passkey_details" className="flex-1 flex flex-col animate-in fade-in zoom-in duration-200">
                      <Label>Passkey Device Details</Label>
                      <input className={inputClasses} placeholder="e.g. iPhone 13 Pro (Maddy)" {...register(`${prefix}_passkey_details`)} />
                    </Field>
                  )}
                  <Field><Label>Backup Codes</Label><div className="relative"><select className={selectClasses} {...register(`${prefix}_backup_codes_status`)}><option className="bg-[#0b0e14]">Off</option><option className="bg-[#0b0e14]">On</option></select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div></div></Field>
                  {watch(`${prefix}_backup_codes_status`) === 'On' && (
                    <Field className="flex-1 flex flex-col animate-in fade-in zoom-in duration-200"><Label>Backup Codes</Label><textarea className={`${inputClasses} flex-1 min-h-[60px] resize-y font-mono text-[11px] bg-[#0b0e14]`} placeholder={"1234 5678\n8765 4321"} {...register(`${prefix}_backup_codes`)} /></Field>
                  )}
                </div>,
              );
            }
          }

          // Render fields
          return (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-white/5 pt-4 mt-2">
              {fields}
              {provider !== 'WhatsApp' && (
                <Field>
                  <Label>Date of Birth</Label>
                  <input type="date" className={inputClasses} {...register(`${prefix}_dob`)} />
                </Field>
              )}
              <Field span className="flex-1 flex flex-col border-t border-white/5 pt-4 mt-2">
                <Label>Raw Credentials / Fallback</Label>
                <textarea className={`${inputClasses} flex-1 min-h-[60px] resize-y font-mono text-[11px] bg-[#0b0e14]`} placeholder={"Paste unstructured data..."} {...register(`${prefix}_credentials`)} />
              </Field>
            </div>
          );
        };

        const secScenario = watch('secondary_login_scenario');

        return (
          <div className="space-y-8">
            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <h4 className="text-sm uppercase text-emerald-500 font-bold tracking-widest mb-6 flex items-center gap-2 font-h ml-2">
                <Activity size={14} /> Transfer Tracking
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ml-2">
                <Field>
                  <Label>Credentials Status</Label>
                  <div className="relative">
                    <select className={selectClasses} {...register('credentials_shared_status')}>
                      {['Shared', 'Pending Verification', 'Recovered'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
                  </div>
                </Field>
                <Field>
                  <Label>Shared Platform</Label>
                  <div className="relative">
                    <select className={selectClasses} {...register('credentials_shared_platform')}>
                      {['WhatsApp', 'Telegram', 'Instagram', 'Face-to-Face'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
                  </div>
                </Field>
                <Field>
                  <Label>Shared By</Label>
                  <input className={inputClasses} placeholder="Staff Name" {...register('credentials_shared_by')} />
                </Field>
                <Field>
                  <Label>Shared Date</Label>
                  <input type="date" className={inputClasses} {...register('shared_date')} />
                </Field>
                <Field>
                  <Label>Shared Time</Label>
                  <input type="time" className={inputClasses} {...register('shared_time')} />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Primary */}
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <div className="flex justify-between items-center mb-6 ml-2">
                  <h4 className="text-sm uppercase text-yellow-500 font-bold tracking-widest flex items-center gap-2 font-h"><Key size={14} /> Primary Login</h4>
                </div>
                <div className="flex flex-col gap-4 flex-1 ml-2">
                  <div className="grid grid-cols-1 gap-4">
                    <Field>
                      <Label>Provider</Label>
                      <input type="hidden" {...register('primary_login_provider')} />
                      <ProviderIconSelector
                        value={watch('primary_login_provider')}
                        onChange={(val) => setValue('primary_login_provider', val, { shouldValidate: true, shouldDirty: true })}
                      />
                    </Field>
                  </div>
                  {renderProviderFields('primary')}
                </div>
              </div>

              {/* Secondary */}
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-muted)]"></div>
                <div className="flex justify-between items-center mb-6 ml-2">
                  <h4 className="text-sm uppercase text-[var(--color-muted)] font-bold tracking-widest flex items-center gap-2 font-h"><Link2 size={14} /> Secondary Login</h4>
                </div>
                <div className="flex flex-col gap-4 flex-1 ml-2">
                  <Field>
                    <Label>Scenario</Label>
                    <input type="hidden" {...register('secondary_login_scenario')} />
                    <ScenarioIconSelector 
                      value={watch('secondary_login_scenario')} 
                      onChange={(val) => setValue('secondary_login_scenario', val, { shouldValidate: true, shouldDirty: true })} 
                    />
                  </Field>

                  {(secScenario === 'Show Login Providers (Disabled)' || secScenario === 'Social media Logins (Provided)') && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <Field>
                          <Label>Provider</Label>
                          <input type="hidden" {...register('secondary_login_provider')} />
                          <ProviderIconSelector
                            value={watch('secondary_login_provider')}
                            onChange={(val) => setValue('secondary_login_provider', val, { shouldValidate: true, shouldDirty: true })}
                          />
                        </Field>
                      </div>

                      {secScenario === 'Show Login Providers (Disabled)' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <Field>
                            <Label>Disabled Date</Label>
                            <input type="date" className={inputClasses} {...register('secondary_disabled_date')} />
                          </Field>
                          <Field>
                            <Label>Disabled Time</Label>
                            <input type="time" className={inputClasses} {...register('secondary_disabled_time')} />
                          </Field>
                          <Field className="sm:col-span-2">
                            <Label>Reason / Details for disabling</Label>
                            <input className={inputClasses} placeholder="e.g. Unlinked, Not Safe..." {...register('secondary_disabled_reason')} />
                          </Field>
                        </div>
                      )}

                      {secScenario === 'Social media Logins (Provided)' && (
                        renderProviderFields('secondary')
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── STEP 3: Unlink Timeline ───────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <div className="ml-2">
                <h4 className="text-sm uppercase text-cyan-500 font-bold tracking-widest mb-2 font-h flex items-center gap-2">
                  <Clock size={14} /> Unlink Timeline
                </h4>
                <p className="text-xs text-[var(--color-muted)] font-mono mb-6">Dates to track when logins can be safely unlinked from the account.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Primary Unlink */}
                  <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                    <h5 className="text-[11px] uppercase text-gray-300 font-bold tracking-widest mb-4 font-mono flex items-center gap-2">
                      <Key size={12} className="text-yellow-500" /> Primary Login
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <Label>Unlink Eligible Date</Label>
                        <input type="date" className={inputClasses} {...register('primary_unlink_eligible_date')} />
                      </Field>
                      <Field>
                        <Label>Unlink Expiry Date</Label>
                        <input type="date" className={inputClasses} {...register('primary_unlink_expiry_date')} />
                      </Field>
                    </div>
                  </div>

                  {/* Secondary Unlink */}
                  <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                    <h5 className="text-[11px] uppercase text-gray-300 font-bold tracking-widest mb-4 font-mono flex items-center gap-2">
                      <Key size={12} className="text-[var(--color-muted)]" /> Secondary Login
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <Label>Unlink Eligible Date</Label>
                        <input type="date" className={inputClasses} {...register('secondary_unlink_eligible_date')} />
                      </Field>
                      <Field>
                        <Label>Unlink Expiry Date</Label>
                        <input type="date" className={inputClasses} {...register('secondary_unlink_expiry_date')} />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ── STEP 4: Unlink Guarantee ──────────────────────────────────────────
      case 4:
        const primaryPlan = watch('primary_unlink_plan');
        const secondaryPlan = watch('secondary_unlink_plan');
        const primaryCustomDays = watch('primary_custom_days');
        const secondaryCustomDays = watch('secondary_custom_days');
        const txDateValue = watch('transaction_date');

        const primaryHealth = getUnlinkHealth(primaryPlan, primaryCustomDays);
        const secondaryHealth = getUnlinkHealth(secondaryPlan, secondaryCustomDays);

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Deal Completed Date */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <h4 className="text-sm uppercase text-emerald-500 font-bold tracking-widest mb-6 font-h ml-2 flex items-center gap-2">
                <Calendar size={14} /> Deal Completed Date
              </h4>
              <div className="ml-2">
                <input type="date" className={`${inputClasses} max-w-[250px] text-lg py-3`} {...register('transaction_date')} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Primary Login Card */}
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <h4 className="text-sm uppercase text-yellow-500 font-bold tracking-widest mb-6 font-h ml-2 flex items-center gap-2">
                  <Key size={14} /> Primary Login Unlink Guarantee
                </h4>
                
                <div className="flex-1 ml-2 flex flex-col gap-6">
                  <div className={`p-5 rounded-xl border flex items-center justify-between ${primaryHealth.bg} ${primaryHealth.border}`}>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-mono mb-1">Expiry Date</p>
                      <h3 className="text-xl font-bold font-mono text-white">{primaryHealth.expiryStr}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-mono mb-1">Days Left</p>
                      <h3 className={`text-3xl font-black font-mono leading-none ${primaryHealth.color}`}>{primaryHealth.days}</h3>
                    </div>
                  </div>

                  <Field>
                    <Label>Select Guarantee Plan</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['No Guarantee', '7 Days', '15 Days', '30 Days', '37 Days', '60 Days', 'Custom'].map(plan => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setValue('primary_unlink_plan', plan)}
                          className={`px-3 py-2 rounded-lg border text-xs font-bold tracking-wide transition-all ${
                            primaryPlan === plan 
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                            : 'bg-[#0b0e14] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                          }`}
                        >
                          {plan}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <AnimatePresence>
                    {primaryPlan === 'Custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Field>
                          <Label>Custom Days</Label>
                          <input type="number" min="1" className={`${inputClasses} max-w-[200px]`} placeholder="e.g. 45" {...register('primary_custom_days')} />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Secondary Login Card */}
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-muted)]"></div>
                <h4 className="text-sm uppercase text-[var(--color-muted)] font-bold tracking-widest mb-6 font-h ml-2 flex items-center gap-2">
                  <Key size={14} /> Secondary Login Unlink Guarantee
                </h4>
                
                <div className="flex-1 ml-2 flex flex-col gap-6">
                  <div className={`p-5 rounded-xl border flex items-center justify-between ${secondaryHealth.bg} ${secondaryHealth.border}`}>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-mono mb-1">Expiry Date</p>
                      <h3 className="text-xl font-bold font-mono text-white">{secondaryHealth.expiryStr}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-mono mb-1">Days Left</p>
                      <h3 className={`text-3xl font-black font-mono leading-none ${secondaryHealth.color}`}>{secondaryHealth.days}</h3>
                    </div>
                  </div>

                  <Field>
                    <Label>Select Guarantee Plan</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['No Guarantee', '7 Days', '15 Days', '30 Days', '37 Days', '60 Days', 'Custom'].map(plan => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setValue('secondary_unlink_plan', plan)}
                          className={`px-3 py-2 rounded-lg border text-xs font-bold tracking-wide transition-all ${
                            secondaryPlan === plan 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                            : 'bg-[#0b0e14] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                          }`}
                        >
                          {plan}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <AnimatePresence>
                    {secondaryPlan === 'Custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Field>
                          <Label>Custom Days</Label>
                          <input type="number" min="1" className={`${inputClasses} max-w-[200px]`} placeholder="e.g. 45" {...register('secondary_custom_days')} />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {secondaryPlan === 'No Guarantee' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -5 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-start gap-3 mt-auto"
                      >
                        <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                        <p>Secondary Login Not Covered Under Guarantee. Customer assumes full responsibility for this login method.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Terms & Special Conditions */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              <h4 className="text-sm uppercase text-purple-500 font-bold tracking-widest mb-6 font-h ml-2 flex items-center gap-2">
                <FileText size={14} /> Terms & Special Conditions
              </h4>
              
              <div className="flex-1 ml-2 flex flex-col h-full">
                <textarea 
                  className={`${inputClasses} flex-1 min-h-[140px] resize-y bg-[#0b0e14] leading-relaxed`} 
                  placeholder="Examples:&#10;- Secondary login included&#10;- Recovery not guaranteed&#10;- Linked mail excluded&#10;- Customer informed about unlink risk&#10;- Account sold as-is"
                  {...register('terms_and_conditions')} 
                />
              </div>
            </div>
          </div>
        );


      // ── STEP 5: Financials ────────────────────────────────────────────────
      case 5:
        const marginPct = soldPrice > 0 ? ((profit / soldPrice) * 100).toFixed(1) : "0.0";
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field>
              <Label>Cost Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold font-mono text-xs">₹</span>
                <input type="number" className={`${inputClasses} pl-8 font-bold text-gray-300`} placeholder="0.00" {...register('owner_price')} />
              </div>
            </Field>
            <Field>
              <Label>Sold Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60 font-bold font-mono text-xs">₹</span>
                <input type="number" className={`${inputClasses} pl-8 font-bold text-emerald-400`} placeholder="0.00" {...register('sold_price')} />
              </div>
            </Field>
            <Field>
              <Label>Commission / Brokerage (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold font-mono text-xs">₹</span>
                <input type="number" className={`${inputClasses} pl-8`} placeholder="0.00" {...register('commission')} />
              </div>
            </Field>
            <Field>
              <Label>Additional Expenses (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold font-mono text-xs">₹</span>
                <input type="number" className={`${inputClasses} pl-8`} placeholder="0.00" {...register('additional_expenses')} />
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

            <Field>
              <Label>Mode of Deal</Label>
              <div className="relative mt-4">
                <select className={selectClasses} {...register('mode_of_deal')}>
                  {['WhatsApp', 'Telegram', 'Instagram', 'Face to Face'].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
            <Field>
              <Label>Mode of Payment</Label>
              <div className="relative mt-4">
                <select className={selectClasses} {...register('mode_of_payment')}>
                  {[
                    'Full Payment via UPI / Bank Transfer',
                    'Full Payment in Cash',
                    'Half Payment in UPI / Bank Transfer & Half in Cash',
                    'Easy Monthly Instalment (EMI)',
                  ].map(o => <option key={o} className="bg-[#0b0e14]">{o}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
              </div>
            </Field>
            <Field span>
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

      // ── STEP 6: Documents & Notes ─────────────────────────────────────────
      case 6:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-xs uppercase text-white font-bold tracking-widest mb-6 flex items-center gap-2 font-mono border-b border-white/5 pb-4">
                <Folder size={14} className="text-yellow-500" /> Cloud Documents
              </h4>
              {[
                { label: 'Payment Proof Link', key: 'payment_proof_link' },
                { label: 'Buyer Proof Link', key: 'buyer_proof_link' },
                { label: 'Seller Proof Link', key: 'seller_proof_link' },
                { label: 'Account Proof Link', key: 'account_proof_link' },
                { label: 'Chat Screenshots Link', key: 'chat_proof_link' },
                { label: 'Google Drive Folder', key: 'drive_link' },
              ].map(({ label, key }) => (
                <Field key={key}>
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} placeholder="https://" {...register(key)} />
                    <button type="button" onClick={() => { const link = watch(key); if(link) window.open(link, '_blank'); else toast.error('No link provided'); }} className="btn btn-outline border-white/5 hover:border-yellow-500/30 px-4 rounded-xl flex items-center justify-center bg-black/20">
                      <ExternalLink size={16} className="text-[var(--color-muted)] hover:text-white transition-colors" />
                    </button>
                  </div>
                </Field>
              ))}
            </div>
            
            <div className="space-y-6 flex flex-col">
              <h4 className="text-xs uppercase text-white font-bold tracking-widest mb-6 flex items-center gap-2 font-mono border-b border-white/5 pb-4">
                <MessageCircle size={14} className="text-yellow-500" /> Internal Notes (Staff Only)
              </h4>
              <Field span className="flex-1 flex flex-col">
                <textarea className={`${inputClasses} flex-1 min-h-[300px] resize-none font-mono text-[12px] leading-relaxed bg-[#0b0e14]`} placeholder="Enter any internal deal notes, special customer requests, or staff instructions here..." {...register('internal_notes')} />
              </Field>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const summaryPrimaryHealth = getUnlinkHealth(watch('primary_unlink_plan'), watch('primary_custom_days'));

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 items-start relative px-4 sm:px-6 lg:px-8 py-8 xl:py-0">
      
      {/* ── LEFT COLUMN: MAIN EDITOR ───────────────────────────────────────── */}
      <div className="w-full xl:w-[70%] flex flex-col gap-8">
        
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="btn btn-outline border-white/5 text-[var(--color-muted)] hover:text-white hover:border-yellow-500/30 px-5 py-2.5 text-xs flex items-center gap-2 transition-all rounded-xl bg-black/20">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Transactions</span><span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex gap-2">
            <button type="button" onClick={() => handleCopy(nextId, 'Transaction ID')} className="btn btn-outline border-white/5 hover:bg-white/5 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-gray-400 hover:text-white transition-all bg-black/20"><Copy size={14}/> Copy ID</button>
          </div>
        </div>

        {/* Transaction Overview Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#080a0f] to-[#040508]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-3 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <div className="font-mono text-lg font-black text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/15 shadow-inner">
                #{nextId}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                Account Sale
              </span>
            </div>
            <h2 className="font-h text-2xl sm:text-3xl font-black text-white uppercase tracking-wide leading-tight max-w-lg">
              {watch('account_title') || (initialData ? 'Edit Account Transaction' : 'New Account Transaction')}
            </h2>
            <p className="text-[var(--color-muted)] text-[11px] font-mono font-bold mt-1 uppercase tracking-widest">
              Created: <span className="text-gray-300">{watch('transaction_date')}</span>
            </p>
          </div>
          <div className="relative z-10 md:text-right mt-4 md:mt-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 font-mono mb-2">Transaction Status</p>
            <div className={`px-5 py-2.5 rounded-xl border font-bold uppercase tracking-wide text-[11px] shadow-inner ${
              currentPaymentStatus === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              currentPaymentStatus === 'Pending Payment' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
              currentPaymentStatus === 'Disputed' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
              'bg-gray-500/10 border-gray-500/20 text-gray-400'
            }`}>
              {currentPaymentStatus || 'Draft'}
            </div>
          </div>
        </div>

        {/* Step Navigator (Progress tracking) */}
        <div className="flex flex-col sm:flex-row bg-[#080a0f]/80 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i;
            const isDone = step > i;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-1 p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${isActive ? 'bg-yellow-500/10' : 'bg-transparent hover:bg-white/5'} ${i < STEPS.length - 1 ? 'sm:border-r border-r-white/5' : ''}`}
              >
                <Icon size={16} className={isDone ? 'text-emerald-400' : isActive ? 'text-yellow-500' : 'text-[var(--color-muted)]'} />
                <span className={`text-[9px] font-bold tracking-widest uppercase font-mono ${isDone ? 'text-emerald-400' : isActive ? 'text-yellow-500' : 'text-[var(--color-muted)]'}`}>
                  {isDone ? '✓ ' : ''}{s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form area */}
        <form className="flex flex-col gap-8 pb-24 xl:pb-0" onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/5 shadow-2xl bg-gradient-to-b from-[#080a0f] to-[#040508]"
            >
              <h3 className="text-sm font-bold text-white mb-8 pb-5 border-b border-white/5 flex items-center gap-3 font-h uppercase tracking-wider">
                <span className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/15 shadow-inner">
                  {React.createElement(STEPS[step].icon, { size: 16, className: "text-yellow-500" })}
                </span>
                {STEPS[step].label}
              </h3>
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 w-full xl:relative xl:w-auto p-4 xl:p-0 bg-[#040508]/90 backdrop-blur-xl xl:bg-transparent border-t border-white/5 xl:border-none z-40 flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`btn btn-outline border-white/5 text-white px-6 py-3.5 flex items-center gap-2 rounded-xl text-xs bg-[#0b0e14] xl:bg-transparent shadow-lg ${step === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}
            >
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Previous</span>
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                className="btn btn-gold px-8 py-3.5 flex items-center gap-2 rounded-xl text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl flex-1 sm:flex-none justify-center"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !canSubmit}
                className={`btn btn-gold px-8 py-3.5 flex items-center gap-2 rounded-xl text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl flex-1 sm:flex-none justify-center ${(!canSubmit && !isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin inline-block" /> Saving...</>
                ) : (
                  <><Save size={16} /> Save Transaction</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── RIGHT COLUMN: HEALTH SIDEBAR ───────────────────────────────────── */}
      <div className="w-full xl:w-[30%] order-first xl:order-last">
        <div className="xl:sticky xl:top-8 glass-panel rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col bg-gradient-to-b from-[#080a0f] to-[#040508]">
          <div className="p-6 bg-[#0b0e14]/50 border-b border-white/5 flex items-center gap-3">
            <Activity size={18} className="text-yellow-500" />
            <h3 className="font-h uppercase font-black text-sm tracking-widest text-white">Transaction Health</h3>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Payment Status</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${currentPaymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-inner' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-inner'}`}>
                {currentPaymentStatus === 'Paid' ? '✓ Paid' : currentPaymentStatus || 'Pending'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Primary Login</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${credsStatus === 'Shared' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-inner' : 'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-inner'}`}>
                {credsStatus === 'Shared' ? '✓ Shared' : credsStatus || 'Pending'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Secondary Login</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${secondaryProvider === 'Null (Single Login Only)' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20 shadow-inner' : credsStatus === 'Shared' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-inner' : 'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-inner'}`}>
                {secondaryProvider === 'Null (Single Login Only)' ? '— None' : credsStatus === 'Shared' ? '✓ Shared' : 'Pending'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Unlink Guarantee</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border shadow-inner ${summaryPrimaryHealth.bg} ${summaryPrimaryHealth.border} ${summaryPrimaryHealth.color}`}>
                {summaryPrimaryHealth.status === 'Not Applicable' ? '—' : summaryPrimaryHealth.status === 'Active' ? `✓ Active (${summaryPrimaryHealth.days}d)` : summaryPrimaryHealth.status}
              </span>
            </div>

            <div className="h-[1px] w-full bg-white/5 my-2"></div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Net Profit</span>
              <span className={`text-xl font-black font-mono tracking-wide ${profit > 0 ? 'text-emerald-400' : 'text-white'}`}>
                ₹{profit.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Last Updated</span>
              <span className="text-[10px] font-mono font-bold text-gray-300">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
