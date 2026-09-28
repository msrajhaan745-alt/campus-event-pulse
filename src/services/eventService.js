import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_EVENTS } from '../utils/mockData';

const MOCK_STORAGE_KEY_EVENTS = 'cep_mock_events';

function getLocalEvents() {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY_EVENTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(MOCK_STORAGE_KEY_EVENTS, JSON.stringify(INITIAL_EVENTS));
  return INITIAL_EVENTS;
}

function saveLocalEvents(events) {
  localStorage.setItem(MOCK_STORAGE_KEY_EVENTS, JSON.stringify(events));
}

// Helper to invoke RPC with flexible param naming (p_ prefix or plain)
async function callRpcFlexible(fnName, primaryParams, altParams) {
  const res1 = await supabase.rpc(fnName, primaryParams);
  if (!res1.error) return res1;

  // If parameter name mismatch or function not found with exact signature, try altParams
  if (altParams && (res1.error.code === '42883' || res1.error.message?.includes('parameter'))) {
    const res2 = await supabase.rpc(fnName, altParams);
    if (!res2.error) return res2;
  }

  return res1;
}

export const eventService = {
  /**
   * Calls PostgreSQL backend function: get_published_events
   */
  async getPublishedEvents() {
    if (!isSupabaseConfigured) {
      const events = getLocalEvents();
      const published = events.filter((e) => (e.status || '').toLowerCase() === 'published');
      return { data: published, error: null };
    }

    const { data, error } = await supabase.rpc('get_published_events');

    // If RPC doesn't exist yet in an unmigrated DB, fallback to direct events table query
    if (error && (error.code === '42883' || error.message?.includes('function get_published_events() does not exist'))) {
      const fallback = await supabase
        .from('events')
        .select('*')
        .ilike('status', 'published')
        .order('date', { ascending: true });
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: get_event_details
   */
  async getEventDetails(eventId) {
    if (!isSupabaseConfigured) {
      const events = getLocalEvents();
      const event = events.find((e) => String(e.id) === String(eventId));
      if (!event) return { data: null, error: new Error('Event not found') };
      return { data: event, error: null };
    }

    const { data, error } = await callRpcFlexible(
      'get_event_details',
      { p_event_id: eventId },
      { event_id: eventId }
    );

    // Fallback query if RPC isn't deployed yet
    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const fallback = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      return fallback;
    }

    if (error) throw error;
    return { data: Array.isArray(data) ? data[0] : data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: create_event
   */
  async createEvent({ title, description, category, date, time, venue, seatLimit }) {
    const seatLimitInt = parseInt(seatLimit, 10);

    if (!isSupabaseConfigured) {
      const events = getLocalEvents();
      const newEvent = {
        id: 'evt-' + Date.now(),
        title,
        description,
        category,
        date,
        time,
        venue,
        seat_limit: seatLimitInt,
        registered_count: 0,
        available_seats: seatLimitInt,
        status: 'Draft',
        created_at: new Date().toISOString(),
        organizer_name: 'Campus Organizer',
      };
      events.unshift(newEvent);
      saveLocalEvents(events);
      return { data: newEvent, error: null };
    }

    const primaryParams = {
      p_title: title,
      p_description: description,
      p_category: category,
      p_date: date,
      p_time: time,
      p_venue: venue,
      p_seat_limit: seatLimitInt,
    };

    const altParams = {
      title,
      description,
      category,
      date,
      time,
      venue,
      seat_limit: seatLimitInt,
    };

    const { data, error } = await callRpcFlexible('create_event', primaryParams, altParams);

    // Fallback if RPC not yet created
    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const { data: { user } } = await supabase.auth.getUser();
      const fallback = await supabase
        .from('events')
        .insert([{
          title,
          description,
          category,
          date,
          time,
          venue,
          seat_limit: seatLimitInt,
          registered_count: 0,
          status: 'Draft',
          organizer_id: user?.id,
        }])
        .select()
        .single();
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: update_event
   */
  async updateEvent(eventId, { title, description, category, date, time, venue, seatLimit }) {
    const seatLimitInt = parseInt(seatLimit, 10);

    if (!isSupabaseConfigured) {
      const events = getLocalEvents();
      const index = events.findIndex((e) => String(e.id) === String(eventId));
      if (index === -1) return { data: null, error: new Error('Event not found') };

      const diff = seatLimitInt - events[index].seat_limit;
      events[index] = {
        ...events[index],
        title,
        description,
        category,
        date,
        time,
        venue,
        seat_limit: seatLimitInt,
        available_seats: Math.max(0, (events[index].available_seats || 0) + diff),
      };
      saveLocalEvents(events);
      return { data: events[index], error: null };
    }

    const primaryParams = {
      p_event_id: eventId,
      p_title: title,
      p_description: description,
      p_category: category,
      p_date: date,
      p_time: time,
      p_venue: venue,
      p_seat_limit: seatLimitInt,
    };

    const altParams = {
      event_id: eventId,
      title,
      description,
      category,
      date,
      time,
      venue,
      seat_limit: seatLimitInt,
    };

    const { data, error } = await callRpcFlexible('update_event', primaryParams, altParams);

    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const fallback = await supabase
        .from('events')
        .update({
          title,
          description,
          category,
          date,
          time,
          venue,
          seat_limit: seatLimitInt,
        })
        .eq('id', eventId)
        .select()
        .single();
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: publish_event
   */
  async publishEvent(eventId) {
    if (!isSupabaseConfigured) {
      const events = getLocalEvents();
      const index = events.findIndex((e) => String(e.id) === String(eventId));
      if (index === -1) return { error: new Error('Event not found') };
      events[index].status = 'Published';
      saveLocalEvents(events);
      return { data: events[index], error: null };
    }

    const { data, error } = await callRpcFlexible(
      'publish_event',
      { p_event_id: eventId },
      { event_id: eventId }
    );

    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const fallback = await supabase
        .from('events')
        .update({ status: 'Published' })
        .eq('id', eventId)
        .select()
        .single();
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  },

  /**
   * Calls PostgreSQL backend function: close_event
   */
  async closeEvent(eventId) {
    if (!isSupabaseConfigured) {
      const events = getLocalEvents();
      const index = events.findIndex((e) => String(e.id) === String(eventId));
      if (index === -1) return { error: new Error('Event not found') };
      events[index].status = 'Closed';
      saveLocalEvents(events);
      return { data: events[index], error: null };
    }

    const { data, error } = await callRpcFlexible(
      'close_event',
      { p_event_id: eventId },
      { event_id: eventId }
    );

    if (error && (error.code === '42883' || error.message?.includes('does not exist'))) {
      const fallback = await supabase
        .from('events')
        .update({ status: 'Closed' })
        .eq('id', eventId)
        .select()
        .single();
      return fallback;
    }

    if (error) throw error;
    return { data, error: null };
  }
};
