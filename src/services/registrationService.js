import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_REGISTRATIONS } from '../utils/mockData';

const MOCK_STORAGE_KEY_REGS = 'cep_mock_registrations';
const MOCK_STORAGE_KEY_EVENTS = 'cep_mock_events';

function getLocalRegistrations() {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY_REGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(MOCK_STORAGE_KEY_REGS, JSON.stringify(INITIAL_REGISTRATIONS));
  return INITIAL_REGISTRATIONS;
}

function saveLocalRegistrations(regs) {
  localStorage.setItem(MOCK_STORAGE_KEY_REGS, JSON.stringify(regs));
}

// Helper to call RPC with param name flexibility
async function callRpcFlexible(fnName, primaryParams, altParams) {
  const res1 = await supabase.rpc(fnName, primaryParams);
  if (!res1.error) return res1;

  if (altParams && (res1.error.code === '42883' || res1.error.message?.includes('parameter'))) {
    const res2 = await supabase.rpc(fnName, altParams);
    if (!res2.error) return res2;
  }

  return res1;
}

export const registrationService = {
  /**
   * Calls PostgreSQL backend function: register_for_event
   */
  async registerForEvent(eventId) {
    if (!isSupabaseConfigured) {
      const regs = getLocalRegistrations();
      // Check duplicate
      const already = regs.find(
        (r) => String(r.event_id) === String(eventId) && r.status === 'Registered'
      );
      if (already) {
        throw new Error('You are already registered for this event.');
      }

      // Check event capacity and status
      const storedEvents = localStorage.getItem(MOCK_STORAGE_KEY_EVENTS);
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      const eventIndex = events.findIndex((e) => String(e.id) === String(eventId));

      if (eventIndex !== -1) {
        const ev = events[eventIndex];
        if (ev.status === 'Closed') {
          throw new Error('Registration is closed for this event.');
        }
        if (ev.available_seats <= 0) {
          throw new Error('Sorry, this event has reached its maximum seat capacity.');
        }
        ev.registered_count = (ev.registered_count || 0) + 1;
        ev.available_seats = Math.max(0, ev.seat_limit - ev.registered_count);
        localStorage.setItem(MOCK_STORAGE_KEY_EVENTS, JSON.stringify(events));

        const newReg = {
          id: 'reg-' + Date.now(),
          event_id: ev.id,
          title: ev.title,
          date: ev.date,
          venue: ev.venue,
          category: ev.category,
          status: 'Registered',
          registration_date: new Date().toISOString(),
        };
        regs.unshift(newReg);
        saveLocalRegistrations(regs);
        return { data: newReg, error: null };
      }

      throw new Error('Event not found');
    }

    const { data, error } = await callRpcFlexible(
      'register_for_event',
      { p_event_id: eventId },
      { event_id: eventId }
    );

    // Fallback if RPC doesn't exist
    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to register.');

      const fallback = await supabase
        .from('registrations')
        .insert([{
          event_id: eventId,
          user_id: user.id,
          status: 'Registered',
        }])
        .select()
        .single();
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: cancel_registration
   */
  async cancelRegistration(eventId) {
    if (!isSupabaseConfigured) {
      const regs = getLocalRegistrations();
      const reg = regs.find((r) => String(r.event_id) === String(eventId));
      if (reg) {
        reg.status = 'Cancelled';
        saveLocalRegistrations(regs);

        // Adjust seat counts
        const storedEvents = localStorage.getItem(MOCK_STORAGE_KEY_EVENTS);
        const events = storedEvents ? JSON.parse(storedEvents) : [];
        const ev = events.find((e) => String(e.id) === String(eventId));
        if (ev && ev.registered_count > 0) {
          ev.registered_count -= 1;
          ev.available_seats = Math.min(ev.seat_limit, ev.available_seats + 1);
          localStorage.setItem(MOCK_STORAGE_KEY_EVENTS, JSON.stringify(events));
        }
      }
      return { data: true, error: null };
    }

    const { data, error } = await callRpcFlexible(
      'cancel_registration',
      { p_event_id: eventId },
      { event_id: eventId }
    );

    // Fallback if RPC does not exist
    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const { data: { user } } = await supabase.auth.getUser();
      const fallback = await supabase
        .from('registrations')
        .update({ status: 'Cancelled' })
        .eq('event_id', eventId)
        .eq('user_id', user?.id)
        .select();
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: get_my_registrations
   */
  async getMyRegistrations() {
    if (!isSupabaseConfigured) {
      const regs = getLocalRegistrations();
      return { data: regs, error: null };
    }

    const { data, error } = await supabase.rpc('get_my_registrations');

    // Fallback if RPC does not exist
    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const { data: { user } } = await supabase.auth.getUser();
      const fallback = await supabase
        .from('registrations')
        .select(`
          id,
          status,
          created_at,
          event_id,
          events (
            id,
            title,
            date,
            venue,
            category
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fallback.data) {
        const flattened = fallback.data.map((r) => ({
          id: r.id,
          event_id: r.event_id,
          title: r.events?.title,
          date: r.events?.date,
          venue: r.events?.venue,
          category: r.events?.category,
          status: r.status,
          registration_date: r.created_at,
        }));
        return { data: flattened, error: null };
      }
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  }
};
