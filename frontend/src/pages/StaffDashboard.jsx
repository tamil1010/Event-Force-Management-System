import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Calendar, MapPin, Clock, CheckCircle2, XCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffStats();
  }, []);

  const fetchStaffStats = async () => {
    try {
      const res = await api.get('/dashboard/staff');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load staff dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    setActionLoading(assignmentId);
    try {
      await api.put(`/assignments/${assignmentId}/status`, { status: newStatus });
      await fetchStaffStats();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Duty Schedule..." />;
  }

  if (!data) return null;

  const { summary, profile, upcomingAssignments, allAssignments } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Staff Duty Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border-emerald-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile?.avatar}
              alt={profile?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{profile?.name}</h1>
                <Badge variant={profile?.availabilityStatus}>{profile?.availabilityStatus}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profile?.department} • Staff Duty Roster
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-200 border border-slate-800 transition-colors self-start sm:self-auto"
          >
            Update My Profile
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Assigned Duty"
          value={summary.totalAssignments}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Upcoming Shifts"
          value={summary.upcoming}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Active Live Events"
          value={summary.active}
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Completed Operations"
          value={summary.completed}
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Upcoming Duty Assignments List */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">My Assigned Event Shifts</h3>

        {allAssignments.length === 0 ? (
          <EmptyState
            title="No Assignments Scheduled"
            description="You currently have no event assignments scheduled. Check back later or notify your event manager."
          />
        ) : (
          <div className="space-y-4">
            {allAssignments.map((assignment) => {
              const evt = assignment.eventId;
              if (!evt) return null;

              return (
                <div
                  key={assignment._id}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {assignment.roleInEvent}
                      </span>
                      <Badge variant={assignment.status}>{assignment.status}</Badge>
                      <Badge variant={evt.status}>{evt.status}</Badge>
                    </div>

                    <h4 className="text-xl font-extrabold text-white">{evt.name}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-400" />
                        <span className="font-semibold text-white">Date & Time:</span>{' '}
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        ({evt.startTime} - {evt.endTime})
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span className="font-semibold text-white">Location:</span> {evt.location}
                      </p>
                    </div>

                    {assignment.note && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300">
                        <span className="font-bold text-slate-400 uppercase">Instructions: </span>
                        {assignment.note}
                      </div>
                    )}
                  </div>

                  {/* Actions for Staff: Confirm or Decline */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                    {assignment.status === 'Assigned' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(assignment._id, 'Confirmed')}
                          disabled={actionLoading === assignment._id}
                          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Shift
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(assignment._id, 'Declined')}
                          disabled={actionLoading === assignment._id}
                          className="w-full sm:w-auto px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline Shift
                        </button>
                      </>
                    )}

                    {assignment.status === 'Confirmed' && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Shift Confirmed
                      </span>
                    )}

                    <button
                      onClick={() => navigate(`/events/${evt._id}`)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 rounded-xl transition-colors"
                    >
                      View Event Info
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
