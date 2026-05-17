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

import toast from 'react-hot-toast';
import { exportToExcel } from '../../lib/excelExport';
import { generateCustomerPDF, generateInternalPDF } from '../../lib/pdfGenerator';

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

  const handleBothDownload = async (tx) => {
    await toast.promise(
      (async () => {
        const txWithDate = { ...tx, exclude_print_date: !includePrintDate };
        await generateCustomerPDF(txWithDate);
        await new Promise(r => setTimeout(r, 800)); // Delay to prevent browser blocking double downloads
        await generateInternalPDF(txWithDate);
      })(),
      {
        loading: `Generating both PDFs for ${tx.transaction_id || ''}...`,
        success: 'Both PDFs downloaded successfully! 📄✨',
        error: 'Failed to generate one or both PDFs. ❌',
      }
    );
  };

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
      await deleteTransaction(identifier);
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setSelectedTxForDetails(row.original)} style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="View Details"><Eye size={16} /></button>
            <button onClick={() => handleCustomerDownload(row.original)} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Customer PDF"><FileText size={16} /></button>
            <button onClick={() => handleInternalDownload(row.original)} style={{ color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Internal PDF"><FileOutput size={16} /></button>
            <button onClick={() => handleBothDownload(row.original)} style={{ color: '#2ecc71', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Download Both PDFs"><Download size={16} /></button>
            <button 
              onClick={() => {
                setIncludePrintDate(prev => {
                  const next = !prev;
                  toast.success(next ? 'Print Date Footer Enabled' : 'Print Date Footer Disabled');
                  return next;
                });
              }} 
              style={{ color: includePrintDate ? 'var(--gold)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} 
              title={includePrintDate ? "Print Date Option (Active)" : "Print Date Option (Muted)"}
            >
              {includePrintDate ? <Calendar size={16} /> : <CalendarOff size={16} />}
            </button>
            <button onClick={() => handleDelete(row.original)} style={{ color: 'var(--red)' }} title="Delete"><Trash2 size={16} /></button>
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
        <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '0.1em', margin: '0 0 12px 0', borderBottom: '1px solid var(--border)', paddingBottom: '6px', fontWeight: 700 }}>{title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px' }}>
          {items.map(([label, val, highlight]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>{label}</span>
              <span style={{ fontSize: '13px', color: highlight ? 'var(--gold)' : '#fff', fontWeight: highlight ? 700 : 500, wordBreak: 'break-all' }}>{val || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1, gap: '16px', minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search ID or Phone..."
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            >
              <option value="All">All Types</option>
              <option value="Account">Account</option>
              <option value="XSuit">XSuit</option>
              <option value="Supercar">Supercar</option>
              <option value="UC">UC</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--muted)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', height: '38px', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={includePrintDate}
              onChange={e => setIncludePrintDate(e.target.checked)}
              style={{ accentColor: 'var(--gold)', cursor: 'pointer', width: '14px', height: '14px' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 600 }}>Print Date Footer</span>
          </label>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              className="btn btn-outline"
              style={{ padding: '10px 16px', fontSize: '12px', borderColor: 'var(--border-gold)', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={16} /> Visibility
            </button>
            {showVisibilityDropdown && (
              <div style={{ position: 'absolute', top: '44px', right: 0, background: 'var(--bg3)', border: '1px solid var(--border-gold)', borderRadius: '8px', zIndex: 100, padding: '8px 0', minWidth: '180px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                {table.getAllLeafColumns().map(column => {
                  return (
                    <label key={column.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', color: 'var(--text)', transition: 'background 0.2s' }}>
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        style={{ accentColor: 'var(--gold)', cursor: 'pointer', width: '15px', height: '15px' }}
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
            className="btn btn-outline"
            style={{ padding: '10px 16px', fontSize: '12px' }}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="btn btn-green"
            style={{ padding: '10px 16px', fontSize: '12px' }}
          >
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading && data.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    {columns.map((col, cIdx) => (
                      <td key={`skeleton-col-${cIdx}`}>
                        <div style={{ height: '24px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite opacity' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    <Receipt size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                    No transactions found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
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
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-outline"
              style={{ padding: '8px', opacity: !table.getCanPreviousPage() ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-outline"
              style={{ padding: '8px', opacity: !table.getCanNextPage() ? 0.5 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      {/* Transaction Details Modal */}
      {selectedTxForDetails && (() => {
        const tx = selectedTxForDetails;
        const type = tx.transaction_type || 'Account';
        
        // 1. Deal basics
        const dealBasics = [
          ['Transaction ID', tx.transaction_id, true],
          ['Transaction Type', type],
          ['Transaction Date', tx.transaction_date ? new Date(tx.transaction_date).toLocaleString('en-IN') : '—'],
          ['Mode of Deal', tx.mode_of_deal],
          ['Mode of Payment', tx.mode_of_payment],
          ['Payment Status', tx.payment_status, true]
        ];

        // 2. Product-specific details
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

        // 3. Finances
        const sold = Number(tx.sold_price || 0);
        const cost = Number(tx.owner_price || 0);
        const profit = sold - cost;
        const profitColor = profit >= 0 ? '#2ecc71' : '#ef4444';

        // 4. Contacts
        const contactItems = [
          ['Buyer Phone', tx.buyer_phone],
          ['Owner Phone', tx.owner_phone],
          ['Seller Phone', tx.seller_phone],
          ['Reseller Phone', tx.reseller_phone]
        ];

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 5, 10, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border-gold)',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              position: 'relative'
            }}>
              {/* Top Bar / Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Transaction Details
                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'var(--gold-dim)', color: 'var(--gold)', fontWeight: 700 }}>
                      {type}
                    </span>
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Unique Ref: {tx.transaction_id}</p>
                </div>
                <button
                  onClick={() => setSelectedTxForDetails(null)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '8px 16px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  Close
                </button>
              </div>

              {/* Deal Info Section */}
              {renderDetailSection('📊 Deal Information', dealBasics)}

              {/* Product Info Section */}
              {renderDetailSection('🎮 Product Details', productItems)}

              {/* Financial Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '0.1em', margin: '0 0 12px 0', borderBottom: '1px solid var(--border)', paddingBottom: '6px', fontWeight: 700 }}>💰 Financial Overview (Confidential)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px', background: '#111122', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Cost Price</span>
                    <span style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>₹{cost.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Sold Price</span>
                    <span style={{ fontSize: '16px', color: 'var(--gold)', fontWeight: 700 }}>₹{sold.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Net Profit</span>
                    <span style={{ fontSize: '16px', color: profitColor, fontWeight: 800 }}>
                      ₹{profit.toLocaleString()} {profit >= 0 ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contacts Section */}
              {renderDetailSection('📞 Party Contacts', contactItems)}

              {tx.owner_proof_link && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '0.1em', margin: '0 0 12px 0', borderBottom: '1px solid var(--border)', paddingBottom: '6px', fontWeight: 700 }}>🔗 Ownership Proof</h3>
                  <a href={tx.owner_proof_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'underline', wordBreak: 'break-all' }}>
                    {tx.owner_proof_link}
                  </a>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleCustomerDownload(tx)}
                  className="btn btn-gold"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <FileText size={16} /> Customer PDF
                </button>
                <button
                  onClick={() => handleInternalDownload(tx)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '12px', borderColor: 'var(--orange)', color: 'var(--orange)', cursor: 'pointer', background: 'none' }}
                >
                  <FileOutput size={16} /> Internal PDF
                </button>
                <button
                  onClick={() => handleBothDownload(tx)}
                  className="btn btn-green"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <Download size={16} /> Download Both
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      </div>
    </div>
  );
}
