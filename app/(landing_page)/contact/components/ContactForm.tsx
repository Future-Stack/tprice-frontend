"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useContactInquiryMutation } from "@/hooks/useContact";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { mutate: submitInquiry, isPending } = useContactInquiryMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    submitInquiry(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        });
        setIsSuccessModalOpen(true);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send your message. Please try again.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-[#1A1A1A] p-6 md:p-10 rounded-sm border border-white/5 shadow-2xl h-full flex flex-col justify-between"
      >
        <div className="flex flex-col h-full space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-serif text-white mb-1">
              Send a Message
            </h2>
            <p className="text-white/40 text-[12px]">
              All inquiries are handled with complete confidentiality.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isPending}
                placeholder="John Smith"
                className="w-full bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                placeholder="john@example.com"
                className="w-full bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isPending}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Message
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isPending}
                placeholder="Tell us how we can help you..."
                className="w-full flex-1 bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-black font-bold py-4 mt-auto uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 rounded-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Clean Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-sm p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success Badge Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              {/* Text Details */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif text-white tracking-wide">
                  Inquiry Sent Successfully!
                </h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                  Thank you for reaching out. We have received your message and our team will get back to you as soon as possible.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-primary text-black font-bold py-3.5 uppercase tracking-[0.15em] hover:bg-white transition-all duration-300 rounded-sm text-xs sm:text-sm"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
