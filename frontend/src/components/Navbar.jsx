import React from 'react';
import { Menu, Search, User } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Toggle Sidebar Button (Mobile) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-400">
          <span className="font-semibold text-white">Event Force Platform</span>
          <span>/</span>
          <span className="text-brand-400 font-medium capitalize">{user?.role || 'Guest'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notifications Popover */}
        <NotificationBell />

        {/* User Profile Quick Access */}
        {user && (
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-3 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 cursor-pointer transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-brand-500/40"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.department || user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
