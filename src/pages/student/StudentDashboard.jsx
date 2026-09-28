import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Search,
  MapPin,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  CalendarCheck,
} from 'lucide-react';
import { registrationService } from '../../services/registrationService';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { EventCardSkeleton, StatsCardSkeleton } from '../../components/common/Skeleton';
import { formatDate, formatTime } from '../../utils/formatters';
import { EventCard } from '../../components/events/EventCard';

function StatCard({ icon: Icon, label, value, sub, color = 'indigo', loading }) {
  const colorMap = {
    indigo: { bg: 'bg-[#eef2ff]', text: 'text-[#4f46e5]', border: 'border-[#c7d2fe]' },
    emerald: { bg: 'bg-[#f0fdf4]', text: 'text-[#059669]', border: 'border-[#a7f3d0]' },
    violet: { bg: 'bg-[#ede9fe]', text: 'text-[#7c3aed]', border: 'border-[#c4b5fd]' },
    amber: { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]', border: 'border-[#fde68a]' },
  };
  const c = colorMap[color] || colorMap.indigo;

  if (loading) return <StatsCardSkeleton />;

  return (
    <div className="bg-white rounded-2xl border border-[#e4e7ef] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.border} border`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#0f1117] mb-1">{value}</p>
      <p className="text-sm font-semibold text-[#374151]">{label}</p>
      {sub && <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>}
    </div>
  );
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [regRes, evRes] = await Promise.all([
          registrationService.getMyRegistrations(),
          eventService.getPublishedEvents(),
        ]);
        setRegistrations(regRes.data || []);
        setUpcomingEvents(evRes.data || []);
      } catch (err) {
        console.error('Student dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const activeRegistrations = registrations.filter(r => r.status === 'Registered');
  const todayStr = new Date().toISOString().split('T')[0];
  const eventsToday = activeRegistrations.filter(r => r.date === todayStr);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] || 'Student';

  // Get registered event IDs for event cards
  const registeredIds = new Set(activeRegistrations.map(r => String(r.event_id)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      {/* ── Welcome Section ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6b7280] font-medium mb-1">
            {greeting}, 👋
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f1117] tracking-tight">
            {firstName}
          </h1>
          <p className="text-sm text-[#9ca3af] mt-1">
            Discover what's happening around campus today.
          </p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white text-sm font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 transition-all self-start md:self-auto"
        >
          <Search className="w-4 h-4" />
          Browse Events
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Active Registrations"
          value={loading ? '—' : activeRegistrations.length}
          sub="Confirmed event seats"
          color="emerald"
          loading={loading}
        />
        <StatCard
          icon={Calendar}
          label="Events Today"
          value={loading ? '—' : eventsToday.length}
          sub="Happening on campus"
          color="indigo"
          loading={loading}
        />
        <StatCard
          icon={ClipboardList}
          label="Total Activity"
          value={loading ? '—' : registrations.length}
          sub="All-time registrations"
          color="violet"
          loading={loading}
        />
      </div>

      {/* ── My Upcoming Registrations ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0f1117] flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#4f46e5]" strokeWidth={2} />
            My Upcoming Events
          </h2>
          <Link
            to="/my-registrations"
            className="text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => <EventCardSkeleton key={i} />)}
          </div>
        ) : activeRegistrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRegistrations.slice(0, 4).map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-[#e4e7ef] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge category={reg.category} />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#166534] border border-[#86efac] shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Registered
                  </span>
                </div>

                <h3 className="font-bold text-[#0f1117] text-sm mb-2 line-clamp-1 hover:text-[#4f46e5] transition-colors">
                  <Link to={`/events/${reg.event_id}`}>{reg.title}</Link>
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#4f46e5]" />
                    {formatDate(reg.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9ca3af]" />
                    {reg.venue}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#f1f3f8] flex justify-end">
                  <Link
                    to={`/events/${reg.event_id}`}
                    className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-[#e4e7ef] p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[#4f46e5]" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-[#0f1117] mb-1">No registrations yet</h3>
            <p className="text-sm text-[#9ca3af] max-w-xs mx-auto mb-4">
              Explore upcoming campus workshops, fests, and competitions to reserve your seat.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-all"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* ── Discover Events ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0f1117] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4f46e5]" strokeWidth={2} />
            Discover on Campus
          </h2>
          <Link
            to="/events"
            className="text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 6).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredIds.has(String(event.id))}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-[#e4e7ef] p-10 text-center">
            <Calendar className="w-10 h-10 text-[#9ca3af] mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[#6b7280]">No upcoming events at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
