import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ArrowLeft } from 'lucide-react';
import GeometricBackground from '../components/GeometricBackground';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Temporary bypass since DB is failing auth
      // const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // MOCK LOGIN FOR DEMO (Since MongoDB is offline)
      setTimeout(() => {
        const mockUser = { id: 'user123', email, name: 'Demo Student' };
        const mockToken = 'mock-jwt-token-123';
        login(mockUser, mockToken);
        navigate('/dashboard');
      }, 800);

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <GeometricBackground />
      
      <Link to="/" className="absolute top-8 left-8 flex items-center text-brand-textMuted hover:text-brand-text transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-brand-surface/80 backdrop-blur-xl border border-brand-border rounded-2xl shadow-xl p-8 z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-blue-400 flex items-center justify-center mb-4">
            <LogIn size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-center">Welcome back</h2>
          <p className="text-brand-textMuted text-sm mt-2">Sign in to your CampusFlow account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-brand-textMuted">Email address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              placeholder="you@university.edu"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-brand-textMuted">Password</label>
              <a href="#" className="text-xs text-brand-primary hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-text text-brand-bg py-2.5 rounded-lg font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 flex justify-center mt-2"
          >
            {loading ? <span className="animate-pulse">Signing in...</span> : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-textMuted mt-8">
          Don't have an account? <Link to="/signup" className="text-brand-primary font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
