import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { EventCard } from '../../components/events/EventCard';
import { EventFilters } from '../../components/events/EventFilters';
import { EventCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  const { isAuthenticated, isStudent } = useAuth();

  // Load published events
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await eventService.getPublishedEvents();
        if (fetchErr) throw fetchErr;
        setEvents(data || []);

        // If authenticated student, load registrations to show registered status
        if (isAuthenticated && isStudent) {
          try {
            const { data: myRegs } = await registrationService.getMyRegistrations();
            if (myRegs) {
              const activeIds = new Set(
                myRegs
                  .filter((r) => r.status === 'Registered')
                  .map((r) => String(r.event_id))
              );
              setRegisteredEventIds(activeIds);
            }
          } catch (regErr) {
            console.warn('Could not load user registrations:', regErr);
          }
        }
      } catch (err) {
        console.error('Events loading error:', err);
        setError('Failed to load events. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, isStudent]);

  // Update query param when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDateFilter('all');
    setCustomDate('');
    setSearchParams({});
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedDateFilter !== 'all' || 
    customDate !== '';

  // Filter computation
  const filteredEvents = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Calculate end of this week (Sunday)
    const endOfWeek = new Date();
    const day = now.getDay();
    const diff = now.getDate() + (day === 0 ? 0 : 7 - day);
    endOfWeek.setDate(diff);
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    return events.filter((ev) => {
      // 1. Search Query filter (title, description, venue)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (ev.title || '').toLowerCase().includes(q);
        const matchesDesc = (ev.description || '').toLowerCase().includes(q);
        const matchesVenue = (ev.venue || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVenue) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'All') {
        if ((ev.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Date filter
      const evDate = ev.date || '';
      if (selectedDateFilter === 'today') {
        if (evDate !== todayStr) return false;
      } else if (selectedDateFilter === 'this_week') {
        if (evDate < todayStr || evDate > endOfWeekStr) return false;
      } else if (selectedDateFilter === 'upcoming') {
        if (evDate < todayStr) return false;
      } else if (selectedDateFilter === 'custom' && customDate) {
        if (evDate !== customDate) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedCategory, selectedDateFilter, customDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Activities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
            Discover Campus Events
          </h1>
          <p className="text-sm text-[#6b7280] mt-1 max-w-xl">
            Browse published workshops, hackathons, seminars, and fests happening across the college.
          </p>
        </div>

        <div className="text-xs font-medium text-[#6b7280] bg-white px-3.5 py-2 rounded-xl border border-[#e4e7ef] shadow-sm inline-flex items-center gap-2 self-start md:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#4f46e5]" />
          <span>Showing <strong className="text-[#0f1117]">{filteredEvents.length}</strong> events</span>
        </div>
      </div>

      {/* Filter Component */}
      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedDateFilter={selectedDateFilter}
        onDateFilterChange={setSelectedDateFilter}
        customDate={customDate}
        onCustomDateChange={setCustomDate}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 text-red-700 flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEventIds.has(String(event.id))}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={hasActiveFilters ? 'No matching events found' : 'No upcoming events yet.'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search criteria or clearing active category and date filters.'
              : 'Check back soon as organizers publish new workshops and campus activities.'
          }
          actionLabel={hasActiveFilters ? 'Clear All Filters' : undefined}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      )}
    </div>
  );
}

export default EventsPage;
