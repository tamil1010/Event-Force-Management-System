import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Filter, Phone, Mail, Building, Shield, CheckCircle, Clock } from 'lucide-react';

const ForceList = () => {
  const { hasRole } = useAuth();
  const [forceMembers, setForceMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberAssignments, setMemberAssignments] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    fetchForceMembers();
  }, [deptFilter, availabilityFilter]);

  const fetchForceMembers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (deptFilter) params.department = deptFilter;
      if (availabilityFilter) params.availabilityStatus = availabilityFilter;

      const res = await api.get('/force-members', { params });
      if (res.data.success) {
        setForceMembers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch force members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMemberDetails = async (member) => {
    setSelectedMember(member);
    setLoadingModal(true);
    try {
      const res = await api.get(`/force-members/${member._id}`);
      if (res.data.success) {
        setMemberAssignments(res.data.data.assignments || []);
      }
    } catch (err) {
      console.error('Failed to load member profile details:', err);
    } finally {
      setLoadingModal(false);
    }
  };

  const filteredMembers = forceMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Force & Staff Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personnel database, department allocations, and live availability tracking
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search staff by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
            >
              <option value="">All Departments</option>
              <option value="Security">Security</option>
              <option value="Crowd Control">Crowd Control</option>
              <option value="Medical Support">Medical Support</option>
              <option value="Logistics">Logistics</option>
              <option value="Tech Support">Tech Support</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
          >
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Force Members Directory Cards */}
      {loading ? (
        <LoadingSpinner label="Loading staff directory..." />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          title="No Force Members Found"
          description="No personnel matches your selected search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              onClick={() => handleOpenMemberDetails(member)}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{member.name}</h3>
                      <span className="text-xs text-brand-400 font-medium">
                        {member.department}
                      </span>
                    </div>
                  </div>
                  <Badge variant={member.availabilityStatus}>{member.availabilityStatus}</Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{member.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{member.phone || 'No phone recorded'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" /> {member.role}
                </span>
                <span className="font-semibold text-brand-400 hover:underline">
                  View Profile & Roster →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Details Modal Drawer */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={`Personnel Profile - ${selectedMember.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{selectedMember.name}</h3>
                <p className="text-xs text-slate-400">{selectedMember.email} • {selectedMember.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedMember.department}>{selectedMember.department}</Badge>
                  <Badge variant={selectedMember.availabilityStatus}>{selectedMember.availabilityStatus}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Event Assignment History</h4>
              {loadingModal ? (
                <p className="text-xs text-slate-400">Loading assignments...</p>
              ) : memberAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-800 rounded-xl text-center">
                  No event assignments recorded for this member.
                </p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {memberAssignments.map((assign) => (
                    <div
                      key={assign._id}
                      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{assign.eventId?.name || 'Event'}</p>
                        <p className="text-slate-400">
                          Role: <span className="text-brand-300 font-medium">{assign.roleInEvent}</span>
                        </p>
                      </div>
                      <Badge variant={assign.status}>{assign.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ForceList;
