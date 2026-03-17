import React from 'react';
import { motion } from 'framer-motion';

function LogTable({ logs }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full flex flex-col bg-brand-surface/40 rounded-xl border border-brand-border overflow-hidden">
      <div className="flex bg-brand-bg/50 px-4 py-2 text-[10px] font-bold text-brand-textMuted uppercase tracking-wider border-b border-brand-border">
        <div className="w-16">Time</div>
        <div className="w-24">Action</div>
        <div className="flex-1">Status / Detail</div>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-2 space-y-1 py-3 custom-scrollbar"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-brand-textMuted italic py-10">
            Waiting for automation triggers...
          </div>
        ) : (
          logs.map((log, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="group px-3 py-2.5 rounded-lg border border-transparent hover:border-brand-border hover:bg-brand-bg/40 transition-all"
            >
              <div className="flex items-start text-xs font-mono">
                <span className="w-16 text-brand-textMuted shrink-0">{log.timestamp}</span>
                <span className={`w-24 font-bold ${log.status === 'success' ? 'text-brand-success' : 'text-amber-500'} shrink-0`}>
                  {log.action}
                </span>
                <div className="flex-1 min-w-0 ml-2">
                  <span className={`${log.status === 'success' ? 'text-brand-text' : 'text-amber-500/80'} break-words`}>
                    {log.status === 'success' ? '✓ Executed' : '○ Pending'}
                  </span>
                  {log.detail && (
                    <div className="mt-2 p-2 bg-brand-bg rounded border border-brand-border/50 text-[10px] text-brand-textMuted group-hover:text-brand-text transition-colors italic leading-relaxed whitespace-pre-wrap">
                      {log.detail}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default LogTable;
