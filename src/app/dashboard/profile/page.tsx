"use client";

import { motion } from "framer-motion";
import { RefreshCw, Mail, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("Muhammad Uzair");
  const [lastName, setLastName] = useState("Yasin");
  const [email, setEmail] = useState("uzairyasin83@gmail.com");
  const [timezone, setTimezone] = useState("GMT+5:00 Pakistan Standard Time");

  return (
    <div className="p-4 md:p-10 min-h-screen space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10 items-start">
        {/* Left Column: Profile Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-10 space-y-8"
        >
          <div className="bg-primary rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center relative border-4 border-white/30 shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary text-3xl font-bold">
                  MU
                </div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-black mb-1 tracking-tight truncate">Muhammad Uzair Yasin</h1>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex items-center gap-1.5 text-white/80 font-bold text-sm truncate">
                    <Mail className="w-4 h-4 shrink-0" />
                    {email}
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Status */}
            <div className="mt-8 pt-6 border-t border-white/20 relative z-10 space-y-3">
              <div className="flex items-center justify-between text-white/80 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Member Since</span>
                </div>
                <span>Jan 2024</span>
              </div>
              <div className="flex items-center justify-between text-white/80 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Posts This Month</span>
                </div>
                <span>12 / 50</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/5 blur-[60px] md:blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>

          <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-12 px-6 rounded-2xl font-bold text-sm">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
        </motion.div>

        {/* Right Column: Profile Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-primary/5 border border-slate-100"
        >
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 md:mb-10 pb-4 border-b border-slate-100">
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-10">
            <div className="space-y-2 md:space-y-4">
              <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
              <Input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary text-base md:text-lg font-bold text-slate-900"
              />
            </div>
            <div className="space-y-2 md:space-y-4">
              <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
              <Input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary text-base md:text-lg font-bold text-slate-900"
              />
            </div>
            <div className="space-y-2 md:space-y-4 sm:col-span-2">
              <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary text-base md:text-lg font-bold text-slate-900"
              />
            </div>
            <div className="space-y-2 md:space-y-4 sm:col-span-2">
              <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
              <Input 
                type="text" 
                value={timezone} 
                onChange={(e) => setTimezone(e.target.value)}
                className="h-12 md:h-14 px-4 md:px-6 rounded-xl md:rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary text-base md:text-lg font-bold text-slate-900"
              />
            </div>
          </div>

          <Button className="w-full h-14 rounded-2xl text-base font-black gap-3 shadow-xl shadow-primary/20 px-10 bg-primary hover:bg-primary/90 transition-all active:scale-95">
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
