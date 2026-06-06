import React from "react";
import { Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { cn } from "../../utils/cn";
import { StatusBadge } from "./StatusBadge";
import type { Vendor } from "../../data/vendors";

interface VendorTableProps {
  vendors: Vendor[];
  onView: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Construction: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  IT: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  Logistics: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  Manufacturing: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  Healthcare: "bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400",
  Finance: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
};

export function VendorTable({ vendors, onView, onEdit, onDelete }: VendorTableProps) {
  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center mb-4">
          <ArrowUpDown className="w-7 h-7 text-primary/40" />
        </div>
        <p className="text-base font-semibold text-foreground">No vendors found</p>
        <p className="text-sm text-muted mt-1">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-muted/10">
            {["Vendor Name", "Category", "GST Number", "Contact Number", "Status", "Actions"].map((col) => (
              <th
                key={col}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap",
                  col === "Actions" && "text-center"
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, idx) => (
            <tr
              key={vendor.id}
              className={cn(
                "border-b border-muted/6 transition-colors duration-150 hover:bg-primary/4 dark:hover:bg-primary/8 group cursor-pointer animate-in fade-in",
                idx % 2 === 0 ? "bg-transparent" : "bg-muted/2 dark:bg-white/2"
              )}
              style={{ animationDelay: `${idx * 30}ms`, animationFillMode: "both" }}
              onClick={() => onView(vendor)}
            >
              {/* Vendor Name */}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">
                      {vendor.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {vendor.name}
                    </p>
                    <p className="text-[11px] text-muted">{vendor.id}</p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-3.5">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    CATEGORY_COLORS[vendor.category] ?? "bg-muted/10 text-muted"
                  )}
                >
                  {vendor.category}
                </span>
              </td>

              {/* GST */}
              <td className="px-4 py-3.5">
                <span className="text-sm text-foreground font-mono tracking-wide">
                  {vendor.gstNumber}
                </span>
              </td>

              {/* Contact */}
              <td className="px-4 py-3.5">
                <span className="text-sm text-foreground">{vendor.contactNumber}</span>
              </td>

              {/* Status */}
              <td className="px-4 py-3.5">
                <StatusBadge status={vendor.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onView(vendor)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(vendor)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/15 transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(vendor)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
