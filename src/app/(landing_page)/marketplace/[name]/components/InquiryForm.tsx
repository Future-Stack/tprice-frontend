"use client";

import React from "react";
import { ServiceItem } from "../../data";

interface InquiryFormProps {
  item: ServiceItem;
}

export default function InquiryForm({ item }: InquiryFormProps) {
  return (
    <div id="inquiry-form" className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 mb-16">
      <h2 className="text-2xl text-primary font-medium mb-2">Send An Inquiry</h2>
      <p className="text-white/40 text-sm mb-8">
        Reach out directly to {item.name.split(' ')[0]} for a confidential consultation.
      </p>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-white/30 text-xs pl-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Miller"
              className="w-full bg-transparent border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-white/30 text-xs pl-1">Email</label>
            <input 
              type="email" 
              placeholder="john334@gmail.com"
              className="w-full bg-transparent border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-2">
           <label className="text-white/30 text-xs pl-1">Inquiry</label>
           <textarea 
             rows={4}
             placeholder="Inquiry..."
             className="w-full bg-transparent border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-primary/50 outline-none transition-colors resize-none"
           />
        </div>
        
        <button type="button" className="w-full md:w-[350px] bg-primary hover:bg-primary/90 text-[#111] font-semibold py-4 px-8 rounded-sm transition-colors text-sm flex mx-auto justify-center mt-8">
          Send Inquiry
        </button>
      </form>
    </div>
  );
}
