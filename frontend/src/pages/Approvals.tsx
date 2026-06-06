import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  XCircle,
  AlertCircle,
  ThumbsUp,
  ShieldCheck,
  Search
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Interfaces
interface ApprovalChainNode {
  id: string;
  name: string;
  role: string;
  status: "Approved" | "Awaiting" | "Rejected";
  timestamp?: string;
  remarks?: string;
}

interface QuotationSummary {
  vendor: string;
  total: number;
  delivery: string;
  rating: string;
}

interface ApprovalRequest {
  id: string;
  title: string;
  category: string;
  rfqCode: string;
  currentStep: "Submitted" | "L1 Review" | "L2 approval" | "Generate PO";
  chain: ApprovalChainNode[];
  summary: QuotationSummary;
  status: "Pending" | "Approved" | "Rejected";
}

// Initial Mock Approval Requests
const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: "APR-001",
    title: "Office Furniture procurement Q2",
    category: "Furniture",
    rfqCode: "VB-RFQ-2026-042",
    currentStep: "L2 approval",
    chain: [
      { id: "c-1", name: "Rahul Mehta", role: "Procurement Head", status: "Approved", timestamp: "May 20, 10:22 am", remarks: "L1 audit complete. Hardware specs verified." },
      { id: "c-2", name: "Priya Shah", role: "Finance Manager", status: "Awaiting" }
    ],
    summary: {
      vendor: "Infra Supplies PVT LTD",
      total: 185400,
      delivery: "10 days",
      rating: "4.5 / 5"
    },
    status: "Pending"
  },
  {
    id: "APR-002",
    title: "Enterprise Cloud Server Hardware",
    category: "IT",
    rfqCode: "VB-RFQ-2026-089",
    currentStep: "L1 Review",
    chain: [
      { id: "c-3", name: "Rahul Mehta", role: "Procurement Head", status: "Awaiting" }
    ],
    summary: {
      vendor: "Apex Solutions India Ltd",
      total: 380000,
      delivery: "20 days",
      rating: "4.8 / 5"
    },
    status: "Pending"
  },
  {
    id: "APR-003",
    title: "Transit & Logistics Clearing Services",
    category: "Logistics",
    rfqCode: "VB-RFQ-2026-015",
    currentStep: "Submitted",
    chain: [
      { id: "c-5", name: "Rahul Mehta", role: "Procurement Head", status: "Awaiting" }
    ],
    summary: {
      vendor: "Zenith Logistics Services",
      total: 94000,
      delivery: "5 days",
      rating: "4.6 / 5"
    },
    status: "Pending"
  }
];

export function Approvals() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Core State
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string>("APR-001");
  const [remarks, setRemarks] = useState("");
  
  // UI states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredApprovals = useMemo(() => {
    return approvals.filter((app) => {
      const matchSearch =
        !searchQuery ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.rfqCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.summary.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [approvals, searchQuery]);

  // Selected Approval Object
  const selectedApproval = useMemo(() => {
    return approvals.find((a) => a.id === selectedApprovalId) || approvals[0];
  }, [approvals, selectedApprovalId]);

  // Sidebar mapping
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors", icon: Users, path: "/vendors", active: false },
    { name: "RFQs", icon: FileText, path: "/rfqs", active: false },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals (Active)", icon: CheckCircle2, path: "/approvals", active: true },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: false },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: false },
    { name: "Reports", icon: BarChart3, path: "/reports", active: false },
    { name: "Activity", icon: Activity, path: "/activity-logs", active: false },
    { name: "Settings", icon: Settings, path: "/settings", active: false }
  ];

  // Actions
  const handleApprove = () => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const timestampStr = `${today}, ${time.toLowerCase()}`;

    setApprovals(
      approvals.map((app) => {
        if (app.id !== selectedApproval.id) return app;

        // Find the node currently awaiting approval and mark it approved
        const updatedChain = app.chain.map((node) => {
          if (node.status === "Awaiting") {
            return {
              ...node,
              status: "Approved" as const,
              timestamp: timestampStr,
              remarks: remarks.trim() || "Approved without remarks."
            };
          }
          return node;
        });

        // Determine if all chain nodes are approved
        const isAllApproved = updatedChain.every((n) => n.status === "Approved");
        const nextStep = isAllApproved ? ("Generate PO" as const) : app.currentStep;

        return {
          ...app,
          chain: updatedChain,
          currentStep: nextStep,
          status: isAllApproved ? ("Approved" as const) : ("Pending" as const)
        };
      })
    );

    setRemarks("");
  };

  const handleReject = () => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const timestampStr = `${today}, ${time.toLowerCase()}`;

    setApprovals(
      approvals.map((app) => {
        if (app.id !== selectedApproval.id) return app;

        const updatedChain = app.chain.map((node) => {
          if (node.status === "Awaiting") {
            return {
              ...node,
              status: "Rejected" as const,
              timestamp: timestampStr,
              remarks: remarks.trim() || "Rejected."
            };
          }
          return node;
        });

        return {
          ...app,
          chain: updatedChain,
          status: "Rejected" as const
        };
      })
    );

    setRemarks("");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white shrink-0 h-screen sticky top-0 border-r border-white/5 shadow-xl transition-all duration-300">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <img src="/logo.png" alt="VyaparSetu Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
          <div>
            <span className="font-bold text-base tracking-wide leading-none block">VyaparSetu</span>
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
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <aside className="relative flex flex-col w-64 bg-primary text-white h-full p-5 shadow-2xl border-r border-white/5 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="VyaparSetu Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
                <div>
                  <h1 className="font-bold text-base leading-none">VyaparSetu</h1>
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
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* 2. TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-card border-b border-muted/10 h-16 flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Approval Central</span>
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

            {/* Notifications Bell */}
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
                  <div className="max-h-72 overflow-y-auto p-4 text-xs text-muted text-center">
                    All approval logs caught up.
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
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

        {/* 3. PAGE BODY */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Master Side Panel: List of Approvals */}
          <aside className="w-full md:w-80 border-r border-muted/10 bg-card overflow-y-auto flex-shrink-0 flex flex-col transition-all">
            <div className="p-4 border-b border-muted/10 space-y-3">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Approval Actions Required</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input
                  type="text"
                  placeholder="Search approvals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-background border border-muted/20 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                />
              </div>
            </div>
            
            <nav className="flex-1 p-2 space-y-1">
              {filteredApprovals.map((app) => {
                const isSelected = app.id === selectedApproval.id;
                
                const statusBadge =
                  app.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : app.status === "Rejected"
                    ? "bg-red-500/10 text-red-600 border-red-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20";

                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApprovalId(app.id);
                      setRemarks("");
                    }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex flex-col border ${
                      isSelected
                        ? "bg-primary/5 border-primary/20 text-foreground dark:bg-accent/5 dark:border-accent/30"
                        : "border-transparent text-muted hover:bg-primary/2 dark:hover:bg-white/2"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-primary dark:text-accent tracking-wide">{app.rfqCode}</span>
                    <span className="text-xs font-bold text-foreground mt-1 truncate">{app.title}</span>
                    <div className="flex items-center justify-between mt-3.5 w-full">
                      <span className="text-[10px] text-muted-foreground font-semibold">{app.category}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${statusBadge}`}>
                        {app.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Details Panel: Workflow Screen */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            
            {/* Header Title */}
            <div className="border-b border-muted/10 pb-5 space-y-2">
              <h1 className="text-2xl font-bold text-primary dark:text-white">Approval Workflow</h1>
              <p className="text-xs font-semibold text-muted">
                RFQ: {selectedApproval.title} - Vendor: {selectedApproval.summary.vendor} - ₹{selectedApproval.summary.total.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Banner Status Alert */}
            {selectedApproval.status !== "Pending" && (
              <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 ${
                selectedApproval.status === "Approved"
                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-500/5 border-red-500/10 text-red-700 dark:text-red-400"
              }`}>
                {selectedApproval.status === "Approved" ? (
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase">
                    Procurement Workflow {selectedApproval.status}
                  </h4>
                  <p className="text-[11px] text-muted mt-0.5 leading-normal">
                    {selectedApproval.status === "Approved"
                      ? "All required sign-offs are obtained. The system has automatically queued this document for Purchase Order generation."
                      : "This procurement request has been rejected by the approval authority. It has been archived and returned to draft status."}
                  </p>
                </div>
              </div>
            )}

            {/* Stepping Timeline (Horizontal Stepper) */}
            <div className="bg-card rounded-2xl border border-muted/10 p-5 shadow-[0_2px_12px_rgb(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.08)]">
              <div className="flex items-center justify-between max-w-2xl mx-auto py-2">
                {[
                  { key: "Submitted", label: "Submitted" },
                  { key: "L1 Review", label: "L1 Review" },
                  { key: "L2 approval", label: "L2 approval" },
                  { key: "Generate PO", label: "Generate PO" }
                ].map((step, idx, arr) => {
                  
                  // Helper logic to find state of current step
                  const stepOrder = ["Submitted", "L1 Review", "L2 approval", "Generate PO"];
                  const selectedOrderIdx = stepOrder.indexOf(selectedApproval.currentStep);
                  const thisStepIdx = stepOrder.indexOf(step.key);

                  let stepState: "done" | "active" | "pending" = "pending";
                  if (selectedApproval.status === "Rejected" && thisStepIdx >= selectedOrderIdx) {
                    stepState = "pending";
                  } else if (thisStepIdx < selectedOrderIdx || selectedApproval.status === "Approved") {
                    stepState = "done";
                  } else if (thisStepIdx === selectedOrderIdx) {
                    stepState = "active";
                  }

                  const isLast = idx === arr.length - 1;

                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border transition-all ${
                          stepState === "done"
                            ? "bg-primary border-primary text-white dark:bg-accent dark:border-accent dark:text-primary"
                            : stepState === "active"
                            ? "border-primary text-primary dark:border-accent dark:text-accent bg-primary/5 dark:bg-accent/10"
                            : "border-muted/20 text-muted bg-background"
                        }`}>
                          {stepState === "done" ? "✓" : idx + 1}
                        </div>
                        <span className="text-[10px] font-bold text-muted mt-2 whitespace-nowrap">{step.label}</span>
                      </div>
                      
                      {!isLast && (
                        <div className={`h-[2px] flex-1 mx-2 -mt-4 transition-all ${
                          stepState === "done" ? "bg-primary dark:bg-accent" : "bg-muted/15"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              
              {/* Left Column: Approval Chain Timeline & Remarks */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Approval Chain Block */}
                <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-5">
                  <h3 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider pb-1.5 border-b border-muted/10">
                    Approval Chain
                  </h3>

                  <div className="relative pl-5 border-l border-muted/15 space-y-6">
                    {selectedApproval.chain.map((node) => {
                      
                      const isApproved = node.status === "Approved";
                      const isRejected = node.status === "Rejected";

                      return (
                        <div key={node.id} className="relative animate-in fade-in slide-in-from-left duration-200">
                          {/* Stepper Status Dot */}
                          <span className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-card border flex items-center justify-center shrink-0`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isApproved ? "bg-emerald-500" : isRejected ? "bg-red-500" : "bg-blue-500 animate-pulse"
                            }`}></span>
                          </span>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                              <p>{node.name} <span className="text-muted text-[10px] font-medium">({node.role})</span></p>
                              {node.timestamp && <span className="text-[10px] text-muted font-mono font-normal">{node.timestamp}</span>}
                            </div>
                            
                            <p className={`text-[11px] font-bold ${
                              isApproved ? "text-emerald-600 dark:text-emerald-400" :
                              isRejected ? "text-red-500" : "text-blue-500"
                            }`}>
                              {node.status}
                            </p>

                            {node.remarks && (
                              <div className="bg-background rounded-xl p-3 border border-muted/5 mt-1.5 text-xs text-muted-foreground font-medium leading-relaxed">
                                {node.remarks}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Remarks Textarea (Only display when selected approval is still pending) */}
                {selectedApproval.status === "Pending" && (
                  <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-3">
                    <label className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider block">Approval Remarks</label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add compliance notes, justification parameters, audit checklist, or rejection reasons..."
                      className="w-full p-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all resize-none font-medium leading-relaxed"
                    />
                  </div>
                )}

              </div>

              {/* Right Column: Quotations Summary details & Buttons */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Quotations Summary Card */}
                <div className="bg-card border border-muted/10 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider pb-1.5 border-b border-muted/10">
                    Quotations Summary
                  </h3>

                  <div className="space-y-4 text-xs font-semibold text-muted">
                    <div className="flex justify-between items-center py-1">
                      <span>Vendor</span>
                      <span className="text-foreground text-sm font-bold">{selectedApproval.summary.vendor}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1 border-t border-muted/5">
                      <span>Total Value</span>
                      <span className="text-primary dark:text-accent font-mono text-base font-bold">
                        ₹{selectedApproval.summary.total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-t border-muted/5">
                      <span>Delivery Promises</span>
                      <span className="text-foreground">{selectedApproval.summary.delivery}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-t border-muted/5">
                      <span>Vendor SLA Rating</span>
                      <span className="text-foreground bg-primary/5 dark:bg-white/5 border border-muted/10 px-2 py-1 rounded-md text-[10px] font-extrabold text-primary dark:text-accent">
                        {selectedApproval.summary.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approve & Reject Buttons */}
                {selectedApproval.status === "Pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-95 shadow-md"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all active:scale-95"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                )}

                {/* Document details box */}
                <div className="bg-primary/2 dark:bg-white/2 border border-muted/8 rounded-2xl p-4 text-xs font-semibold text-muted space-y-2 leading-relaxed">
                  <div className="flex gap-1.5 items-start">
                    <AlertCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                    <p>
                      This review corresponds to internal request <span className="font-bold text-foreground font-mono">{selectedApproval.rfqCode}</span>.
                      Approval records are immutable once saved to compliance archives.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </main>
        </div>

      </div>

    </div>
  );
}
