import { useState } from "react";
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
  Save,
  CheckCircle2 as SuccessIcon,
  Shield,
  Sliders
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Settings State
  const [erpName, setErpName] = useState("VendorBridge ERP");
  const [currency, setCurrency] = useState("INR");
  const [gstRate, setGstRate] = useState(18);
  const [l1Limit, setL1Limit] = useState(100000);
  const [l2Limit, setL2Limit] = useState(500000);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // UI responsive control states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sidebar Links
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors", icon: Users, path: "/vendors", active: false },
    { name: "RFQs", icon: FileText, path: "/rfqs", active: false },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals", active: false },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: false },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: false },
    { name: "Reports", icon: BarChart3, path: "/reports", active: false },
    { name: "Activity", icon: Activity, path: "/activity-logs", active: false },
    { name: "Settings (Active)", icon: Settings, path: "/settings", active: true }
  ];

  // Actions
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Configuration parameters updated and stored successfully.");
    setTimeout(() => setToastMessage(null), 4000);
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
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Configuration Panel</span>
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
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-[800px] mx-auto w-full">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-muted/10 pb-5">
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-white">System Settings</h1>
              <p className="text-sm text-muted mt-0.5 font-medium">Configure global ERP and workflow parameters</p>
            </div>
          </div>

          {/* Toast Message */}
          {toastMessage && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-primary dark:text-accent font-semibold animate-in slide-in-from-top duration-200">
              <SuccessIcon className="w-4.5 h-4.5 text-emerald-600 dark:text-accent" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Settings Form */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* General Section */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-muted/10 pb-3">
                <Sliders className="w-4.5 h-4.5 text-primary dark:text-accent" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">General Configuration</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">ERP Instance Title</label>
                  <input
                    type="text"
                    value={erpName}
                    onChange={(e) => setErpName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">Base Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-muted/20 bg-background text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="INR">INR (₹) Indian Rupee</option>
                    <option value="USD">USD ($) US Dollar</option>
                    <option value="EUR">EUR (€) Euro</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted">Standard GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Threshold limits */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-muted/10 pb-3">
                <Shield className="w-4.5 h-4.5 text-primary dark:text-accent" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Approval Limits & Rules</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">L1 Approval Limit Threshold (₹)</label>
                  <input
                    type="number"
                    value={l1Limit}
                    onChange={(e) => setL1Limit(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">L2 Approval Limit Threshold (₹)</label>
                  <input
                    type="number"
                    value={l2Limit}
                    onChange={(e) => setL2Limit(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Preferences */}
            <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-muted/10 pb-3">
                <Bell className="w-4.5 h-4.5 text-primary dark:text-accent" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Alert Preferences</h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-background rounded-xl cursor-pointer hover:bg-muted/5 transition-colors border border-muted/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">Email Notifications</span>
                    <span className="text-[10px] text-muted font-medium">Send automatic email digests for RFQ deadlines and approvals.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-background rounded-xl cursor-pointer hover:bg-muted/5 transition-colors border border-muted/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">Real-time Push Alerts</span>
                    <span className="text-[10px] text-muted font-medium">Display alert banners inside the ERP dashboard for new vendor registrations.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemAlerts}
                    onChange={(e) => setSystemAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-primary/95 dark:bg-accent dark:hover:bg-accent/90 text-white dark:text-primary text-xs font-extrabold transition-all active:scale-95 shadow-md shadow-primary/10 dark:shadow-none"
              >
                <Save className="w-4 h-4" />
                <span>Save Config Parameters</span>
              </button>
            </div>

          </form>

        </main>
      </div>

    </div>
  );
}
