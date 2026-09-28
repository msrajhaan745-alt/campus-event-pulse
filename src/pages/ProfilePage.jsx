import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  Database,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function ProfilePage() {
  const { user, role, isStudent, isOrganizer, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
          <User className="w-3.5 h-3.5" />
          <span>User Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
          Campus Profile
        </h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Your credentials and campus platform permissions
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#e4e7ef] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-white font-extrabold text-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{user?.fullName || 'Campus User'}</h2>
            <p className="text-sm text-indigo-200">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mt-2">
              <Shield className="w-3 h-3 text-indigo-300" />
              <span>Role: {role}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef]">
              <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1">
                Account Email
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0f1117]">
                <Mail className="w-4 h-4 text-[#9ca3af]" />
                <span>{user?.email}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef]">
              <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1">
                Assigned Role
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0f1117]">
                <Shield className="w-4 h-4 text-[#9ca3af]" />
                <span>{role}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f9fc] border border-[#e4e7ef] sm:col-span-2">
              <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider block mb-1">
                Backend Connection Status
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-[#4b5563]">
                <Database className="w-4 h-4 text-[#4f46e5]" />
                <span>
                  {isSupabaseConfigured
                    ? 'Connected to live Supabase PostgreSQL backend'
                    : 'Running in interactive evaluation mode (configured with fallback)'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-[#f1f3f8] space-y-3">
            <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="flex flex-wrap gap-2">
              {isStudent && (
                <>
                  <Link
                    to="/student/dashboard"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff] transition-colors"
                  >
                    Go to Student Dashboard
                  </Link>
                  <Link
                    to="/my-registrations"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#e4e7ef] text-[#4b5563] hover:text-[#0f1117] hover:bg-[#f8f9fc] transition-colors"
                  >
                    My Registrations
                  </Link>
                </>
              )}

              {isOrganizer && (
                <>
                  <Link
                    to="/organizer/dashboard"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff] transition-colors"
                  >
                    Organizer Dashboard
                  </Link>
                  <Link
                    to="/organizer/events"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#e4e7ef] text-[#4b5563] hover:text-[#0f1117] hover:bg-[#f8f9fc] transition-colors"
                  >
                    Manage Events
                  </Link>
                  <Link
                    to="/organizer/events/new"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white hover:from-[#4338ca] hover:to-[#4f46e5] transition-all"
                  >
                    Create Event
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Log Out */}
          <div className="pt-4 border-t border-[#f1f3f8] flex items-center justify-between">
            <span className="text-xs text-[#9ca3af]">Sign out from this device session</span>
            <Button variant="danger" size="md" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1.5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
