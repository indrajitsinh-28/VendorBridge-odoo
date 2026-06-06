import React from "react";
import { cn } from "../../utils/cn";
import type { VendorStatus } from "../../data/vendors";

interface StatusBadgeProps {
  status: VendorStatus;
  size?: "sm" | "md";
}

const CONFIG: Record<VendorStatus, { dot: string; bg: string; text: string; label: string }> = {
  Active: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Active",
  },
  Pending: {
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    label: "Pending",
  },
  Blocked: {
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    label: "Blocked",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { dot, bg, text, label } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        bg,
        text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      <span className={cn("rounded-full flex-shrink-0", dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {label}
    </span>
  );
}
