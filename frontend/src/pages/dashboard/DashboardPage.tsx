import React from "react";
import {
  Users,
  ShoppingCart,
  Receipt,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VENDOR_DATA } from "../../data/vendors";

export function DashboardPage() {
  const navigate = useNavigate();
  const active = VENDOR_DATA.filter((v) => v.status === "Active").length;
  const pending = VENDOR_DATA.filter((v) => v.status === "Pending").length;

  const cards = [
    { label: "Total Vendors", value: VENDOR_DATA.length, icon: Users, color: "bg-primary/10 dark:bg-primary/20 text-primary", delta: "+3" },
    { label: "Purchase Orders", value: 47, icon: ShoppingCart, color: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400", delta: "+12" },
    { label: "Pending Invoices", value: 14, icon: Receipt, color: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400", delta: "+2" },
    { label: "Monthly Spend", value: "₹4.2M", icon: TrendingUp, color: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", delta: "+8%" },
  ];

  const activity = [
    { icon: CheckCircle2, color: "text-emerald-500", text: "BuildMate Industries approved", time: "2m ago" },
    { icon: Clock, color: "text-amber-500", text: "FastLog Transport pending review", time: "1h ago" },
    { icon: AlertCircle, color: "text-red-500", text: "DataSync IT Services blocked", time: "3h ago" },
    { icon: CheckCircle2, color: "text-emerald-500", text: "PO #PO-247 sent to NexaIT Solutions", time: "5h ago" },
    { icon: CheckCircle2, color: "text-emerald-500", text: "Invoice #INV-089 paid — MediCraft", time: "1d ago" },
  ];

  return (
    <div className="px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">Welcome back, Arjun. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] border border-muted/8 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgb(0,0,0,0.10)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wide">{c.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1.5">{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-3">{c.delta} this month</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Summary */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] border border-muted/8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Vendor Overview</h2>
            <button
              onClick={() => navigate("/vendors")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Donut-like visual */}
          <div className="flex items-center gap-6 mb-5">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-muted/10" />
                {/* Active arc */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#013E37" strokeWidth="3.5"
                  strokeDasharray={`${(active / VENDOR_DATA.length) * 87.96} 87.96`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-foreground">{VENDOR_DATA.length}</span>
                <span className="text-[10px] text-muted font-medium">Total</span>
              </div>
            </div>
            <div className="space-y-2.5 flex-1">
              {[
                { label: "Active", count: active, color: "bg-primary", pct: Math.round(active / VENDOR_DATA.length * 100) },
                { label: "Pending", count: pending, color: "bg-amber-400", pct: Math.round(pending / VENDOR_DATA.length * 100) },
                { label: "Blocked", count: VENDOR_DATA.filter(v => v.status === "Blocked").length, color: "bg-red-400", pct: Math.round(VENDOR_DATA.filter(v => v.status === "Blocked").length / VENDOR_DATA.length * 100) },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-muted font-medium">{s.label}</span>
                    </div>
                    <span className="font-semibold text-foreground">{s.count} <span className="text-muted font-normal">({s.pct}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/15 overflow-hidden">
                    <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent vendors */}
          <div className="border-t border-muted/10 pt-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Recently Added</p>
            <div className="space-y-2">
              {VENDOR_DATA.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  onClick={() => navigate("/vendors")}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-background cursor-pointer transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-[10px] font-bold">{v.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{v.name}</p>
                    <p className="text-[11px] text-muted">{v.category} · {v.joinedDate}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" : v.status === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"}`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] border border-muted/8">
          <h2 className="text-sm font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex gap-3 items-start">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.color}`} />
                  <div>
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-[11px] text-muted mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/activity-logs")}
            className="w-full mt-5 h-9 rounded-xl border border-muted/20 text-xs font-semibold text-muted hover:text-foreground hover:bg-background transition-all flex items-center justify-center gap-1"
          >
            View All Activity <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
