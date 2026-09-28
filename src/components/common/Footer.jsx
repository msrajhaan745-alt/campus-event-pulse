import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-line mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-card bg-accent text-accentInk font-bold text-xs font-display">
                CA
              </div>
              <span className="font-display text-base font-semibold tracking-tight text-ink">
                Campus Event <span className="text-accent">Pulse</span>
              </span>
            </div>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              The unified event platform for college campus life. Discover workshops, hackathons, and cultural fests, with live seat capacity and verification.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-muted/80 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>PostgreSQL &amp; Supabase Backend Connected</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/events" className="hover:text-ink transition-colors">
                  All Campus Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="hover:text-ink transition-colors">
                  Technical Workshops
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-ink transition-colors">
                  Cultural Celebrations
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-ink transition-colors">
                  Athletic &amp; Sports Tournaments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/login" className="hover:text-ink transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-ink transition-colors">
                  Organizer Dashboard Access
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-ink transition-colors">
                  Register New Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted gap-4">
          <p>© 2026 Campus Event Pulse. High-Performance Campus Platform.</p>
          <p className="flex items-center gap-1.5 text-muted">
            Engineered with <span className="text-accent font-bold">Pulse</span> for student life
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
