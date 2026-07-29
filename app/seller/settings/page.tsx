"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Shield,
  Camera,
  Mail,
  Phone,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/hooks/useAuth";
import { uploadMediaApi } from "@/lib/api/media";
import { toast } from "sonner";

const tabs = [
  { id: "profile", label: "Profile Info", icon: User },
  { id: "security", label: "Security", icon: Shield },
];

export default function SellerSettings() {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Synchronize form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(" ")[0] || "");
      setLastName(user.lastName || user.name?.split(" ").slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      if (user.avatarUrl || user.avatar) {
        setAvatarPreview(user.avatarUrl || user.avatar || "");
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Avatar image size must be smaller than 3MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedAvatarUrl = user?.avatarUrl || user?.avatar || "";

    if (selectedFile) {
      setIsUploadingAvatar(true);
      try {
        const uploadRes = await uploadMediaApi({
          file: selectedFile,
          folder: "exoticworld/avatars",
        });
        uploadedAvatarUrl = uploadRes.url;
      } catch (err: any) {
        console.error("Failed to upload avatar image:", err);
        toast.error("Failed to upload avatar. Updating profile without image change.");
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    updateProfileMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      avatarUrl: uploadedAvatarUrl,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  const isSavingProfile = updateProfileMutation.isPending || isUploadingAvatar;
  const isSavingPassword = changePasswordMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 px-4 md:px-0">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="mb-8">
          <h2 className="text-3xl md:text-[40px] font-clash font-medium tracking-tight text-white">
            Settings
          </h2>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Manage your personal profile and account security settings.
          </p>
        </div>
      </AnimationWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <AnimationWrapper type="fade-right" duration={0.6} delay={0.1}>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 lg:w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1C1C1E] border border-[#2C2C2E] text-primary2 shadow-lg"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#1C1C1E]/50 border border-transparent"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 ${
                    activeTab === tab.id
                      ? "text-primary2"
                      : "text-gray-500 group-hover:text-gray-400"
                  }`}
                />
                <span className="font-medium text-[15px] whitespace-nowrap">
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className="hidden lg:block ml-auto w-1 h-4 bg-primary2 rounded-full scale-y-125" />
                )}
              </button>
            ))}
          </div>
        </AnimationWrapper>

        {/* Content Area */}
        <AnimationWrapper
          key={activeTab}
          type="fade-up"
          duration={0.6}
          delay={0.1}
        >
          <div className="bg-[#1C1C1E] rounded-3xl border border-[#2C2C2E] overflow-hidden shadow-2xl relative">
            {/* Glow Effect */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary2/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="p-6 md:p-10">
              {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 font-clash">
                    <h3 className="text-2xl font-medium text-white">
                      Personal Information
                    </h3>
                    <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mt-4 w-full" />
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-10">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-2 border-[#2C2C2E] overflow-hidden bg-[#111113] flex items-center justify-center p-0.5 transition-transform duration-500 group-hover:rotate-3">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#2C2C2E] text-primary2 font-bold text-2xl">
                              {(firstName.charAt(0) || "S").toUpperCase()}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-1 right-1 p-2 bg-primary2 text-[#111113] rounded-full shadow-lg hover:scale-110 transition-transform sm:hidden cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center sm:items-start gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="px-5 py-2.5 border border-primary2/40 text-primary2 rounded-xl text-sm font-semibold hover:bg-primary2/10 transition-all active:scale-95 cursor-pointer"
                        >
                          Change Avatar
                        </button>
                        <p className="text-gray-500 text-xs tracking-wide">
                          JPG, GIF or PNG. 3MB max.
                        </p>
                      </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                      {/* First Name */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>

                      {/* Email (Read Only) */}
                      <div className="md:col-span-2 space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Email Address
                        </label>
                        <div className="relative group">
                          <input
                            type="email"
                            disabled
                            value={email}
                            placeholder="seller@example.com"
                            className="w-full bg-[#111113]/60 border border-[#2C2C2E] rounded-2xl px-5 py-4 text-gray-400 placeholder:text-gray-600 focus:outline-none cursor-not-allowed pl-14"
                          />
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="md:col-span-2 space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Phone Number
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-1234"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSavingProfile || isUserLoading}
                        className="flex items-center gap-2 px-12 py-4 bg-primary2 text-[#111113] rounded-2xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 hover:scale-[1.03] active:scale-95 group relative overflow-hidden disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingProfile && (
                          <Loader2 className="w-5 h-5 animate-spin text-[#111113]" />
                        )}
                        <span className="relative z-10">
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 font-clash">
                    <h3 className="text-2xl font-medium text-white">
                      Change Password
                    </h3>
                    <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mt-4 w-full" />
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-8 max-w-2xl">
                    <div className="space-y-6">
                      {/* Current Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="flex items-center gap-2 px-10 py-4 bg-primary2 text-[#111113] rounded-2xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 hover:scale-[1.03] active:scale-95 group relative overflow-hidden disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingPassword && (
                          <Loader2 className="w-5 h-5 animate-spin text-[#111113]" />
                        )}
                        <span className="relative z-10">
                          {isSavingPassword ? "Updating..." : "Update Password"}
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
}
