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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white font-h">System Alerts & Tasks</h2>
        <p className="text-xs text-muted mt-1">Track urgent actions, deal alerts, and daily responsibilities here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Critical Alerts */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 font-h uppercase tracking-wider">
            <AlertCircle size={16} className="text-red-500" /> Urgent Pending System Alerts
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0 relative z-10" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-white m-0">Link Verification Expiration Alert</p>
                <p className="text-xs mt-1 text-muted leading-relaxed">
                  Transaction <strong className="text-white">#TX8403</strong> (Account Store) requires manual double check for secondary login unlink safety period validation immediately.
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-xl flex gap-3 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <Clock size={16} className="text-yellow-500 mt-0.5 shrink-0 relative z-10" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-white m-0">UC Packet Manual Loading Queue</p>
                <p className="text-xs mt-1 text-muted leading-relaxed">
                  Order <strong className="text-white">#TX8411</strong> has been pending for over 15 minutes due to manual loader confirmation delays. Please ping the loader.
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-3 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
              <Clock size={16} className="text-blue-500 mt-0.5 shrink-0 relative z-10" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-white m-0">Supplier Payments Verification</p>
                <p className="text-xs mt-1 text-muted leading-relaxed">
                  Confirm owner price payout of <strong className="text-white">₹24,500</strong> to Supplier account <strong className="text-white">MBS_Supplier_9</strong> for transaction ID #TX8401.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 font-h uppercase tracking-wider">
            <CheckCircle2 size={16} className="text-[#10b981]" /> Interactive Admin Checklist
          </h3>

          <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
            <input
              type="text"
              className="flex-1 h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:border-yellow-500/40 focus:ring-0 transition-all duration-200 outline-none"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Add quick responsibility task..."
            />
            <select
              value={newTaskPriority}
              onChange={e => setNewTaskPriority(e.target.value)}
              className="w-24 h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:border-yellow-500/40 focus:ring-0 transition-all duration-200 outline-none appearance-none cursor-pointer"
            >
              <option value="High" className="bg-[#0e1118]">High</option>
              <option value="Medium" className="bg-[#0e1118]">Medium</option>
              <option value="Low" className="bg-[#0e1118]">Low</option>
            </select>
            <button type="submit" className="btn btn-gold h-10 px-4 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,215,0,0.2)]" title="Add Task">
              <Plus size={16} />
            </button>
          </form>

          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-lg transition-all duration-200 hover:bg-white/[0.04] hover:border-white/10 group"
              >
                <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggle(task.id)}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 accent-yellow-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className={`text-xs ${task.done ? 'text-white/30 line-through' : 'text-white font-medium'} transition-all duration-200`}>
                    {task.text}
                  </span>
                </label>
                
                <div className="flex items-center gap-3 ml-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-white/5 text-muted border border-white/10'}`}>
                    {task.priority}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center text-muted text-xs border border-dashed border-white/10 rounded-lg">
                All clear! No tasks listed. Add a new task above.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
