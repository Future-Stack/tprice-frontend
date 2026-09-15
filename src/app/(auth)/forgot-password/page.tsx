"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { useForgotPasswordMutation } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useForgotPasswordMutation();
  const isLoading = forgotPasswordMutation.isPending;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    forgotPasswordMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          toast.success("Password reset email sent successfully!");
        },
        onError: (error: unknown) => {
          console.error("Forgot password request failed:", error);

          let errorMessage = "Failed to send password reset email. Please try again.";

          if (axios.isAxiosError(error) && error.response?.data) {
            const resData = error.response.data as { message?: string | string[]; error?: string };
            if (typeof resData.message === "string") {
              errorMessage = resData.message;
            } else if (Array.isArray(resData.message)) {
              errorMessage = resData.message.join(", ");
            } else if (resData.error) {
              errorMessage = resData.error;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Luxury Image & Text */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full min-h-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Right Side: Forgot Password Form / Success State */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md bg-[#111111] border border-[#D4AF37]/20 p-10 md:p-12 rounded-2xl shadow-2xl"
        >
          {!isSubmitted ? (
            <>
              <div className="mb-10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white text-xs font-bold uppercase tracking-[0.2em] mb-6 group transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to login
                </Link>
                <h4 className="text-[#D4AF37] text-[14px] font-bold  mb-4">
                  Reset Password
                </h4>
                <h2 className="text-4xl font-cormorant text-white mb-2">
                  Forgot Password
                </h2>
                <p className="text-white/40 text-sm">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your email address here"
                    disabled={isLoading}
                    className={`w-full bg-[#1A1A1A] border rounded-lg px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                      error
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-white/5 focus:border-[#D4AF37]/50"
                    }`}
                  />
                  {error && (
                    <p className="text-red-400 text-xs mt-1 font-medium font-sans">
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer bg-[#D4AF37] text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37]">
                  <Mail className="w-8 h-8" />
                </div>
              </div>

              <h2 className="text-3xl font-serif text-white mb-4">
                Check your email
              </h2>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                We have sent a password reset link to{" "}
                <strong className="text-white font-medium">{email}</strong>.
                Please check your inbox and follow the instructions to reset
                your password.
              </p>

              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] text-sm uppercase tracking-wider"
                >
                  Back to login
                </Link>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full text-xs text-white/40 hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-bold pt-2"
                >
                  Resend Email
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
