import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  User,
  Plus,
  LogOut,
  LogIn,
  Radio,
  CalendarDays,
  Users,
  Settings,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

function NavItem({ to, icon: Icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold'
            : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
        }`
      }
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive => isActive ? 2.5 : 2} />
      <span>{label}</span>
    </NavLink>
  );
}

function NavSection({ title, children }) {
  return (
    <div className="space-y-0.5">
      {title && (
        <p className="px-3.5 py-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-[#9ca3af]">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function Sidebar() {
  const { user, role, isStudent, isOrganizer, isAdmin, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    success('Signed out successfully');
    navigate('/');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-64 flex-col bg-white border-r border-[#e4e7ef] select-none shadow-[2px_0_12px_rgba(0,0,0,0.04)]">
      {/* ── Brand Header ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#f1f3f8]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center shadow-md group-hover:shadow-[#4f46e5]/30 transition-all">
            <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold tracking-tight text-[#0f1117] group-hover:text-[#4f46e5] transition-colors">
              Campus Event
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4f46e5] -mt-0.5">
              Pulse
            </span>
          </div>
        </Link>
      </div>

      {/* ── Create Event CTA (Organizer only) ── */}
      {isOrganizer && (
        <div className="px-4 pt-4 pb-2">
          <Link
            to="/organizer/events/new"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-semibold py-2.5 px-4 text-xs tracking-wide shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Event</span>
          </Link>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* General */}
        <NavSection>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
              }`
            }
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Discover Events</span>
          </NavLink>
        </NavSection>

        {/* Student Portal */}
        {isAuthenticated && isStudent && (
          <NavSection title="My Portal">
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/my-registrations"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>My Registrations</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </NavLink>
          </NavSection>
        )}

        {/* Organizer Portal */}
        {isAuthenticated && isOrganizer && (
          <NavSection title="Organizer">
            <NavLink
              to="/organizer/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/organizer/events"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>Manage Events</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </NavLink>
          </NavSection>
        )}

        {/* Unauthenticated */}
        {!isAuthenticated && (
          <NavSection title="Account">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold' : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
                }`
              }
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Sign In</span>
            </NavLink>
          </NavSection>
        )}
      </nav>

      {/* ── User Footer ── */}
      <div className="border-t border-[#f1f3f8] p-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef] p-2.5 group">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full avatar-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#0f1117] leading-tight">
                  {user?.fullName || user?.name || 'User'}
                </p>
                <p className="truncate text-[10px] text-[#9ca3af] font-medium">
                  {role || 'Student'}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#9ca3af] hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/register"
              className="flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-semibold py-2.5 text-xs shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center w-full rounded-xl border border-[#e4e7ef] bg-white hover:bg-[#f8f9fc] text-[#6b7280] py-2 text-xs font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
