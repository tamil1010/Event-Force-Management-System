import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignmentModal from '../components/AssignmentModal';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UserPlus,
  Trash2,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  FileText,
  Shield,
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/events/${id}`, { status: newStatus });
      if (res.data.success) {
        fetchEventDetails();
      }
    } catch (err) {
      console.error('Failed to update event status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Remove this force member from the event assignment?')) return;
    try {
      await api.delete(`/assignments/${assignmentId}`);
      fetchEventDetails();
    } catch (err) {
      console.error('Failed to remove assignment:', err);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event and remove all staff assignments?')) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.success) {
        navigate('/events');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading event operational details..." />;
  if (!event) return null;

  const remainingNeeded = Math.max(0, event.requiredForce - event.assignedForceCount);
  const percentageMet = Math.round((event.assignedForceCount / event.requiredForce) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events Catalog
      </button>

      {/* Hero Header */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="h-64 relative bg-slate-900">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={event.status}>{event.status}</Badge>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-950/80 text-brand-300 border border-brand-500/30">
              {event.category}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{event.name}</h1>
              <p className="text-xs text-slate-300 mt-1">
                Created by {event.createdBy?.name || 'Admin'} • {event.createdBy?.email}
              </p>
            </div>

            {/* Event Manager Controls */}
            {hasRole('Admin', 'Event Manager') && (
              <div className="flex items-center gap-3">
                <select
                  value={event.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none"
                >
                  <option value="Upcoming">Status: Upcoming</option>
                  <option value="Active">Status: Active</option>
                  <option value="Completed">Status: Completed</option>
                  <option value="Cancelled">Status: Cancelled</option>
                </select>

                <button
                  onClick={handleDeleteEvent}
                  disabled={deleting}
                  className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Operational Overview Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Date & Time</span>
              <p className="text-sm font-bold text-white">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-slate-400">{event.startTime} - {event.endTime}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Venue Location</span>
              <p className="text-sm font-bold text-white">{event.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Staffing Capacity</span>
              <p className="text-sm font-bold text-white">
                {event.assignedForceCount} / {event.requiredForce} Assigned
              </p>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, percentageMet)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Briefing & Assigned Force Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Instructions */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-brand-400" />
              Event Description & Briefing
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description || 'No specific briefing details provided.'}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-indigo-400" />
              Force Requirements Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Required Headcount</span>
                <span className="font-bold text-white">{event.requiredForce} members</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Confirmed Deployed</span>
                <span className="font-bold text-emerald-400">{event.assignedForceCount} members</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Open Vacancies</span>
                <span className={`font-bold ${remainingNeeded > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {remainingNeeded} remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Force Members List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Assigned Force Roster</h3>
              <p className="text-xs text-slate-400">
                Staff members assigned to operational duty for this event
              </p>
            </div>

            {hasRole('Admin', 'Event Manager') && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Assign Staff
              </button>
            )}
          </div>

          {event.assignments.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No force members assigned yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click 'Assign Staff' to allocate personnel to this event.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {event.assignments.map((assign) => {
                const member = assign.forceMemberId;
                if (!member) return null;

                return (
                  <div
                    key={assign._id}
                    className="py-4 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{member.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            {assign.roleInEvent}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {member.department} • {member.phone || member.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge variant={assign.status}>{assign.status}</Badge>

                      {hasRole('Admin', 'Event Manager') && (
                        <button
                          onClick={() => handleRemoveAssignment(assign._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Remove assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal Dialog */}
      {isAssignModalOpen && (
        <AssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          event={event}
          onAssignSuccess={fetchEventDetails}
        />
      )}
    </div>
  );
};

export default EventDetails;
