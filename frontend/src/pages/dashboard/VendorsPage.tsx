import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  RotateCcw,
  Filter,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { VENDOR_DATA, type Vendor, type VendorStatus, type VendorCategory } from "../../data/vendors";
import { StatCards } from "../../Components/vendors/StatCards";
import { VendorTable } from "../../Components/vendors/VendorTable";
import { VendorDrawer } from "../../Components/vendors/VendorDrawer";
import { AddVendorModal } from "../../Components/vendors/AddVendorModal";

type TabStatus = "All" | VendorStatus;

const CATEGORIES: VendorCategory[] = ["Construction", "IT", "Logistics", "Manufacturing", "Healthcare", "Finance"];
const STATUSES: VendorStatus[] = ["Active", "Pending", "Blocked"];

export function VendorsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | "">("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "">("");
  const [activeTab, setActiveTab] = useState<TabStatus>("All");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);

  // Filtered vendors
  const filtered = useMemo(() => {
    return VENDOR_DATA.filter((v) => {
      const matchSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.gstNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !categoryFilter || v.category === categoryFilter;
      const matchStatus = !statusFilter || v.status === statusFilter;
      const matchTab = activeTab === "All" || v.status === activeTab;
      return matchSearch && matchCategory && matchStatus && matchTab;
    });
  }, [search, categoryFilter, statusFilter, activeTab]);

  const tabCounts = useMemo(() => ({
    All: VENDOR_DATA.length,
    Active: VENDOR_DATA.filter((v) => v.status === "Active").length,
    Pending: VENDOR_DATA.filter((v) => v.status === "Pending").length,
    Blocked: VENDOR_DATA.filter((v) => v.status === "Blocked").length,
  }), []);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setStatusFilter("");
    setActiveTab("All");
  };

  const hasActiveFilters = search || categoryFilter || statusFilter || activeTab !== "All";

  const TABS: { key: TabStatus; label: string }[] = [
    { key: "All", label: "All" },
    { key: "Active", label: "Active" },
    { key: "Pending", label: "Pending" },
    { key: "Blocked", label: "Blocked" },
  ];

  const TAB_COLORS: Record<TabStatus, string> = {
    All: "text-primary",
    Active: "text-emerald-600 dark:text-emerald-400",
    Pending: "text-amber-600 dark:text-amber-400",
    Blocked: "text-red-600 dark:text-red-400",
  };

  const TAB_BADGE_COLORS: Record<TabStatus, string> = {
    All: "bg-primary/10 text-primary dark:bg-primary/20",
    Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    Blocked: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  };

  return (
    <>
      <div className="px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
            <p className="text-sm text-muted mt-0.5">Manage supplier profiles and registrations</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-sm hover:shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>

        {/* Stat Cards */}
        <StatCards vendors={VENDOR_DATA} />

        {/* Search & Filter */}
        <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] border border-muted/8 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors by name, GST, contact person…"
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Category filter */}
            <div className="relative min-w-[160px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as VendorCategory | "")}
                className="w-full h-10 pl-3 pr-8 rounded-xl border border-muted/20 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
            </div>

            {/* Status filter */}
            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as VendorStatus | "")}
                className="w-full h-10 pl-3 pr-8 rounded-xl border border-muted/20 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className={cn(
                "h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap",
                hasActiveFilters
                  ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                  : "border-muted/20 text-muted hover:bg-background"
              )}
            >
              <RotateCcw className={cn("w-3.5 h-3.5", hasActiveFilters && "animate-spin-once")} />
              Reset
            </button>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.15)] border border-muted/8 overflow-hidden">

          {/* Status Tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 border-b border-muted/10 overflow-x-auto pb-0">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
                  activeTab === key
                    ? cn("border-primary bg-primary/5 dark:bg-primary/10", TAB_COLORS[key])
                    : "border-transparent text-muted hover:text-foreground hover:bg-background"
                )}
              >
                {label}
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold transition-all",
                    activeTab === key ? TAB_BADGE_COLORS[key] : "bg-muted/15 text-muted"
                  )}
                >
                  {tabCounts[key]}
                </span>
              </button>
            ))}

            {/* Result count */}
            <div className="ml-auto pl-4 pb-2 text-xs text-muted whitespace-nowrap flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          <VendorTable
            vendors={filtered}
            onView={setSelectedVendor}
            onEdit={(v) => console.log("Edit", v.id)}
            onDelete={setDeleteTarget}
          />
        </div>
      </div>

      {/* Vendor Details Drawer */}
      <VendorDrawer
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />

      {/* Add Vendor Modal */}
      <AddVendorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-muted/10 p-6 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center mb-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <h3 className="text-base font-bold text-foreground">Remove Vendor?</h3>
              <p className="text-sm text-muted mt-1.5">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">{deleteTarget.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-10 rounded-xl border border-muted/20 text-foreground text-sm font-semibold hover:bg-background transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
