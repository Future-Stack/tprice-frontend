"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, UploadCloud, Image as ImageIcon, Plus, X, Check, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";

const steps = ["Basic Info", "Specifications", "Media", "Pricing", "Review"];

export default function AddListing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [saleType, setSaleType] = useState("fixed");
  const [askingPrice, setAskingPrice] = useState("");
  const [allowCounterOffers, setAllowCounterOffers] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("standard");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images for demonstration
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission logic would go here
      console.log("Listing submitted with plan:", selectedPlan);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-clash font-medium mb-8">Basic Information</h3>
            {/* Listing Title */}
            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-gray-300">Listing Title</label>
              <input
                type="text"
                placeholder="e.g. Ferrari 488 Spider"
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
              />
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Category</label>
                <div className="relative">
                  <select className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary2/50 transition-colors appearance-none cursor-pointer">
                    <option value="">Select Category</option>
                    <option value="luxury-cars">Luxury Cars</option>
                    <option value="watches">Watches</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="yachts">Yachts</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Item Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-gray-300">Description</label>
              <textarea
                rows={6}
                placeholder="Provide a detailed description of the item..."
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors resize-none shadow-inner"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-clash font-medium mb-8">Specifications</h3>
            
            {/* Row 1: Year & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Year of Manufacture</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Condition</label>
                <div className="relative">
                  <select className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary2/50 transition-colors appearance-none cursor-pointer">
                    <option value="">Select Condition</option>
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Usage & Exterior Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Usage / Mileage</label>
                <input
                  type="text"
                  placeholder="e.g. 12,000 miles or 450 flight hours"
                  className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Exterior Color</label>
                <input
                  type="text"
                  placeholder="e.g. Rosso Corsa"
                  className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors"
                />
              </div>
            </div>

            {/* Placeholder for remaining space to match image height if needed */}
            <div className="h-20 hidden md:block"></div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-clash font-medium mb-8">Media Gallery</h3>

            {/* Main Upload Area */}
            <div className="relative group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-[#2C2C2E] bg-[#1c1c1e] aspect-[16/7] rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:border-primary2/50 group-hover:bg-[#252528]">
                <div className="w-16 h-16 bg-[#111113] rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary2 transition-colors">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-lg">Click or drag images to upload</p>
                  <p className="text-gray-500 text-sm mt-1">High-resolution JPG, PNG or WEBP (max 10MB each)</p>
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative aspect-square rounded-2xl border-2 border-[#2C2C2E] bg-[#1c1c1e] overflow-hidden flex items-center justify-center group">
                  {images[i] ? (
                    <>
                      <img src={images[i].preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-600/50">
                      {i === 0 ? <ImageIcon className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10">
            <h3 className="text-xl font-clash font-medium mb-8">Pricing & Sale Type</h3>

            {/* Sale Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "fixed", title: "Fixed Price", desc: "Set a specific asking price" },
                { id: "auction", title: "Auction", desc: "Set starting bid and duration" },
                { id: "private", title: "Private Sale", desc: "Price on Application (POA)" }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSaleType(type.id)}
                  className={`flex flex-col items-start p-6 rounded-xl border transition-all duration-300 text-left ${
                    saleType === type.id
                      ? "border-primary2 bg-primary2/5 ring-1 ring-primary2"
                      : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-gray-600"
                  }`}
                >
                  <span className={`font-semibold text-base mb-1 ${saleType === type.id ? "text-primary2" : "text-white"}`}>
                    {type.title}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {type.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Asking Price Input */}
            <div className="space-y-4 max-w-md">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Asking Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="text"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
                  />
                </div>
              </div>

              {/* Counter Offers Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={allowCounterOffers}
                    onChange={(e) => setAllowCounterOffers(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-[#2C2C2E] rounded bg-[#1c1c1e] checked:bg-primary2 checked:border-primary2 transition-all cursor-pointer"
                  />
                  <Check className={`absolute w-3.5 h-3.5 text-[#111113] transition-opacity duration-200 pointer-events-none ${allowCounterOffers ? "opacity-100" : "opacity-0"}`} />
                </div>
                <span className="text-[14px] text-gray-400 group-hover:text-gray-300 transition-colors">
                  Allow buyers to make counter-offers
                </span>
              </label>
            </div>
            
            <div className="h-4 hidden md:block" />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center">
            {/* Header Icon & Text */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary2/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary2/20">
                <CheckCircle2 className="w-8 h-8 text-primary2" />
              </div>
              <h3 className="text-2xl font-clash font-medium text-white mb-2">Ready to Submit</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                Your listing will be submitted to our curation team for review. 
                This typically takes 24-48 hours.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Standard Listing Plan */}
              <div 
                onClick={() => setSelectedPlan("standard")}
                className={`relative group cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${
                  selectedPlan === "standard" 
                    ? "bg-[#1c1c1e] border-primary2/50 ring-1 ring-primary2/20" 
                    : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 transition-colors ${selectedPlan === "standard" ? "text-green-500" : "text-gray-600"}`}>
                    {selectedPlan === "standard" ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-clash font-medium text-white">Standard Listing (Free)</h4>
                      <p className="text-gray-400 text-sm mt-1">List your item on the marketplace at no upfront cost.</p>
                    </div>
                    <ul className="space-y-3 mt-6">
                      {[
                        "No listing fee",
                        "6% commission charged only after sale",
                        "Standard visibility"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Featured Listing Plan */}
              <div 
                onClick={() => setSelectedPlan("featured")}
                className={`relative group cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${
                  selectedPlan === "featured" 
                    ? "bg-[#1c1c1e] border-primary2/50 ring-1 ring-primary2/20" 
                    : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 transition-colors ${selectedPlan === "featured" ? "text-green-500" : "text-gray-600"}`}>
                    {selectedPlan === "featured" ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-clash font-medium text-white">Featured Listing ($99)</h4>
                      <p className="text-gray-400 text-sm mt-1">Boost your listing visibility and reach more premium buyers.</p>
                    </div>
                    <ul className="space-y-3 mt-6">
                      {[
                        "Priority placement in listings",
                        "Higher visibility to VIP buyers",
                        "Faster exposure"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 relative z-0 max-w-229 mx-auto">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="mb-6">
          <h2 className="text-[40px] font-clash font-medium tracking-tight">Create New Listing</h2>
          <p className="text-gray-400 mt-2 text-lg">Add your luxury item to the marketplace.</p>
        </div>
      </AnimationWrapper>

      <AnimationWrapper type="fade-up" duration={0.6} delay={0.1}>
        <div
          className="bg-[#1C1C1E] p-8 md:p-10 rounded-2xl border border-[#2C2C2E] shadow-2xl overflow-hidden "
          style={{
            boxShadow: "0 0 50px -12px rgba(178, 114, 31, 0.15)"
          }}
        >
          {/* Progress Section */}
          <div className="mb-12">
            <div className="w-full bg-[#111113] h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-primary2 h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="justify-between items-center text-[13px] font-medium hidden md:flex px-2">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`transition-colors duration-300 cursor-default ${
                    index <= currentStep ? "text-primary2" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
            {/* Mobile step indicator */}
            <div className="md:hidden text-center text-primary2 font-medium text-sm">
              Step {currentStep + 1}: {steps[currentStep]}
            </div>
          </div>

          {/* Form Context Container */}
          <div className="bg-[#111113]/50 rounded-2xl p-6 md:p-8 border border-[#2C2C2E]/60  min-h-115">
            <AnimationWrapper key={currentStep} type="zoom" duration={0.4}>
              {renderStepContent()}
            </AnimationWrapper>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-[#2C2C2E] rounded-xl text-gray-400 text-sm font-medium hover:bg-[#2C2C2E] hover:text-white transition-all duration-300 group cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            ) : (
              <div />
            )}
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-primary2 text-[#111113] rounded-xl text-sm font-bold hover:bg-primary transition-all duration-300 shadow-lg shadow-primary2/10 group cursor-pointer ml-auto"
            >
              {currentStep === steps.length - 1 ? "Submit Listing" : "Next Step"}
              {currentStep !== steps.length - 1 && (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
