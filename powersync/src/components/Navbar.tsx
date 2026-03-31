import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Search, History, Home as HomeIcon, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { name: 'Beranda', path: '/', icon: HomeIcon },
    { name: 'Katalog', path: '/catalog', icon: Search },
    { name: 'Booking Saya', path: '/my-bookings', icon: History },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-50 order-slate-100 py-4 shadow-sm">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md shadow-emerald-200">
            <Zap className="text-white" size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent tracking-tight">
            PowerSync
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-700 leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Power Member</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors">
                    <UserIcon size={16} />
                    Profil Saya
                  </Link>
                  <button 
                    onClick={() => { setShowDropdown(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Keluar Sistem
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 font-bold hover:text-emerald-600 transition-colors mr-2">Masuk</Link>
              <Link to="/register" className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-200">
                Mulai Sekarang
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
