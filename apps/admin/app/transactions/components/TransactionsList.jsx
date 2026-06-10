"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, FileText, Download, Trash2, ChevronLeft, ChevronRight, FileOutput, Receipt, RefreshCw, Calendar, CalendarOff } from 'lucide-react';
import { fetchAllTransactions, deleteTransaction } from '../../services/transactionService';

import { toast } from 'sonner';
import { exportToExcel } from '../../lib/excelExport';
import { generateCustomerPDF, generateInternalPDF, testPDF } from '../../lib/pdfGenerator';

export default function TransactionsList({ onAddNew }) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [includePrintDate, setIncludePrintDate] = useState(true);
  const [selectedTxForDetails, setSelectedTxForDetails] = useState(null);

  const handleCustomerDownload = async (tx) => {
    await toast.promise(
      (async () => {
        const txWithDate = { ...tx, exclude_print_date: !includePrintDate };
        await generateCustomerPDF(txWithDate);
      })(),
      {
        loading: `Generating Customer PDF for ${tx.transaction_id || ''}...`,
        success: 'Customer PDF downloaded successfully! 🎉',
        error: 'Failed to generate Customer PDF. ❌',
      }
    );
  };

  const handleInternalDownload = async (tx) => {
    await toast.promise(
      (async () => {
        const txWithDate = { ...tx, exclude_print_date: !includePrintDate };
        await generateInternalPDF(txWithDate);
      })(),
      {
        loading: `Generating Admin PDF for ${tx.transaction_id || ''}...`,
        success: 'Admin PDF downloaded successfully! 🚀',
        error: 'Failed to generate Admin PDF. ❌',
      }
    );
  };

  // const handleBothDownload = async (tx) => {
  //   await toast.promise(
  //     (async () => {
  //       const txWithDate = { ...tx, exclude_print_date: !includePrintDate };
  //       await generateCustomerPDF(txWithDate);
  //       await new Promise(r => setTimeout(r, 800)); // Delay to prevent browser blocking double downloads
  //       await generateInternalPDF(txWithDate);
  //     })(),
  //     {
  //       loading: `Generating both PDFs for ${tx.transaction_id || ''}...`,
  //       success: 'Both PDFs downloaded successfully! 📄✨',
  //       error: 'Failed to generate one or both PDFs. ❌',
  //     }
  //   );
  // };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions(forceRefresh);
      setData(txs || []);
      if (forceRefresh) toast.success('Transactions refreshed');
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tx) => {
    if (!tx) return;
    const identifier = tx.id || tx.transaction_id;
    if (!window.confirm(`Are you sure you want to delete transaction ${tx.transaction_id || ''}?`)) return;

    // Optimistic UI update
    const previousData = [...data];
    setData(prev => prev.filter(item => item.id !== tx.id && item.transaction_id !== tx.transaction_id));

    try {
      await deleteTransaction(tx);
      toast.success('Transaction deleted successfully');
      // No need to reload data if it's optimistic, unless we want to ensure cache is cleared.
      // The backend will clear its cache automatically on delete.
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast.error(`Failed to delete transaction: ${error.message || 'Unknown error'}`);
      // Revert optimistic update
      setData(previousData);
    }
  };

  const handleExport = () => {
    exportToExcel(data, 'Transactions_Export');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'transaction_id',
        header: 'Tx ID',
        cell: info => <span className="text-blue-400 font-mono text-xs">{info.getValue()}</span>,
      },
      {
        accessorKey: 'transaction_type',
        header: 'Type',
        cell: info => {
          const type = info.getValue();
          let statusClass = 'status';
          if (type === 'Account') statusClass += ' status-available';
          else if (type === 'XSuit') statusClass += ' status-pending';
          else if (type === 'Supercar') statusClass += ' status-sold';
          else statusClass += ' status-available';

          return (
            <span className={statusClass}>
              {type}
            </span>
          );
        }
      },
      {
        accessorKey: 'transaction_date',
        header: 'Date',
        cell: info => <span className="text-white/60">{new Date(info.getValue()).toLocaleDateString()}</span>,
      },
      {
        accessorKey: 'sold_price',
        header: 'Amount',
        cell: info => <span className="font-bold text-white">₹{Number(info.getValue() || 0).toLocaleString()}</span>,
      },
      {
        accessorKey: 'buyer_phone',
        header: 'Customer Phone',
        cell: info => <span className="text-white/80">{info.getValue() || 'N/A'}</span>,
      },
      {
        accessorKey: 'payment_status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          return (
            <span className={`status ${status === 'Paid' ? 'status-available' : 'status-pending'}`}>
              {status}
            </span>
          );
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedTxForDetails(row.original)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eaeaea', background: 'var(--color-bg2)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}><Eye size={13} /> View</button>
            <button onClick={() => handleCustomerDownload(row.original)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gold)', background: 'var(--color-gold-dim)', border: '1px solid var(--color-border-gold)', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}><FileText size={13} /> Cust PDF</button>
            <button onClick={() => handleInternalDownload(row.original)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-orange)', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}><FileOutput size={13} /> Int PDF</button>
            <button onClick={() => handleDelete(row.original)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-red)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}><Trash2 size={13} /> Delete</button>
          </div>
        )
      }
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (typeFilter === 'All') return data;
    return data.filter(item => item.transaction_type === typeFilter);
  }, [data, typeFilter]);

  // Debounce global filter
  const [debouncedFilter, setDebouncedFilter] = useState(globalFilter);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter: debouncedFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const renderDetailSection = (title, items) => {
    return (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.1em', margin: '0 0 12px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', fontWeight: 700 }}>{title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px' }}>
          {items.map(([label, val, highlight]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '2px' }}>{label}</span>
              <span style={{ fontSize: '13px', color: highlight ? 'var(--color-gold)' : '#fff', fontWeight: highlight ? 700 : 500, wordBreak: 'break-all' }}>{val || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-lg border border-[var(--color-border-gold)]">
        <div className="flex flex-1 flex-wrap gap-4 min-w-[300px]">
          <div className="relative flex-1 min-w-[200px] max-w-[400px]">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full bg-black/40 border border-[var(--color-border)] rounded-xl py-2.5 pl-10 pr-4 text-[13.5px] text-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all"
              placeholder="Search ID or Phone..."
            />
          </div>

          <div className="relative min-w-[150px]">
            <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full bg-black/40 border border-[var(--color-border)] rounded-xl py-2.5 pl-10 pr-10 text-[13.5px] text-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all appearance-none cursor-pointer"
            >
              <option value="All" className="bg-[#111520]">All Types</option>
              <option value="Account" className="bg-[#111520]">Account</option>
              <option value="XSuit" className="bg-[#111520]">XSuit</option>
              <option value="Supercar" className="bg-[#111520]">Supercar</option>
              <option value="UC" className="bg-[#111520]">UC</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-[var(--color-muted)] bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-xl cursor-pointer select-none hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={includePrintDate}
              onChange={e => setIncludePrintDate(e.target.checked)}
              className="accent-[var(--color-gold)] w-3.5 h-3.5 cursor-pointer"
            />
            <span className={includePrintDate ? 'text-white' : ''}>Print Date Footer</span>
          </label>

          <div className="relative">
            <button
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              className="btn btn-outline border-[var(--color-border-gold)] text-[var(--color-gold)] px-4 py-2.5 text-[12px] hover:bg-[var(--color-gold-dim)] h-[38px]"
            >
              <Eye size={16} /> Visibility
            </button>
            {showVisibilityDropdown && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-xl z-50 py-2 min-w-[180px] shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                {table.getAllLeafColumns().map(column => {
                  return (
                    <label key={column.id} className="flex items-center gap-3 px-4 py-2 text-[12.5px] cursor-pointer text-white hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="accent-[var(--color-gold)] w-3.5 h-3.5 cursor-pointer"
                      />
                      {column.id === 'transaction_id' ? 'Tx ID' : column.id === 'transaction_type' ? 'Type' : column.id === 'transaction_date' ? 'Date' : column.id === 'sold_price' ? 'Amount' : column.id === 'buyer_phone' ? 'Customer Phone' : column.id === 'payment_status' ? 'Status' : column.id === 'actions' ? 'Actions' : column.id}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => loadData(true)}
            className="btn btn-outline border-[var(--color-border)] text-[var(--color-muted)] px-4 py-2.5 text-[12px] hover:bg-white/5 h-[38px]"
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={handleExport} className="btn btn-green px-4 py-2.5 text-[12px] h-[38px]">
            <Download size={15} /> Export Excel
          </button>
          <button onClick={testPDF} className="btn btn-gold px-4 py-2.5 text-[12px] h-[38px]">
            Test PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap glass-panel rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="admin-table w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="bg-black/30 border-b border-[var(--color-border-gold)] text-[var(--color-gold)] font-bold text-xs uppercase tracking-wider py-4 px-4 text-left whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading && data.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="border-b border-white/5">
                    {columns.map((col, cIdx) => (
                      <td key={`skeleton-col-${cIdx}`} className="p-4">
                        <div className="h-6 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-20 text-[var(--color-muted)] font-medium">
                    <Receipt size={56} className="mx-auto mb-4 opacity-20 text-white" />
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-4 whitespace-nowrap text-[13.5px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[var(--color-border-gold)] flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="text-[12.5px] text-[var(--color-muted)] font-medium">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-outline border-[var(--color-border)] p-2 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-muted)] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-outline border-[var(--color-border)] p-2 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-muted)] hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxForDetails && (() => {
        const tx = selectedTxForDetails;
        const type = tx.transaction_type || 'Account';

        // ... data prep ...
        const dealBasics = [
          ['Transaction ID', tx.transaction_id, true],
          ['Transaction Type', type],
          ['Transaction Date', tx.transaction_date ? new Date(tx.transaction_date).toLocaleString('en-IN') : '—'],
          ['Mode of Deal', tx.mode_of_deal],
          ['Mode of Payment', tx.mode_of_payment],
          ['Payment Status', tx.payment_status, true]
        ];

        let productItems = [];
        if (type === 'Account') {
          const acc = tx.account_transactions?.[0] || {};
          productItems = [
            ['Primary Login Provider', acc.primary_login_provider, true],
            ['Primary Credentials', acc.primary_credentials],
            ['Primary Mothermail', acc.primary_mothermail_status],
            ['Secondary Login Provider', acc.secondary_login_provider, true],
            ['Secondary Credentials', acc.secondary_credentials],
            ['Secondary Mothermail', acc.secondary_mothermail_status],
            ['Guarantee Plan', acc.guarantee_plan, true],
            ['Primary Unlink Date', acc.primary_unlink_date ? new Date(acc.primary_unlink_date).toLocaleDateString('en-IN') : '—'],
            ['Primary Void Date', acc.primary_guarantee_void_date ? new Date(acc.primary_guarantee_void_date).toLocaleDateString('en-IN') : '—'],
            ['Secondary Unlink Date', acc.secondary_unlink_date ? new Date(acc.secondary_unlink_date).toLocaleDateString('en-IN') : '—'],
            ['Secondary Void Date', acc.secondary_guarantee_void_date ? new Date(acc.secondary_guarantee_void_date).toLocaleDateString('en-IN') : '—'],
            ['Product Link', acc.product_link]
          ];
        } else if (type === 'XSuit') {
          const xs = tx.xsuit_transactions?.[0] || {};
          productItems = [
            ['X-Suit Name', xs.xsuit_name, true],
            ['Gift Status', xs.gift_status],
            ['Delivery Date', xs.delivery_date ? new Date(xs.delivery_date).toLocaleDateString('en-IN') : '—'],
            ['Delivery Time', xs.delivery_time],
            ['Buyer In-Game Name', xs.buyer_ig_name],
            ['Buyer In-Game ID', xs.buyer_ig_id, true],
            ['Gifter In-Game Name', xs.gifter_ig_name],
            ['Gifter In-Game ID', xs.gifter_ig_id]
          ];
        } else if (type === 'Supercar') {
          const sc = tx.supercar_transactions?.[0] || {};
          productItems = [
            ['Supercar Name', sc.supercar_name, true],
            ['Card Tier (Tire)', sc.supercar_card_tier],
            ['Gift Status', sc.gift_status],
            ['Delivery Date', sc.delivery_date ? new Date(sc.delivery_date).toLocaleDateString('en-IN') : '—'],
            ['Buyer In-Game Name', sc.buyer_ig_name],
            ['Buyer In-Game ID', sc.buyer_ig_id, true],
            ['Gifter In-Game Name', sc.gifter_ig_name],
            ['Gifter In-Game ID', sc.gifter_ig_id]
          ];
        } else if (type === 'UC') {
          const uc = tx.uc_transactions?.[0] || {};
          productItems = [
            ['UC Method', uc.uc_method, true],
            ['UC Pack', uc.uc_pack],
            ['Number of Packs', uc.num_packs],
            ['Total UC', uc.total_uc, true],
            ['Delivery Status', uc.delivery_status],
            ['Delivery Date', uc.delivery_date ? new Date(uc.delivery_date).toLocaleDateString('en-IN') : '—']
          ];
        }

        const sold = Number(tx.sold_price || 0);
        const cost = Number(tx.owner_price || 0);
        const profit = sold - cost;
        const profitColorClass = profit >= 0 ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]';

        const contactItems = [
          ['Buyer Phone', tx.buyer_phone],
          ['Owner Phone', tx.owner_phone],
          ['Seller Phone', tx.seller_phone],
          ['Reseller Phone', tx.reseller_phone]
        ];

        const renderSection = (title, items) => (
          <div className="mb-8">
            <h3 className="text-[13px] uppercase text-[var(--color-gold)] tracking-widest mb-4 border-b border-[var(--color-border)] pb-2.5 font-bold flex items-center gap-2">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
              {items.map(([label, val, highlight]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[11.5px] text-[var(--color-muted)] mb-1 font-medium">{label}</span>
                  <span className={`text-[13.5px] break-all ${highlight ? 'text-[var(--color-gold)] font-bold' : 'text-white font-medium'}`}>{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 sm:p-6 transition-opacity">
            <div className="bg-[#0b0e14] border border-[var(--color-border-gold)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative scrollbar-thin">
              
              {/* Header */}
              <div className="flex justify-between items-start sm:items-center mb-8 pb-5 border-b border-[var(--color-border-gold)]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white m-0 flex flex-wrap items-center gap-3">
                    Transaction Details
                    <span className="text-[11px] px-2.5 py-1 rounded bg-[var(--color-gold-dim)] text-[var(--color-gold)] font-bold tracking-widest uppercase">
                      {type}
                    </span>
                  </h2>
                  <p className="text-[12.5px] text-[var(--color-muted)] mt-1.5 font-medium">Unique Ref: <span className="text-white/80">{tx.transaction_id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedTxForDetails(null)}
                  className="btn btn-outline border-[var(--color-border)] text-[var(--color-muted)] hover:text-white hover:border-[var(--color-gold)] px-5 py-2 text-xs"
                >
                  Close
                </button>
              </div>

              {/* Sections */}
              {renderSection('📊 Deal Information', dealBasics)}
              {renderSection('🎮 Product Details', productItems)}

              {/* Financial Section */}
              <div className="mb-8">
                <h3 className="text-[13px] uppercase text-[var(--color-gold)] tracking-widest mb-4 border-b border-[var(--color-border)] pb-2.5 font-bold">💰 Financial Overview (Confidential)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/40 p-5 rounded-xl border border-white/5 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[11.5px] text-[var(--color-muted)] mb-1 font-medium">Cost Price</span>
                    <span className="text-lg text-white font-bold tracking-wide">₹{cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11.5px] text-[var(--color-muted)] mb-1 font-medium">Sold Price</span>
                    <span className="text-lg text-[var(--color-gold)] font-bold tracking-wide">₹{sold.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11.5px] text-[var(--color-muted)] mb-1 font-medium">Net Profit</span>
                    <span className={`text-xl font-black tracking-wide ${profitColorClass}`}>
                      ₹{Math.abs(profit).toLocaleString()} {profit >= 0 ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {renderSection('📞 Party Contacts', contactItems)}

              {tx.owner_proof_link && (
                <div className="mb-8">
                  <h3 className="text-[13px] uppercase text-[var(--color-gold)] tracking-widest mb-4 border-b border-[var(--color-border)] pb-2.5 font-bold">🔗 Ownership Proof</h3>
                  <a href={tx.owner_proof_link} target="_blank" rel="noopener noreferrer" className="text-[13.5px] text-blue-400 hover:text-blue-300 underline underline-offset-4 break-all font-medium">
                    {tx.owner_proof_link}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-[var(--color-border)] pt-6 mt-4 flex flex-wrap gap-3 justify-end bg-[#0b0e14] sticky bottom-[-32px] py-4">
                <button onClick={() => handleCustomerDownload(tx)} className="btn btn-gold text-xs px-5 py-2.5 shadow-[0_4px_15px_rgba(255,215,0,0.2)]">
                  <FileText size={15} /> Customer PDF
                </button>
                <button onClick={() => handleInternalDownload(tx)} className="btn btn-outline border-orange-500/30 text-orange-500 hover:bg-orange-500/10 text-xs px-5 py-2.5">
                  <FileOutput size={15} /> Internal PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
