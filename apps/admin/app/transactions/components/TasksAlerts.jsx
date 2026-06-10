"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TasksAlerts() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Confirm primary unlink status for #TX8403', done: false, priority: 'High' },
    { id: 2, text: 'Validate seller payment proof for supercar order #TX8412', done: false, priority: 'High' },
    { id: 3, text: 'Process pending UC delivery for ID: 51239581', done: false, priority: 'Medium' },
    { id: 4, text: 'Contact WhatsApp customer for warranty assurance check', done: false, priority: 'Low' },
    { id: 5, text: 'Clear old transaction PDF temporary local cache', done: false, priority: 'Low' }
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  const handleToggle = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.done;
        if (nextState) toast.success(`Task marked as complete!`);
        return { ...t, done: nextState };
      }
      return t;
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      done: false,
      priority: newTaskPriority
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    toast.success('Task added successfully!');
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>System Alerts & Tasks</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-muted)', margin: '4px 0 0' }}>Track urgent actions, deal alerts, and daily responsibilities here.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Critical Alerts */}
        <div className="card" style={{ border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#eaeaea', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ color: 'var(--color-red)' }} /> Urgent Pending System Alerts
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(231,76,60,0.1)', borderLeft: '3px solid var(--color-red)', padding: '14px', borderRadius: '6px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertTriangle size={16} style={{ color: 'var(--color-red)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#eaeaea' }}>Link Verification Expiration Alert</p>
                <p style={{ fontSize: '11.5px', margin: '4px 0 0', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                  Transaction <strong>#TX8403</strong> (Account Store) requires manual double check for secondary login unlink safety period validation immediately.
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(241,196,15,0.1)', borderLeft: '3px solid #f1c40f', padding: '14px', borderRadius: '6px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Clock size={16} style={{ color: '#f1c40f', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#eaeaea' }}>UC Packet Manual Loading Queue</p>
                <p style={{ fontSize: '11.5px', margin: '4px 0 0', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                  Order <strong>#TX8411</strong> has been pending for over 15 minutes due to manual loader confirmation delays. Please ping the loader.
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(52,152,219,0.1)', borderLeft: '3px solid #3498db', padding: '14px', borderRadius: '6px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Clock size={16} style={{ color: '#3498db', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#eaeaea' }}>Supplier Payments Verification</p>
                <p style={{ fontSize: '11.5px', margin: '4px 0 0', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                  Confirm owner price payout of <strong>₹24,500</strong> to Supplier account <strong>MBS_Supplier_9</strong> for transaction ID #TX8401.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="card" style={{ border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#eaeaea', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} style={{ color: '#2ecc71' }} /> Interactive Admin Checklist
          </h3>

          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              className="input"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Add quick responsibility task..."
              style={{ flex: 1, height: '38px', fontSize: '12px' }}
            />
            <select
              value={newTaskPriority}
              onChange={e => setNewTaskPriority(e.target.value)}
              className="input"
              style={{ width: '90px', height: '38px', fontSize: '12px' }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button type="submit" className="btn btn-gold" style={{ height: '38px', padding: '0 12px' }} title="Add Task">
              <Plus size={16} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
            {tasks.map(task => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--color-bg2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggle(task.id)}
                    style={{ accentColor: 'var(--color-gold)', width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12.5px', color: task.done ? 'var(--color-muted)' : '#eaeaea', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.text}
                  </span>
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '9px',
                    background: task.priority === 'High' ? 'rgba(231,76,60,0.15)' : task.priority === 'Medium' ? 'rgba(241,196,15,0.15)' : 'rgba(255,255,255,0.06)',
                    color: task.priority === 'High' ? 'var(--color-red)' : task.priority === 'Medium' ? '#f1c40f' : 'var(--color-muted)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {task.priority}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-red)', opacity: 0.7, cursor: 'pointer', padding: 2 }}
                    title="Delete task"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '12px' }}>
                All clear! No tasks listed. Add a new task above.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
