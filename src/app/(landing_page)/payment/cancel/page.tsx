"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  XCircle, 
  RefreshCw, 
  Home, 
  HelpCircle,
  AlertCircle
} from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="relative z-10 max-w-xl mx-auto px-4 py-16 sm:py-24">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative backdrop-blur-xl text-center"
      >
        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
        >
          <XCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        {/* Header Text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2 block"
        >
          Payment Cancelled
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3 tracking-tight"
        >
          Transaction Was Not Completed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed"
        >
          You have cancelled the checkout process. Don&apos;t worry — no funds were deducted from your payment method.
        </motion.p>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 mb-8 text-left space-y-2.5"
        >
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-white/70">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-white block mb-0.5">Need to try again?</span>
              <p className="text-white/50 text-xs leading-relaxed">
                {reason ? reason : "Your items or subscription request remain saved. You can restart the checkout process whenever you are ready."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/inventory"
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/10"
          >
            <RefreshCw className="w-4 h-4" />
            Try Payment Again
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-white/70" />
            Return Home
          </Link>
        </motion.div>

        {/* Support Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-xs text-white/40"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Encountering issues during payment?{" "}
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <section className="min-h-[85vh] bg-black flex items-center justify-center relative overflow-hidden py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center text-white/50 text-sm">
          Loading...
        </div>
      }>
        <PaymentCancelContent />
      </Suspense>
    </section>
  );
}
