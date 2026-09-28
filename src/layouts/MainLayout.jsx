import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen flex bg-[#f8f9fc] text-[#0f1117] font-sans">
      {/* Fixed Left Sidebar — desktop only */}
      <Sidebar />

      {/* Main container — offset by sidebar on desktop */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 overflow-x-hidden">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
