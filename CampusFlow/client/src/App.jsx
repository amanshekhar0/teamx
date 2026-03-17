import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Bell, LogOut, Moon, Sun } from 'lucide-react';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// V2 Sidebar with sexy minimal styling
function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
    <div className="w-64 bg-brand-surface h-full border-r border-brand-border flex flex-col pt-8 transition-colors duration-300 hidden md:flex z-40">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold tracking-tight text-brand-text flex items-center">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-brand-primary to-blue-400 mr-2 flex-shrink-0"></span>
          CampusFlow
        </h1>
      </div>
      <nav className="flex-1 flex flex-col space-y-1 px-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              isActive ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-brand-textMuted hover:bg-brand-bg hover:text-brand-text'
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/register-student"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              isActive ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-brand-textMuted hover:bg-brand-bg hover:text-brand-text'
            }`
          }
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-brand-border space-y-2">
        <div className="px-3 py-2 mb-2 flex items-center justify-between">
          <div className="text-sm font-medium truncate">{user?.name}</div>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-brand-textMuted hover:bg-brand-bg transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-bg text-brand-text transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes inside Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/register-student" element={
            <ProtectedRoute>
              <AppLayout><RegisterPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Redirect arbitrary paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
