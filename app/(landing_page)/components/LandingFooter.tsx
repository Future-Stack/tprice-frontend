"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";

const COMPANY_LINKS = [
  { name: "About Us", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Services", href: "#" },
  { name: "FAQs", href: "#" },
  { name: "Contact Us", href: "#" },
];

const QUICK_LINKS = [
  { name: "Categories", href: "#" },
  { name: "Help Center", href: "#" },
  { name: "Live chat", href: "#" },
  { name: "How it works", href: "#" },
];

const SOCIAL_SVGS = [
  // Instagram
  <svg key="ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  // Facebook
  <svg key="fb" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  // Youtube
  <svg key="yt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>,
  // X (Twitter)
  <svg key="x" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
];

export default function LandingFooter() {
  return (
    <footer className="bg-[#050505] text-white pt-24 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-primary">
                Exotic<span className="text-white">World</span>
              </span>
            </Link>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-[280px]">
              The World's most exclusive marketplace for extraordinary assests by invitation only
            </p>
            <div className="flex gap-4">
              {SOCIAL_SVGS.map((svg, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-all duration-300"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 text-primary">COMAPNY</h4>
            <ul className="space-y-4">
              {COMPANY_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 text-[13px] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 text-primary">QUICK LINKS</h4>
            <ul className="space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 text-[13px] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscription Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 text-primary">STAY UPDATED</h4>
            <p className="text-white/40 text-[13px] mb-6">
              Receive updates offers, & exclusive listings
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Email"
                className="w-full bg-[#111] border border-white/5 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="w-full cursor-pointer bg-primary text-black font-bold text-sm py-3 rounded-sm hover:bg-white transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/20 font-medium uppercase tracking-widest">
          <p>© 2024 SkillNest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Terms & conditions</Link>
            <div className="w-px h-3 bg-white/10" />
            <Link href="#" className="hover:text-white transition-colors">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

