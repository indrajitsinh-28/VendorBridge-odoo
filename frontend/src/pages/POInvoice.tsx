import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingBag,
  CheckCircle2,
  DollarSign,
  FileDown,
  BarChart3,
  Activity,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  FileCode,
  Mail,
  Printer,
  Download,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Interfaces
interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

interface AddressBox {
  orgName: string;
  address: string;
  gstin: string;
}

interface InvoiceDocument {
  id: string;
  poNumber: string;
  poDate: string;
  invoiceDate: string;
  dueDate: string;
  billTo: AddressBox;
  vendor: AddressBox;
  items: InvoiceItem[];
  status: "Pending Payment" | "Paid" | "Draft";
}

// Initial Mock Invoice Documents
const INITIAL_INVOICES: InvoiceDocument[] = [
  {
    id: "INV-2025-0068",
    poNumber: "PO-2025-0068",
    poDate: "21 May, 2025",
    invoiceDate: "21 May, 2025",
    dueDate: "21 June, 2025",
    billTo: {
      orgName: "VendorBridge Procurement Corp",
      address: "123 Business Park, Ahmedabad, Gujarat - 380015",
      gstin: "253834381FB"
    },
    vendor: {
      orgName: "Infra Supplies Pvt Ltd",
      address: "456, Industrial Estate, Surat, Gujarat - 395003",
      gstin: "343434DB4523"
    },
    items: [
      { name: "Ergonomic chair", qty: 25, price: 3500 },
      { name: "Tech Core LTD item", qty: 10, price: 8200 }
    ],
    status: "Pending Payment"
  },
  {
    id: "INV-2025-0069",
    poNumber: "PO-2025-0069",
    poDate: "22 May, 2025",
    invoiceDate: "22 May, 2025",
    dueDate: "22 June, 2025",
    billTo: {
      orgName: "VendorBridge Procurement Corp",
      address: "123 Business Park, Ahmedabad, Gujarat - 380015",
      gstin: "253834381FB"
    },
    vendor: {
      orgName: "Apex Solutions India Ltd",
      address: "Phase 3, Hinjewadi IT Park, Pune, Maharashtra - 411057",
      gstin: "27AAAAA1111A1Z1"
    },
    items: [
      { name: "Enterprise Database server node", qty: 1, price: 120000 },
      { name: "High-speed switches layer 3", qty: 2, price: 45000 }
    ],
    status: "Paid"
  }
];

export function POInvoice() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect active page based on pathname
  const isPOPage = location.pathname.includes("purchase-orders");

  // State
  const [documents, setDocuments] = useState<InvoiceDocument[]>(INITIAL_INVOICES);
  const [selectedDocId, setSelectedDocId] = useState<string>("INV-2025-0068");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // UI responsive states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Selected Document object
  const selectedDoc = useMemo(() => {
    return documents.find((doc) => doc.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Calculations
  const calculatedTotals = useMemo(() => {
    const subtotal = selectedDoc.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    const cgst = subtotal * 0.09; // 9% CGST
    const sgst = subtotal * 0.09; // 9% SGST
    const grandTotal = subtotal + cgst + sgst;
    
    return { subtotal, cgst, sgst, grandTotal };
  }, [selectedDoc]);

  // Sidebar link mapping
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors", icon: Users, path: "/vendors", active: false },
    { name: "RFQs", icon: FileText, path: "/rfqs", active: false },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals", active: false },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: isPOPage },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: !isPOPage },
    { name: "Reports", icon: BarChart3, path: "/reports", active: false },
    { name: "Activity", icon: Activity, path: "/activity-logs", active: false },
    { name: "Settings", icon: Settings, path: "/settings", active: false }
  ];

  // Actions
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadPDF = () => {
    triggerToast(`Document ${isPOPage ? selectedDoc.poNumber : selectedDoc.id}.pdf download initiated successfully.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const openEmailModal = () => {
    setEmailTo(selectedDoc.vendor.orgName.toLowerCase().replace(/\s+/g, "") + "@company.com");
    setEmailSubject(`Procurement ${isPOPage ? "Purchase Order" : "Invoice"} ${isPOPage ? selectedDoc.poNumber : selectedDoc.id} - VendorBridge`);
    setEmailBody(`Dear accounts team,\n\nPlease find attached the official procurement document reference ${isPOPage ? selectedDoc.poNumber : selectedDoc.id} generated on behalf of VendorBridge Procurement Corp.\n\nBest regards,\nArjun Kapoor\nProcurement Manager`);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (e: FormEvent) => {
    e.preventDefault();
    setIsEmailModalOpen(false);
    triggerToast(`Email dispatch successful! Document sent to ${emailTo}.`);
  };

  const handleMarkAsPaid = () => {
    setDocuments(
      documents.map((doc) => {
        if (doc.id !== selectedDoc.id) return doc;
        return {
          ...doc,
          status: "Paid" as const
        };
      })
    );
    triggerToast(`Document ${selectedDoc.id} marked as Paid.`);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* 1. LEFT SIDEBAR (Desktop) - print:hidden removes sidebar when printing */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white shrink-0 h-screen sticky top-0 border-r border-white/5 shadow-xl transition-all duration-300 print:hidden">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center font-black text-sm">
            VB
          </div>
          <div>
            <span className="font-bold text-base tracking-wide leading-none block">VendorBridge</span>
            <span className="text-[10px] text-white/50 font-medium">Procurement ERP</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  item.active
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-200 ${item.active ? "text-accent" : "group-hover:scale-110"}`} />
                <span>{item.name.replace(" (Active)", "")}{item.active ? " (Active)" : ""}</span>
                {item.active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            <span className="text-base">{theme === "light" ? "🌙" : "☀️"}</span>
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/15 hover:text-red-400 transition-all text-sm font-medium mt-1"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAW */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden print:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <aside className="relative flex flex-col w-64 bg-primary text-white h-full p-5 shadow-2xl border-r border-white/5 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center font-black text-sm">
                  VB
                </div>
                <div>
                  <h1 className="font-bold text-base leading-none">VendorBridge</h1>
                  <span className="text-[10px] text-white/50">Procurement ERP</span>
                </div>
              </div>
              <button
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 py-5 space-y-0.5 overflow-y-auto">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      navigate(item.path);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      item.active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.name.replace(" (Active)", "")}{item.active ? " (Active)" : ""}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/10 pt-4 space-y-1">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 text-sm font-medium"
              >
                <span className="text-base">{theme === "light" ? "🌙" : "☀️"}</span>
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/15 text-sm font-medium"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden print:w-full print:p-0">
        
        {/* 2. TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-card border-b border-muted/10 h-16 flex items-center justify-between px-6 transition-all duration-300 print:hidden">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                {isPOPage ? "Purchase Orders Manager" : "Invoice Center"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
              title="Theme Toggle"
            >
              <span className="text-lg leading-none">{theme === "light" ? "🌙" : "☀️"}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-muted/10 flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                  </div>
                  <div className="p-4 text-xs text-muted text-center">No new notifications</div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                  AK
                </div>
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-semibold leading-none">Arjun Kapoor</p>
                  <p className="text-[10px] text-muted mt-0.5">Procurement Mgr</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-muted/10">
                    <p className="font-semibold text-sm">Arjun Kapoor</p>
                    <p className="text-xs text-muted">arjun@company.com</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => navigate("/login")} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. MAIN WORKFLOW BODY */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden print:w-full print:p-0">
          
          {/* Master Side Panel: List of POs / Invoices - print:hidden */}
          <aside className="w-full md:w-80 border-r border-muted/10 bg-card overflow-y-auto flex-shrink-0 flex flex-col transition-all print:hidden">
            <div className="p-4 border-b border-muted/10">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                {isPOPage ? "Purchase Orders Logs" : "Generated Invoices"}
              </span>
            </div>
            
            <nav className="flex-1 p-2 space-y-1">
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDoc.id;
                
                const statusBadge =
                  doc.status === "Paid"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : doc.status === "Pending Payment"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-primary/5 text-muted border-muted/20";

                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex flex-col border ${
                      isSelected
                        ? "bg-primary/5 border-primary/20 text-foreground dark:bg-accent/5 dark:border-accent/30"
                        : "border-transparent text-muted hover:bg-primary/2 dark:hover:bg-white/2"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-primary dark:text-accent tracking-wide">
                      {isPOPage ? doc.poNumber : doc.id}
                    </span>
                    <span className="text-xs font-bold text-foreground mt-1 truncate">{doc.vendor.orgName}</span>
                    <div className="flex items-center justify-between mt-3.5 w-full">
                      <span className="text-[10px] font-mono font-semibold">₹{doc.items.reduce((a,c) => a + c.qty * c.price, 0).toLocaleString("en-IN")}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${statusBadge}`}>
                        {doc.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Details Panel: Invoice Template */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 print:p-0 print:overflow-visible print:w-full print:bg-white print:text-black">
            
            {/* Action Bar (Top of invoice card) - print:hidden */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-muted/10 pb-5 print:hidden">
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-white">
                  {isPOPage ? "Purchase Order" : "Invoice Document"}
                </h1>
                <p className="text-xs font-semibold text-muted">
                  {selectedDoc.poNumber}-auto-generated after approval
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-muted/20 hover:bg-primary/5 text-foreground text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
                >
                  <Download className="w-4 h-4 text-muted" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-muted/20 hover:bg-primary/5 text-foreground text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
                >
                  <Printer className="w-4 h-4 text-muted" />
                  <span>Print</span>
                </button>
                <button
                  onClick={openEmailModal}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-95 whitespace-nowrap shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email</span>
                </button>
              </div>
            </div>

            {/* Toast alert - print:hidden */}
            {toastMessage && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-primary dark:text-accent font-semibold animate-in slide-in-from-top duration-200 print:hidden">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* 8. DETAILED INVOICE WRAPPER CARD */}
            <div className="bg-card rounded-2xl border border-muted/10 p-6 sm:p-8 shadow-sm space-y-8 print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black">
              
              {/* Header Title (For print only context, hidden on screen) */}
              <div className="hidden print:block border-b border-gray-300 pb-4 mb-6">
                <h1 className="text-xl font-bold uppercase text-black">
                  {isPOPage ? "OFFICIAL PURCHASE ORDER" : "PROCUREMENT INVOICE"}
                </h1>
                <p className="text-xs text-gray-500 font-mono mt-1">{selectedDoc.poNumber}</p>
              </div>

              {/* Bill To & Vendor Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-background rounded-2xl border border-muted/5 print:border print:border-gray-200 print:bg-transparent">
                {/* Bill to */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-muted font-bold block uppercase tracking-wide print:text-gray-500">Bill To:</span>
                  <p className="text-sm font-bold text-foreground print:text-black">{selectedDoc.billTo.orgName}</p>
                  <p className="text-muted leading-relaxed font-semibold print:text-gray-600">{selectedDoc.billTo.address}</p>
                  <p className="text-foreground font-mono print:text-black mt-1 font-semibold">
                    GSTIN: <span className="font-bold">{selectedDoc.billTo.gstin}</span>
                  </p>
                </div>

                {/* Vendor info */}
                <div className="space-y-2 text-xs md:border-l md:border-muted/10 md:pl-6 print:border-gray-200 print:border-l">
                  <span className="text-[10px] text-muted font-bold block uppercase tracking-wide print:text-gray-500">Vendor / Supplier:</span>
                  <p className="text-sm font-bold text-foreground print:text-black">{selectedDoc.vendor.orgName}</p>
                  <p className="text-muted leading-relaxed font-semibold print:text-gray-600">{selectedDoc.vendor.address}</p>
                  <p className="text-foreground font-mono print:text-black mt-1 font-semibold">
                    GSTIN: <span className="font-bold">{selectedDoc.vendor.gstin}</span>
                  </p>
                </div>
              </div>

              {/* Order reference dates details row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold py-4 border-y border-muted/10 print:border-gray-200">
                <div>
                  <span className="text-muted block print:text-gray-500">PO Number:</span>
                  <span className="font-bold text-foreground mt-0.5 block print:text-black">{selectedDoc.poNumber}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-gray-500">PO Date:</span>
                  <span className="font-medium text-foreground mt-0.5 block print:text-black">{selectedDoc.poDate}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-gray-500">Invoice Date:</span>
                  <span className="font-medium text-foreground mt-0.5 block print:text-black">{selectedDoc.invoiceDate}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-gray-500">Due Date:</span>
                  <span className="font-medium text-foreground mt-0.5 block print:text-black">{selectedDoc.dueDate}</span>
                </div>
              </div>

              {/* Line Items Calculations Table */}
              <div className="border border-muted/10 rounded-2xl overflow-hidden bg-background print:border-gray-200 print:bg-transparent">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-muted/10 text-muted uppercase text-[10px] font-bold bg-card print:border-gray-200 print:bg-gray-100 print:text-gray-700">
                      <th className="px-5 py-3.5">Item</th>
                      <th className="px-5 py-3.5 text-center w-20">Qty</th>
                      <th className="px-5 py-3.5 text-right w-32">Unit Price</th>
                      <th className="px-5 py-3.5 text-right w-36">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDoc.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-muted/6 last:border-0 hover:bg-primary/2 print:border-gray-200">
                        <td className="px-5 py-3.5 text-xs font-semibold text-foreground print:text-black">{item.name}</td>
                        <td className="px-5 py-3.5 text-xs font-bold text-foreground text-center print:text-black">{item.qty}</td>
                        <td className="px-5 py-3.5 text-xs text-foreground text-right font-mono print:text-black">
                          ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-foreground text-right font-mono font-bold print:text-black">
                          ₹{(item.qty * item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Calculations Summary rows */}
                    <tr className="border-t border-muted/10 bg-card/40 print:border-gray-200 print:bg-transparent">
                      <td colSpan={2} className="hidden sm:table-cell" />
                      <td className="px-5 py-2.5 text-xs font-medium text-muted text-right print:text-gray-500">Subtotal</td>
                      <td className="px-5 py-2.5 text-xs text-foreground text-right font-mono font-bold print:text-black">
                        ₹{calculatedTotals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-card/40 print:bg-transparent">
                      <td colSpan={2} className="hidden sm:table-cell" />
                      <td className="px-5 py-2.5 text-xs font-medium text-muted text-right print:text-gray-500">CGST (9%)</td>
                      <td className="px-5 py-2.5 text-xs text-foreground text-right font-mono font-bold print:text-black">
                        ₹{calculatedTotals.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-card/40 print:bg-transparent">
                      <td colSpan={2} className="hidden sm:table-cell" />
                      <td className="px-5 py-2.5 text-xs font-medium text-muted text-right print:text-gray-500">SGST (9%)</td>
                      <td className="px-5 py-2.5 text-xs text-foreground text-right font-mono font-bold print:text-black">
                        ₹{calculatedTotals.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-card/45 border-t border-muted/10 print:border-gray-200 print:bg-transparent">
                      <td colSpan={2} className="hidden sm:table-cell" />
                      <td className="px-5 py-4 text-xs font-bold text-primary dark:text-accent text-right print:text-black uppercase">Grand Total</td>
                      <td className="px-5 py-4 text-sm text-primary dark:text-accent text-right font-mono font-black print:text-black">
                        ₹{calculatedTotals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status Tracking indicator & Update actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-muted/10 print:hidden">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted">Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedDoc.status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedDoc.status === "Paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {selectedDoc.status}
                  </span>
                </div>

                {selectedDoc.status === "Pending Payment" && (
                  <button
                    onClick={handleMarkAsPaid}
                    className="h-10 px-5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary dark:text-accent dark:hover:bg-accent/10 text-xs font-bold transition-all active:scale-95 self-start sm:self-auto"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>

            </div>

          </main>
        </div>

      </div>

      {/* 9. MOCK EMAIL MODAL */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs animate-in fade-in duration-300" onClick={() => setIsEmailModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl border border-muted/15 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-muted/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Email Draft Dispatch</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="p-1 rounded-lg hover:bg-primary/5 dark:hover:bg-white/5">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xxs font-bold text-muted uppercase">Recipient (To)</label>
                <input
                  type="email"
                  required
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-bold text-muted uppercase">Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-bold text-muted uppercase">Message Body</label>
                <textarea
                  rows={6}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-4 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                />
              </div>

              {/* Attachment Preview badge */}
              <div className="flex items-center gap-2 p-2.5 bg-primary/2 dark:bg-white/2 border border-muted/5 rounded-xl text-xxs font-bold">
                <FileCode className="w-4 h-4 text-primary dark:text-accent" />
                <span className="text-muted">Attachment:</span>
                <span className="text-foreground">{isPOPage ? selectedDoc.poNumber : selectedDoc.id}.pdf (152 KB)</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-muted/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 h-10 rounded-xl border border-muted/20 text-xs font-bold hover:bg-background transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all shadow-md"
                >
                  Send Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
