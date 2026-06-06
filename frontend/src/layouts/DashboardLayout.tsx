import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Quote,
  CheckSquare,
  ShoppingCart,
  Receipt,
  BarChart3,
  Activity,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../utils/cn";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Users, label: "Vendors", to: "/vendors" },
  { icon: FileText, label: "RFQs", to: "/rfqs" },
  { icon: Quote, label: "Quotations", to: "/quotations" },
  { icon: CheckSquare, label: "Approvals", to: "/approvals" },
  { icon: ShoppingCart, label: "Purchase Orders", to: "/purchase-orders" },
  { icon: Receipt, label: "Invoices", to: "/invoices" },
  { icon: BarChart3, label: "Reports", to: "/reports" },
  { icon: Activity, label: "Activity Logs", to: "/activity-logs" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-primary transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VyaparSetu Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-1 flex-shrink-0" />
            <div>
              <span className="text-white font-bold text-base leading-none">VyaparSetu</span>
              <p className="text-white/50 text-[10px] mt-0.5">Procurement ERP</p>
            </div>
          </div>
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200",
                      isActive ? "text-accent" : "group-hover:scale-110"
                    )}
                  />
                  {label}{isActive && " (Active)"}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle and sign out at bottom */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <span className="text-base">{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/15 hover:text-red-400 transition-all text-sm font-medium mt-0.5"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="flex items-center gap-4 px-4 lg:px-6 py-3 bg-card border-b border-muted/10 z-10 flex-shrink-0">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground/60 hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search vendors, orders, invoices…"
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-background border border-muted/20 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-muted/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-muted/10 flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">Notifications</span>
                    <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  {[
                    { text: "FastLog Transport submitted documents", time: "2m ago", unread: true },
                    { text: "New vendor approval request pending", time: "1h ago", unread: true },
                    { text: "Purchase Order #PO-234 approved", time: "3h ago", unread: false },
                  ].map((n, i) => (
                    <div key={i} className={cn("px-4 py-3 flex gap-3 hover:bg-background transition-colors cursor-pointer", i < 2 ? "border-b border-muted/10" : "")}>
                      <span className={cn("mt-1 w-2 h-2 rounded-full flex-shrink-0", n.unread ? "bg-primary" : "bg-transparent")} />
                      <div>
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-xs text-muted mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-3 text-center">
                    <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all notifications</span>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-background transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AK</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-none">Arjun Kapoor</p>
                  <p className="text-[10px] text-muted mt-0.5">Procurement Manager</p>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted transition-transform duration-200", profileOpen && "rotate-180")} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-muted/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-muted/10">
                    <p className="text-sm font-semibold text-foreground">Arjun Kapoor</p>
                    <p className="text-xs text-muted">arjun@company.com</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: UserCircle, label: "My Profile" },
                      { icon: Settings, label: "Settings" },
                    ].map(({ icon: Icon, label }) => (
                      <button key={label} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-background transition-colors">
                        <Icon className="w-4 h-4 text-muted" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-muted/10 py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Click-outside to close dropdowns */}
      {(profileOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setProfileOpen(false); setNotifOpen(false); }}
        />
      )}
    </div>
  );
}
