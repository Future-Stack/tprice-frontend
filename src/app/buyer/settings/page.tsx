"use client";

import React, { useState, useEffect } from 'react';
import AnimationWrapper from '@/app/components/AnimationWrapper';
import { Crown, User, Bell, Shield, CreditCard, Check, Plus, Loader2, Eye, EyeOff } from 'lucide-react';
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function BuyerSettings() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const updateProfileMutation = useUpdateProfileMutation();
    const changePasswordMutation = useChangePasswordMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [showSecurityForm, setShowSecurityForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [notifications, setNotifications] = useState({
        bids: true,
        offers: true,
        newListings: true,
        priceDrops: false,
    });

    useEffect(() => {
        if (user) {
            const fullName = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "";
            setName(fullName);
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const parts = trimmedName.split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        updateProfileMutation.mutate({
            firstName,
            lastName,
            phone: phone.trim(),
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
                    setShowSecurityForm(false);
                },
            }
        );
    };

    const isSavingProfile = updateProfileMutation.isPending;
    const isSavingPassword = changePasswordMutation.isPending;
    const isVip = Boolean(user?.vipStatus || user?.isVip);

    return (
        <AnimationWrapper>
            <div className="w-full max-w-200 mb-20 lg:mb-0">
                {/* Main Card */}
                <div className="bg-[#18181A] rounded-[20px] shadow-[0_0_50px_rgba(231,143,35,0.03)] border border-[#E78F23]/10 md:p-10 p-6 relative overflow-hidden"
                    style={{
                        boxShadow: "0px 0px 80px 0px rgba(231, 143, 35, 0.05)"
                    }}
                >
                    <h1 className="text-[28px] md:text-4xl font-medium font-clash text-white mb-10 relative z-10">Settings</h1>

                    {/* Membership Section */}
                    <section className="mb-10 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Crown className="w-4.5 h-4.5 text-[#E78F23]" strokeWidth={2} />
                            <h2 className="text-[11px] font-semibold text-gray-300 tracking-widest uppercase">Membership</h2>
                        </div>
                        <div className="bg-[#111113] rounded-xl p-4 flex items-center justify-between border border-[#2A2A2C]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#E78F23]/10 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-[#E78F23]" fill="currentColor" strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-medium text-gray-200">
                                        {isUserLoading ? "Loading..." : isVip ? "VIP Member" : "Standard Member"}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                        {isVip ? "1.5% buyer fee - Exclusive access" : "Standard buyer account"}
                                    </p>
                                </div>
                            </div>
                            <button type="button" className="px-5 py-2 text-xs font-medium text-gray-400 hover:text-white bg-[#1A1A1C] border border-[#2A2A2C] rounded-lg hover:bg-[#252528] transition-colors shrink-0 cursor-pointer">
                                Manage
                            </button>
                        </div>
                    </section>

                    {/* Profile Section */}
                    <section className="mb-10 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                            <h2 className="text-[11px] font-semibold text-gray-300 tracking-widest uppercase">Profile</h2>
                        </div>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={isUserLoading ? "Loading..." : "Enter your name"}
                                    required
                                    className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    placeholder={isUserLoading ? "Loading..." : "Enter your email"}
                                    className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all bg-opacity-70 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={isUserLoading ? "Loading..." : "Enter your phone number"}
                                    className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all bg-opacity-70"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile || isUserLoading}
                                    className="bg-[#facc15] text-[#111] font-semibold text-xs px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all min-w-[120px] text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Notifications Section - Commented out
                    <section className="mb-10 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                            <h2 className="text-[11px] font-semibold text-gray-300 tracking-widest uppercase">Notifications</h2>
                        </div>
                        <div className="space-y-2">
                            {[
                                { id: 'bids', label: 'Bids' },
                                { id: 'offers', label: 'Offers' },
                                { id: 'newListings', label: 'New Listings' },
                                { id: 'priceDrops', label: 'Price Drops' },
                            ].map((item) => (
                                <div key={item.id} className="bg-[#18181B] rounded-[10px] p-4 flex items-center justify-between border border-[#2A2A2C]">
                                    <span className="text-[13px] text-gray-400">{item.label}</span>
                                    <button
                                        type="button"
                                        onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                        className="relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors focus:outline-none bg-[#2C2C2E]"
                                    >
                                        <span
                                            className={`${notifications[item.id as keyof typeof notifications] ? 'translate-x-4 bg-[#facc15]' : 'translate-x-1 bg-white'
                                                } inline-block h-[14px] w-[14px] transform rounded-full transition-transform duration-200 ease-in-out`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                    */}

                    {/* Security Section */}
                    <section className="mb-10 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                            <h2 className="text-[11px] font-semibold text-gray-300 tracking-widest uppercase">Security</h2>
                        </div>
                        <div
                            onClick={() => setShowSecurityForm(!showSecurityForm)}
                            className="bg-[#18181B] rounded-[10px] p-4 flex items-center justify-between border border-[#2A2A2C] cursor-pointer hover:border-gray-600 transition-colors"
                        >
                            <span className="text-[13px] text-gray-400">Change Password</span>
                            <span className="text-xs text-[#E78F23] font-medium">{showSecurityForm ? "Cancel" : "Edit"}</span>
                        </div>

                        {showSecurityForm && (
                            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 bg-[#111113] p-4 rounded-[10px] border border-[#2A2A2C]">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSavingPassword}
                                        className="bg-[#facc15] text-[#111] font-semibold text-xs px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all min-w-[120px] text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSavingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        <span>{isSavingPassword ? "Updating..." : "Update Password"}</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>

                </div>
            </div>
        </AnimationWrapper>
    );
}