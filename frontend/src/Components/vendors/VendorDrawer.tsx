import React from "react";
import {
  X,
  Building2,
  FileText,
  Star,
  Truck,
  Zap,
  Download,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { StatusBadge } from "./StatusBadge";
import type { Vendor } from "../../data/vendors";

interface VendorDrawerProps {
  vendor: Vendor | null;
  onClose: () => void;
}

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-muted/20 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-6 text-right">{value}</span>
    </div>
  );
}

function RateBar({ value }: { value: number }) {
  const color =
    value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-muted/20 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export function VendorDrawer({ vendor, onClose }: VendorDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          vendor ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] lg:w-[480px] bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          vendor ? "translate-x-0" : "translate-x-full"
        )}
      >
        {!vendor ? null : (
          <>
            {/* Drawer header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-muted/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground leading-snug">{vendor.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted">{vendor.id}</span>
                    <span className="w-1 h-1 rounded-full bg-muted/40" />
                    <StatusBadge status={vendor.status} size="sm" />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-all mt-0.5"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Vendor Information */}
              <section>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Vendor Information
                </h3>
                <div className="bg-background rounded-2xl p-4 space-y-3.5">
                  {[
                    { icon: Building2, label: "Company Name", value: vendor.name },
                    { icon: FileText, label: "GST Number", value: vendor.gstNumber },
                    { icon: User, label: "Contact Person", value: vendor.contactPerson },
                    { icon: Mail, label: "Email", value: vendor.email },
                    { icon: Phone, label: "Phone Number", value: vendor.contactNumber },
                    { icon: MapPin, label: "Address", value: vendor.address },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted font-medium">{label}</p>
                        <p className="text-sm text-foreground font-medium break-words">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Documents
                </h3>
                <div className="space-y-2">
                  {vendor.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between bg-background rounded-xl px-4 py-3 group hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-[11px] text-muted">{doc.type} · {doc.size} · {doc.uploadedOn}</p>
                        </div>
                      </div>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {vendor.documents.length === 0 && (
                    <p className="text-sm text-muted text-center py-4">No documents uploaded yet.</p>
                  )}
                </div>
              </section>

              {/* Performance Metrics */}
              <section>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Performance Metrics
                </h3>
                <div className="bg-background rounded-2xl p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Truck className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs font-medium text-muted">Delivery Rating</span>
                    </div>
                    <RatingBar value={vendor.performance.deliveryRating} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Star className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs font-medium text-muted">Quality Score</span>
                    </div>
                    <RatingBar value={vendor.performance.qualityScore} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs font-medium text-muted">Response Rate</span>
                    </div>
                    <RateBar value={vendor.performance.responseRate} />
                  </div>

                  {/* Score summary */}
                  <div className="pt-2 border-t border-muted/10 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Delivery", value: `${vendor.performance.deliveryRating}/5` },
                      { label: "Quality", value: `${vendor.performance.qualityScore}/5` },
                      { label: "Response", value: `${vendor.performance.responseRate}%` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-card rounded-xl py-2.5">
                        <p className="text-base font-bold text-foreground">{value}</p>
                        <p className="text-[10px] text-muted mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Drawer footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-muted/10 flex-shrink-0">
              <button className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all">
                Edit Vendor
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-muted/20 text-foreground text-sm font-semibold hover:bg-background active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
