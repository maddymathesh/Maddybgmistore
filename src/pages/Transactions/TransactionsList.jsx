import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, FileText, Download, Trash2, ChevronLeft, ChevronRight, FileOutput } from 'lucide-react';
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions();
      setData(txs || []);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete transaction');
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
          const colors = {
            'Account': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'XSuit': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            'Supercar': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            'UC': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          };
          return (
            <span className={`px-2 py-1 rounded-md border text-xs font-medium ${colors[type] || 'bg-gray-800 text-gray-300'}`}>
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
            <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1.5 w-fit ${
              status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {status}
            </span>
          );
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="View Details">
              <Eye size={16} />
            </button>
            <button onClick={() => generateCustomerPDF(row.original)} className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors" title="Customer PDF">
              <FileText size={16} />
            </button>
            <button onClick={() => generateInternalPDF(row.original)} className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors" title="Internal PDF">
              <FileOutput size={16} />
            </button>
            <button onClick={() => handleDelete(row.original.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
              <Trash2 size={16} />
            </button>
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

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
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
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="flex flex-1 w-full gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Search ID or Phone..."
            />
          </div>
          
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="appearance-none bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Account">Account</option>
              <option value="XSuit">XSuit</option>
              <option value="Supercar">Supercar</option>
              <option value="UC">UC</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Download size={18} /> Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 font-semibold text-white/60">
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
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center text-white/40">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center text-white/40">
                    <Receipt size={48} className="mx-auto mb-4 opacity-20" />
                    No transactions found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#0a0a0a]">
          <div className="text-sm text-white/40">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
