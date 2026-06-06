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
  Download,
  Info,
  Calendar,
  User,
  Globe,
  FileSpreadsheet,
  Search,
  FileCode
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Interfaces
interface AuditLog {
  id: string;
  type: "RFQ" | "Approvals" | "Invoices" | "Vendors";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  ipAddress: string;
  associatedRef: string;
  impact: "Low" | "Medium" | "High";
  status: "Success" | "Pending" | "Neutral";
}

// Initial Mock Audit Trail Logs
const INITIAL_LOGS: AuditLog[] = [
  {
    id: "LOG-001",
    type: "Invoices",
    title: "Quotation selected",
    description: "Infra supplies pvt ltd selected for office furniture Q2 response review.",
    timestamp: "22 May 2026, 9:15 PM",
    actor: "Rahul Mehta (Procurement Head)",
    ipAddress: "192.168.2.14",
    associatedRef: "VB-RFQ-2026-042",
    impact: "Medium",
    status: "Success"
  },
  {
    id: "LOG-002",
    type: "Approvals",
    title: "Approval pending",
    description: "PO-2024 awaiting L2 approval by Priya Shah (Finance Manager).",
    timestamp: "22 May 2026, 09:15 AM",
    actor: "System Automation",
    ipAddress: "10.0.1.250",
    associatedRef: "VB-PO-2026-0068",
    impact: "High",
    status: "Pending"
  },
  {
    id: "LOG-003",
    type: "RFQ",
    title: "RFQ published",
    description: "Office furniture Q2 RFQ dispatched and sent to 3 assigned vendors.",
    timestamp: "19 May 2025, 11:30 AM",
    actor: "Arjun Kapoor (Procurement Manager)",
    ipAddress: "192.168.2.45",
    associatedRef: "VB-RFQ-2026-042",
    impact: "Low",
    status: "Neutral"
  },
  {
    id: "LOG-004",
    type: "Vendors",
    title: "Vendor added",
    description: "Fastlog Transport registered online and status set to pending verifications.",
    timestamp: "18 May 2025, 2:20 PM",
    actor: "Self-Registration Portlet",
    ipAddress: "103.45.201.12",
    associatedRef: "VB-VEN-009",
    impact: "Medium",
    status: "Neutral"
  },
  {
    id: "LOG-005",
    type: "Invoices",
    title: "Invoice #INV-0068 Paid",
    description: "Marked invoice for Infra Supplies Pvt Ltd as fully paid.",
    timestamp: "15 May 2025, 4:50 PM",
    actor: "Priya Shah (Finance Manager)",
    ipAddress: "192.168.3.11",
    associatedRef: "VB-INV-2025-0068",
    impact: "High",
    status: "Success"
  },
  {
    id: "LOG-006",
    type: "Vendors",
    title: "Vendor Compliance Blocked",
    description: "Matrix Buildcon compliance records flagged; status updated to Blocked.",
    timestamp: "10 May 2025, 10:00 AM",
    actor: "Rahul Mehta (Procurement Head)",
    ipAddress: "192.168.2.14",
    associatedRef: "VB-VEN-005",
    impact: "High",
    status: "Success"
  }
];

export function ActivityLogs() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Core State
  const [logs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "RFQ" | "Approvals" | "Invoices" | "Vendors">("All");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // UI responsive control states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Filter logs in real-time
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !search ||
        log.title.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.associatedRef.toLowerCase().includes(search.toLowerCase()) ||
        log.actor.toLowerCase().includes(search.toLowerCase());

      const matchTab = activeTab === "All" || log.type === activeTab;

      return matchSearch && matchTab;
    });
  }, [logs, search, activeTab]);

  // Sidebar link mapping
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors", icon: Users, path: "/vendors", active: false },
    { name: "RFQs", icon: FileText, path: "/rfqs", active: false },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals", active: false },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: false },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: false },
    { name: "Reports", icon: BarChart3, path: "/reports", active: false },
    { name: "Activity (Active)", icon: Activity, path: "/activity-logs", active: true },
    { name: "Settings", icon: Settings, path: "/settings", active: false }
  ];

  // Actions
  const handleExport = () => {
    setToastMessage("Audit trail logs exported successfully as audit_trail_logs.csv.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white shrink-0 h-screen sticky top-0 border-r border-white/5 shadow-xl transition-all duration-300">
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
        <div className="fixed inset-0 z-50 flex lg:hidden">
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
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Audit logs portlet</span>
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

            {/* Notifications Dropdown */}
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

            {/* User Profile */}
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
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto w-full">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-muted/10 pb-5">
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-white">Activity & Logs</h1>
              <p className="text-sm text-muted mt-0.5">Procurement audit trail</p>
            </div>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-muted/20 hover:bg-primary/5 text-foreground text-sm font-semibold transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-muted" />
              <span>Export logs</span>
            </button>
          </div>

          {/* Toast Message */}
          {toastMessage && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-primary dark:text-accent font-semibold animate-in slide-in-from-top duration-200">
              <FileSpreadsheet className="w-4.5 h-4.5 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Search bar & filter tabs card */}
          <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-5 space-y-5">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit trail by description, reference ID, or actor..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all font-medium"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-t border-muted/10 pt-4">
              {(["All", "RFQ", "Approvals", "Invoices", "Vendors"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all duration-150 border whitespace-nowrap ${
                      isActive
                        ? "bg-primary border-primary text-white dark:bg-accent dark:border-accent dark:text-primary shadow-sm"
                        : "border-muted/20 text-muted hover:bg-primary/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Timeline audit trail container */}
          <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6">
            
            {filteredLogs.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Info className="w-8 h-8 text-muted mx-auto" />
                <p className="text-sm font-bold text-foreground">No matching audit logs</p>
                <p className="text-xs text-muted max-w-xs mx-auto">Try refining your search terms or selecting a different log category.</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l border-muted/15 space-y-8 py-2">
                {filteredLogs.map((log) => {
                  
                  // Dynamic icon based on log status/type
                  const isSuccess = log.status === "Success";
                  const isPending = log.status === "Pending";
                  
                  const dotColor = 
                    isSuccess ? "border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                    isPending ? "border-amber-500/20 text-amber-600 dark:text-amber-400" :
                    "border-muted/20 text-blue-600 dark:text-blue-400";
                  
                  const circleColor =
                    isSuccess ? "bg-emerald-500" :
                    isPending ? "bg-amber-500" :
                    "bg-blue-500";

                  return (
                    <div
                      key={log.id}
                      onClick={() => handleViewDetails(log)}
                      className="relative group cursor-pointer transition-all hover:translate-x-0.5 animate-in fade-in duration-200"
                    >
                      {/* Left timeline status circle */}
                      <span className={`absolute -left-[33px] top-0.5 w-[15px] h-[15px] rounded-full bg-card border flex items-center justify-center shrink-0 ${dotColor}`}>
                        <span className={`w-[7px] h-[7px] rounded-full ${circleColor}`}></span>
                      </span>

                      {/* Log text description */}
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors leading-snug">
                            {log.title} — <span className="text-xs text-muted-foreground font-normal">{log.description}</span>
                          </p>
                          <span className="text-[10px] text-muted font-mono font-medium whitespace-nowrap">{log.timestamp}</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <span className="text-[9px] font-extrabold uppercase bg-primary/5 text-primary px-2 py-0.5 rounded-md border border-muted/10 font-mono tracking-wide">
                            {log.associatedRef}
                          </span>
                          <span className="text-[9px] text-muted font-semibold">
                            Actor: {log.actor.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </main>
      </div>

      {/* Detail Slide Drawer */}
      {isDrawerOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          
          <div className="relative w-full sm:w-[420px] bg-card h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-accent font-bold text-xs shrink-0 font-mono">
                  {selectedLog.type[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Audit Log Details</h3>
                  <p className="text-[10px] text-muted font-medium mt-0.5">{selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 text-muted hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs font-semibold text-muted">
              
              {/* Event Context Card */}
              <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-4">
                <div>
                  <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Audit Event</span>
                  <span className="text-xs font-bold text-foreground mt-1 block">{selectedLog.title}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Detailed Action</span>
                  <span className="text-xs font-medium text-foreground mt-1 block leading-relaxed">{selectedLog.description}</span>
                </div>
              </div>

              {/* Server Metadata */}
              <div className="space-y-3">
                <h4 className="text-xxs font-bold text-primary dark:text-accent uppercase tracking-wider">Server Metadata</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="text-[9px] text-muted font-bold block uppercase">Actor / Initiator</span>
                      <span className="text-xs font-medium text-foreground mt-0.5 block">{selectedLog.actor}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Globe className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="text-[9px] text-muted font-bold block uppercase">Client IP Address</span>
                      <span className="text-xs font-bold text-foreground font-mono mt-0.5 block">{selectedLog.ipAddress}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <FileCode className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="text-[9px] text-muted font-bold block uppercase">Associated Document</span>
                      <span className="text-xs font-bold text-foreground font-mono mt-0.5 block tracking-wider">{selectedLog.associatedRef}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs metrics details */}
              <div className="space-y-3">
                <h4 className="text-xxs font-bold text-primary dark:text-accent uppercase tracking-wider">Audit Parameters</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-medium">Log Type</span>
                    <span className="font-bold text-foreground">{selectedLog.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-medium">Impact Level</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                      selectedLog.impact === "High" ? "bg-red-500/10 text-red-600 border-red-500/25" :
                      selectedLog.impact === "Medium" ? "bg-amber-500/10 text-amber-600 border-amber-500/25" :
                      "bg-blue-500/10 text-blue-600 border-blue-500/25"
                    }`}>{selectedLog.impact}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-medium">Audit Time</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      {selectedLog.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-medium">Execution Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">SUCCESS</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-muted/10 flex-shrink-0">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full h-11 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-95"
              >
                Close Audit Entry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
