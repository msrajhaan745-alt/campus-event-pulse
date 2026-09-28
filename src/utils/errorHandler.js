/**
 * Translates PostgreSQL, Supabase, or network errors into user-friendly messages.
 * Avoids exposing raw database internals or error codes to end users.
 */
export function getFriendlyErrorMessage(error, defaultMessage = 'Something went wrong. Please try again.') {
  if (!error) return defaultMessage;

  const message = typeof error === 'string' ? error : error.message || error.error_description || '';
  const code = error.code || '';
  const details = error.details || '';

  const fullText = `${code} ${message} ${details}`.toLowerCase();

  // Network / Connection issues
  if (fullText.includes('failed to fetch') || fullText.includes('networkerror') || fullText.includes('network error')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Duplicate registration
  if (
    code === '23505' ||
    code === 'P0001' ||
    fullText.includes('already registered') ||
    fullText.includes('duplicate registration') ||
    fullText.includes('unique_registration') ||
    fullText.includes('registrations_user_event_key')
  ) {
    return 'You are already registered for this event.';
  }

  // Event capacity / seat limit
  if (
    fullText.includes('event full') ||
    fullText.includes('capacity reached') ||
    fullText.includes('no available seats') ||
    fullText.includes('seat limit exceeded')
  ) {
    return 'Sorry, this event has reached its maximum seat capacity.';
  }

  // Event closed
  if (fullText.includes('event closed') || fullText.includes('registration closed')) {
    return 'Registration is closed for this event.';
  }

  // Authentication errors
  if (fullText.includes('invalid login credentials') || fullText.includes('invalid_grant')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (fullText.includes('user already registered') || fullText.includes('email already in use')) {
    return 'An account with this email address already exists. Please log in instead.';
  }

  if (fullText.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }

  if (fullText.includes('jwt expired') || fullText.includes('session expired')) {
    return 'Your session has expired. Please log in again.';
  }

  // Row-level security / permission denied
  if (fullText.includes('row-level security') || fullText.includes('permission denied') || code === '42501') {
    return 'You do not have permission to perform this action.';
  }

  // Default clean fallback
  if (message && !message.includes('{') && !message.includes('SELECT') && !message.includes('relation "')) {
    return message;
  }

  return defaultMessage;
}
