"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare, 
  Share2, 
  RefreshCw, 
  Filter,
  MoreVertical,
  ExternalLink,
  Search,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const publishedPosts = [
  { 
    id: 1, 
    title: "Revolutionizing Facebook Growth with Intelligent AI Automation", 
    date: "2 hours ago", 
    engagement: "1.2k", 
    comments: 48,
    shares: 12,
    image: "/launch-automate.png",
    type: "Automation",
    reach: "12.4k"
  },
  { 
    id: 2, 
    title: "10 Proven Strategies for Building a High-Converting Audience in 2025", 
    date: "5 hours ago", 
    engagement: "856", 
    comments: 24,
    shares: 8,
    image: "/growth-acceleration.png",
    type: "Growth",
    reach: "8.2k"
  },
  { 
    id: 3, 
    title: "Maximizing Your Digital Reach with Global-Scale Networking Tools", 
    date: "Yesterday, 10:00 AM", 
    engagement: "2.4k", 
    comments: 112,
    shares: 45,
    image: "/global-reach.png",
    type: "Strategy",
    reach: "24.5k"
  },
  { 
    id: 4, 
    title: "Advanced Safety Protocols: Maintaining Facebook Compliance in 2025", 
    date: "Dec 24, 2025", 
    engagement: "542", 
    comments: 15,
    shares: 3,
    image: "/advanced-safety.png",
    type: "Security",
    reach: "4.1k"
  },
  { 
    id: 5, 
    title: "Analyzing Performance: The Key to Continuous Automation Success", 
    date: "Dec 23, 2025", 
    engagement: "920", 
    comments: 32,
    shares: 14,
    image: "/analyze-optimize.png",
    type: "Analytics",
    reach: "9.8k"
  },
  { 
    id: 6, 
    title: "Defining Your Audience: Precision Targeting for Modern Marketers", 
    date: "Dec 22, 2025", 
    engagement: "1.1k", 
    comments: 56,
    shares: 22,
    image: "/define-your-audience.png",
    type: "Marketing",
    reach: "11.2k"
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

export default function PublishedPostsPage() {
  const [filter, setFilter] = useState("All Posts");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-10 min-h-screen space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Published Posts</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold mt-1">View and manage all your live Facebook activity</p>
        </div>
        <Button className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
          <RefreshCw className="w-5 h-5" />
          Refresh Feed
        </Button>
      </motion.div>

      {/* Toolbar Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 px-5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 font-black text-xs text-slate-600 hover:border-primary/30 transition-all"
            >
              <Filter className="w-4 h-4 text-primary" />
              {filter}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters ? "rotate-180" : "")} />
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                >
                  {["All Posts", "Automation", "Growth", "Security", "Analytics"].map((type) => (
                    <button 
                      key={type}
                      onClick={() => {
                        setFilter(type);
                        setShowFilters(false);
                      }}
                      className={cn(
                        "w-full px-5 py-3 text-left font-black text-[10px] uppercase tracking-widest transition-colors",
                        filter === type ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/5"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">
            Showing 1 - {publishedPosts.length} of {publishedPosts.length} posts
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-medium"
          />
        </div>
      </motion.div>

      {/* Grid of Posts */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {publishedPosts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Card className="border-none shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 group overflow-hidden flex flex-col rounded-[2.5rem] bg-white cursor-pointer h-full border border-transparent hover:border-primary/10">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Badges */}
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em] shadow-lg">
                  {post.type}
                </div>
                <div className="absolute top-5 right-5 px-3 py-1.5 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Published
                </div>
              </div>

              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors text-lg leading-snug">
                  {post.title}
                </h3>
                
                {/* Detailed Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reach</p>
                    <p className="text-sm font-black text-slate-900">{post.reach}</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Engage</p>
                    <p className="text-sm font-black text-slate-900">{post.engagement}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth</p>
                    <div className="flex items-center justify-end gap-1 text-primary">
                      <TrendingUp className="w-3 h-3" />
                      <p className="text-sm font-black">+12%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black">{post.shares}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

