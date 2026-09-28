import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Compass,
  CalendarCheck,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  Bell,
  Plus,
  CalendarDays,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, isStudent, isOrganizer, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    success('Signed out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold'
        : 'text-[#6b7280] hover:bg-[#f1f3f8] hover:text-[#0f1117]'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#e4e7ef] px-4 sm:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between h-14">
        {/* Mobile: Brand + Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl border border-[#e4e7ef] flex items-center justify-center text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f8f9fc] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[#0f1117] text-sm tracking-tight">
              Campus Pulse
            </span>
          </Link>
        </div>

        {/* Desktop: Page title area (empty — sidebar has brand) */}
        <div className="hidden md:flex items-center gap-3 flex-1">
          {/* Intentionally minimal — sidebar has full branding */}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-xl border border-[#e4e7ef] flex items-center justify-center text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f8f9fc] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {isAuthenticated && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444] border-2 border-white" />
            )}
          </button>

          {/* User avatar or Sign-In */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl border border-[#e4e7ef] hover:bg-[#f8f9fc] transition-colors group"
            >
              <div className="w-7 h-7 rounded-full avatar-gradient flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-semibold text-[#0f1117] leading-tight max-w-[90px] truncate">
                  {user?.fullName?.split(' ')[0] || 'Profile'}
                </span>
                <span className="text-[10px] text-[#9ca3af] font-medium">{role}</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-[#e4e7ef] text-xs font-semibold text-[#6b7280] hover:bg-[#f8f9fc] hover:text-[#0f1117] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4 pt-2 border-t border-[#f1f3f8] space-y-1 animate-fade-in-up">
          <NavLink to="/events" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
            <Compass className="w-4 h-4" />
            <span>Discover Events</span>
          </NavLink>

          {isStudent && (
            <>
              <NavLink to="/student/dashboard" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/my-registrations" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <CalendarCheck className="w-4 h-4" />
                <span>My Registrations</span>
              </NavLink>
            </>
          )}

          {isOrganizer && (
            <>
              <NavLink to="/organizer/dashboard" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Organizer Dashboard</span>
              </NavLink>
              <NavLink to="/organizer/events" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <CalendarDays className="w-4 h-4" />
                <span>Manage Events</span>
              </NavLink>
              <NavLink to="/organizer/events/new" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <Plus className="w-4 h-4 text-[#4f46e5]" />
                <span>Create Event</span>
              </NavLink>
            </>
          )}

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavLink>
              <div className="pt-2 mt-2 border-t border-[#f1f3f8] flex items-center justify-between px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full avatar-gradient flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0f1117]">{user?.fullName || 'User'}</p>
                    <p className="text-[10px] text-[#9ca3af]">{role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-[#e4e7ef] bg-white py-2.5 text-xs font-semibold text-[#6b7280]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] py-2.5 text-xs font-semibold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
