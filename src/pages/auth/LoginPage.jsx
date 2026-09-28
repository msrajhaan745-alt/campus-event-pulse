import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const user = await login(email, password);
      success('Welcome back to Campus Event Pulse!');
      const role = user?.user_metadata?.role || user?.role || 'Student';
      if (from) {
        navigate(from, { replace: true });
      } else if (role.toLowerCase() === 'organizer') {
        navigate('/organizer/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(getFriendlyErrorMessage(err, 'Failed to sign in. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const fillStudent = () => {
    setEmail('student@campus.edu');
    setPassword('student123');
    setErrorMessage('');
  };

  const fillOrganizer = () => {
    setEmail('organizer@campus.edu');
    setPassword('organizer123');
    setErrorMessage('');
  };

  return (
    <div className="w-full animate-fade-in-up">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0f1117] tracking-tight leading-tight mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-[#6b7280] leading-relaxed">
          Sign in to discover events, track registrations, and manage your campus activities.
        </p>
      </div>

      {/* Demo Quick-Fill */}
      <div className="mb-6 rounded-xl border border-[#e4e7ef] bg-[#f8f9fc] p-4">
        <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#9ca3af] mb-3">
          Quick Demo Login
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillStudent}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#e4e7ef] hover:border-[#c7d2fe] hover:bg-[#eef2ff] bg-white text-xs font-semibold text-[#6b7280] hover:text-[#4f46e5] transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Demo</span>
          </button>
          <button
            type="button"
            onClick={fillOrganizer}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#e4e7ef] hover:border-[#c4b5fd] hover:bg-[#ede9fe] bg-white text-xs font-semibold text-[#6b7280] hover:text-[#7c3aed] transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Organizer Demo</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@campus.edu"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e4e7ef] bg-white text-sm text-[#0f1117] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#374151]" htmlFor="password">
              Password
            </label>
            <button type="button" className="text-[11px] text-[#4f46e5] hover:underline font-medium">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#e4e7ef] bg-white text-sm text-[#0f1117] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full py-3 rounded-xl text-sm mt-2 font-semibold"
        >
          Sign In to Pulse
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#f1f3f8] text-center">
        <p className="text-sm text-[#6b7280]">
          New to Campus Event Pulse?{' '}
          <Link to="/register" className="font-semibold text-[#4f46e5] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
