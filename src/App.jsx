import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { RoleRoute } from './components/routing/RoleRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { EventsPage } from './pages/events/EventsPage';
import { EventDetailsPage } from './pages/events/EventDetailsPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyRegistrationsPage } from './pages/student/MyRegistrationsPage';

// Organizer Pages
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { OrganizerEventsPage } from './pages/organizer/OrganizerEventsPage';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { EditEventPage } from './pages/organizer/EditEventPage';
import { EventParticipantsPage } from './pages/organizer/EventParticipantsPage';

// Common Authenticated & Fallback Pages
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />

        {/* Student Protected Routes */}
        <Route
          path="/student/dashboard"
          element={
            <RoleRoute allowedRole="Student">
              <StudentDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/my-registrations"
          element={
            <RoleRoute allowedRole="Student">
              <MyRegistrationsPage />
            </RoleRoute>
          }
        />

        {/* Organizer Protected Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <RoleRoute allowedRole="Organizer">
              <OrganizerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <RoleRoute allowedRole="Organizer">
              <OrganizerEventsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/organizer/events/new"
          element={
            <RoleRoute allowedRole="Organizer">
              <CreateEventPage />
            </RoleRoute>
          }
        />
        <Route
          path="/organizer/events/:id/edit"
          element={
            <RoleRoute allowedRole="Organizer">
              <EditEventPage />
            </RoleRoute>
          }
        />
        <Route
          path="/organizer/events/:id/participants"
          element={
            <RoleRoute allowedRole="Organizer">
              <EventParticipantsPage />
            </RoleRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRole="Admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* Authenticated User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
