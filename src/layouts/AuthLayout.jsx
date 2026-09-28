import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Zap, Calendar, Users, Award, ArrowRight } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Calendar,
    title: 'Discover Events',
    desc: 'Browse workshops, hackathons, cultural fests and more.',
    color: 'bg-[#eef2ff] text-[#4f46e5]',
  },
  {
    icon: Users,
    title: 'One-Click Registration',
    desc: 'Reserve your seat instantly with real-time availability.',
    color: 'bg-[#f0fdf4] text-[#059669]',
  },
  {
    icon: Award,
    title: 'Track Your Events',
    desc: 'Manage your upcoming registrations in one place.',
    color: 'bg-[#fff7ed] text-[#d97706]',
  },
];

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* LEFT: Form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 max-w-xl mx-auto lg:mx-0 w-full">
        {/* Brand */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center shadow-[0_4px_14px_rgba(79,70,229,0.35)] group-hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] transition-all">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] font-bold tracking-tight text-[#0f1117] group-hover:text-[#4f46e5] transition-colors">
                Campus Event
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4f46e5] -mt-0.5">
                Pulse
              </span>
            </div>
          </Link>
        </div>

        {/* Page content slot */}
        <Outlet />
      </div>

      {/* RIGHT: Visual showcase — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[520px] bg-gradient-to-br from-[#0f1117] via-[#1e1b4b] to-[#312e81] p-12 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#4f46e5]/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 rounded-full bg-[#7c3aed]/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid-subtle opacity-30 pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#4f46e5]/40 bg-[#4f46e5]/20 px-3.5 py-1.5 text-xs font-semibold text-[#a5b4fc] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a5b4fc] animate-pulse" />
            Live Campus Pulse
          </span>
          <span className="text-xs text-[#6b7280] font-mono">Fall 2026</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-4 my-auto">
          {/* Hero event card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 group hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-semibold border border-violet-500/30">
                Technical
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                92% filled
              </span>
            </div>
            <h3 className="text-white text-xl font-bold tracking-tight mb-1">
              HackSRM 2026
            </h3>
            <p className="text-[#9ca3af] text-xs leading-relaxed">
              36-hour code sprint for 500+ student developers, designers, and creators.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#6b7280]">
              <span className="flex items-center gap-1.5 text-[#9ca3af]">
                <Calendar className="w-3.5 h-3.5 text-[#4f46e5]" />
                Oct 14–16, 2026
              </span>
              <span className="flex items-center gap-1.5 text-[#9ca3af]">
                <Users className="w-3.5 h-3.5" />
                460 / 500
              </span>
            </div>
            {/* Capacity bar */}
            <div className="mt-3 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active Events', value: '248' },
              { label: 'Registrations', value: '12.4k' },
              { label: 'Organizers', value: '84' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-center">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-[#6b7280] mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div className="space-y-2.5 mt-2">
            {FEATURE_CARDS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/4 px-4 py-3 backdrop-blur-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-[11px] text-[#6b7280] leading-tight">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#4b5563] pt-6 border-t border-white/10">
          <span>Postgres RLS • Real-time seats</span>
          <span className="flex items-center gap-1 text-[#6b7280]">
            Supabase powered <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
