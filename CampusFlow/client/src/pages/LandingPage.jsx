import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Sparkles, Moon, Sun } from 'lucide-react';
import GeometricBackground, { CursorGlow } from '../components/GeometricBackground';
import { useTheme } from '../context/ThemeContext';

function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col selection:bg-brand-primary/30">
      <GeometricBackground />
      <CursorGlow />

      {/* Nav */}
      <nav className="fixed w-full top-0 z-50 border-b border-white/5 backdrop-blur-md bg-brand-bg/60 supports-[backdrop-filter]:bg-brand-bg/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-blue-400 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CampusFlow</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-brand-surface transition-colors cursor-pointer">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="text-sm font-medium hover:text-brand-primary transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/signup" className="text-sm font-medium bg-brand-text text-brand-bg px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-8"
          variants={containerVars}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVars} className="inline-flex items-center space-x-2 bg-brand-surface border border-brand-border px-3 py-1 rounded-full text-xs font-medium text-brand-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span>CampusFlow V2 is now Live</span>
          </motion.div>

          <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            Automate your campus life <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">with absolute precision.</span>
          </motion.h1>

          <motion.p variants={itemVars} className="text-lg md:text-xl text-brand-textMuted max-w-2xl mx-auto leading-relaxed">
            The ultimate productivity engine for students. Seamlessly bridge your frontend workflows to powerful n8n backends, all wrapped in a gorgeous interface.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup" className="group w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-brand-primaryHover transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              <span>Get Started</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium border border-brand-border hover:bg-brand-surface transition-colors">
              View Features
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32 w-full"
          id="features"
        >
          {[
            { icon: <Zap className="text-yellow-500" />, title: "Lightning Fast", desc: "Instantly trigger n8n workflows with sub-second latency from our optimized Node.js edge endpoints." },
            { icon: <Shield className="text-emerald-500" />, title: "Secure JWT Auth", desc: "Enterprise-grade security for student accounts, ensuring your deadlines are private and protected." },
            { icon: <Sparkles className="text-purple-500" />, title: "Stunning UI/UX", desc: "Fluid animations, intelligent dark mode toggles, and pure minimalist perfection." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-brand-surface/50 border border-brand-border backdrop-blur-sm hover:border-brand-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-brand-textMuted text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

export default LandingPage;
