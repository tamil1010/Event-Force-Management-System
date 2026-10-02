import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    // Event Statuses
    Upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Completed: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',

    // Force Member Statuses
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Assigned: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'On Leave': 'bg-slate-500/10 text-slate-400 border-slate-500/30',

    // Assignment Statuses
    Confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Declined: 'bg-rose-500/10 text-rose-400 border-rose-500/30',

    // Roles
    Admin: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'Event Manager': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'Staff/Force Member': 'bg-slate-700/40 text-slate-300 border-slate-600/30',

    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const styleClass = variants[variant] || variants[children] || variants.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styleClass} ${sizes[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse" />
      {children}
    </span>
  );
};

export default Badge;
