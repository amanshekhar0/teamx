import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CalendarClock, Megaphone, Terminal } from 'lucide-react';

import DeadlineModal from '../components/DeadlineModal';
import NoticeSummarizer from '../components/NoticeSummarizer';
import LogTable from '../components/LogTable';

function Dashboard() {
  const [deadlines, setDeadlines] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Setup global mock logger for demo
    window.addLog = (action, status) => {
      setLogs((prev) => [{
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action,
        status
      }, ...prev].slice(0, 8)); // keep last 8
    };
    return () => delete window.addLog;
  }, []);

  const fetchDeadlines = async () => {
    try {
      // Mocked to empty array in server due to DB bypass, but calling it anyway
      const res = await axios.get('http://localhost:5000/api/deadlines');
      setDeadlines(res.data);
    } catch (error) {
      console.error('Error fetching deadlines', error);
      // Fallback dummy data for demo visual purposes since DB is bypassed
      if (deadlines.length === 0) {
        setDeadlines([
          { _id: '1', title: 'OS Assignment 3', dateTimeIso: new Date(Date.now() + 86400000).toISOString() },
          { _id: '2', title: 'DBMS Project Eval', dateTimeIso: new Date(Date.now() + 172800000).toISOString() }
        ]);
      }
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

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
        className="mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-2">Automations Overview</h2>
        <p className="text-brand-textMuted">Monitor active triggers, synthesize broadacsts, and verify webhooks.</p>
      </motion.div>

      {/* Grid Layout */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="space-y-8 flex flex-col h-full">
          
          {/* Deadlines Section */}
          <motion.div variants={itemVars} className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <CalendarClock className="text-brand-primary" size={20} />
                </div>
                <h3 className="font-semibold text-lg text-brand-text">Active Schedules</h3>
              </div>
              <button 
                onClick={() => setModalOpen(true)}
                className="text-sm font-medium bg-brand-text text-brand-bg px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all"
              >
                + Schedule
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {deadlines.length === 0 ? (
                <div className="p-6 border border-dashed border-brand-border rounded-xl text-center text-brand-textMuted text-sm">
                  No upcoming events scheduled.
                </div>
              ) : (
                deadlines.map(d => (
                  <div key={d._id} className="p-4 bg-brand-bg border border-brand-border rounded-xl flex justify-between items-center group hover:border-brand-primary/50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-brand-text mb-1">{d.title}</p>
                      <p className="text-xs text-brand-textMuted font-mono">
                        {new Date(d.dateTimeIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-brand-success"></div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Notice Broadcaster Section */}
          <motion.div variants={itemVars} className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-6 flex-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Megaphone className="text-purple-500" size={20} />
              </div>
              <h3 className="font-semibold text-lg text-brand-text">Notice Broadcaster</h3>
            </div>
            <NoticeSummarizer />
          </motion.div>

        </div>

        {/* Right Column */}
        <motion.div variants={itemVars} className="h-full min-h-[500px]">
          {/* Logs Section */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Terminal className="text-emerald-500" size={20} />
              </div>
              <h3 className="font-semibold text-lg text-brand-text">Execution Pipeline</h3>
            </div>
            <div className="flex-1 min-h-0">
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
