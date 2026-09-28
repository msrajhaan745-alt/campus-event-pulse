import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Compass, 
  Award,
  BookOpen,
  Code,
  Music,
  Trophy,
  Zap
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { EventCard } from '../components/events/EventCard';
import { EventCardSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../hooks/useAuth';

export function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isOrganizer } = useAuth();

  useEffect(() => {
    async function loadEvents() {
      try {
        const { data } = await eventService.getPublishedEvents();
        if (data) {
          setUpcomingEvents(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load spotlight events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const categories = [
    { name: 'Technical', icon: Code, bg: 'bg-[#eef2ff]', text: 'text-[#4f46e5]', border: 'border-[#c7d2fe]', desc: 'Coding, AI & Robotics' },
    { name: 'Cultural', icon: Music, bg: 'bg-[#faf5ff]', text: 'text-[#9333ea]', border: 'border-[#e9d5ff]', desc: 'Music, Drama & Arts' },
    { name: 'Sports', icon: Trophy, bg: 'bg-[#ecfdf5]', text: 'text-[#059669]', border: 'border-[#a7f3d0]', desc: 'Tournaments & Athletics' },
    { name: 'Workshop', icon: BookOpen, bg: 'bg-[#fffbeb]', text: 'text-[#d97706]', border: 'border-[#fde68a]', desc: 'Hands-on Bootcamps' },
    { name: 'Seminar', icon: Award, bg: 'bg-[#e0e7ff]', text: 'text-[#4338ca]', border: 'border-[#c7d2fe]', desc: 'Keynotes & Talks' },
    { name: 'Club', icon: Users, bg: 'bg-[#fff1f2]', text: 'text-[#e11d48]', border: 'border-[#fecdd3]', desc: 'Societies & Meets' },
  ];

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 border-b border-[#e4e7ef] bg-gradient-to-b from-[#f8f9fc] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#eef2ff] text-[#4f46e5] border border-[#c7d2fe] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#4f46e5]" />
              <span>Official College Campus Event Platform</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f1117] tracking-tight leading-[1.12]">
              Discover What's Happening on <span className="text-[#4f46e5]">Campus</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed font-normal">
              Connect with collegiate activities, workshops, cultural celebrations, and sports competitions. Register in seconds with live seat tracking and real-time organizer coordination.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              <Link
                to="/events"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {isAuthenticated ? (
                <Link
                  to={isOrganizer ? '/organizer/dashboard' : '/student/dashboard'}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-[#f8f9fc] text-[#0f1117] border border-[#e4e7ef] shadow-sm transition-all text-center"
                >
                  Go to {isOrganizer ? 'Organizer Dashboard' : 'Student Dashboard'}
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-[#f8f9fc] text-[#0f1117] border border-[#e4e7ef] shadow-sm transition-all text-center"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Campus Highlight Stats */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#f1f3f8] max-w-lg mx-auto">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0f1117]">500+</span>
                <p className="text-xs text-[#9ca3af] font-medium mt-1">Active Students</p>
              </div>
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#4f46e5]">100%</span>
                <p className="text-xs text-[#9ca3af] font-medium mt-1">Realtime Seats</p>
              </div>
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0f1117]">20+</span>
                <p className="text-xs text-[#9ca3af] font-medium mt-1">Campus Clubs</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured / Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4f46e5] mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Happening Soon</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
              Upcoming Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#e4e7ef]">
            <p className="text-[#6b7280] font-medium text-sm">No published events found right now.</p>
          </div>
        )}
      </section>

      {/* Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4f46e5]">
            Diverse Activities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] mt-1 tracking-tight">
            Popular Event Categories
          </h2>
          <p className="text-sm text-[#6b7280] mt-2">
            Explore academic, creative, athletic, and leadership events hosted across department branches.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-[#e4e7ef] hover:border-[#c7d2fe] hover:shadow-md transition-all group shadow-sm"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 border ${cat.bg} ${cat.text} ${cat.border} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-[#0f1117] mb-0.5 group-hover:text-[#4f46e5] transition-colors">
                  {cat.name}
                </span>
                <span className="text-[11px] text-[#9ca3af] line-clamp-1">
                  {cat.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-[#e4e7ef] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4f46e5]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] mt-1 tracking-tight">
              How Campus Event Pulse Works
            </h2>
            <p className="text-sm text-[#6b7280] mt-2">
              Designed specifically for college campus workflows — from student registration to organizer approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#f8f9fc] border border-[#e4e7ef] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-extrabold text-sm flex items-center justify-center mb-3.5 shadow-[0_4px_14px_rgba(79,70,229,0.25)]">
                1
              </div>
              <h3 className="font-bold text-base text-[#0f1117] mb-1.5">Explore Campus Events</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Filter by technical workshops, sports, seminars, or cultural festivals. Check available seats in real-time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#f8f9fc] border border-[#e4e7ef] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-extrabold text-sm flex items-center justify-center mb-3.5 shadow-[0_4px_14px_rgba(79,70,229,0.25)]">
                2
              </div>
              <h3 className="font-bold text-base text-[#0f1117] mb-1.5">One-Click Registration</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Confirm your seat instantly. Guarded by duplicate registration protection and seat capacity limits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#f8f9fc] border border-[#e4e7ef] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-extrabold text-sm flex items-center justify-center mb-3.5 shadow-[0_4px_14px_rgba(79,70,229,0.25)]">
                3
              </div>
              <h3 className="font-bold text-base text-[#0f1117] mb-1.5">Manage & Attend</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Track registered activities in your student portal. Organizers track participant rosters and publish updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
