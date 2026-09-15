"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Home, 
  ShoppingBag, 
  Receipt,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const sessionId = searchParams.get("session_id") || searchParams.get("reference") || searchParams.get("tx_ref");
  const amount = searchParams.get("amount");
  
  const referenceId = sessionId 
    ? (sessionId.length > 22 ? `${sessionId.slice(0, 18)}...` : sessionId) 
    : `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId || referenceId);
    setCopied(true);
    toast.success("Transaction ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-10 max-w-xl mx-auto px-4 py-16 sm:py-24">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        {/* Header Text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-2 block"
        >
          Payment Confirmed
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3 tracking-tight"
        >
          Thank You For Your Order!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed"
        >
          Your transaction has completed successfully. A confirmation email with details has been sent to your inbox.
        </motion.p>

        {/* Transaction Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 mb-8 text-left space-y-3"
        >
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-white/40 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-primary" />
              Transaction Ref
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white/80 text-xs sm:text-sm">{referenceId}</span>
              <button
                onClick={handleCopy}
                className="text-white/40 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                title="Copy Reference"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {amount && (
            <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-white/[0.06]">
              <span className="text-white/40">Amount Paid</span>
              <span className="font-semibold text-white text-base">${Number(amount).toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-white/[0.06]">
            <span className="text-white/40">Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Completed
            </span>
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
            <ShoppingBag className="w-4 h-4" />
            Continue Browsing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-white/70" />
            Home
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
          Have questions about your order?{" "}
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <section className="min-h-[85vh] bg-black flex items-center justify-center relative overflow-hidden py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center text-white/50 text-sm">
          Loading payment confirmation...
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </section>
  );
}
