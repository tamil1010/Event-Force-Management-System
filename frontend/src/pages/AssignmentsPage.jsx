import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, Users, Trash2, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssignmentsPage = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // If Staff Member, fetch my assignments; if Admin/Manager, fetch overall
      const endpoint = hasRole('Staff/Force Member') && !hasRole('Admin', 'Event Manager')
        ? '/assignments/my-assignments'
        : '/assignments/my-assignments'; // or custom route

      const res = await api.get(endpoint);
      if (res.data.success) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this assignment?')) return;
    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      console.error('Failed to remove assignment:', err);
    }
  };

  const filtered = assignments.filter((a) => (filterStatus ? a.status === filterStatus : true));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Force Assignments Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time shift allocations, role duties, and confirmation records
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 self-start sm:self-auto"
        >
          <option value="">All Assignment Statuses</option>
          <option value="Assigned">Assigned</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Declined">Declined</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading assignment records..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Assignments Found"
          description="There are currently no staff assignments matching your criteria."
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold bg-slate-900/60">
                  <th className="py-3.5 px-4">Event Operation</th>
                  <th className="py-3.5 px-4">Force Member</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  {hasRole('Admin', 'Event Manager') && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filtered.map((item) => {
                  const evt = item.eventId;
                  const member = item.forceMemberId;

                  return (
                    <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {evt ? (
                          <div
                            onClick={() => navigate(`/events/${evt._id}`)}
                            className="cursor-pointer hover:text-brand-400 transition-colors"
                          >
                            <p className="line-clamp-1">{evt.name}</p>
                            <p className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400" /> {evt.location}
                            </p>
                          </div>
                        ) : (
                          'Unknown Event'
                        )}
                      </td>

                      <td className="py-4 px-4">
                        {member ? (
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="font-semibold text-white text-xs">{member.name}</p>
                              <p className="text-[10px] text-slate-400">{member.department}</p>
                            </div>
                          </div>
                        ) : (
                          'Self'
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {item.roleInEvent}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-300">
                        {evt && (
                          <>
                            {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            <span className="text-slate-500 block">{evt.startTime} - {evt.endTime}</span>
                          </>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={item.status}>{item.status}</Badge>
                      </td>

                      {hasRole('Admin', 'Event Manager') && (
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Remove assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
