"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { useResetPasswordMutation } from "@/hooks/useAuth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordMutation = useResetPasswordMutation();
  const isLoading = resetPasswordMutation.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!token) {
      newErrors.token = "No reset token found in URL. Please request a new link.";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError =
        errors.token ||
        errors.newPassword ||
        errors.confirmNewPassword ||
        "Please fix the validation errors before submitting.";
      toast.error(firstError);
      return;
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset successfully!");
        },
        onError: (error: unknown) => {
          console.error("Password reset failed:", error);

          let errorMessage = "Failed to reset password. The link may be expired or invalid.";

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

  // If token is missing, show an alert state
  if (!token && !isSuccess) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl font-serif text-white mb-4">
          Invalid Reset Link
        </h2>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          The password reset token is missing from the URL. Please make sure you clicked the full link from the email or try requesting a new password reset.
        </p>

        <div className="space-y-4">
          <Link
            href="/forgot-password"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] text-sm uppercase tracking-wider"
          >
            Forgot Password
          </Link>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-white/10 text-white font-bold py-4 rounded-lg hover:bg-white/5 transition-all duration-300 text-sm uppercase tracking-wider"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isSuccess ? (
        <>
          <div className="mb-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white text-xs font-bold uppercase tracking-[0.2em] mb-6 group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to login
            </Link>
            <h4 className="text-[#D4AF37] text-[14px] font-bold mb-4">
              Reset Password
            </h4>
            <h2 className="text-4xl font-cormorant text-white mb-2">
              Create New Password
            </h2>
            <p className="text-white/40 text-sm">
              Please enter and confirm your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="enter new password"
                  disabled={isLoading}
                  className={`w-full bg-[#1A1A1A] border rounded-lg pl-5 pr-12 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                    errors.newPassword
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/5 focus:border-[#D4AF37]/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1 font-medium font-sans">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="confirm new password"
                  disabled={isLoading}
                  className={`w-full bg-[#1A1A1A] border rounded-lg pl-5 pr-12 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                    errors.confirmNewPassword
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/5 focus:border-[#D4AF37]/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-400 text-xs mt-1 font-medium font-sans">
                  {errors.confirmNewPassword}
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
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
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
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl font-serif text-white mb-4">
            Password Updated
          </h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Your password has been successfully reset. You can now use your new password to sign in.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] text-sm uppercase tracking-wider"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
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

      {/* Right Side: Reset Password Form / Success State */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md bg-[#111111] border border-[#D4AF37]/20 p-10 md:p-12 rounded-2xl shadow-2xl"
        >
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-white/50 text-sm">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
              <span>Loading page content...</span>
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
