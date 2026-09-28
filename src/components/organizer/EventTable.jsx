import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Send, 
  Ban, 
  Users, 
  Calendar, 
  MapPin, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export function EventTable({
  events = [],
  onPublish,
  onClose,
  loadingActionId,
}) {
  return (
    <div>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#e4e7ef] bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9fc] border-b border-[#e4e7ef] text-xs font-semibold text-[#6b7280]">
              <th className="py-3.5 px-5">Event</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Seats</th>
              <th className="py-3.5 px-4">Registered</th>
              <th className="py-3.5 px-4">Available</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f8] text-sm">
            {events.map((event) => {
              const statusLower = (event.status || '').toLowerCase();
              const isDraft = statusLower === 'draft';
              const isPublished = statusLower === 'published';
              const isClosed = statusLower === 'closed';

              const available = event.available_seats !== undefined
                ? event.available_seats
                : Math.max(0, event.seat_limit - (event.registered_count || 0));

              return (
                <tr key={event.id} className="hover:bg-[#f8f9fc]/60 transition-colors">
                  <td className="py-4 px-5">
                    <Link
                      to={`/events/${event.id}`}
                      className="font-semibold text-[#0f1117] hover:text-[#4f46e5] transition-colors line-clamp-1"
                    >
                      {event.title}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge category={event.category} className="text-xs" />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-[#6b7280] text-xs font-medium">
                    {formatDate(event.date)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge status={event.status} className="text-xs" />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-[#4b5563] text-xs">
                    {event.seat_limit}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-[#4b5563] text-xs">
                    {event.registered_count || 0}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-xs">
                    <span className={available <= 5 && available > 0 ? 'text-amber-600 font-bold' : available === 0 ? 'text-red-500 font-bold' : 'text-[#0f1117]'}>
                      {available}
                    </span>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap text-right space-x-1.5">
                    {/* View Details */}
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex p-1.5 rounded-lg text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f1f3f8] transition-colors"
                      title="View Event Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* View Participants */}
                    <Link
                      to={`/organizer/events/${event.id}/participants`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-[#4b5563] bg-[#f8f9fc] hover:bg-[#f1f3f8] border border-[#e4e7ef] transition-colors"
                      title="View Participant Roster"
                    >
                      <Users className="w-3.5 h-3.5 text-[#6b7280]" />
                      <span>Roster</span>
                    </Link>

                    {/* Edit Event */}
                    <Link
                      to={`/organizer/events/${event.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-[#4b5563] bg-[#f8f9fc] hover:bg-[#f1f3f8] border border-[#e4e7ef] transition-colors"
                      title="Edit Event Information"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#6b7280]" />
                      <span>Edit</span>
                    </Link>

                    {/* Publish Action for Draft */}
                    {isDraft && (
                      <button
                        onClick={() => onPublish(event)}
                        disabled={loadingActionId === event.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] hover:bg-[#d1fae5] transition-all disabled:opacity-50"
                        title="Publish Event to Students"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}

                    {/* Close Action for Published */}
                    {isPublished && (
                      <button
                        onClick={() => onClose(event)}
                        disabled={loadingActionId === event.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Close Event Registrations"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Close</span>
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
        {events.map((event) => {
          const statusLower = (event.status || '').toLowerCase();
          const isDraft = statusLower === 'draft';
          const isPublished = statusLower === 'published';
          const available = event.available_seats !== undefined
            ? event.available_seats
            : Math.max(0, event.seat_limit - (event.registered_count || 0));

          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-[#e4e7ef] p-4 space-y-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge category={event.category} className="text-xs" />
                <Badge status={event.status} className="text-xs" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#0f1117]">
                  <Link to={`/events/${event.id}`} className="hover:text-[#4f46e5] transition-colors">{event.title}</Link>
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#4f46e5]" />
                  <span>{formatDate(event.date)}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-[#9ca3af]" />
                  <span className="line-clamp-1">{event.venue}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#f1f3f8] text-center text-xs">
                <div className="bg-[#f8f9fc] p-2 rounded-xl border border-[#e4e7ef]/60">
                  <span className="text-[#9ca3af] block mb-0.5 text-[11px]">Capacity</span>
                  <span className="font-bold text-[#0f1117]">{event.seat_limit}</span>
                </div>
                <div className="bg-[#f8f9fc] p-2 rounded-xl border border-[#e4e7ef]/60">
                  <span className="text-[#9ca3af] block mb-0.5 text-[11px]">Registered</span>
                  <span className="font-bold text-[#0f1117]">{event.registered_count || 0}</span>
                </div>
                <div className="bg-[#f8f9fc] p-2 rounded-xl border border-[#e4e7ef]/60">
                  <span className="text-[#9ca3af] block mb-0.5 text-[11px]">Available</span>
                  <span className={`font-bold ${available <= 5 && available > 0 ? 'text-amber-600' : available === 0 ? 'text-red-500' : 'text-[#0f1117]'}`}>
                    {available}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  to={`/organizer/events/${event.id}/participants`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[#f8f9fc] text-[#4b5563] border border-[#e4e7ef] hover:bg-[#f1f3f8]"
                >
                  <Users className="w-3.5 h-3.5 text-[#6b7280]" />
                  Roster
                </Link>
                <Link
                  to={`/organizer/events/${event.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-[#e4e7ef] text-[#4b5563] hover:bg-[#f8f9fc]"
                >
                  <Edit className="w-3.5 h-3.5 text-[#6b7280]" />
                  Edit
                </Link>
                {isDraft && (
                  <button
                    onClick={() => onPublish(event)}
                    disabled={loadingActionId === event.id}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] hover:bg-[#d1fae5]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publish Event
                  </button>
                )}
                {isPublished && (
                  <button
                    onClick={() => onClose(event)}
                    disabled={loadingActionId === event.id}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Close Registrations
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventTable;
