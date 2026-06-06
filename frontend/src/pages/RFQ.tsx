import { useState, useMemo } from "react";
import type { FormEvent } from "react";
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
  Plus,
  Trash2,
  Upload,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Send,
  Save,
  CheckCircle,
  Paperclip
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Interfaces
interface LineItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
}

interface AssignedVendor {
  id: string;
  name: string;
  companyName: string;
  category: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
}

// Mock Database of Vendors to Assign
const AVAILABLE_VENDORS: AssignedVendor[] = [
  { id: "V-1", name: "Infra Supplies Pvt Ltd", companyName: "Infra Supplies Pvt Ltd", category: "Construction" },
  { id: "V-2", name: "Techcore LTD", companyName: "Techcore LTD", category: "IT" },
  { id: "V-3", name: "Apex Solutions India Ltd", companyName: "Apex Solutions India Ltd", category: "IT" },
  { id: "V-4", name: "Zenith Logistics Services", companyName: "Zenith Logistics Services", category: "Logistics" },
  { id: "V-5", name: "Banyan Corporate Consultants", companyName: "Banyan Corporate Consultants", category: "Services" },
  { id: "V-6", name: "Standard Woods & Decor Ltd", companyName: "Standard Woods & Decor Ltd", category: "Furniture" }
];

export function RFQ() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Wizard Stepper State (1, 2, 3)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [successState, setSuccessState] = useState<"draft" | "sent" | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("Office Furniture procurement Q2");
  const [category, setCategory] = useState("Furniture");
  const [deadline, setDeadline] = useState("2026-06-15");
  const [description, setDescription] = useState("Ergonomic chairs and standing desks for 3rd floor");

  // Stepper Step 2: Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "li-1", name: "Ergonomic chair", qty: 15, unit: "NOS" },
    { id: "li-2", name: "Standing desks", qty: 10, unit: "NOS" }
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState("NOS");

  // Stepper Step 3: Assigned Vendors & Attachments State
  const [assignedVendors, setAssignedVendors] = useState<AssignedVendor[]>([
    { id: "V-1", name: "Infra Supplies Pvt Ltd", companyName: "Infra Supplies Pvt Ltd", category: "Construction" },
    { id: "V-2", name: "Techcore LTD", companyName: "Techcore LTD", category: "IT" }
  ]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);

  // Attachments State
  const [files, setFiles] = useState<AttachedFile[]>([
    { id: "file-1", name: "Layout_Blueprints_3rdFloor.pdf", size: "3.2 MB" }
  ]);
  const [dragActive, setDragActive] = useState(false);

  // UI States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 1. Navigation sidebars mapping
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: false },
    { name: "Vendors", icon: Users, path: "/vendors", active: false },
    { name: "RFQs (Active)", icon: FileText, path: "/rfqs", active: true },
    { name: "Quotations", icon: ShoppingBag, path: "/quotations", active: false },
    { name: "Approvals", icon: CheckCircle2, path: "/approvals", active: false },
    { name: "Purchase Orders", icon: DollarSign, path: "/purchase-orders", active: false },
    { name: "Invoices", icon: FileDown, path: "/invoices", active: false },
    { name: "Reports", icon: BarChart3, path: "/reports", active: false },
    { name: "Activity", icon: Activity, path: "/activity-logs", active: false },
    { name: "Settings", icon: Settings, path: "/settings", active: false }
  ];

  // Step 2 Action: Add Line Item
  const handleAddLineItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: LineItem = {
      id: `li-custom-${Date.now()}`,
      name: newItemName.trim(),
      qty: newItemQty,
      unit: newItemUnit
    };
    setLineItems([...lineItems, newItem]);
    setNewItemName("");
    setNewItemQty(1);
    setNewItemUnit("NOS");
  };

  // Step 2 Action: Remove Line Item
  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Step 3 Action: Assign Vendor
  const handleAssignVendor = (vendor: AssignedVendor) => {
    if (assignedVendors.some((v) => v.id === vendor.id)) return;
    setAssignedVendors([...assignedVendors, vendor]);
    setVendorSearch("");
    setIsVendorDropdownOpen(false);
  };

  // Step 3 Action: Unassign Vendor
  const handleUnassignVendor = (id: string) => {
    setAssignedVendors(assignedVendors.filter((v) => v.id !== id));
  };

  // Search filtered vendors
  const filteredAvailableVendors = useMemo(() => {
    if (!vendorSearch) return AVAILABLE_VENDORS;
    return AVAILABLE_VENDORS.filter((v) =>
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(vendorSearch.toLowerCase())
    );
  }, [vendorSearch]);

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles: AttachedFile[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        newFiles.push({
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        });
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles: AttachedFile[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        newFiles.push({
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        });
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  // Stepper Validations
  const isStep1Valid = title.trim() !== "" && deadline.trim() !== "" && category.trim() !== "";
  const isStep2Valid = lineItems.length > 0;
  const isStep3Valid = assignedVendors.length > 0;

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid) setCurrentStep(2);
    else if (currentStep === 2 && isStep2Valid) setCurrentStep(3);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    setSuccessState("draft");
  };

  const handleSaveAndSend = () => {
    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      alert("Please complete all fields, add line items, and assign at least one vendor before sending.");
      return;
    }
    setSuccessState("sent");
  };

  const resetWizard = () => {
    setTitle("");
    setCategory("IT");
    setDeadline("");
    setDescription("");
    setLineItems([]);
    setAssignedVendors([]);
    setFiles([]);
    setCurrentStep(1);
    setSuccessState(null);
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
                <span>{item.name}</span>
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
                    <span>{item.name}</span>
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
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Procurement Workflows</span>
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

        {/* 3. PAGE BODY */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
          
          {/* Header */}
          <div className="border-b border-muted/10 pb-5">
            <h1 className="text-2xl font-bold text-primary dark:text-white">Create RFQ's</h1>
            <p className="text-sm text-muted mt-0.5">new request for quotation</p>
          </div>

          {/* Success Screen state */}
          {successState ? (
            <div className="bg-card border border-muted/10 rounded-2xl p-8 max-w-lg mx-auto text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  {successState === "sent" ? "RFQ Dispatched Successfully!" : "RFQ Saved as Draft"}
                </h2>
                <p className="text-sm text-muted">
                  {successState === "sent"
                    ? `Request for quotation "${title}" was successfully issued and sent to ${assignedVendors.length} assigned vendors.`
                    : `Request for quotation "${title}" has been saved as a local draft. You can revise it and send it later.`}
                </p>
              </div>

              {/* RFQ Mini Specs Summary */}
              <div className="bg-background rounded-xl p-4 text-left border border-muted/5 text-xs font-semibold space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted">Category:</span>
                  <span className="text-foreground">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Deadline:</span>
                  <span className="text-foreground">{deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Line Items:</span>
                  <span className="text-foreground">{lineItems.length} Products</span>
                </div>
                {successState === "sent" && (
                  <div className="flex justify-between">
                    <span className="text-muted">Assigned Vendors:</span>
                    <span className="text-foreground">{assignedVendors.map((v) => v.name).join(", ")}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetWizard}
                  className="flex-1 h-11 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-95 shadow-md"
                >
                  Create Another RFQ
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 h-11 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-95"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* RFQ creation form container */
            <div className="space-y-6">
              
              {/* Stepper Wizard Indicator */}
              <div className="flex items-center justify-center max-w-md mx-auto py-2">
                {[1, 2, 3].map((step) => {
                  const isActive = currentStep === step;
                  const isDone = currentStep > step;
                  
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <button
                        onClick={() => {
                          if (step === 1) setCurrentStep(1);
                          if (step === 2 && isStep1Valid) setCurrentStep(2);
                          if (step === 3 && isStep1Valid && isStep2Valid) setCurrentStep(3);
                        }}
                        disabled={step > 1 && !isStep1Valid}
                        className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center border transition-all shrink-0 ${
                          isDone
                            ? "bg-primary border-primary text-white dark:bg-accent dark:border-accent dark:text-primary"
                            : isActive
                            ? "border-primary text-primary dark:border-accent dark:text-accent bg-primary/5 dark:bg-accent/10 shadow-sm"
                            : "border-muted/25 text-muted bg-card"
                        }`}
                      >
                        {isDone ? "✓" : step}
                      </button>
                      
                      {step < 3 && (
                        <div className={`h-[2px] flex-1 mx-2 transition-all ${
                          isDone ? "bg-primary dark:bg-accent" : "bg-muted/20"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Main Card grid */}
              <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.12)] border border-muted/10 p-6">
                
                {/* STEP 1: RFQ BASICS */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="border-b border-muted/10 pb-2">
                      <h3 className="text-sm font-bold text-primary dark:text-accent uppercase tracking-wider">Step 1: RFQ Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* RFQ Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">RFQ's Title *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Office Furniture procurement Q2"
                          className="w-full h-11 px-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all font-medium"
                        />
                      </div>

                      {/* Category Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">Category *</label>
                        <select
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all font-semibold cursor-pointer appearance-none"
                        >
                          <option value="Furniture">Furniture</option>
                          <option value="IT">IT</option>
                          <option value="Construction">Construction</option>
                          <option value="Logistics">Logistics</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Services">Services</option>
                        </select>
                      </div>

                      {/* Deadline Datepicker */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">Deadline *</label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full h-11 px-4 pr-10 rounded-xl border border-muted/20 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all font-medium cursor-pointer"
                          />
                          <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        </div>
                      </div>

                      {/* Description Textarea */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">Description</label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide detailed description of materials, services, expectations or technical scopes..."
                          className="w-full p-4 rounded-xl border border-muted/20 bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent transition-all resize-none font-medium leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: LINE ITEMS */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
                    <div className="border-b border-muted/10 pb-2">
                      <h3 className="text-sm font-bold text-primary dark:text-accent uppercase tracking-wider">Step 2: RFQ Line Items</h3>
                    </div>

                    {/* Add Line Item Form inline */}
                    <form onSubmit={handleAddLineItem} className="bg-background border border-muted/10 p-4 rounded-2xl space-y-4 md:space-y-0 md:flex md:items-end md:gap-3">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">Product / Service Name *</label>
                        <input
                          type="text"
                          required
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="e.g. Ergonomic chair"
                          className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-card text-xs font-medium text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                        />
                      </div>

                      <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">Quantity *</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={newItemQty}
                          onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                          className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20"
                        />
                      </div>

                      <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-xs font-semibold text-muted block">Unit *</label>
                        <select
                          value={newItemUnit}
                          onChange={(e) => setNewItemUnit(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          <option value="NOS">NOS (Numbers)</option>
                          <option value="PCS">PCS (Pieces)</option>
                          <option value="KG">KG (Kilograms)</option>
                          <option value="LTR">LTR (Litres)</option>
                          <option value="MTR">MTR (Meters)</option>
                          <option value="BOX">BOX (Boxes)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full md:w-auto h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                      </button>
                    </form>

                    {/* Table list of Items added */}
                    <div className="border border-muted/10 rounded-2xl overflow-hidden bg-background">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-muted/10 text-muted uppercase text-[10px] font-bold bg-card">
                            <th className="px-5 py-3.5">Product/Service Name</th>
                            <th className="px-5 py-3.5 text-center">Quantity</th>
                            <th className="px-5 py-3.5 text-center">Unit</th>
                            <th className="px-5 py-3.5 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lineItems.map((item, idx) => (
                            <tr key={item.id} className="border-b border-muted/6 last:border-0 hover:bg-primary/2 dark:hover:bg-white/2 transition-colors">
                              <td className="px-5 py-3 text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-muted">#{idx + 1}</span>
                                  <span>{item.name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm font-bold text-foreground text-center">{item.qty}</td>
                              <td className="px-5 py-3 text-xs text-muted text-center font-semibold">{item.unit}</td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLineItem(item.id)}
                                  className="w-7 h-7 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 flex items-center justify-center mx-auto transition-all"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {lineItems.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-5 py-10 text-center text-xs text-muted">
                                No line items added yet. Please specify a product/service above to add.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* STEP 3: VENDORS & ATTACHMENTS */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
                    <div className="border-b border-muted/10 pb-2">
                      <h3 className="text-sm font-bold text-primary dark:text-accent uppercase tracking-wider">Step 3: Assign Vendors & Attachments</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Vendor Assignment Box */}
                      <div className="space-y-4">
                        <div className="space-y-1.5 relative">
                          <label className="text-xs font-semibold text-muted block">Assign Vendors *</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={vendorSearch}
                              onChange={(e) => {
                                setVendorSearch(e.target.value);
                                setIsVendorDropdownOpen(true);
                              }}
                              onFocus={() => setIsVendorDropdownOpen(true)}
                              placeholder="Search vendors by name or category..."
                              className="w-full h-10 px-3.5 rounded-xl border border-muted/20 bg-background text-xs font-semibold text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent"
                            />
                            {vendorSearch && (
                              <button
                                onClick={() => setVendorSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Vendor search dropdown */}
                          {isVendorDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsVendorDropdownOpen(false)} />
                              <div className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-card border border-muted/15 shadow-xl rounded-xl z-50 p-1">
                                {filteredAvailableVendors.length > 0 ? (
                                  filteredAvailableVendors.map((vendor) => {
                                    const isAssigned = assignedVendors.some((av) => av.id === vendor.id);
                                    return (
                                      <button
                                        key={vendor.id}
                                        type="button"
                                        disabled={isAssigned}
                                        onClick={() => handleAssignVendor(vendor)}
                                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                                          isAssigned
                                            ? "text-muted bg-primary/2 dark:bg-white/2 cursor-not-allowed"
                                            : "hover:bg-primary/5 dark:hover:bg-white/5 text-foreground cursor-pointer"
                                        }`}
                                      >
                                        <div>
                                          <p className="font-bold">{vendor.name}</p>
                                          <p className="text-[10px] text-muted">{vendor.category}</p>
                                        </div>
                                        {isAssigned && (
                                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Assigned</span>
                                        )}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="p-4 text-center text-xs text-muted">No vendors found</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Chips of Assigned Vendors */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-muted block">Assigned Vendors ({assignedVendors.length})</label>
                          <div className="flex flex-wrap gap-2 p-3 bg-background rounded-2xl border border-muted/5 min-h-[90px] content-start">
                            {assignedVendors.map((v) => (
                              <div
                                key={v.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-muted/10 text-xs font-bold text-foreground shadow-sm animate-in zoom-in-95 duration-150"
                              >
                                <span>{v.name}</span>
                                <span className="text-[9px] bg-primary/5 text-primary px-1.5 py-0.5 rounded-md font-semibold">{v.category}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUnassignVendor(v.id)}
                                  className="text-muted hover:text-red-500 transition-colors"
                                  title="Unassign"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            {assignedVendors.length === 0 && (
                              <span className="text-xs text-muted italic p-1">No vendors assigned yet. Search above to add.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: File Attachments */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted block">Attachments</label>
                          
                          {/* Dropzone */}
                          <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative ${
                              dragActive
                                ? "border-primary bg-primary/5 dark:border-accent dark:bg-white/5"
                                : "border-muted/20 hover:border-primary/50 dark:hover:border-accent/50 bg-background"
                            }`}
                          >
                            <input
                              type="file"
                              multiple
                              onChange={handleFileInput}
                              className="hidden"
                              id="rfq-files-input"
                            />
                            
                            <Upload className="w-8 h-8 text-muted mb-2 animate-bounce-hover" />
                            <p className="text-xs font-bold text-foreground">Drag & drop files or click to upload</p>
                            <p className="text-[10px] text-muted mt-0.5">PDF, Word, Excel, Images up to 10MB</p>
                            
                            <label
                              htmlFor="rfq-files-input"
                              className="mt-3.5 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary dark:bg-white/5 dark:text-foreground text-xs font-bold rounded-xl cursor-pointer transition-colors border border-muted/10"
                            >
                              Browse Files
                            </label>
                          </div>
                        </div>

                        {/* List of Files uploaded */}
                        {files.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2.5 bg-background rounded-xl border border-muted/5 group hover:border-muted/15 transition-all"
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className="p-2 rounded-lg bg-card text-primary dark:text-accent border border-muted/10 shrink-0">
                                    <Paperclip className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate text-foreground">{file.name}</p>
                                    <p className="text-[10px] text-muted">{file.size}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(file.id)}
                                  className="p-1 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* Footer Buttons Navigation */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-muted/10 mt-8">
                  
                  {/* Left: Previous step button or spacer */}
                  <div>
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-95 whitespace-nowrap w-full sm:w-auto"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {/* Draft and Submit buttons shown in Step 3 */}
                    {currentStep === 3 ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-xl border border-muted/20 text-foreground text-xs font-bold hover:bg-background transition-all active:scale-95 whitespace-nowrap"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save as Draft</span>
                        </button>
                        <button
                          type="button"
                          disabled={!isStep1Valid || !isStep2Valid || !isStep3Valid}
                          onClick={handleSaveAndSend}
                          className="inline-flex items-center justify-center gap-1.5 h-11 px-6 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-primary whitespace-nowrap shadow-md"
                        >
                          <Send className="w-4 h-4" />
                          <span>Save & Send to Vendors</span>
                        </button>
                      </>
                    ) : (
                      /* Next button for steps 1 and 2 */
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                        className="inline-flex items-center justify-center gap-1.5 h-11 px-6 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 dark:bg-accent dark:text-primary dark:hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-primary whitespace-nowrap shadow-sm"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
