"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard>
    <div className="flex flex-col md:flex-row h-screen bg-[#F4F9FF] overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-[60]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
            P
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            Post<span className="text-primary">siva</span>
          </span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {children}
      </main>
    </div>
    </AuthGuard>
  );
}
