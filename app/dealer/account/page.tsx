"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Shield,
  Bell,
  Camera,
  Mail,
  Phone,
  CheckCircle2,
  Crown,
  Loader2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/hooks/useAuth";
import { uploadMediaApi } from "@/lib/api/media";
import { toast } from "sonner";

const tabs = [
  { id: "profile", label: "Profile Info", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function DealerAccount() {
  const { data: user, isLoading: isUserLoading, isError, refetch } = useGetMeQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Synchronize form fields when API data is received
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(" ")[0] || "");
      setLastName(user.lastName || user.name?.split(" ").slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatarPreview(user.avatarUrl || user.avatar || "");
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
        toast.error("Failed to upload avatar image. Updating profile without changing image.");
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    updateProfileMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || null,
      avatarUrl: uploadedAvatarUrl || null,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
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
  const isVipUser = Boolean(user?.vipStatus || user?.isVip);

  return (
    <div className="max-w-6xl space-y-8 pb-10 px-4 md:px-0">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-[40px] font-clash font-medium tracking-tight text-white">
                Account Settings
              </h2>
              {isVipUser && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-[#E78F23] rounded-full text-xs font-semibold shadow-sm">
                  <Crown className="w-3.5 h-3.5 fill-[#E78F23]" />
                  VIP Member
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-2 text-base md:text-lg">
              Manage your profile preferences, verification status, and security.
            </p>
          </div>

          {isError && (
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Sync
            </button>
          )}
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
                className={`shrink-0 lg:w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id
                  ? "bg-[#1C1C1E] border border-[#2C2C2E] text-primary2 shadow-lg"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#1C1C1E]/50 border border-transparent"
                  }`}
              >
                <tab.icon
                  className={`w-5 h-5 ${activeTab === tab.id ? "text-primary2" : "text-gray-500 group-hover:text-gray-400"
                    }`}
                />
                <span className="font-medium text-[15px] whitespace-nowrap">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="hidden lg:block ml-auto w-1 h-4 bg-primary2 rounded-full scale-y-125" />
                )}
              </button>
            ))}
          </div>
        </AnimationWrapper>

        {/* Content Area */}
        <AnimationWrapper key={activeTab} type="fade-up" duration={0.6} delay={0.1}>
          <div className="bg-[#1C1C1E] rounded-3xl border border-[#2C2C2E] overflow-hidden shadow-2xl relative">
            {/* Ambient Background Glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary2/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="p-6 md:p-10">
              {/* Profile Info Tab */}
              {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-8 font-clash">
                    <div>
                      <h3 className="text-2xl font-medium text-white">Personal Information</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Update your identity details and contact information.
                      </p>
                    </div>

                    {user && (
                      <div className="flex items-center gap-2">
                        {user.isVerified ? (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                        <span className="px-3 py-1 bg-[#111113] border border-[#2C2C2E] text-gray-300 rounded-full text-xs font-semibold uppercase">
                          {user.role || "DEALER"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mb-8 w-full" />

                  {isUserLoading ? (
                    /* Skeleton Loading State */
                    <div className="space-y-10 animate-pulse">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[#2C2C2E]/60" />
                        <div className="space-y-2">
                          <div className="w-32 h-9 rounded-xl bg-[#2C2C2E]/60" />
                          <div className="w-40 h-4 rounded bg-[#2C2C2E]/40" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                        <div className="space-y-2.5">
                          <div className="w-24 h-4 bg-[#2C2C2E]/60 rounded" />
                          <div className="w-full h-14 bg-[#111113] border border-[#2C2C2E] rounded-2xl" />
                        </div>
                        <div className="space-y-2.5">
                          <div className="w-24 h-4 bg-[#2C2C2E]/60 rounded" />
                          <div className="w-full h-14 bg-[#111113] border border-[#2C2C2E] rounded-2xl" />
                        </div>
                        <div className="md:col-span-2 space-y-2.5">
                          <div className="w-28 h-4 bg-[#2C2C2E]/60 rounded" />
                          <div className="w-full h-14 bg-[#111113] border border-[#2C2C2E] rounded-2xl" />
                        </div>
                        <div className="md:col-span-2 space-y-2.5">
                          <div className="w-28 h-4 bg-[#2C2C2E]/60 rounded" />
                          <div className="w-full h-14 bg-[#111113] border border-[#2C2C2E] rounded-2xl" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-10">
                      {/* Avatar Section */}
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full border-2 border-[#2C2C2E] overflow-hidden bg-[#111113] flex items-center justify-center p-0.5 transition-transform duration-500 group-hover:rotate-3 shadow-inner">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-linear-to-br from-primary2/20 to-primary2/5 flex items-center justify-center text-primary2 font-bold text-2xl">
                                {firstName ? firstName[0]?.toUpperCase() : "D"}
                                {lastName ? lastName[0]?.toUpperCase() : "A"}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="absolute bottom-1 right-1 p-2 bg-primary2 text-[#111113] rounded-full shadow-lg hover:scale-110 transition-transform sm:hidden"
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
                            className="px-5 py-2.5 border border-primary2/40 text-primary2 rounded-xl text-sm font-semibold hover:bg-primary2/10 transition-all active:scale-95 flex items-center gap-2"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Change Avatar</span>
                          </button>
                          <p className="text-gray-500 text-xs tracking-wide">
                            JPG, PNG or WEBP. 3MB max.
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
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                            required
                          />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2.5">
                          <label className="text-sm font-medium text-gray-400 ml-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                            required
                          />
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2 space-y-2.5">
                          <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-gray-400">
                              Email Address
                            </label>
                            <span className="text-xs text-gray-500 font-medium">Read-only</span>
                          </div>
                          <div className="relative group">
                            <input
                              type="email"
                              value={email}
                              readOnly
                              placeholder="dealer@example.com"
                              className="w-full bg-[#161618] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-gray-400 placeholder:text-gray-600 focus:outline-none cursor-not-allowed select-none pl-14 opacity-80"
                            />
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
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
                          disabled={isSavingProfile}
                          className="flex items-center justify-center gap-2 px-12 py-4 bg-primary2 text-[#111113] rounded-2xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSavingProfile ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Saving Changes...</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 font-clash">
                    <h3 className="text-2xl font-medium text-white">Change Password</h3>
                    <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mt-4 w-full" />
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-8 max-w-2xl">
                    <div className="space-y-6">
                      {/* Current Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Current Password
                        </label>
                        <div className="relative group">
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          New Password
                        </label>
                        <div className="relative group">
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">
                          Confirm New Password
                        </label>
                        <div className="relative group">
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="flex items-center justify-center gap-2 px-10 py-4 bg-primary2 text-[#111113] rounded-2xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {changePasswordMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <span>Update Password</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#111113] border border-[#2C2C2E] rounded-2xl flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-primary2" />
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2">Notification Preferences</h4>
                  <p className="text-gray-400 max-w-sm text-sm">
                    Manage how you receive alerts, trade notifications, and updates regarding your dealer account.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
}

