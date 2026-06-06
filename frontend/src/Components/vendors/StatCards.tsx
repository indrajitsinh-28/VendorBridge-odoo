import { Users, UserCheck, Clock, Ban, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../utils/cn";
import type { Vendor } from "../../data/vendors";

interface StatCardsProps {
  vendors: Vendor[];
}

export function StatCards({ vendors }: StatCardsProps) {
  const total = vendors.length;
  const active = vendors.filter((v) => v.status === "Active").length;
  const pending = vendors.filter((v) => v.status === "Pending").length;
  const blocked = vendors.filter((v) => v.status === "Blocked").length;

  const cards = [
    {
      label: "Total Vendors",
      value: total,
      icon: Users,
      trend: "+3 this month",
      up: true,
      iconBg: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary",
    },
    {
      label: "Active Vendors",
      value: active,
      icon: UserCheck,
      trend: "+2 this month",
      up: true,
      iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending Approvals",
      value: pending,
      icon: Clock,
      trend: "Needs review",
      up: false,
      iconBg: "bg-amber-50 dark:bg-amber-500/15",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Blocked Vendors",
      value: blocked,
      icon: Ban,
      trend: "No change",
      up: false,
      iconBg: "bg-red-50 dark:bg-red-500/15",
      iconColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] border border-muted/8 hover:shadow-[0_4px_20px_rgb(0,0,0,0.10)] dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wide">{card.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1.5">{card.value}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", card.iconBg)}>
                <Icon className={cn("w-5 h-5", card.iconColor)} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {card.up ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-muted" />
              )}
              <span className={cn("text-xs font-medium", card.up ? "text-emerald-600 dark:text-emerald-400" : "text-muted")}>
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
