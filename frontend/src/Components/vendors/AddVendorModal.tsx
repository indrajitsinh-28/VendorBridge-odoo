import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface AddVendorModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Construction", "IT", "Logistics", "Manufacturing", "Healthcare", "Finance"];

export function AddVendorModal({ open, onClose }: AddVendorModalProps) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    gstNumber: "",
    contactPerson: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend — just close
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-muted/10 transition-all duration-300 pointer-events-auto",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-muted/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Building2 className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Add New Vendor</h2>
                <p className="text-xs text-muted mt-0.5">Fill in the supplier details below</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Infra Supplies Pvt Ltd"
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.gstNumber}
                    onChange={(e) => set("gstNumber", e.target.value)}
                    placeholder="27AABCI1234A1Z5"
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.contactPerson}
                    onChange={(e) => set("contactPerson", e.target.value)}
                    placeholder="Full name"
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="vendor@company.com"
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.contactNumber}
                    onChange={(e) => set("contactNumber", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Registered office address"
                  className="w-full px-3 py-2 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-muted/10">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-muted/20 text-foreground text-sm font-semibold hover:bg-background transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
              >
                Add Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
