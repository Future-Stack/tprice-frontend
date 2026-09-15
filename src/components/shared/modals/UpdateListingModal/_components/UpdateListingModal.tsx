"use client";

import React, { useEffect } from "react";
import { UpdateListingModalProps } from "./types";
import UpdateListingForm from "./UpdateListingForm";

export default function UpdateListingModal({
  isOpen,
  onClose,
  listing,
}: UpdateListingModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <UpdateListingForm
        key={listing.id}
        listing={listing}
        onClose={onClose}
      />
    </div>
  );
}
