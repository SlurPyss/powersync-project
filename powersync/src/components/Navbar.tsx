import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Search, History, Home as HomeIcon, LogOut, User as UserIcon, ChevronDown, Shield, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'Beranda', path: '/', icon: HomeIcon },
    { name: 'Katalog', path: '/catalog', icon: Search },
    { name: 'Lokasi', path: '/#lokasi', icon: MapPin },
    { name: 'Cara Kerja', path: '/#cara-kerja', icon: Zap },
  ];

  if (isAuthenticated && user?.role !== 'admin') {
    navItems.push({ name: 'Booking Saya', path: '/my-bookings', icon: History });
  }

  if (user?.role === 'admin') {
    navItems.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
    navItems.push({ name: 'Laporan TOPSIS', path: '/topsis-report', icon: LayoutDashboard });
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100/60 py-3 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-emerald-200">
              <Zap className="text-white" size={22} fill="currentColor" />
            </div>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent tracking-tight">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right section: Auth + Hamburger */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 sm:gap-3 pl-2 pr-3 sm:pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-700 leading-none">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Power Member</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-2 transition-all duration-200 origin-top-right ${
                    showDropdown
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                  >
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
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-slate-600 font-bold hover:text-emerald-600 transition-colors">Masuk</Link>
                <Link to="/register" className="btn-primary flex items-center gap-2 !py-2.5 !px-5 !text-sm shadow-lg shadow-emerald-200">
                  Mulai Sekarang
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[280px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-lg font-black bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Menu
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Nav Items */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Footer: Auth Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
              >
                <UserIcon size={16} />
                Profil Saya
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                Keluar Sistem
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login" className="block w-full text-center px-4 py-3 text-sm font-bold text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="block w-full text-center px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                Mulai Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
