import { useNavigate, useLocation, Link } from "react-router-dom";
import { Home, ArrowLeft, Search, LayoutDashboard, Users, ShoppingCart, Receipt } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const QUICK_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard",       to: "/dashboard" },
  { icon: Users,           label: "Vendors",         to: "/vendors"   },
  { icon: ShoppingCart,    label: "Purchase Orders", to: "/purchase-orders" },
  { icon: Receipt,         label: "Invoices",        to: "/invoices"  },
];

export function NotFoundPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* Soft background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary opacity-[0.04] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary opacity-[0.04] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent opacity-[0.06] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full animate-in fade-in slide-in-from-bottom-6 duration-500">

        {/* VendorBridge logo mark */}
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-8">
          <span className="text-accent font-black text-xl tracking-tight">VS</span>
        </div>

        {/* 404 number */}
        <div className="relative mb-4 select-none">
          <span className="text-[9rem] sm:text-[11rem] font-black leading-none tracking-tighter text-primary/8 dark:text-white/5 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end gap-1">
              {["4","0","4"].map((char, i) => (
                <span
                  key={i}
                  className="text-6xl sm:text-7xl font-black text-primary dark:text-white/90 leading-none tracking-tighter"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
          Page not found
        </h1>

        {/* Sub-text with the attempted URL */}
        <p className="text-sm text-muted mt-3 leading-relaxed max-w-sm">
          The page at{" "}
          <code className="px-1.5 py-0.5 rounded-md bg-primary/8 text-primary font-mono text-xs font-semibold">
            {location.pathname}
          </code>{" "}
          doesn't exist or may have been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-muted/20 bg-card text-sm font-semibold text-foreground hover:bg-primary/5 hover:border-primary/20 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-sm shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-10 w-full max-w-xs">
          <div className="flex-1 h-px bg-muted/15" />
          <span className="text-xs text-muted font-medium uppercase tracking-wider">Quick Links</span>
          <div className="flex-1 h-px bg-muted/15" />
        </div>

        {/* Quick nav links */}
        <div className="grid grid-cols-2 gap-2.5 mt-5 w-full max-w-xs">
          {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-muted/10 hover:border-primary/20 hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200 group shadow-sm"
            >
              <Icon className="w-4 h-4 text-muted group-hover:text-primary transition-colors flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted/60 mt-10">
          VendorBridge Procurement ERP · If this seems like a bug,{" "}
          <a href="mailto:support@vendorbridge.in" className="hover:text-primary underline underline-offset-2 transition-colors">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
