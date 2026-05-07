"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Camera,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Plus,
  ShieldCheck,
  X
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import { AnimatePresence, motion } from "framer-motion";

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  provider: string;
  lastFour: string;
  isPrimary: boolean;
  bankType?: string;
  nameOnCard?: string;
  expiry?: string;
}

const tabs = [
  { id: "profile", label: "Profile Info", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payout", label: "Payout Methods", icon: CreditCard },
];

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "bank",
      provider: "JPMorgan Chase Bank",
      lastFour: "4582",
      isPrimary: true,
      bankType: "Wire Transfer",
    },
    {
      id: "2",
      type: "bank",
      provider: "Bank of America",
      lastFour: "9921",
      isPrimary: false,
      bankType: "ACH",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleOpenModal = (method: PaymentMethod | null = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        nameOnCard: method.nameOnCard || "Alexander Kingston",
        cardNumber: method.type === "card" ? `•••• •••• •••• ${method.lastFour}` : `•••• •••• •••• ${method.lastFour}`,
        expiry: method.expiry || "MM/YY",
        cvc: "•••",
      });
    } else {
      setEditingMethod(null);
      setFormData({
        nameOnCard: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleTogglePrimary = (id: string) => {
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      isPrimary: m.id === id
    })));
  };

  const handleRemove = (id: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMethod) {
      setPaymentMethods(prev => prev.map(m => m.id === editingMethod.id ? {
        ...m,
        nameOnCard: formData.nameOnCard,
        lastFour: formData.cardNumber.replace(/\s/g, "").slice(-4),
        expiry: formData.expiry
      } : m));
    } else {
      const newMethod: PaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        type: "card",
        provider: "Visa",
        lastFour: formData.cardNumber.replace(/\s/g, "").slice(-4) || "0000",
        isPrimary: paymentMethods.length === 0,
        nameOnCard: formData.nameOnCard,
        expiry: formData.expiry,
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 px-4 md:px-0">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="mb-8">
          <h2 className="text-3xl md:text-[40px] font-clash font-medium tracking-tight text-white">Settings</h2>
          <p className="text-gray-400 mt-2 text-base md:text-lg">
            Manage your account preferences, security, and payout methods.
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
                className={`shrink-0 lg:w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id
                  ? "bg-[#1C1C1E] border border-[#2C2C2E] text-primary2 shadow-lg"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#1C1C1E]/50 border border-transparent"
                  }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary2" : "text-gray-500 group-hover:text-gray-400"}`} />
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
            {/* Glow Effect */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary2/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="p-6 md:p-10">
              {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 font-clash">
                    <h3 className="text-2xl font-medium text-white">Personal Information</h3>
                    <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mt-4 w-full" />
                  </div>

                  <div className="space-y-10">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-2 border-[#2C2C2E] overflow-hidden bg-[#111113] flex items-center justify-center p-0.5 transition-transform duration-500 group-hover:rotate-3">
                          <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <button
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
                          onClick={triggerFileInput}
                          className="px-5 py-2.5 border border-primary2/40 text-primary2 rounded-xl text-sm font-semibold hover:bg-primary2/10 transition-all active:scale-95"
                        >
                          Change Avatar
                        </button>
                        <p className="text-gray-500 text-xs tracking-wide">JPG, GIF or PNG. 1MB max.</p>
                      </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                      {/* First Name */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">First Name</label>
                        <input
                          type="text"
                          defaultValue="Julian"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Carter"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>

                      {/* Email */}
                      <div className="md:col-span-2 space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                        <div className="relative group">
                          <input
                            type="email"
                            defaultValue="julian@aurablack.com"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="md:col-span-2 space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                        <div className="relative group">
                          <input
                            type="text"
                            defaultValue="+1 (555) 000-1234"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>

                      {/* Company Name */}
                      <div className="md:col-span-2 space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">Company / Dealership Name (Optional)</label>
                        <div className="relative group">
                          <input
                            type="text"
                            defaultValue="Aura Black LLC"
                            className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20 pl-14"
                          />
                          <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary2 transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                      <button className="flex items-center gap-2 px-12 py-4 bg-primary2 text-[#111113] rounded-2xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 hover:scale-[1.03] active:scale-95 group relative overflow-hidden">
                        <span className="relative z-10">Save Changes</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 font-clash">
                    <h3 className="text-2xl font-medium text-white">Change Password</h3>
                    <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mt-4 w-full" />
                  </div>

                  <div className="space-y-8 max-w-2xl">
                    <div className="space-y-6">
                      {/* Current Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>

                      {/* New Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-medium text-gray-400 ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#111113] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:ring-1 focus:ring-primary2/20"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button className="px-10 py-4 bg-primary2 text-[#111113] rounded-2xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 hover:scale-[1.03] active:scale-95 group relative overflow-hidden">
                        <span className="relative z-10">Update Password</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-primary2" />
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2">Notification Settings</h4>
                  <p className="text-gray-500 max-w-sm">Manage how you receive alerts and updates about your listings and account.</p>
                </div>
              )}

              {activeTab === "payout" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <div className="font-clash">
                      <h3 className="text-2xl font-medium text-white">Payout Methods</h3>
                      <div className="h-0.5 bg-linear-to-r from-[#2C2C2E] to-transparent mt-4 w-48" />
                    </div>
                    <button
                      onClick={() => handleOpenModal()}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary2 text-[#111113] rounded-xl font-bold hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 active:scale-95 group"
                    >
                      <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                      <span>Add Method</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`bg-[#111113] border-2 transition-all duration-300 rounded-2xl p-6 ${method.isPrimary ? "border-primary2/20 hover:border-primary2/40" : "border-[#2C2C2E] hover:border-[#3C3C3E]"
                          }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center shadow-inner">
                            {method.type === "bank" ? (
                              <Building2 className={`w-7 h-7 ${method.isPrimary ? "text-primary2" : "text-gray-500"}`} />
                            ) : (
                              <CreditCard className={`w-7 h-7 ${method.isPrimary ? "text-primary2" : "text-gray-500"}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h4 className="text-xl font-semibold text-white tracking-tight">{method.provider}</h4>
                              {method.isPrimary && (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-[15px] mt-1.5 flex items-center gap-2">
                              {method.bankType || "Credit Card"} <span className="text-gray-600 font-bold">••••</span> {method.lastFour}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-4">
                            {!method.isPrimary && (
                              <button
                                onClick={() => handleTogglePrimary(method.id)}
                                className="text-gray-400 hover:text-white transition-colors text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5"
                              >
                                Make Primary
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenModal(method)}
                              className="text-gray-400 hover:text-white transition-colors text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5"
                            >
                              Edit
                            </button>
                            {!method.isPrimary && (
                              <button
                                onClick={() => handleRemove(method.id)}
                                className="text-red-500/70 hover:text-red-500 transition-colors text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-500/5"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Mobile Actions */}
                        <div className="sm:hidden mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleOpenModal(method)}
                            className="flex-1 text-center text-gray-400 hover:text-white transition-colors text-sm font-semibold py-2"
                          >
                            Edit
                          </button>
                          {!method.isPrimary && (
                            <>
                              <button
                                onClick={() => handleTogglePrimary(method.id)}
                                className="flex-1 text-center text-gray-400 hover:text-white transition-colors text-sm font-semibold py-2"
                              >
                                Make Primary
                              </button>
                              <button
                                onClick={() => handleRemove(method.id)}
                                className="flex-1 text-center text-red-500/70 hover:text-red-500 transition-colors text-sm font-semibold py-2"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Separator Line */}
                    <div className="py-6">
                      <div className="h-px bg-linear-to-r from-[#2C2C2E] via-[#2C2C2E] to-transparent" />
                    </div>

                    {/* Security Footnote */}
                    <div className="bg-[#111113]/40 border border-[#2C2C2E] rounded-2xl p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary2/5 blur-2xl rounded-full translate-x-16 -translate-y-16" />
                      <div className="flex gap-4 relative z-10">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary2/10 flex items-center justify-center border border-primary2/20">
                          <ShieldCheck className="w-5 h-5 text-primary2" />
                        </div>
                        <div>
                          <h5 className="text-base font-semibold text-white mb-2">Secure Transactions</h5>
                          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                            All wire transfers and payouts are verified through Escrow.com integration. Large transfers may require additional voice verification to ensure the highest level of security for your funds.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#111113] rounded-[32px] border border-[#2C2C2E] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white tracking-tight">
                    {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name on Card */}
                  <div className="space-y-2.5">
                    <label className="text-[15px] font-medium text-white/90 ml-1">Name on Card</label>
                    <input
                      type="text"
                      placeholder="Alexander Kingston"
                      value={formData.nameOnCard}
                      onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                      className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-inner"
                      required
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2.5">
                    <label className="text-[15px] font-medium text-white/90 ml-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-inner"
                      required
                    />
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <label className="text-[15px] font-medium text-white/90 ml-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-inner"
                        required
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[15px] font-medium text-white/90 ml-1">CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={formData.cvc}
                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                        className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-all shadow-inner"
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-5 bg-primary2 text-[#111113] rounded-2xl font-bold text-lg hover:bg-[#E78F23] transition-all duration-300 shadow-xl shadow-primary2/10 hover:shadow-primary2/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {editingMethod ? "Save Changes" : "Add Card"}
                    </button>
                  </div>

                  <p className="text-center text-gray-500 text-xs tracking-wide">
                    Your card details are encrypted and secure
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
