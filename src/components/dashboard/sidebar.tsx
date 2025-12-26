"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Database, 
  Clock, 
  LogOut,
  Home,
  CheckCircle2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "My Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    title: "Published Posts",
    icon: CheckCircle2,
    href: "/dashboard/published",
  },
  {
    title: "Create Post",
    icon: Plus,
    href: "/dashboard/post",
  },
  {
    title: "Post Storage",
    icon: Database,
    href: "/dashboard/storage",
  },
  {
    title: "Scheduled Posts",
    icon: Clock,
    href: "/dashboard/scheduled",
  },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DashboardSidebar = ({ isOpen, setIsOpen }: DashboardSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden"
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col p-5 transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Link href="/" className="flex items-center gap-2.5 mb-10 ml-1">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            P
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Post<span className="text-primary">siva</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block relative"
              >
                <div className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                  isActive ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="font-bold text-sm">{item.title}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-5 border-t border-slate-100">
          <button 
            onClick={() => window.location.href = "/login"}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
