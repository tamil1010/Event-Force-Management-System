import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignmentModal from '../components/AssignmentModal';
import { Calendar, Users, UserPlus, Plus, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEventForAssign, setSelectedEventForAssign] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const fetchManagerStats = async () => {
    try {
      const res = await api.get('/dashboard/manager');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load manager dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Manager Dashboard..." />;
  }

  if (!data) return null;

  const {
    totalManaged,
    upcomingManaged,
    activeManaged,
    totalRequiredStaff,
    totalAssignedStaff,
    availableStaffCount,
    managedEvents,
  } = data;

  const staffingPercentage = totalRequiredStaff > 0
    ? Math.round((totalAssignedStaff / totalRequiredStaff) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Event Manager Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border-cyan-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Event Manager Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Staffing & Event Progress
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor force headcount targets, assign qualified personnel, and launch new events.
            </p>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="px-5 py-3 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Managed Events"
          value={totalManaged}
          icon={Calendar}
          color="cyan"
          description={`${upcomingManaged} Upcoming • ${activeManaged} Active`}
        />
        <StatCard
          title="Required Force Headcount"
          value={totalRequiredStaff}
          icon={Users}
          color="blue"
          description="Total force positions needed"
        />
        <StatCard
          title="Assigned Force Staff"
          value={totalAssignedStaff}
          icon={CheckCircle}
          color="emerald"
          description={`${staffingPercentage}% staffing quota met`}
        />
        <StatCard
          title="Pool Available Staff"
          value={availableStaffCount}
          icon={UserPlus}
          color="amber"
          description="Available for event assignment"
        />
      </div>

      {/* Managed Events Progress Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Managed Event Progress</h3>
          <button
            onClick={() => navigate('/events')}
            className="text-xs font-semibold text-brand-400 hover:underline"
          >
            View All Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managedEvents.map((evt) => {
            const pct = Math.round((evt.assignedForceCount / evt.requiredForce) * 100);
            const remaining = Math.max(0, evt.requiredForce - evt.assignedForceCount);

            return (
              <div
                key={evt._id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {evt.category}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">{evt.name}</h4>
                    </div>
                    <Badge variant={evt.status}>{evt.status}</Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 my-4">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {new Date(evt.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      ({evt.startTime} - {evt.endTime})
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {evt.location}
                    </p>
                  </div>

                  {/* Staffing Progress Bar */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-300">Staffing Quota Progress</span>
                      <span className="font-bold text-blue-400">
                        {evt.assignedForceCount} / {evt.requiredForce} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 100
                            ? 'bg-emerald-500'
                            : pct > 50
                            ? 'bg-brand-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    {remaining > 0 ? (
                      <p className="text-[11px] text-amber-400 mt-2">
                        ⚠️ Needs {remaining} more force members
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-400 mt-2">
                        ✓ Fully staffed
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => navigate(`/events/${evt._id}`)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-medium rounded-xl text-slate-300 border border-slate-800 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setSelectedEventForAssign(evt)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-xs font-bold rounded-xl text-white shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign Staff
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedEventForAssign && (
        <AssignmentModal
          isOpen={!!selectedEventForAssign}
          onClose={() => setSelectedEventForAssign(null)}
          event={selectedEventForAssign}
          onAssignSuccess={fetchManagerStats}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
