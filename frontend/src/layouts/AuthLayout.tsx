import React from "react";
import { ThemeToggle } from "../Components/ThemeToggle";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-background transition-colors duration-300 overflow-hidden">
      {/* Left Section - Branding & Illustration */}
      <div className="lg:w-1/2 h-full relative flex flex-col justify-between p-6 lg:p-10 bg-primary overflow-hidden">
        {/* Subtle butter-colored accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-accent opacity-10 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-accent opacity-10 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col gap-2.5 text-white mb-6">
            <div className="flex items-center gap-3.5 group cursor-pointer">
              <img src="/logo.png" alt="VyaparSetu Logo" className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5 shadow-lg shadow-black/15 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
              <div className="flex flex-col justify-center">
                <span className="text-3xl lg:text-4.5xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent leading-none">VyaparSetu</span>
                <span className="text-lg lg:text-xl font-bold text-accent tracking-wide mt-1.5 transition-all duration-300 group-hover:text-amber-300">व्यापार सेतु</span>
              </div>
            </div>
            <div className="h-[2px] w-24 bg-accent rounded-full opacity-80 transition-all duration-300 group-hover:w-36" />
          </div>

          <div className="max-w-md space-y-4 mt-6 lg:mt-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Smart Procurement Starts Here
            </h1>
            <p className="text-xs text-white/80 leading-relaxed">
              Manage vendors, RFQs, quotations, approvals, purchase orders, and invoices from one intelligent platform.
            </p>
            
            {/* Real-time ERP Stats Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Active Vendors</span>
                <p className="text-xl font-black text-white mt-0.5">1,420+</p>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Volume Managed</span>
                <p className="text-xl font-black text-white mt-0.5">₹48.6M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Dashboard Preview Illustration */}
        <div className="relative z-10 mt-6 lg:mt-auto hidden lg:block animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="w-full rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md p-4 shadow-2xl relative overflow-hidden group">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-50 pointer-events-none" />
            
            {/* Header Mock */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-2.5">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">LIVE OVERVIEW</span>
            </div>

            {/* mini chart & rows */}
            <div className="space-y-2.5">
              {/* Row 1 */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">VS</div>
                  <div>
                    <p className="text-[10px] font-bold text-white leading-none">VyaparSetu Procurement</p>
                    <p className="text-[7.5px] text-white/50 mt-0.5">PO #2345 approved</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-accent">₹1,85,400</span>
              </div>
              
              {/* Row 2 */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[9px] font-bold">IT</div>
                  <div>
                    <p className="text-[10px] font-bold text-white leading-none">Apex Solutions Ltd</p>
                    <p className="text-[7.5px] text-white/50 mt-0.5">RFQ Quotation received</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-white/70">Pending L2</span>
              </div>

              {/* Row 3 - Mini SVG Chart */}
              <div className="pt-1.5">
                <p className="text-[7.5px] font-bold text-white/35 uppercase tracking-wide mb-1.5">Monthly Spend Trend</p>
                <div className="flex items-end justify-between h-11 px-2 bg-white/2 rounded-xl border border-white/5 pt-3">
                  {[25, 45, 35, 75, 55, 90].map((height, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-3.5 rounded-t bg-accent/40 hover:bg-accent transition-colors duration-200" 
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[6.5px] text-white/30 mt-0.5 font-mono">{["J","F","M","A","M","J"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form Area */}
      <div className="lg:w-1/2 h-full flex flex-col relative overflow-y-auto bg-background">
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
