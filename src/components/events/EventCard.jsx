import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatters';

const CATEGORY_ACCENT = {
  technical: 'from-violet-50 to-purple-50 border-violet-200/50',
  cultural:  'from-amber-50 to-yellow-50 border-amber-200/50',
  sports:    'from-emerald-50 to-green-50 border-emerald-200/50',
  workshop:  'from-blue-50 to-sky-50 border-blue-200/50',
  seminar:   'from-pink-50 to-rose-50 border-pink-200/50',
  club:      'from-orange-50 to-amber-50 border-orange-200/50',
  other:     'from-slate-50 to-gray-50 border-slate-200/50',
};

export function EventCard({ event, isRegistered = false }) {
  const {
    id,
    title,
    category,
    date,
    time,
    venue,
    available_seats,
    seat_limit,
    registered_count = 0,
    status,
    organizer_name,
  } = event;

  const seatsAvailable = available_seats !== undefined
    ? available_seats
    : Math.max(0, (seat_limit || 0) - registered_count);

  const isFull = seatsAvailable <= 0;
  const isClosed = (status || '').toLowerCase() === 'closed';
  const isAlmostFull = seatsAvailable > 0 && seatsAvailable <= 5;
  const catKey = (category || '').toLowerCase();
  const accentGradient = CATEGORY_ACCENT[catKey] || CATEGORY_ACCENT.other;

  const fillPercent = seat_limit
    ? Math.min(100, Math.round((registered_count / seat_limit) * 100))
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-[#e4e7ef] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_-4px_rgba(79,70,229,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:border-[rgba(79,70,229,0.2)] transition-all duration-200 hover:-translate-y-1 flex flex-col overflow-hidden">
      {/* Category color bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        catKey === 'technical' ? 'from-violet-500 to-purple-500' :
        catKey === 'cultural'  ? 'from-amber-500 to-yellow-500' :
        catKey === 'sports'    ? 'from-emerald-500 to-green-500' :
        catKey === 'workshop'  ? 'from-blue-500 to-sky-500' :
        catKey === 'seminar'   ? 'from-pink-500 to-rose-500' :
        catKey === 'club'      ? 'from-orange-500 to-amber-500' :
        'from-slate-400 to-gray-400'
      }`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Top: Badges row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <Badge category={category} />
          <div className="flex items-center gap-1.5">
            {isRegistered && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#166534] border border-[#86efac]">
                <CheckCircle2 className="w-3 h-3" />
                Registered
              </span>
            )}
            {isClosed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fff1f2] text-[#9f1239] border border-[#fda4af]">
                <XCircle className="w-3 h-3" />
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[15px] text-[#0f1117] group-hover:text-[#4f46e5] transition-colors line-clamp-2 mb-3 leading-snug">
          <Link to={`/events/${id}`}>{title}</Link>
        </h3>

        {/* Meta info */}
        <div className="space-y-2 text-xs text-[#6b7280] flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#4f46e5] shrink-0" />
            <span>{formatDate(date)}</span>
            {time && (
              <>
                <span className="text-[#d1d5db]">·</span>
                <Clock className="w-3.5 h-3.5 text-[#4f46e5] shrink-0" />
                <span>{formatTime(time)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#6b7280] shrink-0" />
            <span className="line-clamp-1">{venue || 'Campus Venue'}</span>
          </div>
          {organizer_name && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#6b7280] shrink-0" />
              <span className="line-clamp-1 text-[#9ca3af]">{organizer_name}</span>
            </div>
          )}
        </div>

        {/* Capacity bar */}
        {seat_limit > 0 && (
          <div className="mt-3 pt-3 border-t border-[#f1f3f8]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[#9ca3af] font-medium">Capacity</span>
              <span className={`text-[11px] font-semibold ${
                isFull ? 'text-[#dc2626]' :
                isAlmostFull ? 'text-[#d97706]' :
                'text-[#059669]'
              }`}>
                {isFull ? 'Full' : `${seatsAvailable} left`}
              </span>
            </div>
            <div className="w-full bg-[#f1f3f8] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isFull ? 'bg-[#dc2626]' :
                  isAlmostFull ? 'bg-[#d97706]' :
                  'bg-gradient-to-r from-[#4f46e5] to-[#6366f1]'
                }`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3.5 bg-[#f8f9fc] border-t border-[#f1f3f8] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-[#9ca3af] font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>{registered_count || 0} / {seat_limit || '—'}</span>
        </div>

        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#e4e7ef] text-[#4f46e5] hover:bg-[#eef2ff] hover:border-[#c7d2fe] transition-all group-hover:border-[#c7d2fe]"
        >
          {isRegistered ? 'View Details' : isFull || isClosed ? 'View Event' : 'Register'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
