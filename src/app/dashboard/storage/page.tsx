"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Filter, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ExternalLink,
  ChevronDown,
  Trash2,
  CheckSquare,
  Square,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type MediaType = "all" | "image" | "video";

const initialMediaItems = [
  { id: 1, type: "image", name: "Facebook Reach Strategy.png", size: "26.52 KB", date: "Dec 13, 2025", status: "uploaded", url: "/global-reach.png" },
  { id: 2, type: "video", name: "Automation Demo.webm", size: "4.88 MB", date: "Dec 13, 2025", status: "uploaded", url: "/hero-section.png" },
  { id: 3, type: "image", name: "Audience Insights.png", size: "59.29 KB", date: "Dec 11, 2025", status: "posted", url: "/define-your-audience.png" },
  { id: 4, type: "image", name: "Campaign Setup.png", size: "19.64 KB", date: "Dec 11, 2025", status: "posted", url: "/create-your-campaign.png" },
  { id: 5, type: "image", name: "Growth Engine.png", size: "126.73 KB", date: "Dec 9, 2025", status: "posted", url: "/growth-acceleration.png" },
  { id: 6, type: "video", name: "System Launch.mp4", size: "1.94 MB", date: "Dec 8, 2025", status: "uploaded", url: "/launch-automate.png" },
  { id: 7, type: "image", name: "Security Protocols.png", size: "37.04 KB", date: "Dec 8, 2025", status: "posted", url: "/advanced-safety.png" },
  { id: 8, type: "image", name: "Analytics Dashboard.png", size: "37.04 KB", date: "Dec 8, 2025", status: "posted", url: "/analyze-optimize.png" },
];

export default function StoragePage() {
  const [mediaItems, setMediaItems] = useState(initialMediaItems);
  const [filter, setFilter] = useState<MediaType>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const router = useRouter();

  const filteredItems = mediaItems.filter(item => filter === "all" || item.type === filter);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const deleteSelected = () => {
    setMediaItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  return (
    <div className="p-4 md:p-10 min-h-screen">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10 bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post Storage</h1>
          <p className="text-sm text-slate-500 font-bold mt-1">Showing {filteredItems.length} of {mediaItems.length} media items</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button 
                    onClick={deleteSelected}
                    variant="destructive" 
                    className="h-12 px-6 rounded-xl gap-2 font-black shadow-lg shadow-red-200 bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedIds.length})
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button 
                    onClick={() => setSelectedIds([])}
                    variant="ghost" 
                    className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Clear
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="h-12 px-5 bg-white rounded-xl border-2 border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:border-primary/30 transition-all shadow-sm"
            >
              <Filter className="w-4 h-4" />
              {filter === "all" ? "All Media" : filter.charAt(0).toUpperCase() + filter.slice(1) + "s"}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilterDropdown ? "rotate-180" : "")} />
            </button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                >
                  {["all", "image", "video"].map((type) => (
                    <button 
                      key={type}
                      onClick={() => {
                        setFilter(type as MediaType);
                        setShowFilterDropdown(false);
                      }}
                      className={cn(
                        "w-full px-5 py-3 text-left font-bold text-sm transition-colors",
                        filter === type ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/5"
                      )}
                    >
                      {type === "all" ? "All Media" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button 
            onClick={selectAll}
            variant="outline" 
            className="h-12 px-6 rounded-xl gap-2 font-black border-slate-100 text-slate-600 hover:border-primary/30"
          >
            {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
            Select All
          </Button>

          <Button className="h-12 px-8 rounded-xl gap-2 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              className={cn(
                "bg-white rounded-[2.5rem] border transition-all duration-300 shadow-xl overflow-hidden group flex flex-col h-full relative cursor-pointer",
                selectedIds.includes(item.id) ? "border-primary ring-4 ring-primary/5 shadow-primary/10" : "border-slate-100 shadow-primary/5 hover:border-primary/30"
              )}
              onClick={() => toggleSelect(item.id)}
            >
              {/* Selection Indicator */}
              <div className={cn(
                "absolute top-5 left-5 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                selectedIds.includes(item.id) ? "bg-primary border-primary text-white" : "bg-white/80 backdrop-blur-md border-white/50 text-transparent"
              )}>
                <Check className="w-4 h-4 stroke-[3]" />
              </div>

              {/* Media Preview */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={item.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                
                {/* Overlay Badge */}
                <div className="absolute top-5 right-5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                  {item.type === "image" ? <ImageIcon className="w-3 h-3 text-white" /> : <VideoIcon className="w-3 h-3 text-white" />}
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.type}</span>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white relative z-10">
                <div>
                  <h3 className="text-[13px] font-black text-slate-900 truncate mb-1.5 uppercase tracking-tight">{item.name}</h3>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-5 uppercase tracking-widest">
                    <span>{item.size}</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    item.status === "uploaded" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {item.status}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/dashboard/post");
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
