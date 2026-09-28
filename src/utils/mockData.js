/**
 * Initial fallback data used ONLY when Supabase credentials are NOT yet configured in .env.
 * This ensures the frontend can be thoroughly tested, inspected, and demonstrated
 * out of the box during student evaluation.
 * Once VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, the application strictly
 * calls the PostgreSQL backend RPC functions.
 */

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Python Workshop',
    description: 'Hands-on intensive workshop on Python programming, automation, data structures, and standard libraries for modern development.',
    category: 'Workshop',
    date: '2026-10-01',
    time: '10:00:00',
    venue: 'CS Lab 101',
    organizer_id: 'org-1',
    organizer_name: 'Computer Science Department',
    seat_limit: 50,
    registered_count: 1,
    available_seats: 49,
    status: 'Published',
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'evt-2',
    title: 'Campus Hackathon 2026',
    description: '36-hour code sprint to build innovative campus solutions, AI utilities, and sustainable student tools. Mentorship and prizes included.',
    category: 'Technical',
    date: '2026-10-15',
    time: '09:00:00',
    venue: 'Innovation Hub, 3rd Floor',
    organizer_id: 'org-1',
    organizer_name: 'Coding Club',
    seat_limit: 100,
    registered_count: 78,
    available_seats: 22,
    status: 'Published',
    created_at: '2026-09-21T11:00:00Z',
  },
  {
    id: 'evt-3',
    title: 'Annual Cultural Fest: Tarang',
    description: 'An evening celebrating campus music, classical and street dance, theatrical plays, and vibrant art installations.',
    category: 'Cultural',
    date: '2026-10-20',
    time: '17:30:00',
    venue: 'Main University Auditorium',
    organizer_id: 'org-2',
    organizer_name: 'Cultural Committee',
    seat_limit: 300,
    registered_count: 240,
    available_seats: 60,
    status: 'Published',
    created_at: '2026-09-22T14:00:00Z',
  },
  {
    id: 'evt-4',
    title: 'Inter-College Football Championship',
    description: 'Knockout football matches between college departments. Cheer for your team and show campus sportsmanship!',
    category: 'Sports',
    date: '2026-10-05',
    time: '16:00:00',
    venue: 'Campus Sports Ground',
    organizer_id: 'org-3',
    organizer_name: 'Sports Council',
    seat_limit: 150,
    registered_count: 150,
    available_seats: 0,
    status: 'Published',
    created_at: '2026-09-23T08:00:00Z',
  },
  {
    id: 'evt-5',
    title: 'AI & Machine Learning Seminar',
    description: 'Distinguished lecture by industry experts exploring Large Language Models, deep learning advances, and career pathways in AI.',
    category: 'Seminar',
    date: '2026-10-08',
    time: '14:00:00',
    venue: 'Seminar Hall B',
    organizer_id: 'org-1',
    organizer_name: 'Department of AI & DS',
    seat_limit: 80,
    registered_count: 45,
    available_seats: 35,
    status: 'Published',
    created_at: '2026-09-24T09:30:00Z',
  },
  {
    id: 'evt-6',
    title: 'Robotics & IoT Exhibition (Draft)',
    description: 'Student prototype demonstrations featuring autonomous rovers, drone mapping, and smart home sensor grids.',
    category: 'Club',
    date: '2026-11-02',
    time: '11:00:00',
    venue: 'Mechanical Block Atrium',
    organizer_id: 'org-1',
    organizer_name: 'Robotics Club',
    seat_limit: 60,
    registered_count: 0,
    available_seats: 60,
    status: 'Draft',
    created_at: '2026-09-25T12:00:00Z',
  },
  {
    id: 'evt-7',
    title: 'Alumni Tech Talk (Past/Closed)',
    description: 'Interactive session with alumni working at top tech firms sharing interview prep and internship strategies.',
    category: 'Seminar',
    date: '2026-09-15',
    time: '11:00:00',
    venue: 'Auditorium Hall 2',
    organizer_id: 'org-1',
    organizer_name: 'Alumni Association',
    seat_limit: 75,
    registered_count: 75,
    available_seats: 0,
    status: 'Closed',
    created_at: '2026-09-10T10:00:00Z',
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-1',
    event_id: 'evt-2',
    title: 'Campus Hackathon 2026',
    date: '2026-10-15',
    venue: 'Innovation Hub, 3rd Floor',
    category: 'Technical',
    status: 'Registered',
    registration_date: '2026-09-22T10:00:00Z',
  }
];

export const INITIAL_PARTICIPANTS = {
  'evt-1': [
    {
      id: 'p-1',
      student_name: 'Alex Johnson',
      student_email: 'alex.j@campus.edu',
      status: 'Registered',
      registration_date: '2026-09-26T14:30:00Z',
    }
  ],
  'evt-2': [
    {
      id: 'p-2',
      student_name: 'Samantha Ray',
      student_email: 'samantha.r@campus.edu',
      status: 'Registered',
      registration_date: '2026-09-22T10:00:00Z',
    },
    {
      id: 'p-3',
      student_name: 'David Chen',
      student_email: 'd.chen@campus.edu',
      status: 'Registered',
      registration_date: '2026-09-23T11:20:00Z',
    }
  ]
};
