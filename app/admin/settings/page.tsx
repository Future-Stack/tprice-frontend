"use client";

import React, { useState } from 'react';
import AnimationWrapper from '@/app/components/AnimationWrapper';
import { ChevronDown, CheckCircle2, ClipboardList, Search, Lock, Monitor,   LogOut } from 'lucide-react';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('General');
    const [notifications, setNotifications] = useState({
        newListing: true,
        dealFlagged: true,
        dealerActivity: false,
    });

    const [moderation, setModeration] = useState({
        requireApproval: true,
        autoApproveDealers: false,
        flagInactiveDeals: true,
        flagMissingData: false,
    });

    const [auditLogs, setAuditLogs] = useState({
        retentionPeriod: '30 days',
        detailedLogin: false,
    });


    const tabs = ['General', 'Moderation', 'Security', 'Audit and logs'];

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AnimationWrapper>
            <div className="max-w-250 mb-20">
                <header className="mb-10">
                    <h1 className="text-[32px] md:text-[40px] font-bold text-white mb-2 leading-tight">
                        {activeTab === 'General' ? 'General settings' :
                            activeTab === 'Moderation' ? 'Moderation settings' :
                                activeTab === 'Security' ? 'Security settings' : 'Audit and logs'}
                    </h1>
                    <p className="text-[#888] text-sm md:text-base">
                        {activeTab === 'General' ? 'Define your platform identity and defaults' :
                            activeTab === 'Moderation' ? 'Manage listings approval and automated flag rules' :
                                activeTab === 'Security' ? 'Configure platform security and access' : 'Control listing approval workflow and quality rules'}
                    </p>
                </header>


                <div className="flex flex-wrap gap-3 mb-12">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab
                                ? 'bg-primary text-black'
                                : 'bg-[#1A1A1C] text-[#888] hover:text-white hover:bg-[#252528]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'General' ? (
                    <div className="space-y-12">
                        {/* System profile Section */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">System profile</h2>
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Platform Name :</label>
                                        <input
                                            type="text"
                                            placeholder="ExoticWorld"
                                            defaultValue="ExoticWorld"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#444]"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Email Address :</label>
                                        <input
                                            type="email"
                                            placeholder="support@exoticworld.com"
                                            defaultValue="support@exoticworld.com"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#444]"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Default Currency :</label>
                                        <input
                                            type="text"
                                            placeholder="USD - US Dollar"
                                            defaultValue="USD - US Dollar"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#444]"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Region/Time Zone :</label>
                                        <div className="relative">
                                            <select className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all appearance-none cursor-pointer">
                                                <option>UTC</option>
                                                <option>EST</option>
                                                <option>PST</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-[#666]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button className="bg-primary cursor-pointer   text-black px-8 py-3 rounded-xl text-sm font-bold transition-all ">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Notification Section */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Notification</h2>
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <span className="text-[13px] font-medium text-[#666]">Alert Type</span>
                                    <span className="text-[13px] font-medium text-[#666]">Email</span>
                                </div>

                                <div className="space-y-1 mb-10">
                                    <NotificationToggle
                                        label="New Listing Submissions"
                                        isActive={notifications.newListing}
                                        onToggle={() => toggleNotification('newListing')}
                                    />
                                    <NotificationToggle
                                        label="Deal Flagged Alerts"
                                        isActive={notifications.dealFlagged}
                                        onToggle={() => toggleNotification('dealFlagged')}
                                    />
                                    <NotificationToggle
                                        label="Dealer activity alerts"
                                        isActive={notifications.dealerActivity}
                                        onToggle={() => toggleNotification('dealerActivity')}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button className="bg-primary cursor-pointer   text-black px-8 py-3 rounded-xl text-sm font-bold transition-all ">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : activeTab === 'Moderation' ? (
                    <AnimationWrapper type="fade-up">
                        <div className="space-y-8">
                            {/* Approval Workflow */}
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-[#facc15]" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Approval Workflow</h2>
                                </div>
                                <div className="space-y-6">
                                    <ToggleItem
                                        label="Require admin approval for listings"
                                        subtext="Automatically flag stale listings"
                                        isActive={moderation.requireApproval}
                                        onToggle={() => setModeration(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                                    />
                                    <ToggleItem
                                        label="Auto approve trusted dealers"
                                        subtext="All new listings must be manually approved"
                                        isActive={moderation.autoApproveDealers}
                                        onToggle={() => setModeration(prev => ({ ...prev, autoApproveDealers: !prev.autoApproveDealers }))}
                                    />
                                </div>
                            </section>

                            {/* Listing quality requirements */}
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
                                        <ClipboardList className="w-6 h-6 text-[#facc15]" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Listing quality requirements</h2>
                                </div>
                                <div className="space-y-5 ml-2">
                                    <QualityItem text="Minimum price must be set" />
                                    <QualityItem text="At least 1 image must be required" />
                                    <QualityItem text="Description minimum 50 characters" />
                                </div>
                            </section>

                            {/* Auto flag rules */}
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
                                        <Search className="w-6 h-6 text-[#facc15]" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Auto flag rules</h2>
                                </div>
                                <div className="space-y-6">
                                    <ToggleItem
                                        label="Flag Deals after 48 hours of inactivity"
                                        subtext="All new listings must be manually approved"
                                        isActive={moderation.flagInactiveDeals}
                                        onToggle={() => setModeration(prev => ({ ...prev, flagInactiveDeals: !prev.flagInactiveDeals }))}
                                    />
                                    <ToggleItem
                                        label="Flag listings with missing Data"
                                        subtext="Flag incomplete listings submissions"
                                        isActive={moderation.flagMissingData}
                                        onToggle={() => setModeration(prev => ({ ...prev, flagMissingData: !prev.flagMissingData }))}
                                    />
                                </div>
                            </section>

                            <div className="flex justify-end pt-4">
                                <button className="bg-[#facc15] hover:bg-[#eab308] text-black px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#facc15]/10 hover:scale-[1.02] active:scale-[0.98]">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </AnimationWrapper>
                ) : activeTab === 'Security' ? (
                    <AnimationWrapper type="fade-up">
                        <div className="space-y-8">
                            {/* Change Password */}
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-8 font-primary">Change Password</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#333]"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Platform Name :</label>
                                        <input
                                            type="text"
                                            placeholder="support@exoticworld.com"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#333]"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="****************"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#333]"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[13px] font-medium text-[#666]">Retype new password</label>
                                        <input
                                            type="password"
                                            placeholder="****************"
                                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all placeholder:text-[#333]"
                                        />
                                    </div>
                                </div>
                                <button className="border border-[#facc15]/50 text-[#facc15] hover:bg-[#facc15] hover:text-black hover:border-[#facc15] px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300">
                                    Save Changes
                                </button>
                            </section>

                            {/* Require approval toggle */}
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#facc15]/5 border border-[#facc15]/10 flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-[#facc15]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Require admin approval for listings</h3>
                                        <p className="text-[#666] text-sm">Automatically flag stale listings</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModeration(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                                    className={`relative inline-flex h-[34px] w-[64px] items-center rounded-full transition-all duration-300 focus:outline-none ${moderation.requireApproval ? 'bg-[#facc15]' : 'bg-[#2A2A2A]'}`}
                                >
                                    <div className={`inline-block h-7 w-7 transform rounded-full transition-all duration-300 ${moderation.requireApproval ? 'translate-x-[32px] bg-black shadow-lg' : 'translate-x-1 bg-[#444]'}`} />
                                </button>
                            </section>

                            {/* Active Sessions */}
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <Monitor className="w-6 h-6 text-[#facc15]" />
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Active Sessions</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <h4 className="text-white font-medium">Mackbook Pro - Chrome</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[#666] text-sm">New York, US</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#facc15] animate-pulse" />
                                                <span className="text-[#facc15] text-[13px] font-medium italic">Current device</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/[0.03]" />

                                    <div className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <h4 className="text-white font-medium">i phone 16 pro max - safari</h4>
                                            <span className="text-[#666] text-sm">New York, US</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 flex items-center justify-center transition-all group/btn border border-transparent hover:border-orange-500/20">
                                            <LogOut className="w-5 h-5 text-[#f97316] group-hover/btn:scale-110 transition-all" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </AnimationWrapper>
                ) : (
                    <AnimationWrapper type="fade-up">
                        <div className="space-y-8">
                            <section className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center">
                                        <ClipboardList className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Log retention</h2>
                                </div>

                                <div className="space-y-10">
                                    {/* Retention Period Dropdown */}
                                    <div className="space-y-3 max-w-sm">
                                        <label className="text-[13px] font-medium text-[#666]">Retention Period</label>
                                        <div className="relative">
                                            <select
                                                value={auditLogs.retentionPeriod}
                                                onChange={(e) => setAuditLogs(prev => ({ ...prev, retentionPeriod: e.target.value }))}
                                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#facc15]/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="7 days">7 days</option>
                                                <option value="30 days">30 days</option>
                                                <option value="90 days">90 days</option>
                                                <option value="1 year">1 year</option>
                                                <option value="Forever">Forever</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-[#666]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Login Toggle */}
                                    <div className="flex items-center justify-between group">
                                        <div className="space-y-1.5">
                                            <h4 className={`text-[17px] md:text-[19px] font-medium transition-colors ${auditLogs.detailedLogin ? 'text-white' : 'text-[#aaa]'}`}>
                                                Detailed Login
                                            </h4>
                                            <p className="text-[#666] text-sm max-w-md">
                                                Capture detailed activity logs for all administrative actions and system events.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setAuditLogs(prev => ({ ...prev, detailedLogin: !prev.detailedLogin }))}
                                            className={`relative inline-flex h-8 w-15 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none ${auditLogs.detailedLogin ? 'bg-primary' : 'bg-[#2A2A2A]'}`}
                                        >
                                            <div
                                                className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${auditLogs.detailedLogin ? 'translate-x-7.5 bg-black shadow-lg' : 'translate-x-1 bg-[#444]'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end pt-4">
                                <button className="bg-primary hover:bg-[#eab308] text-black px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg cursor-pointer shadow-[#facc15]/10 hover:scale-[1.02] active:scale-[0.98]">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </AnimationWrapper>
                )}

            </div>
        </AnimationWrapper>
    );
}

function NotificationToggle({ label, isActive, onToggle }: { label: string, isActive: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between py-5 border-b border-white/3 last:border-0 group transition-all">
            <span className={`text-[15px] md:text-[17px] font-medium transition-colors ${isActive ? 'text-white' : 'text-[#888]'}`}>
                {label}
            </span>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-7.5 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${isActive ? 'bg-primary' : 'bg-[#2A2A2A]'
                    }`}
            >
                <div
                    className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${isActive ? 'translate-x-6.5 bg-black shadow-lg' : 'translate-x-1 bg-[#444]'
                        }`}
                />
            </button>
        </div>
    );
}

function ToggleItem({ label, subtext, isActive, onToggle }: { label: string, subtext?: string, isActive: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between py-2 transition-all">
            <div className="space-y-1.5">
                <h4 className={`text-[16px] md:text-[18px] font-medium transition-colors ${isActive ? 'text-white' : 'text-[#aaa]'}`}>
                    {label}
                </h4>
                {subtext && <p className="text-[#666] text-xs md:text-sm font-medium">{subtext}</p>}
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-7.5 w-14 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none ${isActive ? 'bg-primary' : 'bg-[#2A2A2A]'}`}
            >
                <div
                    className={`inline-block h-6 w-6 transform rounded-full transition-all duration-300 ease-in-out ${isActive ? 'translate-x-6.5 bg-black shadow-lg' : 'translate-x-1 bg-[#444]'}`}
                />
            </button>
        </div>
    );
}

function QualityItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 py-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
            <span className="text-[#888] text-[15px] md:text-[16px] font-medium">{text}</span>
        </div>
    );
}
