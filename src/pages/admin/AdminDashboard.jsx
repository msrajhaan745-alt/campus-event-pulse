import React, { useState } from 'react';
import {
  Users, CalendarDays, TrendingUp, ShieldCheck,
  Activity, Clock, CheckCircle2, XCircle, Eye,
  BarChart3, Megaphone, Settings, Flag, Bell,
  ChevronRight, ArrowUpRight, ArrowDownRight,
  Building2, Search, Filter, MoreVertical,
  UserCheck, AlertCircle, Layers
} from 'lucide-react';

/* ── Demo data ─────────────────────────────────── */
const STATS = [
  { label: 'Total Users',      value: '1,284', change: '+12%', up: true,  icon: Users,        color: 'green' },
  { label: 'Active Events',    value: '38',    change: '+5%',  up: true,  icon: CalendarDays, color: 'blue'  },
  { label: 'Pending Approvals',value: '7',     change: '-2',   up: false, icon: Clock,        color: 'amber' },
  { label: 'Total Revenue',    value: '₹2.4L', change: '+18%', up: true,  icon: TrendingUp,   color: 'green' },
];

const COLOR_MAP = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', icon: 'text-emerald-600' },
  blue:  { bg: 'bg-sky-50',     text: 'text-sky-700',     ring: 'ring-sky-200',     icon: 'text-sky-600'     },
  amber: { bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200',   icon: 'text-amber-600'   },
};

const EVENTS = [
  { id: 1, title: 'Hackathon 2026',         organizer: 'TechClub',    date: '28 Sep', seats: 120, registered: 94,  status: 'active',   category: 'Tech'     },
  { id: 2, title: 'Cultural Night',          organizer: 'Arts Society', date: '02 Oct', seats: 300, registered: 276, status: 'active',   category: 'Cultural' },
  { id: 3, title: 'Alumni Connect Webinar',  organizer: 'CSE Dept',    date: '05 Oct', seats: 80,  registered: 14,  status: 'pending',  category: 'Network'  },
  { id: 4, title: 'Sports Day',              organizer: 'Sports Club',  date: '10 Oct', seats: 500, registered: 312, status: 'active',   category: 'Sports'   },
  { id: 5, title: 'Debate Championship',     organizer: 'Debate Club',  date: '12 Oct', seats: 60,  registered: 41,  status: 'pending',  category: 'Academics'},
];

const USERS = [
  { id: 1, name: 'Aarav Mehta',   email: 'aarav@college.edu',   role: 'Student',   joined: '3 days ago',  status: 'active'   },
  { id: 2, name: 'Priya Sharma',  email: 'priya@college.edu',   role: 'Organizer', joined: '1 week ago',  status: 'active'   },
  { id: 3, name: 'Rohan Das',     email: 'rohan@college.edu',   role: 'Student',   joined: '2 weeks ago', status: 'inactive' },
  { id: 4, name: 'Sneha Joshi',   email: 'sneha@college.edu',   role: 'Organizer', joined: '1 month ago', status: 'active'   },
];

const PENDING = [
  { id: 1, title: 'Alumni Connect Webinar', organizer: 'CSE Dept',   submitted: '2 hours ago',  type: 'New Event'  },
  { id: 2, title: 'Photography Workshop',   organizer: 'Photo Club',  submitted: '5 hours ago',  type: 'New Event'  },
  { id: 3, title: 'Debate Championship',    organizer: 'Debate Club', submitted: '1 day ago',    type: 'Edit Event' },
];

const TABS = ['Overview', 'Events', 'Users', 'Approvals'];

/* ── Sub-components ─────────────────────────────── */
function StatCard({ stat }) {
  const c = COLOR_MAP[stat.color] || COLOR_MAP.green;
  const Icon = stat.icon;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
          stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {stat.change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending:  'bg-amber-50   text-amber-700   ring-1 ring-amber-200',
    inactive: 'bg-gray-100   text-gray-500    ring-1 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || map.inactive}`}>
      {status}
    </span>
  );
}

/* ── Main Component ─────────────────────────────── */
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [pendingMap, setPendingMap] = useState({});

  const handleApprove = (id) => setPendingMap(m => ({ ...m, [id]: 'approved' }));
  const handleReject  = (id) => setPendingMap(m => ({ ...m, [id]: 'rejected' }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Header Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">Admin Portal</h1>
              <p className="text-xs text-gray-400 mt-0.5">Campus Event Pulse</p>
            </div>
            <span className="badge-admin ml-2">Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-700 transition-all">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
              AD
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
              }`}
            >
              {tab}
              {tab === 'Approvals' && PENDING.filter(p => !pendingMap[p.id]).length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                  {PENDING.filter(p => !pendingMap[p.id]).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Events */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-600" /> Recent Events
                  </h2>
                  <button onClick={() => setActiveTab('Events')} className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1">
                    See all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {EVENTS.slice(0, 4).map(ev => (
                    <div key={ev.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/70 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Megaphone className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{ev.title}</p>
                        <p className="text-xs text-gray-400">{ev.organizer} · {ev.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-900">{ev.registered}/{ev.seats}</p>
                        <p className="text-[10px] text-gray-400">seats</p>
                      </div>
                      <StatusBadge status={ev.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals quick view */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Pending
                  </h2>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                    {PENDING.filter(p => !pendingMap[p.id]).length} new
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {PENDING.map(p => {
                    const done = pendingMap[p.id];
                    return (
                      <div key={p.id} className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.type} · {p.submitted}</p>
                        {done ? (
                          <span className={`mt-2 inline-block text-xs font-semibold ${done === 'approved' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {done === 'approved' ? '✓ Approved' : '✗ Rejected'}
                          </span>
                        ) : (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleApprove(p.id)} className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors">
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button onClick={() => handleReject(p.id)} className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors">
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Events this month', value: '14', icon: Layers,    color: 'text-emerald-600 bg-emerald-50' },
                { label: 'New users today',   value: '23', icon: UserCheck,  color: 'text-sky-600 bg-sky-50'         },
                { label: 'Flags/Reports',     value: '2',  icon: Flag,       color: 'text-red-500 bg-red-50'         },
              ].map(item => (
                <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EVENTS TAB ── */}
        {activeTab === 'Events' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-emerald-400 transition-colors">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full text-sm bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-emerald-300 hover:text-emerald-700 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3 text-left">Event</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Organizer</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Date</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Seats</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {EVENTS.filter(e => e.title.toLowerCase().includes(search.toLowerCase())).map(ev => (
                    <tr key={ev.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{ev.title}</p>
                            <p className="text-xs text-gray-400">{ev.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-gray-500">{ev.organizer}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-500">{ev.date}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-20">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${(ev.registered / ev.seats) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{ev.registered}/{ev.seats}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={ev.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'Users' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-emerald-400 transition-colors max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3 text-left">User</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Role</th>
                    <th className="px-5 py-3 text-left hidden md:table-cell">Joined</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          u.role === 'Organizer' ? 'bg-sky-50 text-sky-700' : 'bg-gray-100 text-gray-600'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-400 text-xs">{u.joined}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={u.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── APPROVALS TAB ── */}
        {activeTab === 'Approvals' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Pending Approvals</h2>
                <p className="text-xs text-gray-500">Review and approve organizer submissions</p>
              </div>
            </div>

            <div className="grid gap-4">
              {PENDING.map(p => {
                const done = pendingMap[p.id];
                return (
                  <div key={p.id} className={`bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${
                    done === 'approved' ? 'border-emerald-200 bg-emerald-50/40' :
                    done === 'rejected' ? 'border-red-200 bg-red-50/30 opacity-70' :
                    'border-gray-100 hover:border-amber-200'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Megaphone className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{p.organizer}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">{p.type}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{p.submitted}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {done ? (
                          <span className={`flex items-center gap-1 text-sm font-bold ${done === 'approved' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {done === 'approved' ? <><CheckCircle2 className="w-4 h-4" /> Approved</> : <><XCircle className="w-4 h-4" /> Rejected</>}
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(p.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-sm font-semibold transition-all active:scale-95"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
