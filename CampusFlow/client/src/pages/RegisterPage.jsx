import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, Sparkles } from 'lucide-react';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    if (!formData.phone.startsWith('+91') || formData.phone.length < 13) {
      setStatus({ type: 'error', message: 'Phone must be in E.164 format starting with +91' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus({ type: 'success', message: 'Student successfully registered into n8n pipeline.' });
      
      if (window.addLog) {
        window.addLog('Register Student', 'success', `WhatsApp: Welcome message sent to ${formData.name}`);
      }
      
      setFormData({ name: '', phone: '', email: '' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.response?.data?.error || 'Registration failed' });
      if (window.addLog) window.addLog('Register Student', 'error', error.response?.data?.error || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Register Student</h2>
          <p className="text-sm text-brand-textMuted max-w-lg leading-relaxed">Add a new student to the system. They will receive automated WhatsApp messages and email updates via n8n.</p>
        </div>
        <div className="hidden sm:flex h-12 w-12 bg-brand-primary/10 rounded-2xl items-center justify-center border border-brand-primary/20">
          <UserPlus className="text-brand-primary" size={24} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-sm"
      >
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-6 p-4 rounded-xl text-sm border flex items-start space-x-3 ${status.type === 'success' ? 'bg-brand-success/10 border-brand-success/20 text-brand-success' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
          >
            {status.type === 'success' && <Sparkles size={18} className="mt-0.5 flex-shrink-0" />}
            <span>{status.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-textMuted mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aman Shekhar"
                required
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder-brand-textMuted/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-textMuted mb-2">Phone Number (E.164)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+919876543210"
                required
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder-brand-textMuted/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-textMuted mb-2">Gmail Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@gmail.com"
              required
              className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder-brand-textMuted/50"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 bg-brand-primary hover:bg-brand-primaryHover text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-brand-primary/20 active:scale-95"
            >
              {loading ? 'Processing...' : 'Register Student'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
