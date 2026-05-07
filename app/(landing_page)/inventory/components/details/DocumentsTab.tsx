"use client";

import React from "react";
import { FileText, Download } from "lucide-react";

interface DocumentItem {
  title: string;
  type: string;
}

interface DocumentsTabProps {
  documents: DocumentItem[];
}

export default function DocumentsTab({ documents }: DocumentsTabProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-primary border-b border-primary/20 pb-2 inline-block">
        Documents
      </h3>
      
      <div className="space-y-4">
        {documents.map((doc, idx) => (
          <div 
            key={idx} 
            className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <FileText className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-medium text-white/90">{doc.title}</h4>
                <p className="text-xs text-white/20 uppercase tracking-widest font-bold">{doc.type}</p>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary/40 transition-all">
              <Download size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
