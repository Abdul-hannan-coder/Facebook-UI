"use client";

import { motion, Variants } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Facebook,
  Plus,
  ArrowRight,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AuthGuard } from "@/components/AuthGuard";
import { useFacebook } from "@/hooks/facebook";
import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import Link from "next/link";

const stats = [
  { label: "Total Reach", value: "124.5k", growth: "+12.5%", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "Engagement", value: "45.2k", growth: "+8.2%", icon: TrendingUp, color: "text-[#82C3FF]", bg: "bg-[#82C3FF]/10" },
  { label: "Scheduled", value: "18", growth: "Next: 2h", icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
  { label: "Messages", value: "1.2k", growth: "+24%", icon: MessageSquare, color: "text-[#82C3FF]", bg: "bg-[#82C3FF]/10" },
];

const recentPosts = [
  { 
    id: 1, 
    title: "Scale your Facebook reach in 2025", 
    date: "2 hours ago", 
    engagement: "1.2k", 
    status: "Published",
    image: "/launch-automate.png",
    type: "Automation"
  },
  { 
    id: 2, 
    title: "10 tips for better audience targeting", 
    date: "5 hours ago", 
    engagement: "856", 
    status: "Published",
    image: "/growth-acceleration.png",
    type: "Growth"
  },
  { 
    id: 3, 
    title: "The future of AI in social media automation", 
    date: "Tomorrow, 10:00 AM", 
    engagement: "-", 
    status: "Scheduled",
    image: "/global-reach.png",
    type: "Strategy"
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Dashboard() {
  const { pages, fetchPages, isLoading: fbLoading, hasToken, isConnected } = useFacebook();
  const { user } = useAuth();

  useEffect(() => {
    if (hasToken) {
      fetchPages();
    }
  }, [hasToken, fetchPages]);

  return (
    <AuthGuard>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-4 md:p-10 min-h-screen space-y-10"
      >
      {/* Welcome Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">                                          
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            Welcome{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>                                                     
          <p className="text-sm md:text-base text-slate-500 font-bold">Facebook Automation Overview</p>
          {!hasToken && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800 mb-2">
                Connect your Facebook account to get started
              </p>
              <Link href="/connect-facebook">
                <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 font-bold text-sm">
                  Connect Facebook
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">    
          <Plus className="w-5 h-5" />
          New Campaign
        </Button>
      </motion.div>

      {/* Facebook Pages Section */}
      {hasToken && (
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  Your Facebook Pages
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} Connected
                </p>
              </div>
              <Button
                onClick={() => fetchPages()}
                disabled={fbLoading}
                variant="outline"
                className="h-10 px-6 rounded-xl font-bold text-sm"
              >
                {fbLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            {fbLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No Facebook pages found</p>
                <Link href="/connect-facebook">
                  <Button variant="outline" className="rounded-xl">
                    Connect Facebook
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <div
                    key={page.page_id}
                    className="p-6 border border-slate-100 rounded-2xl hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Facebook className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{page.page_name}</h3>
                          <p className="text-xs text-slate-500">{page.page_category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Permissions:</span>
                        <span className="font-semibold text-slate-700">{page.page_permissions}</span>
                      </div>
                      {page.expires_at && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Expires:</span>
                          <span className="font-semibold text-slate-700">
                            {new Date(page.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="p-8 border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white group hover:shadow-primary/10 transition-all cursor-default">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className={`text-[10px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-full uppercase tracking-widest`}>
                  {stat.growth}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Analytics Area */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white p-8 md:p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                  <Activity className="w-3 h-3" />
                  Performance
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Growth Analytics</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Reach Monitoring</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">System Live</span>
              </div>
            </div>
            
            <div className="h-[320px] flex items-end gap-3 md:gap-4 px-2 relative">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] font-black text-slate-300 pointer-events-none pb-8 pr-2">
                <span>100k</span>
                <span>75k</span>
                <span>50k</span>
                <span>25k</span>
                <span>0k</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-8 pl-10 pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-px bg-slate-100/50" />
                ))}
              </div>

              <div className="flex-1 flex items-end gap-3 md:gap-4 pl-10 h-full">
                {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 75, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 + 0.5, ease: "easeOut" }}
                      className="w-full bg-primary/10 rounded-t-2xl group-hover:bg-primary transition-all relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
                      <motion.div 
                        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20"
                      >
                        {h}k Reach
                      </motion.div>
                    </motion.div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Day {i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Campaign Status */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-white p-8 md:p-10">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 text-center">Status</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-10">Account Health</p>
            
            <div className="space-y-8">
              {[
                { label: "Account Safety", val: 98, color: "bg-primary" },
                { label: "Daily Limit", val: 65, color: "bg-[#82C3FF]" },
                { label: "Proxy Health", val: 100, color: "bg-primary" },
                { label: "API Response", val: 92, color: "bg-[#82C3FF]" },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs font-black text-slate-900">{item.val}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-[1.5px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.color} shadow-[0_0_8px_rgba(24,119,242,0.3)]`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`mt-12 p-6 rounded-3xl border flex items-center gap-4 cursor-default transition-all ${
                isConnected 
                  ? 'bg-primary/5 border-primary/10' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}                     
            >
              <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border ${
                isConnected 
                  ? 'text-primary border-primary/5' 
                  : 'text-yellow-600 border-yellow-200'
              }`}>                  
                <Facebook className={`w-6 h-6 ${isConnected ? 'fill-current' : ''}`} />
              </div>
              <div>
                <div className={`text-xs font-black uppercase tracking-tight leading-none mb-1.5 ${
                  isConnected ? 'text-slate-900' : 'text-yellow-800'
                }`}>
                  {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                </div>                                 
                <div className={`text-[10px] font-black uppercase tracking-widest ${
                  isConnected ? 'text-primary' : 'text-yellow-600'
                }`}>
                  {isConnected ? 'Active System' : 'Connect Required'}
                </div>
                {!isConnected && (
                  <Link href="/connect-facebook" className="mt-2 inline-block">
                    <Button size="sm" className="h-8 px-4 rounded-lg text-xs font-bold">
                      Connect Now
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Posts Cards */}
      <section className="space-y-8 pb-10">
        <motion.div variants={itemVariants} className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent Post Preview</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Latest Facebook Activity</p>
          </div>
          <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-primary/5 group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="border-none shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 group overflow-hidden flex flex-col rounded-[2.5rem] bg-white cursor-pointer h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em] shadow-lg">
                    {post.type}
                  </div>
                  <div className={`absolute top-5 right-5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${
                    post.status === 'Published' ? 'bg-primary text-white' : 'bg-[#82C3FF] text-white'
                  }`}>
                    {post.status}
                  </div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col">
                  <h3 className="font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors text-lg leading-snug">
                    {post.title}
                  </h3>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{post.date}</span>
                    </div>
                    {post.engagement !== "-" && (
                      <div className="flex items-center gap-1.5 text-primary font-black text-sm">
                        <TrendingUp className="w-4 h-4" />
                        {post.engagement}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
      </motion.div>
    </AuthGuard>
  );
}
