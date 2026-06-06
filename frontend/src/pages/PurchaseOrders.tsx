import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, ShoppingBag, CheckCircle2,
  DollarSign, FileDown, BarChart3, Activity, Settings, Bell,
  ChevronDown, LogOut, Menu, X, FileCode, Mail, Printer,
  Download, AlertCircle, Search, Package, Truck,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface POItem { name: string; qty: number; unit: string; price: number; }
interface AddressBox { orgName: string; address: string; gstin: string; }
type POStatus = "Draft" | "Approved" | "Delivered" | "Cancelled";
type POPriority = "High" | "Medium" | "Low";

interface PurchaseOrder {
  id: string;
  poDate: string;
  deliveryDate: string;
  billTo: AddressBox;
  vendor: AddressBox;
  items: POItem[];
  status: POStatus;
  priority: POPriority;
  paymentTerms: string;
  shippingMode: string;
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-2025-0041",
    poDate: "02 Jan, 2025",
    deliveryDate: "20 Jan, 2025",
    billTo: { orgName: "VendorBridge Procurement Corp", address: "Plot 7, Sector 44, Gurugram, Haryana – 122003", gstin: "06AABCV1234A1Z5" },
    vendor: { orgName: "Infra Supplies Pvt Ltd", address: "Plot 12, MIDC Industrial Area, Pune, Maharashtra – 411019", gstin: "27AABCI1234A1Z5" },
    items: [
      { name: "Heavy-duty scaffolding set", qty: 10, unit: "Set", price: 14500 },
      { name: "Portland cement (50 kg bag)", qty: 200, unit: "Bag", price: 420 },
      { name: "Steel TMT bars 12mm", qty: 50, unit: "Bundle", price: 3800 },
    ],
    status: "Approved",
    priority: "High",
    paymentTerms: "Net 30",
    shippingMode: "Road Freight",
  },
  {
    id: "PO-2025-0042",
    poDate: "05 Jan, 2025",
    deliveryDate: "22 Jan, 2025",
    billTo: { orgName: "VendorBridge Procurement Corp", address: "Plot 7, Sector 44, Gurugram, Haryana – 122003", gstin: "06AABCV1234A1Z5" },
    vendor: { orgName: "Tech Core Ltd", address: "Tower B, Cyber City, Gurugram, Haryana – 122002", gstin: "07AABCT5678B1Z3" },
    items: [
      { name: "Enterprise rack server (2U)", qty: 2, unit: "Unit", price: 185000 },
      { name: "Layer-3 managed switch 48-port", qty: 3, unit: "Unit", price: 42000 },
      { name: "CAT6A patch cables (1m)", qty: 100, unit: "Pcs", price: 350 },
    ],
    status: "Delivered",
    priority: "High",
    paymentTerms: "Net 45",
    shippingMode: "Air Cargo",
  },
  {
    id: "PO-2025-0043",
    poDate: "10 Jan, 2025",
    deliveryDate: "28 Jan, 2025",
    billTo: { orgName: "VendorBridge Procurement Corp", address: "Plot 7, Sector 44, Gurugram, Haryana – 122003", gstin: "06AABCV1234A1Z5" },
    vendor: { orgName: "FastLog Transport", address: "NH-8, Logistics Park, Bhiwandi, Thane – 421302", gstin: "19AABCF9012C1Z1" },
    items: [
      { name: "Freight forwarding — Pune to Delhi", qty: 1, unit: "Trip", price: 28000 },
      { name: "Packaging material (standard)", qty: 50, unit: "Box", price: 180 },
    ],
    status: "Draft",
    priority: "Medium",
    paymentTerms: "Advance",
    shippingMode: "Road Freight",
  },
  {
    id: "PO-2025-0044",
    poDate: "14 Jan, 2025",
    deliveryDate: "05 Feb, 2025",
    billTo: { orgName: "VendorBridge Procurement Corp", address: "Plot 7, Sector 44, Gurugram, Haryana – 122003", gstin: "06AABCV1234A1Z5" },
    vendor: { orgName: "MediCraft Healthcare", address: "Sector 18, Noida, Uttar Pradesh – 201301", gstin: "09AABCM6789G1Z3" },
    items: [
      { name: "First aid medical kits (large)", qty: 30, unit: "Kit", price: 2200 },
      { name: "Surgical gloves box (L)", qty: 100, unit: "Box", price: 450 },
      { name: "N95 respirator masks", qty: 500, unit: "Pcs", price: 85 },
    ],
    status: "Approved",
    priority: "Medium",
    paymentTerms: "Net 30",
    shippingMode: "Road Freight",
  },
];

const STATUS_STYLES: Record<POStatus, string> = {
  Draft: "bg-muted/10 text-muted border-muted/20",
  Approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Delivered: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const PRIORITY_STYLES: Record<POPriority, string> = {
  High: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Medium: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export function PurchaseOrders() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(PURCHASE_ORDERS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const filtered = useMemo(() =>
    PURCHASE_ORDERS.filter(po =>
      !searchQuery ||
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor.orgName.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  const selected = useMemo(() =>
    PURCHASE_ORDERS.find(po => po.id === selectedId) || PURCHASE_ORDERS[0],
    [selectedId]);

  const totals = useMemo(() => {
    const subtotal = selected.items.reduce((a, i) => a + i.qty * i.price, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    return { subtotal, cgst, sgst, grandTotal: subtotal + cgst + sgst };
  }, [selected]);

  const toast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openEmail = () => {
    setEmailTo(selected.vendor.orgName.toLowerCase().replace(/\s+/g, "") + "@vendor.com");
    setEmailSubject(`Purchase Order ${selected.id} — VendorBridge Procurement`);
    setEmailBody(`Dear Procurement Team,\n\nPlease find the attached Purchase Order ${selected.id} dated ${selected.poDate}.\n\nExpected delivery: ${selected.deliveryDate}\nPayment terms: ${selected.paymentTerms}\n\nKindly acknowledge receipt and confirm availability.\n\nBest regards,\nArjun Kapoor\nProcurement Manager, VendorBridge`);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (e: FormEvent) => {
    e.preventDefault();
    setIsEmailModalOpen(false);
    toast(`PO ${selected.id} dispatched to ${emailTo} successfully.`);
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Vendors", icon: Users, path: "/vendors" },
    { name: "RFQs", icon: FileText, path: "/rfqs" },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations" },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals" },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: true },
    { name: "Invoices", icon: FileDown, path: "/invoices" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Activity Logs", icon: Activity, path: "/activity-logs" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const SidebarContent = () => (
    <>
      <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.path} onClick={() => { navigate(item.path); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${"active" in item && item.active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
              <Icon className={`w-4 h-4 flex-shrink-0 ${"active" in item && item.active ? "text-accent" : ""}`} />
              {item.name}
              {"active" in item && item.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-1">
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
          <span>{theme === "light" ? "🌙" : "☀️"}</span>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button onClick={() => navigate("/login")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/15 hover:text-red-400 text-sm font-medium transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white shrink-0 h-screen sticky top-0 border-r border-white/5 shadow-xl print:hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-sm">VB</span>
          </div>
          <div>
            <span className="font-bold text-base leading-none block">VendorBridge</span>
            <span className="text-[10px] text-white/50 font-medium">Procurement ERP</span>
          </div>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden print:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-primary text-white h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-primary font-black text-sm">VB</span>
                </div>
                <span className="font-bold text-base">VendorBridge</span>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-muted/10 h-16 flex items-center justify-between px-6 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary/5">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-muted uppercase tracking-wider hidden sm:block">Purchase Orders</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-muted hover:bg-primary/5 transition-all">
              <span className="text-lg leading-none">{theme === "light" ? "🌙" : "☀️"}</span>
            </button>
            <div className="relative">
              <button onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }} className="p-2 rounded-xl text-muted hover:bg-primary/5 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card" />
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-muted/10"><span className="font-semibold text-sm">Notifications</span></div>
                  <div className="p-4 text-xs text-muted text-center">No new notifications</div>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }} className="flex items-center gap-2 p-1 rounded-xl hover:bg-primary/5 transition-all">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">AK</div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold leading-none">Arjun Kapoor</p>
                  <p className="text-[10px] text-muted mt-0.5">Procurement Mgr</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-muted/10">
                    <p className="font-semibold text-sm">Arjun Kapoor</p>
                    <p className="text-xs text-muted">arjun@company.com</p>
                  </div>
                  <button onClick={() => navigate("/login")} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* PO List Panel */}
          <aside className="w-full md:w-80 border-r border-muted/10 bg-card overflow-y-auto flex-shrink-0 flex flex-col print:hidden">
            <div className="p-4 border-b border-muted/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Purchase Orders</span>
                <span className="text-xs font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-full">{PURCHASE_ORDERS.length} total</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input type="text" placeholder="Search PO number, vendor…" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-background border border-muted/20 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
            </div>
            <nav className="flex-1 p-2 space-y-1">
              {filtered.map(po => (
                <button key={po.id} onClick={() => setSelectedId(po.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 border ${po.id === selectedId ? "bg-primary/5 border-primary/20" : "border-transparent hover:bg-primary/3"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-primary tracking-wide">{po.id}</span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${STATUS_STYLES[po.status]}`}>{po.status}</span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">{po.vendor.orgName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted font-medium">{po.poDate}</span>
                    <span className="text-[10px] font-mono font-bold">
                      ₹{po.items.reduce((a, i) => a + i.qty * i.price, 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Truck className="w-3 h-3 text-muted" />
                    <span className="text-[10px] text-muted">Due {po.deliveryDate}</span>
                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md ${PRIORITY_STYLES[po.priority]}`}>{po.priority}</span>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* PO Detail Panel */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 print:p-0">

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-muted/10 pb-5 print:hidden">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">Purchase Order</h1>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PRIORITY_STYLES[selected.priority]}`}>{selected.priority} Priority</span>
                </div>
                <p className="text-xs text-muted mt-1 font-mono">{selected.id} · {selected.poDate} · Delivery by {selected.deliveryDate}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => toast(`${selected.id}.pdf download initiated.`)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-muted/20 hover:bg-primary/5 text-xs font-bold transition-all active:scale-95">
                  <Download className="w-4 h-4 text-muted" /> Download PDF
                </button>
                <button onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-muted/20 hover:bg-primary/5 text-xs font-bold transition-all active:scale-95">
                  <Printer className="w-4 h-4 text-muted" /> Print
                </button>
                <button onClick={openEmail}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
                  <Mail className="w-4 h-4" /> Send to Vendor
                </button>
              </div>
            </div>

            {toastMessage && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-primary font-semibold animate-in slide-in-from-top duration-200 print:hidden">
                <AlertCircle className="w-4 h-4 shrink-0" /> {toastMessage}
              </div>
            )}

            {/* PO Document Card */}
            <div className="bg-card rounded-2xl border border-muted/10 p-6 sm:p-8 shadow-sm space-y-8 print:border-0 print:shadow-none">

              {/* Print header */}
              <div className="hidden print:block border-b border-gray-300 pb-4">
                <h1 className="text-xl font-bold uppercase text-black">OFFICIAL PURCHASE ORDER</h1>
                <p className="text-xs text-gray-500 font-mono mt-1">{selected.id}</p>
              </div>

              {/* Meta info row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-background rounded-2xl border border-muted/5">
                {[
                  { label: "PO Number", value: selected.id },
                  { label: "PO Date", value: selected.poDate },
                  { label: "Expected Delivery", value: selected.deliveryDate },
                  { label: "Payment Terms", value: selected.paymentTerms },
                  { label: "Shipping Mode", value: selected.shippingMode },
                  { label: "Priority", value: selected.priority },
                  { label: "Status", value: selected.status },
                  { label: "Items", value: `${selected.items.length} line items` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="text-[10px] text-muted font-semibold uppercase tracking-wide block">{label}</span>
                    <span className="text-xs font-bold text-foreground mt-0.5 block">{value}</span>
                  </div>
                ))}
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-background rounded-2xl border border-muted/5">
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wide block">Bill To:</span>
                  <p className="text-sm font-bold text-foreground">{selected.billTo.orgName}</p>
                  <p className="text-muted leading-relaxed">{selected.billTo.address}</p>
                  <p className="font-mono text-foreground">GSTIN: <span className="font-bold">{selected.billTo.gstin}</span></p>
                </div>
                <div className="space-y-1.5 text-xs md:border-l md:border-muted/10 md:pl-6">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wide block">Vendor / Supplier:</span>
                  <p className="text-sm font-bold text-foreground">{selected.vendor.orgName}</p>
                  <p className="text-muted leading-relaxed">{selected.vendor.address}</p>
                  <p className="font-mono text-foreground">GSTIN: <span className="font-bold">{selected.vendor.gstin}</span></p>
                </div>
              </div>

              {/* Line items table */}
              <div className="border border-muted/10 rounded-2xl overflow-hidden bg-background">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-muted/10 bg-card text-muted uppercase text-[10px] font-bold">
                      <th className="px-5 py-3.5"># Item Description</th>
                      <th className="px-5 py-3.5 text-center w-16">Qty</th>
                      <th className="px-5 py-3.5 w-16">Unit</th>
                      <th className="px-5 py-3.5 text-right w-32">Unit Price</th>
                      <th className="px-5 py-3.5 text-right w-36">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-muted/6 last:border-0 hover:bg-primary/2 transition-colors">
                        <td className="px-5 py-3.5 text-xs font-semibold text-foreground">
                          <span className="text-muted mr-2">{idx + 1}.</span>{item.name}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-foreground text-center">{item.qty}</td>
                        <td className="px-5 py-3.5 text-xs text-muted">{item.unit}</td>
                        <td className="px-5 py-3.5 text-xs text-foreground text-right font-mono">
                          ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-foreground text-right font-mono font-bold">
                          ₹{(item.qty * item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-muted/10 bg-card/40">
                      <td colSpan={3} className="hidden sm:table-cell" />
                      <td className="px-5 py-2.5 text-xs font-medium text-muted text-right">Subtotal</td>
                      <td className="px-5 py-2.5 text-xs text-foreground text-right font-mono font-bold">
                        ₹{totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-card/40">
                      <td colSpan={3} className="hidden sm:table-cell" />
                      <td className="px-5 py-2.5 text-xs font-medium text-muted text-right">CGST (9%)</td>
                      <td className="px-5 py-2.5 text-xs text-foreground text-right font-mono font-bold">
                        ₹{totals.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-card/40">
                      <td colSpan={3} className="hidden sm:table-cell" />
                      <td className="px-5 py-2.5 text-xs font-medium text-muted text-right">SGST (9%)</td>
                      <td className="px-5 py-2.5 text-xs text-foreground text-right font-mono font-bold">
                        ₹{totals.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-t border-muted/10 bg-card/40">
                      <td colSpan={3} className="hidden sm:table-cell" />
                      <td className="px-5 py-4 text-xs font-bold text-primary dark:text-accent text-right uppercase">Grand Total</td>
                      <td className="px-5 py-4 text-sm text-primary dark:text-accent text-right font-mono font-black">
                        ₹{totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status & approve action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-muted/10 print:hidden">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted">Current Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
                {selected.status === "Draft" && (
                  <button onClick={() => toast(`PO ${selected.id} approved and sent to vendor.`)}
                    className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all active:scale-95">
                    Approve &amp; Send PO
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setIsEmailModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-card rounded-2xl border border-muted/15 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-muted/10 flex items-center justify-between">
              <h3 className="text-sm font-bold">Send Purchase Order</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="p-1 rounded-lg hover:bg-primary/5">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase block mb-1.5">To</label>
                <input type="email" required value={emailTo} onChange={e => setEmailTo(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase block mb-1.5">Subject</label>
                <input type="text" required value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase block mb-1.5">Message</label>
                <textarea rows={5} required value={emailBody} onChange={e => setEmailBody(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" />
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-primary/3 border border-muted/10 rounded-xl text-xs">
                <FileCode className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted">Attachment:</span>
                <span className="text-foreground font-medium">{selected.id}.pdf (128 KB)</span>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-muted/10">
                <button type="button" onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 h-10 rounded-xl border border-muted/20 text-xs font-bold hover:bg-background transition-all">Cancel</button>
                <button type="submit"
                  className="px-5 h-10 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm">Send PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close dropdowns on outside click */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setIsProfileOpen(false); setIsNotificationsOpen(false); }} />
      )}
    </div>
  );
}
