import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  UserCheck,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/dashboard/admin';
    if (user.role === 'Event Manager') return '/dashboard/manager';
    return '/dashboard/staff';
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: getDashboardPath(),
      icon: LayoutDashboard,
      roles: ['Admin', 'Event Manager', 'Staff/Force Member'],
    },
    {
      label: 'Events Catalog',
      path: '/events',
      icon: Calendar,
      roles: ['Admin', 'Event Manager', 'Staff/Force Member'],
    },
    {
      label: 'Force & Staff',
      path: '/force-members',
      icon: Users,
      roles: ['Admin', 'Event Manager'],
    },
    {
      label: 'Force Assignments',
      path: '/assignments',
      icon: ClipboardList,
      roles: ['Admin', 'Event Manager', 'Staff/Force Member'],
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: UserCheck,
      roles: ['Admin', 'Event Manager', 'Staff/Force Member'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    user && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 glass-panel border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/20 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-wider flex items-center gap-1.5">
                EVENT<span className="text-brand-500">FORCE</span>
              </h1>
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
                Management System
              </span>
            </div>
          </div>

          {/* User Status Pill in Sidebar */}
          {user && (
            <div className="mx-4 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-700"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <span className="inline-block text-[10px] font-medium text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 mt-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-lg shadow-brand-600/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 text-xs text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>MongoDB Atlas & Cloudinary Enabled</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
