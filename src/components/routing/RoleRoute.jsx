import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RoleRoute({ allowedRole, children }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-campus-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Authorizing access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role match (case-insensitive check)
  const userRoleLower = (role || '').toLowerCase();
  const allowedRoleLower = (allowedRole || '').toLowerCase();

  if (userRoleLower !== allowedRoleLower) {
    // Redirect to respective dashboard
    if (userRoleLower === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRoleLower === 'organizer') {
      return <Navigate to="/organizer/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
}
