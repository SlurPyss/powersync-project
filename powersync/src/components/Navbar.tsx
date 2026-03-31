import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Search, History, Home as HomeIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/', icon: HomeIcon },
    { name: 'Katalog', path: '/catalog', icon: Search },
    { name: 'Booking Saya', path: '/my-bookings', icon: History },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-emerald-100 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Zap className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            FleetCharge
          </span>
        </Link>

        <div className="hidden md:flex gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <Link to="/catalog" className="btn-primary flex items-center gap-2">
          Cari Stasiun
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
