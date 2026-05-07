"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How do I become a VIP Buyer",
    answer: "To become a VIP buyer, you need to apply through our verification process. Once approved, you gain access to exclusive assets, dedicated account support, and early access to new listings."
  },
  {
    question: "How do I list my assets for sale",
    answer: "Listing your assets is simple. Submit your asset details for valuation and vetting. Our experts will verify the provenance and authenticity before the listing goes live to our elite network."
  },
  {
    question: "What is the verification process like",
    answer: "We perform a rigorous 15-point check on every asset, including background checks on ownership history, physical inspection, and documentation verification to ensure maximum trust."
  },
  {
    question: "Are transactions secure and private",
    answer: "Absolutely. We use end-to-end encrypted communications and secure escrow services for all high-value transactions, ensuring complete privacy and security for both parties."
  },
  {
    question: "Do you offer international shipping and logistics",
    answer: "Yes, we have specialized logistics partners who handle global transportation for cars, yachts, and jets, including temporary storage and customs clearance."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-black px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase"
          >
            COMMON QUESTIONS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-white italic"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`border-b border-white/10 overflow-hidden transition-all duration-500 ${
                openIndex === i ? "bg-primary/5 rounded-t-sm" : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors group"
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === i ? "text-primary" : "text-white/80"}`}>
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-500 ${
                    openIndex === i ? "rotate-180 text-primary" : "text-white/20"
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-8 text-white/50 text-base leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
