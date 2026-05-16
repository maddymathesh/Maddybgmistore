import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, FileText, Download, Trash2, ChevronLeft, ChevronRight, FileOutput, Receipt, RefreshCw } from 'lucide-react';
import { fetchAllTransactions, deleteTransaction } from '../../services/transactionService';

import toast from 'react-hot-toast';
import { exportToExcel } from '../../lib/excelExport';
import { generateCustomerPDF, generateInternalPDF } from '../../lib/pdfGenerator';

export default function TransactionsList({ onAddNew }) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    // Optimistic UI update
    const previousData = [...data];
    setData(prev => prev.filter(tx => tx.id !== id));
    
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
      // No need to reload data if it's optimistic, unless we want to ensure cache is cleared.
      // The backend will clear its cache automatically on delete.
    } catch (error) {
      toast.error('Failed to delete transaction');
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ color: 'var(--muted)' }} title="View Details"><Eye size={16} /></button>
            <button onClick={() => generateCustomerPDF(row.original)} style={{ color: 'var(--gold)' }} title="Customer PDF"><FileText size={16} /></button>
            <button onClick={() => generateInternalPDF(row.original)} style={{ color: 'var(--orange)' }} title="Internal PDF"><FileOutput size={16} /></button>
            <button onClick={() => handleDelete(row.original.id)} style={{ color: 'var(--red)' }} title="Delete"><Trash2 size={16} /></button>
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
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

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

        <div style={{ display: 'flex', gap: '8px' }}>
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
      </div>
    </div>
  );
}
