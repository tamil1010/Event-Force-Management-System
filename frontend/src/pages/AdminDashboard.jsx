import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/dashboard/admin');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Executive Analytics..." />;
  }

  if (!stats) return null;

  const { events, force, recentEvents, departmentDistribution, eventsByCategory } = stats;

  const forceStatusPieData = [
    { name: 'Available', value: force.available, color: '#10b981' },
    { name: 'Assigned', value: force.assigned, color: '#f59e0b' },
    { name: 'On Leave', value: force.onLeave, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border-brand-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30">
              Administrator Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Force Command Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Live operational metrics across all events, department deployment, and force availability.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/events')}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Manage Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Events"
          value={events.total}
          icon={Calendar}
          color="blue"
          description={`${events.upcoming} Upcoming • ${events.active} Active`}
        />
        <StatCard
          title="Total Force Members"
          value={force.total}
          icon={Users}
          color="cyan"
          description={`${force.managers} Event Managers`}
        />
        <StatCard
          title="Available Force"
          value={force.available}
          icon={UserCheck}
          color="emerald"
          description="Ready for immediate assignment"
        />
        <StatCard
          title="Assigned Force"
          value={force.assigned}
          icon={Clock}
          color="amber"
          description="Currently deployed on duty"
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Force Distribution Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-400" />
                Department Headcount Breakdown
              </h3>
              <p className="text-xs text-slate-400">Total staff count per specialization</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Force Availability Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-emerald-400" />
              Force Availability Ratio
            </h3>
            <p className="text-xs text-slate-400 mb-4">Current availability status breakdown</p>
          </div>
          
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={forceStatusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {forceStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-800">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Available</p>
              <p className="text-sm font-bold text-emerald-400">{force.available}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Assigned</p>
              <p className="text-sm font-bold text-amber-400">{force.assigned}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">On Leave</p>
              <p className="text-sm font-bold text-slate-400">{force.onLeave}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Event Operations</h3>
            <p className="text-xs text-slate-400">Latest scheduled and active events</p>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Force Capacity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {recentEvents.map((evt) => (
                <tr key={evt._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{evt.name}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{evt.category}</td>
                  <td className="py-3 px-4 text-xs text-slate-300">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({evt.startTime})
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (evt.assignedForceCount / evt.requiredForce) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">
                        {evt.assignedForceCount}/{evt.requiredForce}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={evt.status}>{evt.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/events/${evt._id}`)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
