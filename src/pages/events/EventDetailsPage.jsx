import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Share2,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatDate, formatTime } from '../../utils/formatters';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isOrganizer } = useAuth();
  const { success, error: toastError } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // Dialog states
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch event details and check registration
  useEffect(() => {
    async function loadEventData() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await eventService.getEventDetails(id);
        if (fetchErr) throw fetchErr;
        if (!data) throw new Error('Event not found');

        setEvent(data);

        // Check if student has already registered
        if (isAuthenticated && isStudent) {
          try {
            const { data: myRegs } = await registrationService.getMyRegistrations();
            if (myRegs) {
              const reg = myRegs.find(
                (r) => String(r.event_id) === String(id) && r.status === 'Registered'
              );
              setIsRegistered(Boolean(reg));
            }
          } catch (rErr) {
            console.warn('Registration status fetch warning:', rErr);
          }
        }
      } catch (err) {
        console.error('Event details load error:', err);
        setError(getFriendlyErrorMessage(err, 'Event not found or failed to load.'));
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, [id, isAuthenticated, isStudent]);

  // Handle registration confirmation
  const handleConfirmRegistration = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegLoading(true);
    try {
      await registrationService.registerForEvent(id);
      success('Registration successful! Your seat is reserved.');

      setIsRegistered(true);
      setEvent((prev) => {
        if (!prev) return prev;
        const newCount = (prev.registered_count || 0) + 1;
        const newAvail = Math.max(0, (prev.seat_limit || 0) - newCount);
        return {
          ...prev,
          registered_count: newCount,
          available_seats: newAvail,
        };
      });
      setShowRegisterConfirm(false);
    } catch (err) {
      console.error('Registration failed:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to register for this event.'));
    } finally {
      setRegLoading(false);
    }
  };

  // Handle cancellation confirmation
  const handleConfirmCancellation = async () => {
    setRegLoading(true);
    try {
      await registrationService.cancelRegistration(id);
      success('Registration cancelled successfully.');

      setIsRegistered(false);
      setEvent((prev) => {
        if (!prev) return prev;
        const newCount = Math.max(0, (prev.registered_count || 0) - 1);
        const newAvail = Math.min(prev.seat_limit, (prev.available_seats || 0) + 1);
        return {
          ...prev,
          registered_count: newCount,
          available_seats: newAvail,
        };
      });
      setShowCancelConfirm(false);
    } catch (err) {
      console.error('Cancellation failed:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to cancel registration.'));
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-[#6b7280] font-medium">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0f1117]">Unable to Load Event</h2>
        <p className="text-sm text-[#6b7280]">{error || 'This event could not be found or has been removed.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#0f1117] text-white hover:bg-[#1e2330] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    date,
    time,
    venue,
    organizer_name,
    seat_limit,
    registered_count = 0,
    status,
  } = event;

  const availableSeats = event.available_seats !== undefined
    ? event.available_seats
    : Math.max(0, (seat_limit || 0) - registered_count);

  const isFull = availableSeats <= 0;
  const isClosed = (status || '').toLowerCase() === 'closed';
  const fillPct = Math.min(100, Math.round(((registered_count || 0) / (seat_limit || 1)) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back Button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#0f1117] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Events</span>
      </Link>

      {/* Main Event Card */}
      <div className="bg-white rounded-2xl border border-[#e4e7ef] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 border-b border-[#e4e7ef] bg-gradient-to-r from-slate-50/60 via-white to-indigo-50/30">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge category={category} className="text-xs px-3 py-1 font-semibold" />
              <Badge status={status} className="text-xs px-3 py-1" />
            </div>

            {isRegistered && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                You are Registered
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#6b7280] mt-3 font-medium">
            <Building2 className="w-4 h-4 text-[#9ca3af]" />
            <span>Organized by: <strong className="text-[#0f1117]">{organizer_name || 'Campus Organization'}</strong></span>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#e4e7ef]">
          {/* Left Column: Description & Information */}
          <div className="lg:col-span-2 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0f1117] mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4f46e5]" />
                About this Event
              </h2>
              <p className="text-[#4b5563] leading-relaxed text-sm whitespace-pre-line">
                {description || 'No detailed description provided for this campus event.'}
              </p>
            </div>

            {/* Event Logistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#f1f3f8]">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef]">
                <div className="p-2 rounded-lg bg-[#eef2ff] text-[#4f46e5]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                    Date
                  </span>
                  <span className="text-sm font-semibold text-[#0f1117]">
                    {formatDate(date)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef]">
                <div className="p-2 rounded-lg bg-[#ede9fe] text-[#7c3aed]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                    Time
                  </span>
                  <span className="text-sm font-semibold text-[#0f1117]">
                    {formatTime(time)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef] sm:col-span-2">
                <div className="p-2 rounded-lg bg-[#ecfdf5] text-[#059669]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block">
                    Venue
                  </span>
                  <span className="text-sm font-semibold text-[#0f1117]">
                    {venue || 'Campus Venue Location'}
                  </span>
                </div>
              </div>
            </div>

            {/* Participation Notice */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#eef2ff]/50 border border-[#e0e7ff] text-xs text-[#4338ca]">
              <ShieldCheck className="w-4 h-4 text-[#4f46e5] shrink-0" />
              <span>Instant seat reservation. You can manage or cancel your attendance anytime in your dashboard.</span>
            </div>
          </div>

          {/* Right Column: Registration Card / Status */}
          <div className="p-6 sm:p-8 bg-[#fafbfe] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-[#0f1117] border-b border-[#e4e7ef] pb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4f46e5]" />
                Registration Status
              </h3>

              {/* Seats Counter Breakdown */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#e4e7ef]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6b7280] font-medium">Total Seat Limit</span>
                  <span className="font-bold text-[#0f1117]">{seat_limit}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6b7280] font-medium">Currently Registered</span>
                  <span className="font-bold text-[#0f1117]">{registered_count}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#f1f3f8]">
                  <span className="text-[#374151] font-semibold">Available Seats</span>
                  <span className={`text-sm font-extrabold ${availableSeats <= 5 && availableSeats > 0 ? 'text-amber-600' : availableSeats === 0 ? 'text-red-500' : 'text-[#4f46e5]'}`}>
                    {availableSeats}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="w-full bg-[#f1f3f8] rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull ? 'bg-red-500' : fillPct > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1]'
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#9ca3af] text-right">
                  {fillPct}% capacity filled
                </div>
              </div>
            </div>

            {/* Registration Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#e4e7ef]">
              {isClosed ? (
                <div className="w-full py-3 px-4 rounded-xl bg-[#f1f3f8] text-[#6b7280] text-center font-bold text-xs">
                  Event Registrations Closed
                </div>
              ) : isRegistered ? (
                <div className="space-y-2">
                  <div className="w-full py-2 px-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-center font-semibold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>Registered for this Event</span>
                  </div>
                  <Button
                    variant="danger"
                    size="md"
                    className="w-full"
                    onClick={() => setShowCancelConfirm(true)}
                    loading={regLoading}
                  >
                    Cancel Registration
                  </Button>
                </div>
              ) : isFull ? (
                <div className="w-full py-3 px-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Event Full</span>
                </div>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/events/${id}` } }}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all text-center"
                >
                  Log In to Register
                </Link>
              ) : isStudent ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
                  onClick={() => setShowRegisterConfirm(true)}
                  loading={regLoading}
                >
                  Register Now
                </Button>
              ) : (
                <div className="p-3 bg-[#f8f9fc] border border-[#e4e7ef] rounded-xl text-center text-xs text-[#6b7280] font-medium">
                  Logged in as Organizer. Student registration is disabled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRegisterConfirm}
        onClose={() => setShowRegisterConfirm(false)}
        onConfirm={handleConfirmRegistration}
        title="Confirm Event Registration"
        message={`Register for "${title}"? Your seat will be reserved immediately upon confirmation.`}
        confirmText="Confirm Registration"
        confirmVariant="primary"
        loading={regLoading}
      />

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleConfirmCancellation}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration for "${title}"? This will free up your reserved seat for other students.`}
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        loading={regLoading}
      />
    </div>
  );
}

export default EventDetailsPage;
