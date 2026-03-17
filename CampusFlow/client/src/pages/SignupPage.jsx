import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import GeometricBackground from '../components/GeometricBackground';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mocking signup since DB is down
      setTimeout(() => {
        const mockUser = { id: 'user123', email, name };
        const mockToken = 'mock-jwt-token-123';
        login(mockUser, mockToken);
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-brand-primary flex items-center justify-center mb-4">
            <UserPlus size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-center">Create account</h2>
          <p className="text-brand-textMuted text-sm mt-2">Join CampusFlow to automate your workflow</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-brand-textMuted">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-brand-textMuted">Email address</label>
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
            <label className="block text-sm font-medium mb-1.5 text-brand-textMuted">Password</label>
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
            className="w-full bg-brand-primary text-white py-2.5 rounded-lg font-medium hover:bg-brand-primaryHover hover:shadow-lg transition-all disabled:opacity-50 flex justify-center mt-4"
          >
            {loading ? <span className="animate-pulse">Creating account...</span> : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-textMuted mt-8">
          Already have an account? <Link to="/login" className="text-brand-text font-medium hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignupPage;
