import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Badge from './Badge';
import api from '../services/api';
import { UserPlus, AlertTriangle, CheckCircle, Search, Shield } from 'lucide-react';

const AssignmentModal = ({ isOpen, onClose, event, onAssignSuccess }) => {
  const [availableStaff, setAvailableStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [roleInEvent, setRoleInEvent] = useState('Event Support Staff');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && event) {
      fetchAvailableStaff();
      setErrorMsg('');
      setSuccessMsg('');
      setSelectedStaffId('');
    }
  }, [isOpen, event]);

  const fetchAvailableStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/force-members');
      if (res.data.success) {
        setAvailableStaff(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load force members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setErrorMsg('Please select a force member to assign');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/assignments', {
        eventId: event._id,
        forceMemberId: selectedStaffId,
        roleInEvent,
        note,
      });

      if (res.data.success) {
        setSuccessMsg('Force member assigned successfully!');
        setTimeout(() => {
          onAssignSuccess();
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStaff = availableStaff.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  if (!event) return null;

  const remainingNeeded = Math.max(0, event.requiredForce - event.assignedForceCount);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Force Member - ${event.name}`}>
      <div className="space-y-6">
        {/* Header Event Capacity Summary */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Required Force</span>
            <p className="text-xl font-bold text-white">{event.requiredForce}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Assigned</span>
            <p className="text-xl font-bold text-blue-400">{event.assignedForceCount}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Remaining Needed</span>
            <p className={`text-xl font-bold ${remainingNeeded > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {remainingNeeded}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-4">
          {/* Select Staff Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              1. Select Force Member
            </label>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search by staff name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="max-h-52 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl divide-y divide-slate-800/60 bg-slate-900/50">
              {loading ? (
                <p className="p-4 text-center text-xs text-slate-400">Loading force members...</p>
              ) : filteredStaff.length === 0 ? (
                <p className="p-4 text-center text-xs text-slate-400">No staff members found.</p>
              ) : (
                filteredStaff.map((staff) => (
                  <div
                    key={staff._id}
                    onClick={() => setSelectedStaffId(staff._id)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedStaffId === staff._id
                        ? 'bg-brand-600/20 border-l-4 border-brand-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{staff.name}</p>
                        <p className="text-xs text-slate-400">{staff.department} • {staff.phone || 'No phone'}</p>
                      </div>
                    </div>
                    <Badge variant={staff.availabilityStatus}>{staff.availabilityStatus}</Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Role in Event */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              2. Assign Specific Role/Duty
            </label>
            <select
              value={roleInEvent}
              onChange={(e) => setRoleInEvent(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Event Support Staff">General Event Support</option>
              <option value="Head Security Officer">Head Security Officer</option>
              <option value="Crowd Controller">Crowd Controller</option>
              <option value="First Responder / Medical">First Responder / Medical</option>
              <option value="VIP Escort Lead">VIP Escort Lead</option>
              <option value="Access Controller">Access Controller</option>
              <option value="Tech & Media Lead">Tech & Media Lead</option>
            </select>
          </div>

          {/* Special Instructions Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              3. Special Instructions / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Report to Gate 3 at 08:00 AM sharp with high-vis vest."
              className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedStaffId}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? 'Assigning...' : 'Assign Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssignmentModal;
