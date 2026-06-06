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
  TrendingUp,
  UserCheck,
  Clock,
  ArrowUpRight,
  Percent
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Interface definitions
interface CategorySpend {
  name: string;
  spend: string;
  percentage: number;
  colorClass: string;
}

interface TopVendor {
  name: string;
  spend: string;
  spendVal: number;
  pos: number;
  sla: number;
  quality: number;
  leadTime: number;
  compliance: string;
}

interface MonthlyTrend {
  month: string;
  spend: number;
  spendLabel: string;
}

interface MonthlyData {
  totalSpend: string;
  activeVendors: number;
  poFulfillment: string;
  overdueInvoices: number;
  categories: CategorySpend[];
  topVendors: TopVendor[];
  monthlyTrend: MonthlyTrend[];
}

// Interactive Mock Database mapped by month
const DATA_BY_MONTH: Record<string, MonthlyData> = {
  "May 2025": {
    totalSpend: "12.4 L",
    activeVendors: 28,
    poFulfillment: "94%",
    overdueInvoices: 3,
    categories: [
      { name: "IT Hardware", spend: "₹4.8L", percentage: 75, colorClass: "bg-blue-600 dark:bg-blue-400" },
      { name: "Furniture", spend: "₹3.2L", percentage: 50, colorClass: "bg-emerald-600 dark:bg-emerald-400" },
      { name: "Stationery", spend: "₹2.1L", percentage: 33, colorClass: "bg-amber-500 dark:bg-amber-400" },
      { name: "Logistics", spend: "₹2.3L", percentage: 36, colorClass: "bg-orange-600 dark:bg-orange-400" },
    ],
    topVendors: [
      { name: "TechCore Ltd", spend: "₹4,20,000", spendVal: 420000, pos: 5, sla: 98, quality: 99, leadTime: 3.2, compliance: "Highly Compliant" },
      { name: "Infra Supplies", spend: "₹3,10,000", spendVal: 310000, pos: 4, sla: 92, quality: 94, leadTime: 5.5, compliance: "Compliant" },
      { name: "FastLog", spend: "₹1,90,000", spendVal: 190000, pos: 3, sla: 95, quality: 96, leadTime: 2.1, compliance: "Compliant" },
    ],
    monthlyTrend: [
      { month: "Dec", spend: 4.2, spendLabel: "₹4.2L" },
      { month: "Jan", spend: 6.8, spendLabel: "₹6.8L" },
      { month: "Feb", spend: 8.5, spendLabel: "₹8.5L" },
      { month: "Mar", spend: 9.9, spendLabel: "₹9.9L" },
      { month: "Apr", spend: 11.2, spendLabel: "₹11.2L" },
      { month: "May", spend: 12.4, spendLabel: "₹12.4L" },
    ]
  },
  "Apr 2025": {
    totalSpend: "11.2 L",
    activeVendors: 26,
    poFulfillment: "91%",
    overdueInvoices: 5,
    categories: [
      { name: "IT Hardware", spend: "₹4.5L", percentage: 70, colorClass: "bg-blue-600 dark:bg-blue-400" },
      { name: "Furniture", spend: "₹2.9L", percentage: 45, colorClass: "bg-emerald-600 dark:bg-emerald-400" },
      { name: "Stationery", spend: "₹1.8L", percentage: 28, colorClass: "bg-amber-500 dark:bg-amber-400" },
      { name: "Logistics", spend: "₹2.0L", percentage: 31, colorClass: "bg-orange-600 dark:bg-orange-400" },
    ],
    topVendors: [
      { name: "TechCore Ltd", spend: "₹3,90,000", spendVal: 390000, pos: 4, sla: 97, quality: 98, leadTime: 3.5, compliance: "Highly Compliant" },
      { name: "Infra Supplies", spend: "₹2,80,000", spendVal: 280000, pos: 3, sla: 91, quality: 93, leadTime: 5.8, compliance: "Compliant" },
      { name: "FastLog", spend: "₹1,60,000", spendVal: 160000, pos: 2, sla: 94, quality: 95, leadTime: 2.4, compliance: "Compliant" },
    ],
    monthlyTrend: [
      { month: "Nov", spend: 3.9, spendLabel: "₹3.9L" },
      { month: "Dec", spend: 4.2, spendLabel: "₹4.2L" },
      { month: "Jan", spend: 6.8, spendLabel: "₹6.8L" },
      { month: "Feb", spend: 8.5, spendLabel: "₹8.5L" },
      { month: "Mar", spend: 9.9, spendLabel: "₹9.9L" },
      { month: "Apr", spend: 11.2, spendLabel: "₹11.2L" },
    ]
  },
  "Mar 2025": {
    totalSpend: "9.9 L",
    activeVendors: 25,
    poFulfillment: "93%",
    overdueInvoices: 2,
    categories: [
      { name: "IT Hardware", spend: "₹3.8L", percentage: 60, colorClass: "bg-blue-600 dark:bg-blue-400" },
      { name: "Furniture", spend: "₹2.5L", percentage: 40, colorClass: "bg-emerald-600 dark:bg-emerald-400" },
      { name: "Stationery", spend: "₹1.5L", percentage: 23, colorClass: "bg-amber-500 dark:bg-amber-400" },
      { name: "Logistics", spend: "₹2.1L", percentage: 33, colorClass: "bg-orange-600 dark:bg-orange-400" },
    ],
    topVendors: [
      { name: "TechCore Ltd", spend: "₹3,50,000", spendVal: 350000, pos: 3, sla: 95, quality: 98, leadTime: 3.6, compliance: "Highly Compliant" },
      { name: "Infra Supplies", spend: "₹2,50,000", spendVal: 250000, pos: 3, sla: 93, quality: 94, leadTime: 5.1, compliance: "Compliant" },
      { name: "FastLog", spend: "₹1,80,000", spendVal: 180000, pos: 3, sla: 95, quality: 96, leadTime: 2.0, compliance: "Compliant" },
    ],
    monthlyTrend: [
      { month: "Oct", spend: 3.5, spendLabel: "₹3.5L" },
      { month: "Nov", spend: 3.9, spendLabel: "₹3.9L" },
      { month: "Dec", spend: 4.2, spendLabel: "₹4.2L" },
      { month: "Jan", spend: 6.8, spendLabel: "₹6.8L" },
      { month: "Feb", spend: 8.5, spendLabel: "₹8.5L" },
      { month: "Mar", spend: 9.9, spendLabel: "₹9.9L" },
    ]
  }
};

export function Reports() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Core State
  const [selectedMonth, setSelectedMonth] = useState<"May 2025" | "Apr 2025" | "Mar 2025">("May 2025");
  const [selectedVendor, setSelectedVendor] = useState<TopVendor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // UI state controls
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Fetch data matching selection
  const currentData = useMemo(() => {
    return DATA_BY_MONTH[selectedMonth];
  }, [selectedMonth]);

  // Sidebar Links
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors", icon: Users, path: "/vendors", active: false },
    { name: "RFQs", icon: FileText, path: "/rfqs", active: false },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals", active: false },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: false },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: false },
    { name: "Reports", icon: BarChart3, path: "/reports", active: true },
    { name: "Activity", icon: Activity, path: "/activity-logs", active: false },
    { name: "Settings", icon: Settings, path: "/settings", active: false }
  ];

  // Actions
  const handleExport = () => {
    setToastMessage(`Procurement Report for ${selectedMonth} exported successfully as PDF.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRowClick = (vendor: TopVendor) => {
    setSelectedVendor(vendor);
    setIsDrawerOpen(true);
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
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Reports & Analytics Portlet</span>
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
              <h1 className="text-2xl font-bold text-primary dark:text-white">Reports & analytics</h1>
              <p className="text-sm text-muted mt-0.5 font-medium">Procurement Insights - {selectedMonth}</p>
            </div>
            
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Month Dropdown Selector */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value as any)}
                  className="h-10 px-4 rounded-xl border border-muted/20 bg-card text-foreground text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="May 2025">May 2025</option>
                  <option value="Apr 2025">Apr 2025</option>
                  <option value="Mar 2025">Mar 2025</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary hover:bg-primary/95 dark:bg-accent dark:hover:bg-accent/90 text-white dark:text-primary text-sm font-semibold transition-all active:scale-95 whitespace-nowrap shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Toast Message */}
          {toastMessage && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-primary dark:text-accent font-semibold animate-in slide-in-from-top duration-200">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600 dark:text-accent" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* 4 SUMMARY METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Spend */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-blue-500/20 p-5 flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">Total Spend</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{currentData.totalSpend}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>+8.4% from last quarter</span>
              </div>
            </div>

            {/* Card 2: Active Vendors */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-emerald-500/20 p-5 flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Active Vendors</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{currentData.activeVendors}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Onboarded and fully vetted</span>
              </div>
            </div>

            {/* Card 3: PO Fulfillment */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-amber-500/20 p-5 flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5">
              <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">PO Fulfillment</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{currentData.poFulfillment}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Percent className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excellent compliance rate</span>
              </div>
            </div>

            {/* Card 4: Overdue Invoices */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-rose-500/20 p-5 flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5">
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">Overdue Invoices</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{currentData.overdueInvoices}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Requires immediate review</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMN CONTENT AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1: Spend by Category (Progress bars) */}
            <div className="lg:col-span-5 bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6 flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Spend by Category</h3>
                <p className="text-xxs text-muted mt-0.5">Expense allocation breakdown</p>
              </div>

              <div className="space-y-4">
                {currentData.categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-foreground">{cat.name}</span>
                      <span className="text-muted">{cat.spend}</span>
                    </div>
                    {/* Visual Progress bar container */}
                    <div className="h-2.5 w-full bg-primary/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cat.colorClass}`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: Top Vendors by Spend & Monthly Trend */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* TOP VENDORS TABLE */}
              <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Top Vendors by Spend</h3>
                    <p className="text-xxs text-muted mt-0.5">Click a vendor to view detailed performance metrics</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-muted/10 text-[10px] uppercase font-bold text-muted tracking-wider">
                        <th className="py-2.5 pb-2">Vendor</th>
                        <th className="py-2.5 pb-2 text-right">Spend (₹)</th>
                        <th className="py-2.5 pb-2 text-center">POs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/5">
                      {currentData.topVendors.map((vendor, idx) => (
                        <tr
                          key={idx}
                          onClick={() => handleRowClick(vendor)}
                          className="group hover:bg-primary/5 dark:hover:bg-white/5 cursor-pointer transition-colors text-xs"
                        >
                          <td className="py-3 font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors flex items-center gap-1.5">
                            <span>{vendor.name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary dark:text-accent" />
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-foreground">{vendor.spend}</td>
                          <td className="py-3 text-center font-semibold text-muted">{vendor.pos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MONTHLY TREND CHART CARD */}
              <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Monthly Trend</h3>
                    <p className="text-xxs text-muted mt-0.5">Procurement volume comparison</p>
                  </div>
                </div>

                {/* SVG Chart Container */}
                <div className="relative pt-4 flex flex-col items-center">
                  <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 170" preserveAspectRatio="none">
                    {/* Background Grid Lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" className="text-muted/10" strokeDasharray="4 4" />
                    <line x1="0" y1="65" x2="500" y2="65" stroke="currentColor" className="text-muted/10" strokeDasharray="4 4" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="currentColor" className="text-muted/10" strokeDasharray="4 4" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-muted/10" strokeWidth="1.5" />

                    {/* Bars Rendering */}
                    {currentData.monthlyTrend.map((item, idx) => {
                      // X coordinates calculations
                      const barWidth = 38;
                      const gap = 44;
                      const x = 20 + idx * (barWidth + gap);
                      
                      // Height calculations based on spend (Max spend is 14L, viewport height height is 140px)
                      const maxSpend = 14;
                      const barHeight = (item.spend / maxSpend) * 120;
                      const y = 140 - barHeight;

                      const isCurrentMonth = idx === currentData.monthlyTrend.length - 1;
                      const isHovered = hoveredBarIndex === idx;

                      const fillClass = isCurrentMonth
                        ? "fill-primary dark:fill-accent"
                        : isHovered
                        ? "fill-primary/70 dark:fill-accent/70"
                        : "fill-primary/30 dark:fill-accent/30";

                      return (
                        <g
                          key={idx}
                          onMouseEnter={() => setHoveredBarIndex(idx)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                          className="cursor-pointer"
                        >
                          {/* Rectangle bar with rounded top corners */}
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="4"
                            ry="4"
                            className={`${fillClass} transition-all duration-200`}
                          />
                          {/* X-axis labels */}
                          <text
                            x={x + barWidth / 2}
                            y="158"
                            textAnchor="middle"
                            className="fill-muted font-bold text-[10px]"
                          >
                            {item.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Stateful HTML tooltip overlay matching coordinates */}
                  {hoveredBarIndex !== null && (
                    <div
                      className="absolute bg-card border border-muted/15 shadow-xl rounded-xl p-2 px-3 text-xxs font-extrabold text-foreground pointer-events-none animate-in fade-in duration-100"
                      style={{
                        left: `${hoveredBarIndex * 82 + 35}px`,
                        top: `${115 - (currentData.monthlyTrend[hoveredBarIndex].spend / 14) * 120}px`
                      }}
                    >
                      <span className="block text-muted text-[9px] uppercase leading-none mb-1">{currentData.monthlyTrend[hoveredBarIndex].month} Spend</span>
                      <span className="font-mono text-primary dark:text-accent">{currentData.monthlyTrend[hoveredBarIndex].spendLabel}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* VENDOR PERFORMANCE ANALYTICS SLIDE DRAWER */}
      {isDrawerOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          
          <div className="relative w-full sm:w-[420px] bg-card h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-accent font-bold text-xs shrink-0 font-mono">
                  {selectedVendor.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Performance Report</h3>
                  <p className="text-[10px] text-muted font-medium mt-0.5">Vendor Spend Analytics</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 text-muted hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs font-semibold text-muted">
              
              {/* Context Summary Card */}
              <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-muted font-extrabold">Vendor Partner</span>
                  <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-accent px-2 py-0.5 rounded font-bold">{selectedVendor.compliance}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold text-foreground block">{selectedVendor.name}</span>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span>Total Procurement Volume</span>
                    <span className="text-foreground font-bold font-mono">{selectedVendor.spend}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Purchase Orders Dispatched</span>
                    <span className="text-foreground font-bold">{selectedVendor.pos} POs</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Cards */}
              <div className="space-y-3">
                <h4 className="text-xxs font-bold text-primary dark:text-accent uppercase tracking-wider">Operational SLA Compliance</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Metric 1: Quality Rating */}
                  <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-1">
                    <span className="text-[9px] text-muted block uppercase">Quality Rating</span>
                    <span className="text-lg font-black text-foreground">{selectedVendor.quality}%</span>
                    <div className="w-full bg-primary/10 rounded-full h-1 mt-2">
                      <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${selectedVendor.quality}%` }}></div>
                    </div>
                  </div>

                  {/* Metric 2: SLA Adherence */}
                  <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-1">
                    <span className="text-[9px] text-muted block uppercase">SLA Adherence</span>
                    <span className="text-lg font-black text-foreground">{selectedVendor.sla}%</span>
                    <div className="w-full bg-primary/10 rounded-full h-1 mt-2">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${selectedVendor.sla}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Lead Time Card */}
                <div className="bg-background rounded-2xl p-4 border border-muted/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-muted block uppercase">Avg Delivery Lead Time</span>
                    <span className="text-sm font-bold text-foreground">{selectedVendor.leadTime} days</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-extrabold uppercase font-mono">On Time</span>
                  </div>
                </div>
              </div>

              {/* Vendor Risks Alerts */}
              <div className="space-y-3">
                <h4 className="text-xxs font-bold text-primary dark:text-accent uppercase tracking-wider">Risk Profile</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 flex gap-3 items-start">
                  <Info className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-foreground font-bold">Standard Risk Rating</p>
                    <p className="text-xxs text-muted leading-relaxed font-medium">Compliance records and tax filings are up to date. No payment bottlenecks or delivery delays flags reported.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-muted/10 flex-shrink-0">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full h-11 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-95 animate-pulse"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
