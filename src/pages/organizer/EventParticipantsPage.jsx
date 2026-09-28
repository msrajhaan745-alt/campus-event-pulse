import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { organizerService } from '../../services/organizerService';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function EventParticipantsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadParticipants() {
      setLoading(true);
      setError(null);
      try {
        const { data: res, error: rpcErr } = await organizerService.getEventParticipants(id);
        if (rpcErr) throw rpcErr;
        setData(res);
      } catch (err) {
        console.error('Participants loading error:', err);
        setError(getFriendlyErrorMessage(err, 'Failed to load participant list.'));
      } finally {
        setLoading(false);
      }
    }

    loadParticipants();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-[#6b7280] font-medium">Loading participant list from database...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#0f1117]">Unable to Load Participants</h2>
        <p className="text-sm text-[#6b7280]">{error || 'Could not retrieve roster.'}</p>
        <Link
          to="/organizer/events"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0f1117] text-white hover:bg-[#1e2330] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Events</span>
        </Link>
      </div>
    );
  }

  const {
    event = {},
    participants = [],
    total_participants = 0,
    seat_limit = 50,
    available_seats = 50,
  } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back Link */}
      <Link
        to="/organizer/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#0f1117] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Events Management</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e4e7ef] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-2px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Participant Roster</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
              {event.title || 'Campus Event'}
            </h1>
            <p className="text-sm text-[#6b7280] mt-1">
              Confirmed student registrations and check-in status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/events/${id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#e4e7ef] text-[#4b5563] hover:text-[#0f1117] hover:bg-[#f8f9fc] transition-colors"
            >
              <span>Public Event Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9ca3af]" />
            </Link>
          </div>
        </div>

        {/* Capacity Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 mt-6 border-t border-[#f1f3f8] text-center">
          <div className="bg-[#f8f9fc] p-4 rounded-xl border border-[#e4e7ef]">
            <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1">
              Total Registered
            </span>
            <span className="text-2xl font-extrabold text-[#0f1117]">
              {total_participants}
            </span>
          </div>

          <div className="bg-[#f8f9fc] p-4 rounded-xl border border-[#e4e7ef]">
            <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1">
              Seat Limit
            </span>
            <span className="text-2xl font-extrabold text-[#0f1117]">
              {seat_limit}
            </span>
          </div>

          <div className="bg-[#f8f9fc] p-4 rounded-xl border border-[#e4e7ef]">
            <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1">
              Available Seats
            </span>
            <span className={`text-2xl font-extrabold ${available_seats <= 5 && available_seats > 0 ? 'text-amber-600' : available_seats === 0 ? 'text-red-500' : 'text-[#059669]'}`}>
              {available_seats}
            </span>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      {participants.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#e4e7ef] overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-[#e4e7ef] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0f1117]">
              Registered Students ({participants.length})
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[#e4e7ef] text-xs font-semibold text-[#6b7280]">
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-4">Student Email</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f8] text-sm">
                {participants.map((p, idx) => {
                  const isRegistered = (p.status || 'Registered') === 'Registered';

                  return (
                    <tr key={p.id || idx} className="hover:bg-[#f8f9fc]/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#0f1117]">
                        {p.student_name || 'Student Participant'}
                      </td>
                      <td className="py-4 px-4 text-[#6b7280] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#9ca3af]" />
                        <span>{p.student_email || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4 text-[#9ca3af] text-xs whitespace-nowrap">
                        {formatDate(p.registration_date)}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-[#f1f3f8]">
            {participants.map((p, idx) => (
              <div key={p.id || idx} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0f1117] text-sm">
                    {p.student_name || 'Student Participant'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                    Registered
                  </span>
                </div>
                <div className="text-xs text-[#6b7280] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#9ca3af]" />
                  <span>{p.student_email}</span>
                </div>
                <div className="text-xs text-[#9ca3af]">
                  Registered: {formatDate(p.registration_date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No students have registered for this event yet."
          description="Make sure this event is Published so students can discover and register for it."
        />
      )}
    </div>
  );
}

export default EventParticipantsPage;
