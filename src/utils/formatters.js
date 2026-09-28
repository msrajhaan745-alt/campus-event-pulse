/**
 * Utility functions for date, time, and UI formatting across Campus Event Pulse
 */

export function formatDate(dateString) {
  if (!dateString) return 'Date TBD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString) {
  if (!timeString) return 'Time TBD';
  try {
    // If format is HH:mm:ss or HH:mm
    if (/^\d{2}:\d{2}/.test(timeString)) {
      const [hours, minutes] = timeString.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHours = h % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    }
    // If it's a full ISO date
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    return timeString;
  } catch {
    return timeString;
  }
}

export function getCategoryBadgeClass(category) {
  switch ((category || '').toLowerCase()) {
    case 'technical':
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    case 'cultural':
      return 'bg-accent2/10 text-accent2 border-accent2/30';
    case 'sports':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    case 'workshop':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'seminar':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    case 'club':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    default:
      return 'bg-raised text-muted border-line';
  }
}

export function getStatusBadgeClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'published':
    case 'registered':
    case 'available':
      return 'bg-accent/10 text-accent border-accent/30';
    case 'draft':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'closing soon':
      return 'bg-accent/15 text-accent border-accent/40';
    case 'waitlist':
      return 'bg-accent2/10 text-accent2 border-accent2/30';
    case 'closed':
    case 'cancelled':
    case 'full':
      return 'bg-line text-muted border-line';
    default:
      return 'bg-surface text-muted border-line';
  }
}
