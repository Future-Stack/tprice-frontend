"use client";

import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  X,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Tag,
  FileText,
  Edit3,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Trash2,
  Activity,
} from "lucide-react";
import { useUpdateEventMutation } from "@/hooks/useEvents";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { EventItem } from "@/lib/api/events";
import { toast } from "sonner";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
}

const CATEGORIES = [
  { label: "Yacht", value: "YACHT" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Aviation", value: "AVIATION" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Watches", value: "WATCH" },
  { label: "Other", value: "OTHER" },
];

const STATUSES = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
  const updateEventMutation = useUpdateEventMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categoriesList = categoriesResponse?.data || [];

  const displayCategories = React.useMemo(() => {
    if (!categoriesList || categoriesList.length === 0) {
      return CATEGORIES;
    }

    return categoriesList.map((cat) => {
      let val = cat.slug ? cat.slug.toUpperCase().replace(/-/g, "_") : cat.name.toUpperCase();
      if (val === "SUPERCARS") val = "AUTOMOTIVE";
      if (val === "PRIVATE_JETS") val = "AVIATION";
      if (val === "YACHTS") val = "YACHT";
      if (val === "WATCHES") val = "WATCH";

      return {
        label: cat.name,
        value: val,
      };
    });
  }, [categoriesList]);

  const [formData, setFormData] = useState({
    title: "",
    category: "YACHT",
    description: "",
    location: "",
    coverImageUrl: "",
    status: "UPCOMING",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        category: event.category || "YACHT",
        description: event.description || "",
        location: event.location || "",
        coverImageUrl: event.coverImageUrl || "",
        status: event.status || "UPCOMING",
      });
      setSelectedDate(event.eventDate ? new Date(event.eventDate) : null);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB");
      return;
    }

    try {
      const res = await uploadMediaMutation.mutateAsync({
        file,
        folder: "exoticworld/listings",
      });

      if (res?.url) {
        setFormData((prev) => ({ ...prev, coverImageUrl: res.url }));
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to upload image";
      toast.error(errMsg);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !selectedDate || !formData.location.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (uploadMediaMutation.isPending) {
      toast.error("Please wait until image upload finishes.");
      return;
    }

    try {
      const isoDate = selectedDate.toISOString();

      await updateEventMutation.mutateAsync({
        id: event.id,
        data: {
          title: formData.title.trim(),
          category: formData.category,
          description: formData.description.trim(),
          eventDate: isoDate,
          location: formData.location.trim(),
          coverImageUrl: formData.coverImageUrl.trim() || undefined,
          status: formData.status,
        },
      });

      toast.success("Event updated successfully!");
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to update event";
      toast.error(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#18181A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-clash">Edit Event</h2>
              <p className="text-xs text-gray-400">Update the details of this platform event</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Event Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Monaco Yacht Show 2026 VIP Preview"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Category <span className="text-primary">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                {displayCategories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-[#141416] text-white">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" /> Status <span className="text-primary">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                {STATUSES.map((st) => (
                  <option key={st.value} value={st.value} className="bg-[#141416] text-white">
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Event Date & Time <span className="text-primary">*</span>
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
                wrapperClassName="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Location <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Port Hercules, Monaco"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
                required
              />
            </div>
          </div>

          {/* Cover Image Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" /> Cover Image
              </label>

              <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#262626] p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setInputMode("upload")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    inputMode === "upload"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("url")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    inputMode === "url"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {inputMode === "upload" ? (
              <div className="space-y-3">
                {formData.coverImageUrl ? (
                  /* Preview uploaded image */
                  <div className="relative group rounded-xl border border-primary/30 overflow-hidden bg-[#0E0E10] p-2 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#262626] shrink-0 bg-[#1A1A1A]">
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/landing/hero-car.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded & Saved
                      </div>
                      <p className="text-[11px] text-gray-400 truncate max-w-full font-mono">
                        {formData.coverImageUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer mr-2 shrink-0"
                      title="Remove cover image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Dropzone area */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-[#262626] hover:border-primary/50 bg-[#0E0E10] hover:bg-[#121215]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadMediaMutation.isPending ? (
                      <div className="flex flex-col items-center justify-center py-3 space-y-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-xs font-medium text-primary">Uploading image to cloud...</p>
                        <p className="text-[10px] text-gray-500">Please wait a moment</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Click to upload or drag & drop cover image
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            PNG, JPG, WEBP or GIF (Max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* URL Input Mode */
              <div className="relative">
                <input
                  type="url"
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/... or https://..."
                  className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
                />
                {formData.coverImageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-[#262626] bg-[#0E0E10]">
                    <img
                      src={formData.coverImageUrl}
                      alt="URL Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/landing/hero-car.png";
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Description <span className="text-primary">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide event overview and details..."
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#262626] text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateEventMutation.isPending || uploadMediaMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateEventMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Updating...
                </>
              ) : uploadMediaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
