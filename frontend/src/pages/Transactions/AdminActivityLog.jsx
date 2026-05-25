import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Shield, Download, FileText, Settings, Plus, RefreshCw, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminActivityLog() {
  const [filterType, setFilterType] = useState('All');

  const [logs, setLogs] = useState([
    { text: 'Downloaded Confidential Admin PDF for Transaction #TX8403', time: '12 mins ago', type: 'Downloads', user: 'Owner' },
    { text: 'Role config saved: PDF visibility preferences globally updated', time: '1 hour ago', type: 'Settings', user: 'Owner' },
    { text: 'Seller created new UC Order deal #TX8412', time: '2 hours ago', type: 'Transactions', user: 'Seller (Maddy)' },
    { text: 'Cleared temporary local transaction cache to sync sheets', time: '4 hours ago', type: 'Settings', user: 'Owner' },
    { text: 'Owner downloaded Customer Receipt PDF for Transaction #TX8399', time: '5 hours ago', type: 'Downloads', user: 'Owner' },
    { text: 'Admin account login successful from IP: 157.44.103.92', time: '8 hours ago', type: 'Security', user: 'Owner' },
    { text: 'Created new supercar transaction ID #TX8395', time: 'Yesterday', type: 'Transactions', user: 'Seller (Maddy)' },
    { text: 'Unlink status marked verified for transaction #TX8391', time: 'Yesterday', type: 'Transactions', user: 'Loader (Suresh)' },
    { text: 'Owner changed WhatsApp Support details configuration', time: '2 days ago', type: 'Settings', user: 'Owner' },
    { text: 'Successful security PIN verification session initialized', time: '3 days ago', type: 'Security', user: 'Owner' }
  ]);

  const filteredLogs = filterType === 'All' ? logs : logs.filter(l => l.type === filterType);

  const getIcon = (type) => {
    switch (type) {
      case 'Downloads': return <Download size={14} style={{ color: 'var(--gold)' }} />;
      case 'Settings': return <Settings size={14} style={{ color: '#3498db' }} />;
      case 'Transactions': return <Plus size={14} style={{ color: '#2ecc71' }} />;
      case 'Security': return <Key size={14} style={{ color: 'var(--red)' }} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Admin Audit Logs</h2>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>Security trace timeline tracking administrative actions, configuration updates and downloads.</p>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {['All', 'Transactions', 'Downloads', 'Settings', 'Security'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                borderRadius: '6px',
                background: filterType === type ? 'rgba(255, 215, 0, 0.12)' : 'transparent',
                color: filterType === type ? 'var(--gold)' : 'var(--muted)',
                border: filterType === type ? '1px solid var(--border-gold)' : '1px solid transparent',
                fontWeight: filterType === type ? 700 : 500,
                transition: 'all 0.15s'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '22px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} style={{ color: 'var(--gold)' }} /> Live Audit Timeline ({filteredLogs.length} events)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingLeft: '8px' }}>
          {filteredLogs.map((log, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                borderLeft: '2px solid var(--border)',
                marginLeft: '10px',
                paddingLeft: '20px',
                position: 'relative',
                paddingBottom: i === filteredLogs.length - 1 ? 0 : '8px'
              }}
            >
              {/* Outer timeline indicator */}
              <div style={{
                position: 'absolute',
                left: '-9px',
                top: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--bg)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(log.type)}
              </div>

              <div style={{ flex: 1, marginTop: '2px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0, fontWeight: 600 }}>{log.text}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                  <span>Logged: <strong>{log.user}</strong></span>
                  <span>·</span>
                  <span>{log.time}</span>
                  <span>·</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{log.type}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '12px' }}>
              No system activity events matched your selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
