import React from "react";
import { ThemeToggle } from "../components/ThemeToggle";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background transition-colors duration-300">
      {/* Left Section - Branding & Illustration */}
      <div className="lg:w-1/2 relative flex flex-col justify-between p-8 lg:p-16 bg-primary overflow-hidden">
        {/* Subtle butter-colored accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-accent opacity-10 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-accent opacity-10 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white mb-12">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-primary font-bold text-xl leading-none">V</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">VendorBridge</span>
          </div>

          <div className="max-w-md space-y-6 mt-12 lg:mt-32">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Smart Procurement Starts Here
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Manage vendors, RFQs, quotations, approvals, purchase orders, and invoices from one intelligent platform.
            </p>
          </div>
        </div>

        {/* Abstract Illustration replacing actual image */}
        <div className="relative z-10 mt-12 lg:mt-auto hidden lg:block">
          <div className="w-full h-64 rounded-2xl bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 backdrop-blur-sm p-6 flex flex-col justify-between">
            <div className="w-1/2 h-8 rounded-full bg-white/20 mb-4" />
            <div className="space-y-3">
              <div className="w-full h-4 rounded-full bg-white/10" />
              <div className="w-4/5 h-4 rounded-full bg-white/10" />
              <div className="w-3/4 h-4 rounded-full bg-white/10" />
            </div>
            <div className="flex justify-end mt-4">
               <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form Area */}
      <div className="lg:w-1/2 flex flex-col relative">
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
