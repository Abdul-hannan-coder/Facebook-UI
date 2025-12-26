"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Copy, 
  Video, 
  Check, 
  Globe, 
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send as SendIcon,
  Sparkles,
  Database,
  Upload,
  Type,
  MoreHorizontal,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type PostType = "text" | "image" | "carousel" | "video" | "story_image" | "story_video";
type Visibility = "public" | "connections";

export default function ScheduledPage() {
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const postTypes = [
    { id: "text", title: "Text", sub: "Post text only", icon: Type },
    { id: "image", title: "Photo", sub: "Post a photo", icon: ImageIcon },
    { id: "video", title: "Video", sub: "Post a video", icon: Video },
    { id: "carousel", title: "Carousel", sub: "Post 2-10 images", icon: Copy },
    { id: "story_image", title: "Story (Image)", sub: "Create an image story", icon: Sparkles },
    { id: "story_video", title: "Story (Video)", sub: "Create a video story", icon: Sparkles },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file));
      
      if (postType === "carousel") {
        setPreviewUrls(prev => [...prev, ...newUrls].slice(0, 20));
      } else {
        setPreviewUrls(newUrls.slice(0, 1));
      }
    }
  };

  const removeFile = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const timeSlots = [
    { time: "9:00 AM", status: "empty" },
    { time: "12:00 PM", status: "empty" },
    { time: "3:00 PM", status: "empty" },
    { time: "6:00 PM", status: "empty" },
    { time: "9:00 PM", status: "string" },
    { time: "Custom Time", status: "empty" },
  ];

  const days = [
    { day: "Tuesday, November 4", slots: timeSlots },
    { day: "Thursday, November 6", slots: timeSlots },
  ];

  return (
    <div className="p-4 md:p-10 min-h-screen pb-20">
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          background: white;
          font-family: inherit;
          border-radius: 1.5rem;
          padding: 1rem;
        }
        .react-calendar__tile--active {
          background: #1877F2 !important;
          border-radius: 0.75rem;
        }
        .react-calendar__tile--now {
          background: #1877F2/10;
          border-radius: 0.75rem;
          color: #1877F2;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f8fafc;
          border-radius: 0.75rem;
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Scheduled Posts</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold">Manage your scheduled Facebook posts</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Button>
      </div>

      <div className="space-y-12">
        {/* Your Scheduled Posts Empty State */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ml-1 flex items-center gap-2">
            Your Scheduled Posts
          </h3>
          <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-primary/5 border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No scheduled or failed posts found</h3>
            <p className="text-slate-400 font-bold text-sm">Schedule a post to see it here</p>
          </div>
        </section>

        {/* Schedule New Post Section */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 ml-1">Schedule New Post</h3>
          
          <div className="space-y-12">
            {days.map((day, dIdx) => (
              <div key={dIdx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-black text-slate-900">{day.day}</h4>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {day.slots.map((slot, sIdx) => (
                    <div 
                      key={sIdx}
                      className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {slot.time.split(' ')[0]}
                        </div>
                        <span className="font-bold text-slate-600 uppercase text-xs tracking-widest">{slot.time}</span>
                      </div>
                      
                      <button 
                        onClick={() => setShowModal(true)}
                        className={cn(
                          "h-10 px-5 rounded-lg border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                          slot.status === "string" 
                            ? "bg-slate-100 border-slate-200 text-slate-400" 
                            : "bg-white border-slate-100 text-primary hover:border-primary hover:bg-primary/5"
                        )}
                      >
                        {slot.status === "string" ? "Active" : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            New
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModal(false);
                setShowCalendar(false);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white z-20">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Facebook Post</h2>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    setShowCalendar(false);
                  }}
                  className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10 items-start">
                  <div className="space-y-10">
                    {/* Post Type Selector - EXACT SAME AS POST PAGE */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">Select Post Type</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {postTypes.map((type) => {
                          const isActive = postType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => {
                                setPostType(type.id as PostType);
                                setPreviewUrls([]);
                              }}
                              className={cn(
                                "flex flex-col items-center justify-center gap-2 p-6 rounded-3xl border-2 transition-all duration-300 text-center relative overflow-hidden group min-h-[140px]",
                                isActive 
                                  ? "bg-primary/5 border-primary shadow-sm" 
                                  : "bg-white border-slate-100 hover:border-primary/20"
                              )}
                            >
                              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                                <div className={cn(
                                  "transition-colors",
                                  isActive ? "text-primary" : "text-slate-400"
                                )}>
                                  <type.icon className="w-6 h-6" />
                                </div>
                                {isActive && (
                                  <div className="w-4 h-4 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-primary stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className={cn("font-black text-base", isActive ? "text-primary" : "text-slate-900")}>{type.title}</h4>
                                <p className="text-xs font-bold text-slate-400 tracking-tight">{type.sub}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    {/* Post Content - Hidden for Stories */}
                    {!postType.startsWith("story_") && (
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {postType === "text" ? "Post Content" : "Caption"}
                        </h3>
                              <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl shadow-primary/5 border border-slate-100">
                                <Textarea 
                                  placeholder={postType === "text" ? "What do you want to share?" : "Add a caption for your post..."}
                                  value={content}
                                  onChange={(e) => setContent(e.target.value)}
                                  className="min-h-[180px] text-lg border-none focus-visible:ring-0 p-2 md:p-4 resize-none"
                                />
                          <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                            <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{content.length}/3000 characters</span>
                            <Button variant="ghost" className="text-primary gap-1.5 font-bold rounded-xl h-9 text-xs px-4">
                              <Sparkles className="w-3.5 h-3.5" />
                              AI Assist
                            </Button>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Media Upload */}
                    {(postType !== "text") && (
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Media Upload</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button className="flex items-center gap-4 h-32 px-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 font-bold hover:border-primary/50 hover:bg-primary/5 transition-all group">
                             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                              <Database className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                             </div>
                             <div className="text-left">
                              <p className="font-black text-slate-900 text-sm">Storage</p>
                              <p className="text-[10px] text-slate-400">Select from media</p>
                             </div>
                          </button>
                          
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative h-32 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white flex items-center px-6 gap-4 group hover:border-primary transition-all overflow-hidden cursor-pointer"
                          >
                            <input 
                              ref={fileInputRef}
                              type="file" 
                              className="hidden"
                              onChange={handleFileChange}
                              multiple={postType === "carousel"}
                              accept={postType.includes("video") ? "video/*" : "image/*"}
                            />
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="font-black text-slate-900 text-sm">Click to upload</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{postType.includes('video') ? 'MP4 / WEBM' : 'JPG, PNG, GIF'}</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      {/* Visibility */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visibility</h3>
                        <div className="relative group">
                          <select 
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as Visibility)}
                            className="w-full h-14 bg-white rounded-2xl border-2 border-slate-100 px-6 text-sm font-bold text-slate-900 outline-none appearance-none focus:border-primary transition-all cursor-pointer shadow-sm"
                          >
                            <option value="public">Public - Anyone on Facebook</option>
                            <option value="connections">Friends - Only your friends</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                            <MoreHorizontal className="w-5 h-5 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </section>

                      {/* Scheduled Time - WITH CALENDAR TRIGGER */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          Scheduled Time
                        </h3>
                        <div className="relative">
                          <button 
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="w-full h-14 bg-white rounded-2xl border-2 border-slate-100 px-6 flex items-center justify-between font-bold text-sm text-slate-900 hover:border-primary transition-all shadow-sm"
                          >
                            <span>{scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <CalendarIcon className="w-5 h-5 text-primary" />
                          </button>
                          
                          <AnimatePresence>
                            {showCalendar && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full mb-4 left-0 right-0 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 overflow-hidden"
                              >
                                <Calendar 
                                  onChange={(val) => {
                                    setScheduledDate(val as Date);
                                    setShowCalendar(false);
                                  }} 
                                  value={scheduledDate}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Preview Side - EXACT SAME AS POST PAGE */}
                  <div className="w-full">
                    <div className="xl:sticky xl:top-0 space-y-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Live Preview</h3>
                      <div className={cn(
                        "bg-white border border-slate-100 shadow-2xl overflow-hidden transition-all duration-500",
                        postType.startsWith("story_") ? "rounded-3xl" : "rounded-[2rem]"
                      )}>
                         {/* Facebook Post Header - Hidden for Stories */}
                         {!postType.startsWith("story_") && (
                           <div className="p-4 flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">MU</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-black text-slate-900 text-sm">Muhammad Uzair Yasin</span>
                                  <span className="text-slate-400 text-xs font-medium">• Just now</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-400">
                                  {visibility === "public" ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                  <span className="text-[10px] font-bold uppercase tracking-wider">{visibility === "public" ? "Public" : "Friends"}</span>
                                </div>
                              </div>
                              <MoreHorizontal className="w-5 h-5 text-slate-400" />
                           </div>
                         )}

                         {/* Post Content - Hidden for Stories */}
                         {!postType.startsWith("story_") && (
                           <div className="px-4 pb-4">
                             <p className={cn(
                               "text-slate-900 text-sm leading-relaxed break-words whitespace-pre-wrap min-h-[4rem]",
                               content ? "" : "text-slate-300 italic"
                             )}>
                               {content || "Start typing to see preview..."}
                             </p>
                           </div>
                         )}

                         {/* Media Previews */}
                         <AnimatePresence>
                           {previewUrls.length > 0 ? (
                             <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="relative"
                             >
                               {postType.includes("video") ? (
                                 <div className={cn(
                                   "bg-black flex items-center justify-center relative",
                                   postType === "story_video" ? "aspect-[9/16]" : "aspect-video"
                                 )}>
                                    <video 
                                      src={previewUrls[0]} 
                                      className="w-full h-full object-contain" 
                                      controls 
                                    />
                                 </div>
                               ) : postType === "carousel" ? (
                                 <div className={cn(
                                   "grid gap-1 bg-slate-100 px-4",
                                   previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                                 )}>
                                    {previewUrls.slice(0, 4).map((url, i) => (
                                      <div key={i} className="aspect-square relative overflow-hidden group first:rounded-tl-xl last:rounded-br-xl even:rounded-tr-xl odd:rounded-bl-xl">
                                        <Image src={url} alt="" fill className="object-cover rounded-lg" />
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(i);
                                          }}
                                          className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                 </div>
                               ) : (
                                 <div className={cn(
                                   "relative bg-slate-50 group border-y border-slate-100",
                                   postType === "story_image" ? "aspect-[9/16]" : "aspect-video"
                                 )}>
                                   <Image src={previewUrls[0]} alt="" fill className="object-cover" />
                                   <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewUrls([]);
                                      }}
                                      className="absolute top-4 right-4 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                 </div>
                               )}
                             </motion.div>
                           ) : postType.startsWith("story_") && (
                             <div className="aspect-[9/16] bg-slate-50 flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                               <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                               <p className="text-sm font-bold uppercase tracking-widest">Story Preview</p>
                               <p className="text-[10px] mt-2 font-medium">Upload media to see preview</p>
                             </div>
                           )}
                         </AnimatePresence>

                         {/* Interaction Buttons - Hidden for Stories */}
                         {!postType.startsWith("story_") && (
                           <div className="px-2 py-1 border-t border-slate-50 flex items-center justify-between">
                              {[{icon: ThumbsUp, label: "Like"}, {icon: MessageSquare, label: "Comment"}, {icon: Repeat2, label: "Repost"}, {icon: SendIcon, label: "Send"}].map((btn, i) => (
                                <button key={i} className="flex flex-1 items-center justify-center gap-2 p-3 text-slate-500 font-bold text-[11px] hover:bg-slate-50 rounded-xl transition-colors">
                                  <btn.icon className="w-4 h-4" />
                                  {btn.label}
                                </button>
                              ))}
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-white z-20">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowModal(false);
                    setShowCalendar(false);
                  }}
                  className="h-12 px-8 rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button className="h-12 px-10 rounded-xl font-black gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                  <CalendarIcon className="w-4 h-4" />
                  Schedule Post
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
