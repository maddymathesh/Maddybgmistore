"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, FileText, Download, Trash2, ChevronLeft, ChevronRight, FileOutput, Receipt, RefreshCw, Calendar, CalendarOff, Edit2 } from 'lucide-react';
import { fetchAllTransactions, deleteTransaction } from '../../services/transactionService';

import { toast } from 'sonner';
import { exportToExcel } from '../../lib/excelExport';
import { generateCustomerPDF, generateInternalPDF, testPDF } from '../../lib/pdfGenerator';
import { Dropdown } from '@repo/ui/dropdown';

export default function TransactionsList({ onAddNew, onEdit }) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [selectedTxForDetails, setSelectedTxForDetails] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleCustomerDownload = async (tx) => {
    await toast.promise(
      (async () => {
        const txWithDate = { ...tx, exclude_print_date: false };
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
        const txWithDate = { ...tx, exclude_print_date: false };
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
      setSelectedIds([]); // Clear selection when data changes
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected transaction(s)?`)) return;

    const idsToDelete = [...selectedIds];
    const previousData = [...data];
    setData(prev => prev.filter(tx => !idsToDelete.includes(tx.id) && !idsToDelete.includes(tx.transaction_id)));
    setSelectedIds([]);

    await toast.promise(
      (async () => {
        for (const id of idsToDelete) {
          const tx = previousData.find(t => t.id === id || t.transaction_id === id);
          if (tx) {
            await deleteTransaction(tx);
          }
        }
      })(),
      {
        loading: `Deleting ${idsToDelete.length} transactions...`,
        success: 'Selected transactions deleted successfully! 🗑️',
        error: 'Error occurred while deleting some transactions. ❌',
      }
    );
  };

  const handleBulkExport = () => {
    const selectedData = data.filter(tx => selectedIds.includes(tx.id) || selectedIds.includes(tx.transaction_id));
    exportToExcel(selectedData, 'Selected_Transactions_Export');
  };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedIds(filteredData.map(tx => tx.id || tx.transaction_id));
              } else {
                setSelectedIds([]);
              }
            }}
            className="accent-yellow-500 h-4 w-4 rounded cursor-pointer border-white/10 bg-black/40"
          />
        ),
        cell: ({ row }) => {
          const tx = row.original;
          const id = tx.id || tx.transaction_id;
          const isSelected = selectedIds.includes(id);
          return (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(prev => [...prev, id]);
                } else {
                  setSelectedIds(prev => prev.filter(x => x !== id));
                }
              }}
              className="accent-yellow-500 h-4 w-4 rounded cursor-pointer border-white/10 bg-black/40"
            />
          );
        }
      },
      {
        accessorKey: 'transaction_id',
        header: 'Tx ID',
        cell: info => <span className="text-blue-400 font-mono text-[11px] font-semibold tracking-wider">#{String(info.getValue()).toUpperCase()}</span>,
      },
      {
        accessorKey: 'transaction_type',
        header: 'Type',
        cell: info => {
          const type = info.getValue();
          let badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          if (type === 'Account') badgeColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
          else if (type === 'XSuit') badgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
          else if (type === 'Supercar') badgeColor = 'text-red-400 bg-red-500/10 border-red-500/20';

          return (
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${badgeColor}`}>
              {type}
            </span>
          );
        }
      },
      {
        accessorKey: 'transaction_date',
        header: 'Date',
        cell: info => <span className="text-white/60 font-mono text-[12px]">{new Date(info.getValue()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>,
      },
      {
        accessorKey: 'sold_price',
        header: 'Amount',
        cell: info => <span className="font-bold text-white font-mono text-[13px]">₹{Number(info.getValue() || 0).toLocaleString()}</span>,
      },
      {
        accessorKey: 'buyer_phone',
        header: 'Customer Phone',
        cell: info => <span className="text-white/80 font-mono text-[12px]">{info.getValue() || 'N/A'}</span>,
      },
      {
        accessorKey: 'payment_status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const isPaid = status === 'Paid';
          return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${isPaid ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.1)]' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/25 shadow-[0_0_8px_rgba(234,179,8,0.1)]'}`}>
              {status}
            </span>
          );
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setSelectedTxForDetails(row.original)} className="p-2 rounded-lg text-white bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200 cursor-pointer" title="View Details"><Eye size={14} /></button>
            <button onClick={() => onEdit && onEdit(row.original)} className="p-2 rounded-lg text-blue-400 bg-blue-500/5 border border-blue-500/15 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer" title="Edit Transaction"><Edit2 size={14} /></button>
            <button onClick={() => handleCustomerDownload(row.original)} className="p-2 rounded-lg text-yellow-500 bg-yellow-500/5 border border-yellow-500/15 hover:bg-yellow-500/10 transition-all duration-200 cursor-pointer" title="Download Customer PDF"><FileText size={14} /></button>
            <button onClick={() => handleInternalDownload(row.original)} className="p-2 rounded-lg text-orange-400 bg-orange-400/5 border border-orange-400/15 hover:bg-orange-400/10 transition-all duration-200 cursor-pointer" title="Download Internal PDF"><FileOutput size={14} /></button>
            <button onClick={() => handleDelete(row.original)} className="p-2 rounded-lg text-red-400 bg-red-400/5 border border-red-400/15 hover:bg-red-400/10 transition-all duration-200 cursor-pointer" title="Delete Transaction"><Trash2 size={14} /></button>
          </div>
        )
      }
    ],
    [selectedIds, filteredData, onEdit]
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
      <div className="mb-6">
        <h3 className="text-[13px] uppercase text-yellow-500 tracking-widest m-0 mb-3 border-b border-white/5 pb-1.5 font-bold">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
          {items.map(([label, val, highlight]) => (
            <div key={label} className="flex flex-col">
              <span className="text-[11px] text-muted mb-0.5">{label}</span>
              <span className={`text-[13px] break-all ${highlight ? 'text-yellow-500 font-bold' : 'text-white font-medium'}`}>{val || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="glass-panel p-5 rounded-3xl flex flex-wrap gap-4 items-center justify-between shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.01] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-1 flex-wrap gap-4 min-w-[300px] relative z-10">
          <div className="relative flex-1 min-w-[200px] max-w-[400px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-gray-500"
              placeholder="Search ID or Phone..."
            />
          </div>

          <div className="relative min-w-[150px]">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-10 text-xs font-bold text-white focus:outline-none focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="All" className="bg-[#0b0e14]">All Types</option>
              <option value="Account" className="bg-[#0b0e14]">Account</option>
              <option value="XSuit" className="bg-[#0b0e14]">XSuit</option>
              <option value="Supercar" className="bg-[#0b0e14]">Supercar</option>
              <option value="UC" className="bg-[#0b0e14]">UC</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[var(--color-muted)]"></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => loadData(true)}
            className="btn btn-outline border-white/5 text-[var(--color-muted)] px-4 py-2.5 text-xs hover:bg-white/5 h-[38px] hover:text-white"
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={handleExport} className="btn btn-green px-5 py-2.5 text-xs h-[38px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block table-wrap glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="admin-table w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="bg-[#0b0e14]/60 border-b border-white/5 text-yellow-500 font-black text-[10.5px] uppercase tracking-wider py-4 px-4 text-left whitespace-nowrap font-h">
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
                  <td colSpan={columns.length} className="text-center py-24 text-[var(--color-muted)] font-medium">
                    <Receipt size={56} className="mx-auto mb-4 opacity-10 text-white" />
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="text-xs text-[var(--color-muted)] font-mono font-medium">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-outline border-white/5 p-2.5 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-muted)] hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-outline border-white/5 p-2.5 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-muted)] hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {isLoading && data.length === 0 ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={`skeleton-card-${idx}`} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-white/5 rounded" />
                <div className="h-4 w-16 bg-white/5 rounded" />
              </div>
              <div className="h-3 w-32 bg-white/5 rounded" />
              <div className="h-5 w-20 bg-white/5 rounded" />
            </div>
          ))
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-[var(--color-muted)] font-medium">
            <Receipt size={40} className="mx-auto mb-3 opacity-10 text-white" />
            No transactions found matching your criteria.
          </div>
        ) : (
          <>
            {table.getRowModel().rows.map((row) => {
              const tx = row.original;
              const id = tx.id || tx.transaction_id;
              const isSelected = selectedIds.includes(id);
              const sold = Number(tx.sold_price || 0);
              const isPaid = tx.payment_status === 'Paid';
              const type = tx.transaction_type;

              let badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
              if (type === 'Account') badgeColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
              else if (type === 'XSuit') badgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
              else if (type === 'Supercar') badgeColor = 'text-red-400 bg-red-500/10 border-red-500/20';

              return (
                <div 
                  key={row.id} 
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-4 relative overflow-hidden bg-black/30 ${
                    isSelected ? 'border-yellow-500/30 bg-yellow-500/[0.02]' : 'border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, id]);
                          } else {
                            setSelectedIds(prev => prev.filter(x => x !== id));
                          }
                        }}
                        className="accent-yellow-500 h-4 w-4 rounded cursor-pointer border-white/10 bg-black/40"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-blue-400 font-mono text-[12px] font-bold tracking-wider">#{String(tx.transaction_id).toUpperCase()}</span>
                        <span className="text-[10px] text-white/50 font-mono">{new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                      {type}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline bg-white/[0.01] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Amount</span>
                    <span className="text-base font-bold text-white font-mono">₹{sold.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Customer Phone</span>
                      <span className="text-xs text-white/80 font-mono font-medium">{tx.buyer_phone || 'N/A'}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${isPaid ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/25'}`}>
                      {tx.payment_status}
                    </span>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                    <button onClick={() => setSelectedTxForDetails(tx)} className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition duration-200 border border-white/5 flex items-center justify-center gap-1.5"><Eye size={13} /> Details</button>
                    <button onClick={() => onEdit && onEdit(tx)} className="flex-1 py-2 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 transition duration-200 border border-blue-500/10 flex items-center justify-center gap-1.5"><Edit2 size={13} /> Edit</button>
                    <button onClick={() => handleCustomerDownload(tx)} className="p-2 rounded-lg text-yellow-500 bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 transition duration-200" title="Customer PDF"><FileText size={13} /></button>
                    <button onClick={() => handleInternalDownload(tx)} className="p-2 rounded-lg text-orange-400 bg-orange-400/5 border border-orange-400/10 hover:bg-orange-400/10 transition duration-200" title="Internal PDF"><FileOutput size={13} /></button>
                    <button onClick={() => handleDelete(tx)} className="p-2 rounded-lg text-red-400 bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition duration-200" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </div>
              );
            })}

            {/* Mobile Pagination Control */}
            <div className="flex items-center justify-between p-4 glass-panel rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[11px] text-[var(--color-muted)] font-mono">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="btn btn-outline border-white/5 px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="btn btn-outline border-white/5 px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 bg-[#0e131f]/95 border border-yellow-500/30 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md z-50 flex items-center gap-6 justify-between w-[90%] max-w-[600px]"
          >
            <span className="text-xs font-mono font-bold text-yellow-500 whitespace-nowrap">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={handleBulkExport}
                className="btn btn-outline border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 px-3 py-1.5 text-xs h-[32px] rounded-lg font-bold"
              >
                <Download size={13} /> Export
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn btn-red px-3 py-1.5 text-xs h-[32px] bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
              >
                <Trash2 size={13} /> Delete
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="btn btn-outline border-white/10 text-gray-400 hover:text-white px-2.5 py-1.5 text-xs h-[32px] rounded-lg"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Details Modal */}
      {selectedTxForDetails && (() => {
        const tx = selectedTxForDetails;
        const type = tx.transaction_type || 'Account';

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
        const profitColorClass = profit >= 0 ? 'text-emerald-400' : 'text-red-400';

        const contactItems = [
          ['Buyer Phone', tx.buyer_phone],
          ['Owner Phone', tx.owner_phone],
          ['Seller Phone', tx.seller_phone],
          ['Reseller Phone', tx.reseller_phone]
        ];

        const renderSection = (title, items) => (
          <div className="mb-8">
            <h3 className="text-xs uppercase text-yellow-500 tracking-widest mb-4 border-b border-white/5 pb-2.5 font-bold font-h">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
              {items.map(([label, val, highlight]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[11px] text-[var(--color-muted)] mb-1 font-semibold uppercase font-mono tracking-wider">{label}</span>
                  <span className={`text-[13px] break-all ${highlight ? 'text-yellow-400 font-bold' : 'text-white font-medium'}`}>{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 sm:p-6 transition-opacity animate-fade-in">
            <div className="bg-[#080a0f] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative scrollbar-thin">
              
              {/* Header */}
              <div className="flex justify-between items-start sm:items-center mb-8 pb-5 border-b border-white/5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white m-0 flex flex-wrap items-center gap-3 font-h uppercase tracking-wide">
                    Transaction Details
                    <span className="text-[9px] px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-400 font-bold tracking-widest uppercase border border-yellow-500/15">
                      {type}
                    </span>
                  </h2>
                  <p className="text-[12px] text-[var(--color-muted)] mt-1.5 font-mono">Unique Ref: <span className="text-white/80">{tx.transaction_id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedTxForDetails(null)}
                  className="btn btn-outline border-white/10 text-[var(--color-muted)] hover:text-white hover:border-yellow-500/30 px-5 py-2 text-xs"
                >
                  Close
                </button>
              </div>

              {/* Sections */}
              {renderSection('📊 Deal Information', dealBasics)}
              {renderSection('🎮 Product Details', productItems)}

              {/* Financial Section */}
              <div className="mb-8">
                <h3 className="text-xs uppercase text-yellow-500 tracking-widest mb-4 border-b border-white/5 pb-2.5 font-bold font-h">💰 Financial Overview (Confidential)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--color-muted)] mb-1 font-semibold uppercase font-mono tracking-wider">Cost Price</span>
                    <span className="text-lg text-white font-bold tracking-wide font-mono">₹{cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--color-muted)] mb-1 font-semibold uppercase font-mono tracking-wider">Sold Price</span>
                    <span className="text-lg text-yellow-500 font-bold tracking-wide font-mono">₹{sold.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--color-muted)] mb-1 font-semibold uppercase font-mono tracking-wider">Net Profit</span>
                    <span className={`text-xl font-black tracking-wide font-mono ${profitColorClass}`}>
                      ₹{Math.abs(profit).toLocaleString()} {profit >= 0 ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {renderSection('📞 Party Contacts', contactItems)}

              {tx.owner_proof_link && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase text-yellow-500 tracking-widest mb-4 border-b border-white/5 pb-2.5 font-bold font-h">🔗 Ownership Proof</h3>
                  <a href={tx.owner_proof_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 break-all font-mono">
                    {tx.owner_proof_link}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-white/5 pt-6 mt-4 flex flex-wrap gap-3 justify-end bg-[#080a0f] sticky bottom-[-32px] py-4">
                <button onClick={() => handleCustomerDownload(tx)} className="btn btn-gold text-xs px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  <FileText size={14} /> Customer PDF
                </button>
                <button onClick={() => handleInternalDownload(tx)} className="btn btn-outline border-orange-500/20 text-orange-400 hover:bg-orange-500/10 text-xs px-5 py-2.5">
                  <FileOutput size={14} /> Internal PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
