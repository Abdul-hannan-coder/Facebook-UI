"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";

export default function ContactUs() {
  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Side: Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-black text-slate-900 mb-6">
                  Get in <span className="text-[#1877F2]">Touch</span>
                </h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  Ready to amplify your Facebook presence? Our team is here to help you get started with Postsiva. Reach out for a custom demo or support.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center text-[#1877F2]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Email Us</div>
                      <div className="text-slate-600 font-medium">hello@postsiva.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center text-[#1877F2]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Live Chat</div>
                      <div className="text-slate-600 font-medium">Available Mon-Fri, 9am-6pm EST</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center text-[#1877F2]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Call Us</div>
                      <div className="text-slate-600 font-medium">+1 (555) 000-0000</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-[#1877F2]/10 border border-slate-100">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 ml-1">First Name</label>
                      <Input placeholder="John" className="h-14 rounded-xl px-4 border-slate-200 focus:border-[#1877F2] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 ml-1">Last Name</label>
                      <Input placeholder="Doe" className="h-14 rounded-xl px-4 border-slate-200 focus:border-[#1877F2] transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 ml-1">Email Address</label>
                    <Input type="email" placeholder="john@company.com" className="h-14 rounded-xl px-4 border-slate-200 focus:border-[#1877F2] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 ml-1">Message</label>
                    <Textarea placeholder="How can we help you grow?" className="min-h-[150px] rounded-xl px-4 py-4 border-slate-200 focus:border-[#1877F2] transition-colors resize-none" />
                  </div>
                  <Button className="w-full h-16 text-lg font-bold rounded-2xl group relative overflow-hidden bg-[#1877F2] hover:bg-[#1877F2]/90">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

