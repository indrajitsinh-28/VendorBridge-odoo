import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Menu,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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
  ChevronDown,
  LogOut,
  Building,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Define Vendor Interface
interface Vendor {
  id: string;
  name: string;
  companyName: string;
  category: "Construction" | "IT" | "Logistics" | "Furniture" | "Manufacturing" | "Services";
  gstNumber: string;
  panNumber: string;
  contactPerson: string;
  email: string;
  contactNumber: string;
  address: string;
  status: "Active" | "Pending" | "Blocked";
  registrationDate: string;
  lastUpdated: string;
}

// Initial Mock Data
const INITIAL_VENDORS: Vendor[] = [
  {
    id: "VB-VEN-001",
    name: "Aarav Solutions Ltd",
    companyName: "Apex Solutions India Ltd",
    category: "IT",
    gstNumber: "27AAAAA1111A1Z1",
    panNumber: "AAAAA1111A",
    contactPerson: "Aarav Sharma",
    email: "aarav@apexsolutions.in",
    contactNumber: "+91 98765 43210",
    address: "Hinjewadi IT Park Phase 3, Pune, MH - 411057",
    status: "Active",
    registrationDate: "2025-01-15",
    lastUpdated: "2026-06-01"
  },
  {
    id: "VB-VEN-002",
    name: "Zenith Logistics",
    companyName: "Zenith Logistics Services",
    category: "Logistics",
    gstNumber: "24BBBBB2222B2Z2",
    panNumber: "BBBBB2222B",
    contactPerson: "Priya Patel",
    email: "priya@zenithlogistics.com",
    contactNumber: "+91 99887 76655",
    address: "Safal Pegasus, Prahladnagar, Ahmedabad, GJ - 380015",
    status: "Active",
    registrationDate: "2025-02-10",
    lastUpdated: "2026-05-30"
  },
  {
    id: "VB-VEN-003",
    name: "Banyan Consultants",
    companyName: "Banyan Corporate Consultants",
    category: "Services",
    gstNumber: "19CCCCC3333C3Z3",
    panNumber: "CCCCC3333C",
    contactPerson: "Rohan Das",
    email: "rohan@banyanconsultants.com",
    contactNumber: "+91 91234 56789",
    address: "Park Street, Chowringhee Mansion, Kolkata, WB - 700016",
    status: "Pending",
    registrationDate: "2026-05-20",
    lastUpdated: "2026-05-22"
  },
  {
    id: "VB-VEN-004",
    name: "Standard Furniture Corp",
    companyName: "Standard Woods & Decor Ltd",
    category: "Furniture",
    gstNumber: "07DDDDD4444D4Z4",
    panNumber: "DDDDD4444D",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@standardfurniture.co.in",
    contactNumber: "+91 93456 78901",
    address: "Kirti Nagar Industrial Area, New Delhi - 110015",
    status: "Active",
    registrationDate: "2024-11-05",
    lastUpdated: "2026-05-15"
  },
  {
    id: "VB-VEN-005",
    name: "Matrix Buildcon",
    companyName: "Matrix Infrastructure Projects",
    category: "Construction",
    gstNumber: "29EEEEE5555E5Z5",
    panNumber: "EEEEE5555E",
    contactPerson: "Vikram Malhotra",
    email: "vikram@matrixbuildcon.com",
    contactNumber: "+91 98112 23344",
    address: "Whitefield Main Road, Bangalore, KA - 560066",
    status: "Blocked",
    registrationDate: "2024-08-20",
    lastUpdated: "2026-04-10"
  },
  {
    id: "VB-VEN-006",
    name: "Indo Fabricators",
    companyName: "Indo Mechanical Manufacturing",
    category: "Manufacturing",
    gstNumber: "27FFFFF6666F6Z6",
    panNumber: "FFFFF6666F",
    contactPerson: "Sanjay Mehta",
    email: "sanjay@indofabricators.in",
    contactNumber: "+91 92233 44556",
    address: "MIDC Industrial Area, Andheri East, Mumbai, MH - 400093",
    status: "Active",
    registrationDate: "2025-04-02",
    lastUpdated: "2026-05-25"
  }
];

export function Vendor() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Primary State
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Pending" | "Blocked">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  
  // UI Control State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Modal / Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);
  
  // Modal form fields state
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: "",
    companyName: "",
    category: "IT",
    gstNumber: "",
    panNumber: "",
    contactPerson: "",
    email: "",
    contactNumber: "",
    address: "",
    status: "Active"
  });

  // Table Sorting and Pagination State
  const [sortField, setSortField] = useState<keyof Vendor>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handler for sorting
  const handleSort = (field: keyof Vendor) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter & Search Logic
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.companyName.toLowerCase().includes(search.toLowerCase()) ||
        v.gstNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase()) ||
        v.category.toLowerCase().includes(search.toLowerCase());

      const matchTab = activeTab === "All" || v.status === activeTab;
      const matchCategory = !categoryFilter || v.category === categoryFilter;

      return matchSearch && matchTab && matchCategory;
    });
  }, [vendors, search, activeTab, categoryFilter]);

  // Sorting logic
  const sortedVendors = useMemo(() => {
    const sorted = [...filteredVendors];
    sorted.sort((a, b) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredVendors, sortField, sortOrder]);

  // Pagination logic
  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedVendors.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedVendors, currentPage]);

  const totalPages = Math.ceil(sortedVendors.length / itemsPerPage);

  // Tab Counts Calculations
  const tabCounts = useMemo(() => {
    return {
      All: vendors.length,
      Active: vendors.filter((v) => v.status === "Active").length,
      Pending: vendors.filter((v) => v.status === "Pending").length,
      Blocked: vendors.filter((v) => v.status === "Blocked").length
    };
  }, [vendors]);

  // Form handlers
  const openAddModal = () => {
    setFormMode("add");
    setFormData({
      name: "",
      companyName: "",
      category: "IT",
      gstNumber: "",
      panNumber: "",
      contactPerson: "",
      email: "",
      contactNumber: "",
      address: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setFormMode("edit");
    setFormData(vendor);
    setIsModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    
    if (formMode === "add") {
      const newVendor: Vendor = {
        ...(formData as Omit<Vendor, "id" | "registrationDate" | "lastUpdated">),
        id: `VB-VEN-00${vendors.length + 1}`,
        registrationDate: today,
        lastUpdated: today
      } as Vendor;
      setVendors([...vendors, newVendor]);
    } else {
      setVendors(
        vendors.map((v) =>
          v.id === formData.id
            ? ({ ...formData, lastUpdated: today } as Vendor)
            : v
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (vendor: Vendor) => {
    setVendors(vendors.filter((v) => v.id !== vendor.id));
    setDeleteTarget(null);
    if (selectedVendor?.id === vendor.id) {
      setSelectedVendor(null);
      setIsDrawerOpen(false);
    }
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDrawerOpen(true);
  };

  // Common Nav Items
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors (Active)", icon: Users, path: "/vendors", active: true },
    { name: "RFQs", icon: FileText, path: "/rfqs", active: false },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals", active: false },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: false },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: false },
    { name: "Reports", icon: BarChart3, path: "/reports", active: false },
    { name: "Activity", icon: Activity, path: "/activity-logs", active: false },
    { name: "Settings", icon: Settings, path: "/settings", active: false }
  ];

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

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* 2. TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-card border-b border-muted/10 h-16 flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Static branding for header context */}
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Procurement Suite</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button (Top Navbar) */}
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
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-muted/10 flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {[
                      { title: "Compliance Review Cleared", desc: "Aarav Solutions Ltd is now marked as Active.", time: "5 mins ago" },
                      { title: "New Quotation Submitted", desc: "Matrix Buildcon uploaded quote response #VB-RFQ-089.", time: "1 hour ago" },
                      { title: "GST Number Verification Failed", desc: "Banyan Consultants VAT registration requires manual check.", time: "2 hours ago" }
                    ].map((n, i) => (
                      <div key={i} className="px-4 py-3 border-b border-muted/5 hover:bg-primary/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <p className="text-xxs text-muted mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-muted/60 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
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
                <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-muted/10">
                    <p className="font-semibold text-sm">Arjun Kapoor</p>
                    <p className="text-xs text-muted">arjun.kapoor@vendorbridge.com</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white transition-colors">
                      Profile Coordinates
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white transition-colors">
                      Account Settings
                    </button>
                  </div>
                  <div className="border-t border-muted/10 pt-1 mt-1">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. PAGE HEADER & MAIN BODY */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-white">Vendor Management</h1>
              <p className="text-sm text-muted mt-0.5">Manage supplier profiles and registrations.</p>
            </div>
            
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-primary/10 dark:shadow-none self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>

          {/* 4. SEARCH SECTION */}
          <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search vendors by name, GST number, category, company name or contact details"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative min-w-[160px] md:max-w-[200px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-muted/20 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Construction">Construction</option>
                  <option value="IT">IT</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 5. FILTER TABS & TABLE DATA CARD */}
          <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 overflow-hidden">
            
            {/* Filter Tabs Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-muted/10 px-4 pt-4 gap-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-0">
                {(["All", "Active", "Pending", "Blocked"] as const).map((tab) => {
                  const label = tab === "All" ? "All Vendors" : tab;
                  const isActive = activeTab === tab;
                  
                  // Color definitions based on status
                  const countsColor = 
                    tab === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" :
                    tab === "Pending" ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" :
                    tab === "Blocked" ? "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400" :
                    "bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent";

                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-xl transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
                        isActive
                          ? "border-primary text-primary dark:border-accent dark:text-accent bg-primary/2 dark:bg-accent/2"
                          : "border-transparent text-muted hover:text-foreground hover:bg-background"
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${countsColor}`}>
                        {tabCounts[tab]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick info search yields count */}
              <div className="px-2 pb-4 text-xs font-semibold text-muted flex items-center gap-1.5">
                <span>Total Matches: {sortedVendors.length}</span>
              </div>
            </div>

            {/* 6. VENDOR TABLE / EMPTY STATE */}
            {sortedVendors.length === 0 ? (
              
              /* 9. EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-300">
                {/* SVG Illustration */}
                <div className="w-32 h-32 mb-6 text-muted/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-primary/5 dark:bg-accent/5 rounded-full blur-xl animate-pulse"></div>
                  <svg className="w-16 h-16 relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground">No vendors found</h3>
                <p className="text-sm text-muted mt-1 max-w-sm">
                  We couldn't find any vendor matches. Try modifying your search input or create a new supplier entry.
                </p>
                <button
                  onClick={openAddModal}
                  className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 active:scale-95 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add First Vendor
                </button>
              </div>
            ) : (
              /* Actual Vendor Table */
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-muted/10 text-muted uppercase text-[11px] font-semibold">
                      <th className="px-6 py-4 text-left">
                        <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                          <span>Vendor Name</span>
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button onClick={() => handleSort("category")} className="flex items-center gap-1 hover:text-foreground">
                          <span>Category</span>
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button onClick={() => handleSort("gstNumber")} className="flex items-center gap-1 hover:text-foreground">
                          <span>GST Number</span>
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">Contact Number</th>
                      <th className="px-6 py-4 text-left">Email Address</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">
                        <button onClick={() => handleSort("registrationDate")} className="flex items-center gap-1 hover:text-foreground">
                          <span>Reg Date</span>
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVendors.map((vendor) => {
                      const badgeStyles =
                        vendor.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-500/15"
                          : vendor.status === "Pending"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:bg-amber-500/15"
                          : "bg-red-500/10 text-red-700 dark:text-red-400 dark:bg-red-500/15";

                      const categoryColors = {
                        Construction: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
                        IT: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                        Logistics: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
                        Furniture: "bg-amber-700/10 text-amber-800 dark:text-amber-300",
                        Manufacturing: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
                        Services: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                      }[vendor.category] || "bg-muted/10 text-muted";

                      return (
                        <tr
                          key={vendor.id}
                          className={`border-b border-muted/8 transition-colors duration-200 hover:bg-primary/2 dark:hover:bg-white/2 cursor-pointer group`}
                          onClick={() => handleViewDetails(vendor)}
                        >
                          {/* Vendor Name & Company */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center font-bold text-xs text-primary dark:text-accent font-mono shrink-0 group-hover:scale-105 transition-all">
                                {vendor.name.split(" ").slice(0, 2).map((v) => v[0]).join("")}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary dark:group-hover:text-accent transition-colors">
                                  {vendor.name}
                                </p>
                                <p className="text-xxs text-muted truncate">{vendor.companyName}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors}`}>
                              {vendor.category}
                            </span>
                          </td>

                          {/* GST */}
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium font-mono text-foreground tracking-wide">
                              {vendor.gstNumber}
                            </span>
                          </td>

                          {/* Contact Number */}
                          <td className="px-6 py-4 text-xs font-medium text-foreground">
                            {vendor.contactNumber}
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-xs text-muted truncate max-w-[150px]">
                            {vendor.email}
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeStyles}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                vendor.status === "Active" ? "bg-emerald-500" :
                                vendor.status === "Pending" ? "bg-amber-500" : "bg-red-500"
                              }`} />
                              {vendor.status}
                            </span>
                          </td>

                          {/* Registration Date */}
                          <td className="px-6 py-4 text-xs text-muted font-medium">
                            {vendor.registrationDate}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleViewDetails(vendor)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 dark:hover:text-accent dark:hover:bg-white/5 transition-all"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(vendor)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-amber-600 hover:bg-amber-500/5 dark:hover:text-accent dark:hover:bg-white/5 transition-all"
                                title="Edit Vendor"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(vendor)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                                title="Delete Vendor"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {sortedVendors.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-muted/10 bg-card/50">
                <span className="text-xs text-muted">
                  Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min(currentPage * itemsPerPage, sortedVendors.length)}
                  </span>{" "}
                  of <span className="font-semibold text-foreground">{sortedVendors.length}</span> results
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-muted/20 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-primary text-white dark:bg-accent dark:text-primary"
                          : "border border-muted/20 text-muted hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-muted/20 text-muted hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* 7. ADD / EDIT VENDOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-card rounded-2xl border border-muted/15 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-muted/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary dark:text-white">
                {formMode === "add" ? "Register New Vendor" : "Edit Vendor Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 text-muted hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSaveVendor} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <div className="border-b border-muted/10 pb-1.5">
                  <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Section 1: Basic Information</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Vendor Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Acme Corp India"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Company Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.companyName || ""}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Acme Holdings Pvt Ltd"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-muted block mb-1.5">Vendor Category *</label>
                    <select
                      required
                      value={formData.category || "IT"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Vendor["category"] })}
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent appearance-none cursor-pointer"
                    >
                      <option value="Construction">Construction</option>
                      <option value="IT">IT</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: GST Details */}
              <div className="space-y-4">
                <div className="border-b border-muted/10 pb-1.5">
                  <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Section 2: GST & Tax Details</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">GST Number *</label>
                    <input
                      required
                      type="text"
                      maxLength={15}
                      value={formData.gstNumber || ""}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">PAN Number *</label>
                    <input
                      required
                      type="text"
                      maxLength={10}
                      value={formData.panNumber || ""}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. AAAAA1111A"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact Information */}
              <div className="space-y-4">
                <div className="border-b border-muted/10 pb-1.5">
                  <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Section 3: Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Contact Person *</label>
                    <input
                      required
                      type="text"
                      value={formData.contactPerson || ""}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Name"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@company.com"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1.5">Phone Number *</label>
                    <input
                      required
                      type="text"
                      value={formData.contactNumber || ""}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs font-semibold text-muted block mb-1.5">Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full physical address of operations"
                      className="w-full p-3.5 rounded-xl border border-muted/20 bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Status */}
              <div className="space-y-4">
                <div className="border-b border-muted/10 pb-1.5">
                  <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Section 4: Verification Status</h4>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted block mb-2">Initial Verification Status</label>
                  <div className="flex gap-4">
                    {(["Active", "Pending", "Blocked"] as const).map((s) => {
                      const id = `status-radio-${s}`;
                      const dotColor = s === "Active" ? "bg-emerald-500" : s === "Pending" ? "bg-amber-500" : "bg-red-500";
                      return (
                        <label
                          key={s}
                          htmlFor={id}
                          className={`flex-1 flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            formData.status === s
                              ? "border-primary bg-primary/5 dark:border-accent dark:bg-accent/5 font-bold"
                              : "border-muted/20 hover:bg-background"
                          }`}
                        >
                          <input
                            type="radio"
                            id={id}
                            name="status"
                            checked={formData.status === s}
                            onChange={() => setFormData({ ...formData, status: s })}
                            className="text-primary focus:ring-primary h-4 w-4 dark:text-accent dark:focus:ring-accent shrink-0"
                          />
                          <span className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                            {s}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 h-11 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 h-11 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-98"
                >
                  Save Vendor
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 8. VIEW VENDOR DRAWER */}
      {isDrawerOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full sm:w-[450px] bg-card h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-accent font-bold text-xs shrink-0 font-mono">
                  {selectedVendor.name.split(" ").slice(0, 2).map((v) => v[0]).join("")}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground leading-tight">{selectedVendor.name}</h3>
                  <p className="text-[10px] text-muted font-medium mt-0.5">{selectedVendor.id}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 text-muted hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                selectedVendor.status === "Active"
                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : selectedVendor.status === "Pending"
                  ? "bg-amber-500/5 border-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "bg-red-500/5 border-red-500/10 text-red-700 dark:text-red-400"
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Current Registration Status</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase border ${
                  selectedVendor.status === "Active"
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : selectedVendor.status === "Pending"
                    ? "border-amber-500/20 bg-amber-500/10"
                    : "border-red-500/20 bg-red-500/10"
                }`}>
                  {selectedVendor.status}
                </span>
              </div>

              {/* Vendor Info Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Vendor Information</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-4">
                  <div>
                    <span className="text-[10px] text-muted font-bold block uppercase tracking-wide">Legal Vendor Name</span>
                    <span className="text-xs font-semibold text-foreground mt-1 block">{selectedVendor.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted font-bold block uppercase tracking-wide">Parent Company Name</span>
                    <span className="text-xs font-semibold text-foreground mt-1 block">{selectedVendor.companyName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted font-bold block uppercase tracking-wide">Supplier Category</span>
                    <span className="text-xs font-semibold text-foreground mt-1 block">{selectedVendor.category}</span>
                  </div>
                </div>
              </div>

              {/* GST Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">GST Details</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-4">
                  <div>
                    <span className="text-[10px] text-muted font-bold block uppercase tracking-wide font-sans">GSTIN Number</span>
                    <span className="text-xs font-bold text-foreground font-mono mt-1 block tracking-wider">{selectedVendor.gstNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted font-bold block uppercase tracking-wide">PAN Number</span>
                    <span className="text-xs font-bold text-foreground font-mono mt-1 block tracking-wider">{selectedVendor.panNumber}</span>
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Contact Details</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-primary dark:text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted font-bold block uppercase">Primary Contact Person</span>
                      <span className="text-xs font-semibold text-foreground mt-0.5 block">{selectedVendor.contactPerson}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary dark:text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted font-bold block uppercase">Registered Email</span>
                      <span className="text-xs font-semibold text-foreground mt-0.5 block break-all">{selectedVendor.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary dark:text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted font-bold block uppercase">Corporate Phone</span>
                      <span className="text-xs font-semibold text-foreground mt-0.5 block">{selectedVendor.contactNumber}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary dark:text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted font-bold block uppercase">Physical Business Address</span>
                      <span className="text-xs font-semibold text-foreground mt-1 block leading-relaxed">{selectedVendor.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">Status Information</h4>
                <div className="bg-background rounded-2xl p-4 border border-muted/5 space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Compliance Audited</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Yes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Registration Date</span>
                    <span className="font-semibold text-foreground">{selectedVendor.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Last Updated</span>
                    <span className="font-semibold text-foreground">{selectedVendor.lastUpdated}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-muted/10 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  openEditModal(selectedVendor);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-95 shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setDeleteTarget(selectedVendor);
                }}
                className="w-11 h-11 rounded-xl border border-muted/20 text-red-500 hover:bg-red-500/5 flex items-center justify-center transition-all active:scale-95"
                title="Remove Vendor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE DIALOG CONFIRM */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200" onClick={() => setDeleteTarget(null)}></div>
          <div className="relative w-full max-w-md bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Delete Vendor Record?</h3>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Are you sure you want to completely remove vendor <span className="font-semibold text-foreground">"{deleteTarget.name}"</span>? 
              This will permanently revoke all access permissions and delete their procurement records from VendorBridge. This operation is irreversible.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-98"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all active:scale-98 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
