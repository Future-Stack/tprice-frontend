"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";

import { registerApi, handleGoogleLogin } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const res = await registerApi(payload);

      if (res?.accessToken) {
        const fullUser = {
          ...res.user,
          firstName: payload.firstName,
          lastName: payload.lastName,
          name: `${payload.firstName} ${payload.lastName}`,
        };

        useAuthStore.getState().setAuth(fullUser, res.accessToken, res.refreshToken);
      }

      toast.success("Registration successful! Welcome to Exoticworld.");
      router.push("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(error) && error.response?.data) {
        const resData = error.response.data;
        if (typeof resData.message === "string") {
          errorMessage = resData.message;
        } else if (Array.isArray(resData.message)) {
          errorMessage = resData.message.join(", ");
        } else if (resData.error) {
          errorMessage = resData.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg bg-[#111111] border border-[#D4AF37]/20 p-8 md:p-10 rounded-2xl shadow-2xl"
        >
          <div className="mb-8">
            <h4 className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Register
            </h4>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
              Join Exoticworld
            </h2>
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D4AF37] hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Sophia"
                  disabled={isLoading}
                  autoComplete="off"
                  className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                    errors.firstName
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/5 focus:border-[#D4AF37]/50"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1 font-medium">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Vance"
                  disabled={isLoading}
                  autoComplete="off"
                  className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                    errors.lastName
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/5 focus:border-[#D4AF37]/50"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1 font-medium">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="buyer@gmail.com"
                disabled={isLoading}
                autoComplete="off"
                className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-white/5 focus:border-[#D4AF37]/50"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                  className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all font-mono ${
                    errors.password
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/5 focus:border-[#D4AF37]/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                  className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all font-mono ${
                    errors.confirmPassword
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-white/5 focus:border-[#D4AF37]/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-4 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-[#D4AF37] text-black font-bold py-3.5 rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full cursor-pointer border border-white/10 bg-transparent py-3 rounded-lg flex items-center justify-center gap-3 text-white/80 text-sm font-medium hover:bg-white/5 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
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
