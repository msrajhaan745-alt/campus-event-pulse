import React, { useState } from 'react';
import { Search, Filter, X, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Club',
  'Other',
];

export const DATE_OPTIONS = [
  { id: 'all', label: 'All Dates' },
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'upcoming', label: 'Upcoming' },
];

const CAT_COLORS = {
  All:        'bg-[#0f1117] text-white border-transparent',
  Technical:  'bg-[#ede9fe] text-[#5b21b6] border-[#c4b5fd] hover:bg-[#ddd6fe]',
  Cultural:   'bg-[#fef3c7] text-[#92400e] border-[#fcd34d] hover:bg-[#fde68a]',
  Sports:     'bg-[#dcfce7] text-[#166534] border-[#86efac] hover:bg-[#bbf7d0]',
  Workshop:   'bg-[#dbeafe] text-[#1e40af] border-[#93c5fd] hover:bg-[#bfdbfe]',
  Seminar:    'bg-[#fce7f3] text-[#9d174d] border-[#f9a8d4] hover:bg-[#fbcfe8]',
  Club:       'bg-[#fff7ed] text-[#9a3412] border-[#fdba74] hover:bg-[#fed7aa]',
  Other:      'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1] hover:bg-[#e2e8f0]',
};

export function EventFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDateFilter,
  onDateFilterChange,
  customDate,
  onCustomDateChange,
  onClearFilters,
  hasActiveFilters,
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#e4e7ef] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
      {/* Top: Search + Clear */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events by title, keyword, or venue..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#e4e7ef] bg-[#f8f9fc] text-[#0f1117] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#a5b4fc] focus:bg-white text-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[#9ca3af] hover:bg-[#f1f3f8] hover:text-[#0f1117] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className={`sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            hasActiveFilters
              ? 'border-[#a5b4fc] bg-[#eef2ff] text-[#4f46e5]'
              : 'border-[#e4e7ef] bg-[#f8f9fc] text-[#6b7280]'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse" />}
        </button>

        {/* Desktop: Clear button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6b7280] hover:text-[#dc2626] hover:bg-red-50 border border-[#e4e7ef] hover:border-red-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Filter options — collapsible on mobile */}
      <div className={`${mobileFilterOpen ? 'block' : 'hidden'} sm:block space-y-4 pt-4 border-t border-[#f1f3f8]`}>
        {/* Categories */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#9ca3af] mb-2.5">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? cat === 'All'
                        ? 'bg-[#0f1117] text-white border-transparent shadow-sm'
                        : `${CAT_COLORS[cat]} shadow-sm ring-1 ring-offset-1 ring-current`
                      : cat === 'All'
                        ? 'bg-[#f8f9fc] text-[#6b7280] border-[#e4e7ef] hover:bg-[#f1f3f8]'
                        : `${CAT_COLORS[cat]} opacity-70 hover:opacity-100`
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date filters */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#9ca3af] mb-2.5">
            Timeline
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {DATE_OPTIONS.map((opt) => {
              const isActive = selectedDateFilter === opt.id && !customDate;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onDateFilterChange(opt.id);
                    onCustomDateChange('');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-[#4f46e5] text-white border-transparent shadow-sm'
                      : 'bg-[#f8f9fc] text-[#6b7280] border-[#e4e7ef] hover:bg-[#eef2ff] hover:text-[#4f46e5] hover:border-[#c7d2fe]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}

            {/* Custom date picker */}
            <div className="relative inline-flex items-center">
              <CalendarIcon className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 pointer-events-none" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  onCustomDateChange(e.target.value);
                  onDateFilterChange('custom');
                }}
                className={`text-xs pl-8 pr-3 py-1.5 rounded-full border focus:outline-none transition-colors ${
                  customDate
                    ? 'border-[#a5b4fc] bg-[#eef2ff] text-[#4f46e5] font-semibold'
                    : 'border-[#e4e7ef] bg-[#f8f9fc] text-[#6b7280]'
                }`}
                title="Pick a specific date"
              />
            </div>

            {/* Mobile clear */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#dc2626] bg-red-50 border border-red-200"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventFilters;
