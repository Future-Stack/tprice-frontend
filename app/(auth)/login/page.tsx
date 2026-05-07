"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LayoutPanelLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Luxury Image & Text */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full min-h-screen">
        <img
          src="/images/landing/hero-villa.png"
          alt="Luxury Gateway"
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col justify-center px-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-wider uppercase font-serif"
          >
            Your Gateway to <br />
            Rare Experiences <br />
            And Timeless Luxury <br />
            Begins Here.
          </motion.h1>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md bg-[#111111] border border-[#D4AF37]/20 p-10 md:p-12 rounded-2xl shadow-2xl"
        >
          <div className="mb-10">
            <h4 className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-4">Log In</h4>
            <h2 className="text-4xl font-serif text-white mb-2">Welcome back</h2>
            <p className="text-white/40 text-sm">
              Don't have an account? <Link href="/register" className="text-[#D4AF37] hover:underline">create one</Link>
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="your email address here"
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-[#D4AF37] focus:ring-0 cursor-pointer" />
                <span className="text-xs text-white/40 group-hover:text-white transition-colors">Remember Me</span>
              </label>
              <Link href="#" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">Forgot Password?</Link>
            </div>

            <div className="space-y-4 pt-4">
              <button className="w-full cursor-pointer bg-[#D4AF37] text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                Login
              </button>
              
              <button type="button" className="w-full cursor-pointer border border-white/10 bg-transparent py-4 rounded-lg flex items-center justify-center gap-3 text-white/80 text-sm font-medium hover:bg-white/5 transition-all">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue With Google
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
