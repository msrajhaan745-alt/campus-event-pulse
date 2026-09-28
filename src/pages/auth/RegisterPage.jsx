import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Building2, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function RegisterPage() {
  const [role, setRole] = useState('Student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await register({ email, password, fullName, role });
      success(`Account created! Welcome to Campus Event Pulse as ${role}.`);
      if (role === 'Organizer') {
        navigate('/organizer/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(getFriendlyErrorMessage(err, 'Failed to create account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'][passwordStrength];

  return (
    <div className="w-full animate-fade-in-up">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0f1117] tracking-tight leading-tight mb-2">
          Create your account
        </h1>
        <p className="text-sm text-[#6b7280] leading-relaxed">
          Join thousands of students and organizers on Campus Event Pulse.
        </p>
      </div>

      {/* Role Picker */}
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#9ca3af] mb-3">
          Choose your role
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('Student')}
            className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
              role === 'Student'
                ? 'border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5]'
                : 'border-[#e4e7ef] bg-white text-[#6b7280] hover:border-[#c7d2fe] hover:bg-[#f8f9fc]'
            }`}
          >
            {role === 'Student' && (
              <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-[#4f46e5]" />
            )}
            <GraduationCap className="w-6 h-6" />
            <span>Student</span>
            <span className="text-[10px] font-normal opacity-75 text-center leading-tight">
              Discover & register for campus events
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole('Organizer')}
            className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
              role === 'Organizer'
                ? 'border-[#7c3aed] bg-[#ede9fe] text-[#7c3aed]'
                : 'border-[#e4e7ef] bg-white text-[#6b7280] hover:border-[#c4b5fd] hover:bg-[#f8f9fc]'
            }`}
          >
            {role === 'Organizer' && (
              <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-[#7c3aed]" />
            )}
            <Building2 className="w-6 h-6" />
            <span>Organizer</span>
            <span className="text-[10px] font-normal opacity-75 text-center leading-tight">
              Create & publish campus events
            </span>
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5" htmlFor="fullname">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="fullname"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Chen"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e4e7ef] bg-white text-sm text-[#0f1117] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5" htmlFor="reg-email">
            Campus Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@campus.edu"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e4e7ef] bg-white text-sm text-[#0f1117] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5" htmlFor="reg-pass">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="reg-pass"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
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
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= passwordStrength ? strengthColor : 'bg-[#e4e7ef]'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[10px] font-semibold ${
                passwordStrength === 1 ? 'text-red-500' :
                passwordStrength === 2 ? 'text-amber-500' :
                'text-emerald-600'
              }`}>
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5" htmlFor="confirm-pass">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="confirm-pass"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white text-sm text-[#0f1117] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/10 transition-all ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-300 focus:border-red-400'
                  : confirmPassword && confirmPassword === password
                    ? 'border-emerald-300 focus:border-emerald-400'
                    : 'border-[#e4e7ef] focus:border-[#a5b4fc]'
              }`}
            />
            {confirmPassword && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {confirmPassword === password
                  ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                  : <AlertCircle className="w-4 h-4 text-red-400" />
                }
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full py-3 rounded-xl text-sm mt-2"
        >
          Create {role} Account
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-[#f1f3f8] text-center">
        <p className="text-sm text-[#6b7280]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#4f46e5] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
