import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CalendarClock, Megaphone, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';

import DeadlineModal from '../components/DeadlineModal';
import NoticeSummarizer from '../components/NoticeSummarizer';
import LogTable from '../components/LogTable';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isAdmin = user?.email === 'amanshekar000@gmail.com';

  useEffect(() => {
    window.addLog = (action, status, detail = '') => {
      setLogs((prev) => [{
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action,
        status,
        detail
      }, ...prev].slice(0, 15));
    };
    return () => delete window.addLog;
  }, []);

  const fetchDeadlines = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/deadlines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeadlines(res.data);
    } catch (error) {
      console.error('Error fetching deadlines', error);
    }
  };

  useEffect(() => {
    if (user) fetchDeadlines();
  }, [user]);

  // Calendar Logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const calendarDays = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startOffset = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let d = 1; d <= totalDays; d++) calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));


  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.name.split(' ')[0]} {isAdmin && <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full ml-2">Admin</span>}
          </h2>
          <p className="text-brand-textMuted text-sm">
            {isAdmin ? "Monitoring all institutional automations and cross-user triggers." : "Monitor your personal triggers, synthesize broadcasts, and verify webhooks."}
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        {/* Left: Intelligence Summary & Calendar */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <motion.div variants={itemVars} className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-brand-border bg-brand-bg/30 flex justify-between items-center">
                <h4 className="font-semibold text-sm">Campus Planner</h4>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))} className="p-1 hover:bg-brand-primary/10 rounded transition-colors"><ChevronLeft size={16}/></button>
                  <span className="text-xs font-mono">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                  <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))} className="p-1 hover:bg-brand-primary/10 rounded transition-colors"><ChevronRight size={16}/></button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] font-bold text-center text-brand-textMuted py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    const hasEvent = day && deadlines.some(d => new Date(d.dateTimeIso).toDateString() === day.toDateString());
                    return (
                      <div key={idx} className={`h-8 flex flex-col items-center justify-center rounded-lg text-xs relative ${!day ? 'opacity-0' : ''} ${isToday ? 'bg-brand-primary text-white font-bold' : hasEvent ? 'bg-brand-primary/10 text-brand-text font-bold' : 'text-brand-textMuted'}`}>
                        {day?.getDate()}
                        {hasEvent && !isToday && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-primary"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Active Schedules */}
            <motion.div variants={itemVars} className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <CalendarClock className="text-brand-primary" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-brand-text">Active Schedules</h3>
                </div>
                {!isAdmin && (
                  <button 
                    onClick={() => setModalOpen(true)}
                    className="text-sm font-medium bg-brand-text text-brand-bg px-4 py-2 rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-brand-text transition-all"
                  >
                    + New
                  </button>
                )}
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {deadlines.length === 0 ? (
                  <div className="p-8 border border-dashed border-brand-border rounded-xl text-center text-brand-textMuted text-sm">
                    No upcoming events.
                  </div>
                ) : (
                  deadlines.map(d => (
                    <div key={d._id} className="p-4 bg-brand-bg border border-brand-border rounded-xl flex justify-between items-center group hover:border-brand-primary/50 transition-colors">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-brand-text truncate mb-0.5">{d.title}</p>
                        <p className="text-[10px] text-brand-textMuted font-mono uppercase">
                          {new Date(d.dateTimeIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-success shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Notice Broadcaster */}
          <motion.div variants={itemVars} className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Megaphone className="text-purple-500" size={20} />
              </div>
              <h3 className="font-semibold text-lg text-brand-text">Notice Broadcaster</h3>
            </div>
            <NoticeSummarizer />
          </motion.div>
        </div>

        {/* Right: Pipeline Logs */}
        <motion.div variants={itemVars} className="h-full">
          <div className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-6 h-full flex flex-col min-h-[600px] lg:min-h-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Terminal className="text-emerald-500" size={20} />
                </div>
                <h3 className="font-semibold text-lg text-brand-text">Smart Logs</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></span>
                <span className="text-[10px] font-mono text-brand-success uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <LogTable logs={logs} />
            </div>
          </div>
        </motion.div>

      </motion.div>


      {isModalOpen && (
        <DeadlineModal 
          onClose={() => setModalOpen(false)} 
          onSuccess={() => {
            fetchDeadlines();
            setModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

export default Dashboard;
