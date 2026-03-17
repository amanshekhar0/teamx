import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

function LogTable({ logs }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-border relative h-full bg-brand-bg">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-brand-surface sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold text-brand-textMuted border-b border-brand-border">Time</th>
            <th scope="col" className="px-6 py-4 font-semibold text-brand-textMuted border-b border-brand-border">Action</th>
            <th scope="col" className="px-6 py-4 font-semibold text-brand-textMuted border-b border-brand-border text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {logs.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-12 text-center border-b-0">
                <div className="flex flex-col items-center justify-center space-y-3 text-brand-textMuted">
                  <Activity size={32} className="opacity-20" />
                  <p>Listening for active webhooks...</p>
                </div>
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <motion.tr 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-brand-surface/50 transition-colors group"
              >
                <td className="px-6 py-4 text-brand-textMuted text-xs tabular-nums group-hover:text-brand-text transition-colors">{log.timestamp}</td>
                <td className="px-6 py-4 font-medium text-brand-text">{log.action}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                    log.status === 'Success' 
                      ? 'bg-brand-success/10 text-brand-success border-brand-success/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Success' ? 'bg-brand-success' : 'bg-red-500'} animate-pulse`}></span>
                    <span>{log.status}</span>
                  </span>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LogTable;
