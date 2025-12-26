import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Post<span className="text-primary">siva</span>
              </span>
            </Link>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Automate and amplify your digital voice with the world&apos;s most advanced Facebook automation platform.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100">
                <Instagram className="w-4 h-4" />
              </Link>
                    <Link href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100">
                      <Youtube className="w-4 h-4" />
                    </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/features" className="text-slate-500 hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#integrations" className="text-slate-500 hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/#pricing" className="text-slate-500 hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/#security" className="text-slate-500 hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-500 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/#careers" className="text-slate-500 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/#contact" className="text-slate-500 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-500 hover:text-[#1877F2] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-[#1877F2] transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-[#1877F2] transition-colors">Guides</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-[#1877F2] transition-colors">Support</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-[#1877F2] transition-colors">Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © 2025 Postsiva Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Terms of Service</Link>
            <Link href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

