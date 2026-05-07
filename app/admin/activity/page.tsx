"use client";

import React from "react";
import {
    Check,
    AlertTriangle,
    X,
    Plus,
    Tag,
    Briefcase,
    User,
    Clock
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

const ACTIVITY_DATA = [
    {
        id: 1,
        title: "Listing Approved",
        description: "Ferrari SF90 Stradale approved by Admin",
        type: "listing",
        time: "about 1 hour ago",
        status: "approved",
    },
    {
        id: 2,
        title: "Deal Flagged",
        description: "Suspicious pricing on Pagani huaya deal",
        type: "deal",
        time: "about 2 hours ago",
        status: "flagged",
    },
    {
        id: 3,
        title: "Dealer Suspended",
        description: "LuxeMotors Berlin suspended for policy violation",
        type: "dealer",
        time: "about 4 hours ago",
        status: "suspended",
    },
    {
        id: 4,
        title: "Listing Created",
        description: "Lamborghini Revuelto submitted for review",
        type: "listing",
        time: "about 10 hours ago",
        status: "created",
    },
    {
        id: 5,
        title: "Listing Rejected",
        description: "McLaren P1 listing rejected-incomplete doccument",
        type: "listing",
        time: "about 12 hours ago",
        status: "rejected",
    },
    {
        id: 6,
        title: "Deal Created",
        description: "New deal initiated for Bugatti Chiron Spot",
        type: "deal",
        time: "about 12 hours ago",
        status: "created",
    },
];

const getStatusStyles = (status: string) => {
    switch (status) {
        case "approved":
            return {
                icon: <Check className="text-green-500" size={20} />,
                bg: "bg-green-500/10",
                border: "border-green-500/20",
                dot: "bg-green-500",
                glow: "shadow-[0_0_15px_rgba(34,197,94,0.6)]",
            };
        case "flagged":
            return {
                icon: <AlertTriangle className="text-yellow-500" size={20} />,
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/20",
                dot: "bg-yellow-500",
                glow: "shadow-[0_0_15px_rgba(234,179,8,0.6)]",
            };
        case "suspended":
        case "rejected":
            return {
                icon: <X className="text-red-500" size={20} />,
                bg: "bg-red-500/10",
                border: "border-red-500/20",
                dot: "bg-red-500",
                glow: "shadow-[0_0_15px_rgba(239,68,68,0.6)]",
            };
        case "created":
            return {
                icon: <Plus className="text-blue-400" size={20} />,
                bg: "bg-blue-400/10",
                border: "border-blue-400/20",
                dot: "bg-blue-400",
                glow: "shadow-[0_0_15px_rgba(96,165,250,0.6)]",
            };
        default:
            return {
                icon: <Plus className="text-gray-500" size={20} />,
                bg: "bg-gray-500/10",
                border: "border-gray-500/20",
                dot: "bg-gray-500",
                glow: "shadow-[0_0_15px_rgba(107,114,128,0.6)]",
            };
    }
};

const getTypeIcon = (type: string) => {
    switch (type) {
        case "listing":
            return <Tag size={12} />;
        case "deal":
            return <Briefcase size={12} />;
        case "dealer":
            return <User size={12} />;
        default:
            return <Tag size={12} />;
    }
};

function AdminActivity() {
    return (
        <div className="min-h-screen text-white font-sans pb-20">
            {/* Header Section */}
            <div className="mb-10">
                <AnimationWrapper type="fade-down" duration={0.5}>
                    <h1 className="text-4xl font-bold mb-2">Activity</h1>
                    <p className="text-gray-500 text-sm">Track all system actions and events</p>
                </AnimationWrapper>
            </div>

            {/* Main Container */}
            <AnimationWrapper type="fade-up" duration={0.6} delay={0.2}>
                <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6 md:p-10 max-w-4xl relative overflow-hidden">
                    {/* Vertical Line Container */}
                    <div className="absolute right-[43px] md:right-[48px] top-10 bottom-10 w-px bg-[#232323] hidden md:block" />

                    <div className="space-y-8 relative">
                        {ACTIVITY_DATA.map((activity, index) => {
                            const styles = getStatusStyles(activity.status);
                            return (
                                <AnimationWrapper
                                    key={activity.id}
                                    type="fade-right"
                                    duration={0.5}
                                    delay={index * 0.1}
                                >
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                                            {/* Left Icon Box */}
                                            <div className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl border ${styles.border} ${styles.bg} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                                                {styles.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <h3 className="font-semibold text-base md:text-lg text-gray-100 truncate">
                                                    {activity.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm md:text-base line-clamp-1">
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs capitalize">
                                                        {getTypeIcon(activity.type)}
                                                        <span>{activity.type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] md:text-xs">
                                                        <Clock size={12} />
                                                        <span>{activity.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Dot Indicator */}
                                        <div className="shrink-0 ml-4 md:ml-0 relative z-10">
                                            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${styles.dot} ${styles.glow} transition-all duration-500 group-hover:scale-125`} />
                                        </div>
                                    </div>
                                </AnimationWrapper>
                            );
                        })}
                    </div>
                </div>
            </AnimationWrapper>
        </div>
    );
}

export default AdminActivity;
