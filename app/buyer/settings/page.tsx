"use client";

import React, { useState } from 'react';
import AnimationWrapper from '@/app/components/AnimationWrapper';
import { Crown, User, Bell, Shield, CreditCard, Check, Plus } from 'lucide-react';

export default function BuyerSettings() {
    const [notifications, setNotifications] = useState({
        bids: true,
        offers: true,
        newListings: true,
        priceDrops: false,
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

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
                                    <h3 className="text-[13px] font-medium text-gray-200">VIP Member</h3>
                                    <p className="text-[11px] text-gray-500 mt-0.5">1.5% buyer fee - Exclusive access</p>
                                </div>
                            </div>
                            <button className="px-5 py-2 text-xs font-medium text-gray-400 hover:text-white bg-[#1A1A1C] border border-[#2A2A2C] rounded-lg hover:bg-[#252528] transition-colors shrink-0">
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
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Name</label>
                                <input
                                    type="text"
                                    defaultValue="Alexander Kingston"
                                    className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Email</label>
                                <input
                                    type="email"
                                    defaultValue="a.kingston@email.com"
                                    className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all bg-opacity-70"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 pl-0.5">Phone</label>
                                <input
                                    type="text"
                                    defaultValue="+1 (555) 000-0000"
                                    className="w-full bg-[#18181B] border border-[#2A2A2C] rounded-[10px] px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#E78F23]/50 focus:ring-1 focus:ring-[#E78F23]/50 transition-all bg-opacity-70"
                                />
                            </div>
                            <div className="pt-2">
                                <button className="bg-[#facc15] text-[#111] font-semibold text-xs px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all min-w-[120px] text-center">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Notifications Section */}
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

                    {/* Security Section */}
                    <section className="mb-10 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                            <h2 className="text-[11px] font-semibold text-gray-300 tracking-widest uppercase">Security</h2>
                        </div>
                        <div className="bg-[#18181B] rounded-[10px] p-4 flex items-center justify-between border border-[#2A2A2C] cursor-pointer hover:border-gray-600 transition-colors">
                            <span className="text-[13px] text-gray-400">Change Password</span>
                        </div>
                    </section>

                    {/* Payment Methods Section */}
                    <section className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                                <h2 className="text-[11px] font-semibold text-gray-300 tracking-widest uppercase">Payment Methods</h2>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs font-medium text-[#facc15] hover:text-[#eab308] transition-colors">
                                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                                Add Card
                            </button>
                        </div>
                        <div className="bg-[#18181B] rounded-[10px] p-4 flex items-center justify-between border border-[#2A2A2C]">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#333] px-2.5 py-1 rounded-[4px] text-[10px] font-bold text-gray-400 uppercase">
                                    VISA
                                </div>
                                <span className="text-[13px] text-gray-400 tracking-wider">**** **** **** 4892</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#facc15] shrink-0">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                <span className="text-[11px] font-medium">Default</span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </AnimationWrapper>
    );
}