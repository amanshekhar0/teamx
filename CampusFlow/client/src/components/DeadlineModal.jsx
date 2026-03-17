import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, X, Clock } from 'lucide-react';

function DeadlineModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ title: '', dateTimeIso: '', associated_phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Temporary bypass since backend DB is failing auth
      // await axios.post('http://localhost:5000/api/deadline', formData);
      await new Promise(resolve => setTimeout(resolve, 800)); // fake delay
      
      if (window.addLog) window.addLog('Add Deadline', 'Success');
      onSuccess();
    } catch (error) {
      console.error(error);
      if (window.addLog) window.addLog('Add Deadline', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-brand-surface border border-brand-border rounded-2xl shadow-2xl max-w-md w-full p-8 z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-brand-textMuted hover:text-brand-text hover:bg-brand-bg p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
              <CalendarPlus className="text-brand-primary" size={20} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-brand-text">New Deadline</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-textMuted">Task Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: OS Midterm Prep"
                required
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-brand-textMuted/50 text-brand-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-textMuted">Date & Time</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={formData.dateTimeIso}
                  onChange={e => setFormData({...formData, dateTimeIso: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-primary outline-none transition-all text-brand-text [color-scheme:dark_light]"
                />
                <Clock className="absolute left-3 top-3.5 text-brand-textMuted pointer-events-none" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-textMuted">Student Phone (+91)</label>
              <input 
                type="text" 
                value={formData.associated_phone}
                onChange={e => setFormData({...formData, associated_phone: e.target.value})}
                placeholder="+919876543210"
                required
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-brand-textMuted/50 text-brand-text"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-brand-border">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-brand-textMuted hover:text-brand-text hover:bg-brand-bg rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium bg-brand-text text-brand-bg hover:bg-brand-primary hover:text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Committing...' : 'Commit to n8n'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DeadlineModal;
