import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileEdit, 
  CheckCircle, 
  Ban, 
  Users, 
  PlusCircle, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { organizerService } from '../../services/organizerService';
import { eventService } from '../../services/eventService';
import { useToast } from '../../hooks/useToast';
import { StatsCard } from '../../components/organizer/StatsCard';
import { EventTable } from '../../components/organizer/EventTable';
import { StatsCardSkeleton } from '../../components/common/Skeleton';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function OrganizerDashboard() {
  const [stats, setStats] = useState({
    total_events: 0,
    draft_events: 0,
    published_events: 0,
    closed_events: 0,
    total_registrations: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog & action handling
  const [publishTarget, setPublishTarget] = useState(null);
  const [closeTarget, setCloseTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const { data, error } = await organizerService.getOrganizerDashboard();
      if (error) throw error;
      if (data) {
        setStats(data.stats || {
          total_events: 0,
          draft_events: 0,
          published_events: 0,
          closed_events: 0,
          total_registrations: 0,
        });
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error loading organizer dashboard:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to load organizer dashboard.'));
    } finally {
      setLoading(false);
    }
  }

  // Publish event handler
  const handleConfirmPublish = async () => {
    if (!publishTarget) return;
    setActionLoading(true);
    try {
      await eventService.publishEvent(publishTarget.id);
      success(`"${publishTarget.title}" published successfully!`);
      setPublishTarget(null);
      await loadDashboard();
    } catch (err) {
      console.error('Publish error:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to publish event.'));
    } finally {
      setActionLoading(false);
    }
  };

  // Close event handler
  const handleConfirmClose = async () => {
    if (!closeTarget) return;
    setActionLoading(true);
    try {
      await eventService.closeEvent(closeTarget.id);
      success(`"${closeTarget.title}" closed. No further registrations will be accepted.`);
      setCloseTarget(null);
      await loadDashboard();
    } catch (err) {
      console.error('Close error:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to close event.'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Event Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
            Organizer Dashboard
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Realtime capacity monitoring, event lifecycles, and student registrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/organizer/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Events"
              value={stats.total_events}
              icon={Calendar}
              color="indigo"
              description="Created events"
            />
            <StatsCard
              title="Draft Events"
              value={stats.draft_events}
              icon={FileEdit}
              color="amber"
              description="Awaiting publish"
            />
            <StatsCard
              title="Published"
              value={stats.published_events}
              icon={CheckCircle}
              color="emerald"
              description="Live for students"
            />
            <StatsCard
              title="Closed"
              value={stats.closed_events}
              icon={Ban}
              color="rose"
              description="Concluded"
            />
            <StatsCard
              title="Total Registrations"
              value={stats.total_registrations}
              icon={Users}
              color="purple"
              description="Student attendees"
            />
          </>
        )}
      </div>

      {/* Event Management Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0f1117] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4f46e5]" />
            <span>Campus Events Roster</span>
          </h2>
          <Link
            to="/organizer/events"
            className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 transition-colors"
          >
            <span>Manage All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#e4e7ef] p-10 text-center shadow-sm">
            <div className="w-8 h-8 border-3 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-[#6b7280]">Loading events data...</p>
          </div>
        ) : events.length > 0 ? (
          <EventTable
            events={events}
            onPublish={(ev) => setPublishTarget(ev)}
            onClose={(ev) => setCloseTarget(ev)}
            loadingActionId={actionLoading ? (publishTarget?.id || closeTarget?.id) : null}
          />
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#e4e7ef] space-y-3 shadow-sm">
            <Calendar className="w-10 h-10 text-[#9ca3af] mx-auto" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-[#0f1117]">You haven't created any events yet</h3>
            <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
              Start by scheduling your first college workshop, hackathon, or cultural fest.
            </p>
            <Link
              to="/organizer/events/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-sm hover:shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Event</span>
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={Boolean(publishTarget)}
        onClose={() => setPublishTarget(null)}
        onConfirm={handleConfirmPublish}
        title="Publish Event"
        message={`Publish "${publishTarget?.title}"? Once published, students will immediately be able to view and register for this event.`}
        confirmText="Confirm Publish"
        confirmVariant="primary"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(closeTarget)}
        onClose={() => setCloseTarget(null)}
        onConfirm={handleConfirmClose}
        title="Close Event Registrations"
        message={`Are you sure you want to close registrations for "${closeTarget?.title}"? No further students will be able to register.`}
        confirmText="Confirm Close"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}

export default OrganizerDashboard;
