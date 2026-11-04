"use client";

import { useState } from "react";
import Sidebar from "@/components/inventory/Sidebar";
import Navbar from "@/components/inventory/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className="min-h-screen lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}