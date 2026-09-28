import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Calendar, 
  MapPin, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  ExternalLink,
  Ban,
  ArrowRight,
  Filter
} from 'lucide-react';
import { registrationService } from '../../services/registrationService';
import { useToast } from '../../hooks/useToast';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatDate, formatTime } from '../../utils/formatters';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegForCancel, setSelectedRegForCancel] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'registered', 'cancelled'

  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadMyRegistrations();
  }, []);

  async function loadMyRegistrations() {
    setLoading(true);
    try {
      const { data, error } = await registrationService.getMyRegistrations();
      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error loading registrations:', err);
      toastError(getFriendlyErrorMessage(err, 'Could not load your registrations.'));
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmCancel = async () => {
    if (!selectedRegForCancel) return;

    setActionLoading(true);
    try {
      await registrationService.cancelRegistration(selectedRegForCancel.event_id);
      success('Registration cancelled successfully.');
      
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === selectedRegForCancel.id ? { ...r, status: 'Cancelled' } : r
        )
      );
      setSelectedRegForCancel(null);
    } catch (err) {
      console.error('Cancellation error:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to cancel registration.'));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRegistrations = useMemo(() => {
    if (activeTab === 'registered') {
      return registrations.filter((r) => r.status === 'Registered');
    }
    if (activeTab === 'cancelled') {
      return registrations.filter((r) => r.status === 'Cancelled');
    }
    return registrations;
  }, [registrations, activeTab]);

  const registeredCount = registrations.filter((r) => r.status === 'Registered').length;
  const cancelledCount = registrations.filter((r) => r.status === 'Cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Attendance History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-sm text-[#6b7280] mt-1 font-normal">
            Manage your seat reservations and keep track of your schedule.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-all self-start sm:self-auto"
        >
          <span>Find More Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4e7ef] pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#0f1117] text-white shadow-sm'
              : 'text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f8f9fc]'
          }`}
        >
          All ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'registered'
              ? 'bg-[#0f1117] text-white shadow-sm'
              : 'text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f8f9fc]'
          }`}
        >
          Active ({registeredCount})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#0f1117] text-white shadow-sm'
              : 'text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f8f9fc]'
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#e4e7ef] overflow-hidden p-6 space-y-4 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-[#f1f3f8] rounded-xl w-1/4"></div>
            <div className="h-12 bg-[#f8f9fc] rounded-xl w-full"></div>
            <div className="h-12 bg-[#f8f9fc] rounded-xl w-full"></div>
            <div className="h-12 bg-[#f8f9fc] rounded-xl w-full"></div>
          </div>
        </div>
      ) : filteredRegistrations.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#e4e7ef] bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[#e4e7ef] text-xs font-semibold text-[#6b7280]">
                  <th className="py-3.5 px-6">Event Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Event Date</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Registered On</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f8] text-sm">
                {filteredRegistrations.map((reg) => {
                  const isRegistered = reg.status === 'Registered';

                  return (
                    <tr key={reg.id} className="hover:bg-[#f8f9fc]/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#0f1117]">
                        <Link
                          to={`/events/${reg.event_id}`}
                          className="hover:text-[#4f46e5] transition-colors line-clamp-1"
                        >
                          {reg.title || 'Campus Event'}
                        </Link>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge category={reg.category} className="text-xs font-medium" />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-[#4b5563] text-xs font-medium">
                        {formatDate(reg.date)}
                      </td>
                      <td className="py-4 px-4 text-[#6b7280] text-xs line-clamp-1 max-w-[180px]">
                        {reg.venue}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-[#9ca3af] text-xs">
                        {formatDate(reg.registration_date)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right space-x-2">
                        <Link
                          to={`/events/${reg.event_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#4b5563] hover:text-[#0f1117] bg-[#f8f9fc] hover:bg-[#f1f3f8] border border-[#e4e7ef] transition-colors"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3 h-3 text-[#9ca3af]" />
                        </Link>

                        {isRegistered && (
                          <button
                            onClick={() => setSelectedRegForCancel(reg)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-100/60 border border-red-200 bg-red-50 transition-colors"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredRegistrations.map((reg) => {
              const isRegistered = reg.status === 'Registered';

              return (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-[#e4e7ef] p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge category={reg.category} className="text-xs" />
                    {isRegistered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
                        <CheckCircle2 className="w-3 h-3" />
                        Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-[#0f1117]">
                    <Link to={`/events/${reg.event_id}`} className="hover:text-[#4f46e5] transition-colors">
                      {reg.title || 'Campus Event'}
                    </Link>
                  </h3>

                  <div className="space-y-1.5 text-xs text-[#6b7280]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#4f46e5]" />
                      <span>{formatDate(reg.date)} · {formatTime(reg.time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#9ca3af]" />
                      <span>{reg.venue}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f1f3f8] flex items-center justify-between gap-2">
                    <Link
                      to={`/events/${reg.event_id}`}
                      className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1"
                    >
                      <span>Event Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    {isRegistered && (
                      <button
                        onClick={() => setSelectedRegForCancel(reg)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1 rounded-xl border border-red-200 bg-red-50"
                      >
                        Cancel Seat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#e4e7ef] space-y-4 shadow-sm">
          <Calendar className="w-12 h-12 text-[#9ca3af] mx-auto" strokeWidth={1.5} />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0f1117]">No registrations found</h3>
            <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
              {activeTab === 'all'
                ? "You haven't reserved a seat for any campus events yet."
                : `No events in '${activeTab}' status.`}
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-all"
          >
            Explore Events Now
          </Link>
        </div>
      )}

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        isOpen={Boolean(selectedRegForCancel)}
        onClose={() => setSelectedRegForCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your seat reservation for "${selectedRegForCancel?.title}"? This seat will immediately become available for other students.`}
        confirmText="Yes, Cancel Seat"
        cancelText="Keep My Seat"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}

export default MyRegistrationsPage;
