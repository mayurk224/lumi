import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">

      {/* Desktop Sidebar Container */}
      <div className="hidden lg:block shrink-0 w-64 border-r border-white/10 bg-black">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Mobile Sidebar Content */}
          <div className="relative z-10 w-64 h-full bg-black border-r border-white/10 shadow-2xl flex flex-col">
            {/* Optional: Add a close button specifically for mobile */}
            <div className="flex items-center justify-end p-4 border-b border-white/10">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-white/50 hover:text-[#BBFB00] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Mobile Header (Sticky) */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-4 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-white/70 hover:text-[#BBFB00] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-medium tracking-wide text-sm">
            Kibun Admin
          </span>
        </header>

        {/* Main Outlet Wrapper */}
        <main className="flex-1 overflow-auto">
          {/* Added a container with padding so the inner content has breathing room */}
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
