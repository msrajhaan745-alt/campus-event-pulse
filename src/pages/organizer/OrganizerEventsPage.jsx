import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  PlusCircle, 
  Search, 
  Calendar 
} from 'lucide-react';
import { organizerService } from '../../services/organizerService';
import { eventService } from '../../services/eventService';
import { useToast } from '../../hooks/useToast';
import { EventTable } from '../../components/organizer/EventTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function OrganizerEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Confirmation dialogs
  const [publishTarget, setPublishTarget] = useState(null);
  const [closeTarget, setCloseTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const { data, error } = await organizerService.getOrganizerDashboard();
      if (error) throw error;
      if (data) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to load organizer events:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to load events.'));
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmPublish = async () => {
    if (!publishTarget) return;
    setActionLoading(true);
    try {
      await eventService.publishEvent(publishTarget.id);
      success(`"${publishTarget.title}" published successfully!`);
      setPublishTarget(null);
      await loadEvents();
    } catch (err) {
      console.error('Publish error:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to publish event.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmClose = async () => {
    if (!closeTarget) return;
    setActionLoading(true);
    try {
      await eventService.closeEvent(closeTarget.id);
      success(`"${closeTarget.title}" closed successfully.`);
      setCloseTarget(null);
      await loadEvents();
    } catch (err) {
      console.error('Close error:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to close event.'));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = (ev.title || '').toLowerCase().includes(q) || (ev.venue || '').toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (statusFilter !== 'All') {
      if ((ev.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Event Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
            Manage Campus Events
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Review status badges, edit event details, publish drafts, and track participants
          </p>
        </div>

        <Link
          to="/organizer/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#e4e7ef] p-3.5 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e4e7ef] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] text-xs bg-[#f8f9fc]"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Draft', 'Published', 'Closed'].map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#0f1117] text-white shadow-sm'
                    : 'bg-[#f8f9fc] text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117] border border-[#e4e7ef]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Table / Card List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#e4e7ef] p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-3 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-[#6b7280]">Loading events...</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <EventTable
          events={filteredEvents}
          onPublish={(ev) => setPublishTarget(ev)}
          onClose={(ev) => setCloseTarget(ev)}
          loadingActionId={actionLoading ? (publishTarget?.id || closeTarget?.id) : null}
        />
      ) : (
        <EmptyState
          icon={Calendar}
          title={searchQuery || statusFilter !== 'All' ? 'No matching events' : "You haven't created any events yet."}
          description={
            searchQuery || statusFilter !== 'All'
              ? 'Try changing your search terms or selecting a different status filter.'
              : 'Create an event to start accepting campus student registrations.'
          }
          actionLabel="Create Event"
          onAction={() => navigate('/organizer/events/new')}
        />
      )}

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

export default OrganizerEventsPage;
