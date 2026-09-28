import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-campus-50 text-campus-600 flex items-center justify-center mb-6 border border-campus-100 shadow-sm">
        <Activity className="w-8 h-8" />
      </div>
      <span className="text-6xl font-black text-slate-900 tracking-tight">404</span>
      <h1 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
        The campus page or event URL you are trying to reach does not exist or may have been moved.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-campus-600 hover:bg-campus-700 text-white shadow-md shadow-campus-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Campus Home</span>
        </Link>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Events</span>
        </Link>
      </div>
    </div>
  );
}
