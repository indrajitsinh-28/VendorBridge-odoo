import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  Trash2,
  Eye,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  RefreshCw,
  FileDown,
  Upload,
  Activity,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  BarChart3,
  Settings,
  DollarSign,
  ShoppingBag,
  Users,
  FileText,
  LayoutDashboard,
  ShieldAlert,
  ArrowRight,
  Edit2,
  Mail,
  Phone,
  MapPin,
  AlertOctagon,
  Download
} from "lucide-react";
import { Button } from "../Components/ui/Button";
import { Input } from "../Components/ui/Input";
import { ThemeToggle } from "../Components/ThemeToggle";

// Types definition
interface ActivityLog {
  id: string;
  type: "created" | "updated" | "po" | "quotation";
  title: string;
  description: string;
  timestamp: string;
}

interface Vendor {
  id: string;
  name: string;
  companyName: string;
  category: "IT & Software" | "Logistics" | "Office Supplies" | "Legal & Compliance" | "Marketing" | "Manufacturing";
  gstNumber: string;
  panNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Pending Verification" | "Suspended" | "Blacklisted";
  rating: number;
  city: string;
  registrationDate: string;
  lastUpdated: string;
  ordersCount: number;
  completedOrdersCount: number;
  lastTransactionDate: string;
  activities: ActivityLog[];
}

// Initial mock dataset
const INITIAL_VENDORS: Vendor[] = [
  {
    id: "VB-VEN-001",
    name: "Aarav Sharma",
    companyName: "Apex Solutions India Ltd",
    category: "IT & Software",
    gstNumber: "27AAAAA1111A1Z1",
    panNumber: "AAAAA1111A",
    contactPerson: "Aarav Sharma",
    email: "aarav@apexsolutions.in",
    phone: "+91 98765 43210",
    address: "Plot 24, Phase 3, Hinjewadi IT Park, Pune, Maharashtra - 411057",
    status: "Active",
    rating: 4.8,
    city: "Pune",
    registrationDate: "2025-01-15",
    lastUpdated: "2026-06-01",
    ordersCount: 45,
    completedOrdersCount: 43,
    lastTransactionDate: "2026-05-28",
    activities: [
      { id: "act-1", type: "po", title: "Purchase Order Released", description: "PO #VB-PO-2026-0042 for software development support issued.", timestamp: "2026-05-28" },
      { id: "act-2", type: "quotation", title: "Quotation Submitted", description: "Submitted quotation for Cloud Migration Services.", timestamp: "2026-05-24" },
      { id: "act-3", type: "updated", title: "GST Certificate Renewed", description: "GST Details verified and updated successfully.", timestamp: "2026-05-10" },
      { id: "act-4", type: "created", title: "Vendor Onboarded", description: "Initial registration and self-onboarding verification complete.", timestamp: "2025-01-15" }
    ]
  },
  {
    id: "VB-VEN-002",
    name: "Priya Patel",
    companyName: "Zenith Logistics Services",
    category: "Logistics",
    gstNumber: "24BBBBB2222B2Z2",
    panNumber: "BBBBB2222B",
    contactPerson: "Priya Patel",
    email: "priya@zenithlogistics.com",
    phone: "+91 99887 76655",
    address: "405, Safal Pegasus, Prahladnagar, Ahmedabad, Gujarat - 380015",
    status: "Active",
    rating: 4.6,
    city: "Ahmedabad",
    registrationDate: "2025-02-10",
    lastUpdated: "2026-05-30",
    ordersCount: 120,
    completedOrdersCount: 115,
    lastTransactionDate: "2026-06-02",
    activities: [
      { id: "act-5", type: "po", title: "Purchase Order Completed", description: "Shipment PO #VB-PO-2026-0039 marked as fully delivered.", timestamp: "2026-06-02" },
      { id: "act-6", type: "po", title: "Shipment Dispatched", description: "Dispatched raw materials tracking route #MUM-AHM-04.", timestamp: "2026-05-29" },
      { id: "act-7", type: "updated", title: "Profile Info Updated", description: "Emergency contact phone number updated.", timestamp: "2026-04-12" }
    ]
  },
  {
    id: "VB-VEN-003",
    name: "Rohan Das",
    companyName: "Banyan Corporate Consultants",
    category: "Legal & Compliance",
    gstNumber: "19CCCCC3333C3Z3",
    panNumber: "CCCCC3333C",
    contactPerson: "Rohan Das",
    email: "rohan@banyanconsultants.com",
    phone: "+91 91234 56789",
    address: "Flat 12B, Chowringhee Mansion, Park Street, Kolkata, West Bengal - 700016",
    status: "Pending Verification",
    rating: 4.2,
    city: "Kolkata",
    registrationDate: "2026-05-20",
    lastUpdated: "2026-05-22",
    ordersCount: 2,
    completedOrdersCount: 1,
    lastTransactionDate: "2026-05-25",
    activities: [
      { id: "act-8", type: "quotation", title: "NDA Draft Submitted", description: "Legal audit quotation and standard NDA draft uploaded.", timestamp: "2026-05-22" },
      { id: "act-9", type: "created", title: "Vendor Registered", description: "Self-registration completed, awaiting compliance desk review.", timestamp: "2026-05-20" }
    ]
  },
  {
    id: "VB-VEN-004",
    name: "Vikram Malhotra",
    companyName: "Matrix Systems & Networking",
    category: "IT & Software",
    gstNumber: "07DDDDD4444D4Z4",
    panNumber: "DDDDD4444D",
    contactPerson: "Vikram Malhotra",
    email: "vikram@matrixsystems.co.in",
    phone: "+91 88776 65544",
    address: "Block C-5, Okhla Industrial Area Phase 1, New Delhi - 110020",
    status: "Suspended",
    rating: 3.5,
    city: "New Delhi",
    registrationDate: "2025-06-12",
    lastUpdated: "2026-04-15",
    ordersCount: 30,
    completedOrdersCount: 25,
    lastTransactionDate: "2026-03-10",
    activities: [
      { id: "act-10", type: "updated", title: "Vendor Account Suspended", description: "Compliance suspended account due to expired ISO certification.", timestamp: "2026-04-15" },
      { id: "act-11", type: "po", title: "Delayed PO Delivery", description: "Delivery for PO #VB-PO-2026-0012 delayed by 18 days.", timestamp: "2026-03-10" }
    ]
  },
  {
    id: "VB-VEN-005",
    name: "Sanjay Dutt",
    companyName: "Hindustan Office Suppliers",
    category: "Office Supplies",
    gstNumber: "27EEEEE5555E5Z5",
    panNumber: "EEEEE5555E",
    contactPerson: "Sanjay Dutt",
    email: "sanjay@hindustanoffice.com",
    phone: "+91 92345 67890",
    address: "12, Industrial Area, Bhandup West, Mumbai, Maharashtra - 400078",
    status: "Active",
    rating: 4.9,
    city: "Mumbai",
    registrationDate: "2024-03-11",
    lastUpdated: "2026-06-03",
    ordersCount: 210,
    completedOrdersCount: 209,
    lastTransactionDate: "2026-06-03",
    activities: [
      { id: "act-12", type: "po", title: "Supplies Dispatched", description: "Office workstation supplies dispatched for Bangalore office.", timestamp: "2026-06-03" },
      { id: "act-13", type: "po", title: "Purchase Order Completed", description: "PO #VB-PO-2026-0036 delivered and signed off.", timestamp: "2026-05-25" }
    ]
  },
  {
    id: "VB-VEN-006",
    name: "Meera Krishnan",
    companyName: "Bridges Marketing Group",
    category: "Marketing",
    gstNumber: "32FFFFF6666F6Z6",
    panNumber: "FFFFF6666F",
    contactPerson: "Meera Krishnan",
    email: "meera@bridgesmarketing.in",
    phone: "+91 94567 89012",
    address: "22/450, MG Road, Ernakulam, Kochi, Kerala - 682016",
    status: "Active",
    rating: 4.5,
    city: "Kochi",
    registrationDate: "2025-08-01",
    lastUpdated: "2026-05-15",
    ordersCount: 18,
    completedOrdersCount: 18,
    lastTransactionDate: "2026-05-02",
    activities: [
      { id: "act-14", type: "po", title: "Campaign Sign-off", description: "Q1 Digital Campaign finished successfully, invoice approved.", timestamp: "2026-05-02" },
      { id: "act-15", type: "quotation", title: "Rebranding Quotation Submitted", description: "Submitted comprehensive proposal for ERP launch campaign.", timestamp: "2026-04-28" }
    ]
  },
  {
    id: "VB-VEN-007",
    name: "Karan Johar",
    companyName: "Elite Security Force",
    category: "Manufacturing",
    gstNumber: "29GGGGG7777G7Z7",
    panNumber: "GGGGG7777G",
    contactPerson: "Karan Johar",
    email: "karan@elitesecurity.in",
    phone: "+91 93456 78901",
    address: "Tower B, Prestige Tech Park, Outer Ring Road, Bangalore, Karnataka - 560103",
    status: "Blacklisted",
    rating: 2.1,
    city: "Bangalore",
    registrationDate: "2024-11-05",
    lastUpdated: "2026-02-18",
    ordersCount: 12,
    completedOrdersCount: 8,
    lastTransactionDate: "2026-01-10",
    activities: [
      { id: "act-16", type: "updated", title: "Vendor Blacklisted", description: "Permanently blacklisted due to multiple code of conduct breaches.", timestamp: "2026-02-18" },
      { id: "act-17", type: "po", title: "Breach Incident Filed", description: "Failed compliance audit and non-delivery of critical safety gear.", timestamp: "2026-01-12" }
    ]
  },
  {
    id: "VB-VEN-008",
    name: "Anjali Deshmukh",
    companyName: "Dynamic Office Furniture Ltd",
    category: "Office Supplies",
    gstNumber: "27HHHHH8888H8Z8",
    panNumber: "HHHHH8888H",
    contactPerson: "Anjali Deshmukh",
    email: "anjali@dynamicfurniture.com",
    phone: "+91 97654 32109",
    address: "M-14, MIDC, Ambad, Nashik, Maharashtra - 422010",
    status: "Pending Verification",
    rating: 4.0,
    city: "Nashik",
    registrationDate: "2026-05-29",
    lastUpdated: "2026-05-30",
    ordersCount: 0,
    completedOrdersCount: 0,
    lastTransactionDate: "-",
    activities: [
      { id: "act-18", type: "created", title: "Onboarding Commenced", description: "Company registration docs uploaded. Awaiting compliance check.", timestamp: "2026-05-29" }
    ]
  }
];

const CITIES = ["All", "Mumbai", "Pune", "Ahmedabad", "Kolkata", "New Delhi", "Bangalore", "Kochi", "Nashik"];
const CATEGORIES = ["All", "IT & Software", "Logistics", "Office Supplies", "Legal & Compliance", "Marketing", "Manufacturing"];
const STATUSES = ["All", "Active", "Pending Verification", "Suspended", "Blacklisted"];

export function VendorManagement() {
  const navigate = useNavigate();
  // Primary State
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "ordersCount" | "registrationDate">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Interactivity Overlays State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedVendorForView, setSelectedVendorForView] = useState<Vendor | null>(null);
  const [selectedVendorForEdit, setSelectedVendorForEdit] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  
  // Import / Export State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importDragActive, setImportDragActive] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  // Simulated Loading State (triggered during searches/filtering for premium feel)
  const [isLoading, setIsLoading] = useState(false);

  // Form State for Add / Edit Modal
  const [formValues, setFormValues] = useState({
    name: "",
    companyName: "",
    category: "IT & Software" as Vendor["category"],
    gstNumber: "",
    panNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "Pending Verification" as Vendor["status"],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset filter handling
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setRatingFilter("All");
    setCityFilter("All");
    setDateFilter("All");
    setSortBy("name");
    setSortOrder("asc");
  };

  // Simulate loader effect on search change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, categoryFilter, ratingFilter, cityFilter, dateFilter, sortBy, sortOrder]);

  // Handle Sort Toggle
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filtered and Sorted Vendors
  const filteredAndSortedVendors = useMemo(() => {
    return vendors
      .filter((vendor) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          vendor.name.toLowerCase().includes(query) ||
          vendor.companyName.toLowerCase().includes(query) ||
          vendor.gstNumber.toLowerCase().includes(query) ||
          vendor.email.toLowerCase().includes(query) ||
          vendor.phone.toLowerCase().includes(query) ||
          vendor.id.toLowerCase().includes(query);

        // Status filter
        const matchesStatus = statusFilter === "All" || vendor.status === statusFilter;

        // Category filter
        const matchesCategory = categoryFilter === "All" || vendor.category === categoryFilter;

        // Rating filter
        let matchesRating = true;
        if (ratingFilter !== "All") {
          const minRating = parseFloat(ratingFilter);
          matchesRating = vendor.rating >= minRating;
        }

        // City filter
        const matchesCity = cityFilter === "All" || vendor.city.toLowerCase() === cityFilter.toLowerCase();

        // Date filter
        let matchesDate = true;
        if (dateFilter !== "All") {
          const regDate = new Date(vendor.registrationDate);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - regDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (dateFilter === "30") {
            matchesDate = diffDays <= 30;
          } else if (dateFilter === "90") {
            matchesDate = diffDays <= 90;
          } else if (dateFilter === "365") {
            matchesDate = diffDays <= 365;
          }
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesRating && matchesCity && matchesDate;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [vendors, searchQuery, statusFilter, categoryFilter, ratingFilter, cityFilter, dateFilter, sortBy, sortOrder]);

  // Paginated vendors
  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedVendors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedVendors, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedVendors.length / itemsPerPage) || 1;

  // Stat metrics computations
  const stats = useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter((v) => v.status === "Active").length;
    const pending = vendors.filter((v) => v.status === "Pending Verification").length;
    const blacklisted = vendors.filter((v) => v.status === "Blacklisted").length;
    
    // Average rating
    const ratedVendors = vendors.filter((v) => v.rating > 0);
    const avgRating = ratedVendors.length
      ? (ratedVendors.reduce((acc, curr) => acc + curr.rating, 0) / ratedVendors.length).toFixed(1)
      : "0.0";

    return { total, active, pending, blacklisted, avgRating };
  }, [vendors]);

  // Analytics helper computations
  const analyticsData = useMemo(() => {
    // 1. Category Distribution
    const catMap: Record<string, number> = {};
    vendors.forEach((v) => {
      catMap[v.category] = (catMap[v.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(catMap).map((cat) => ({
      name: cat,
      count: catMap[cat],
      percentage: Math.round((catMap[cat] / vendors.length) * 100)
    }));

    // 2. Growth Trend
    // Group vendors by month they joined (based on 2025/2026 registrationDate)
    const growthTrend = [
      { month: "Jan", count: vendors.filter(v => v.registrationDate.includes("-01-")).length },
      { month: "Feb", count: vendors.filter(v => v.registrationDate.includes("-02-")).length },
      { month: "Mar", count: vendors.filter(v => v.registrationDate.includes("-03-")).length },
      { month: "Apr", count: vendors.filter(v => v.registrationDate.includes("-04-")).length },
      { month: "May", count: vendors.filter(v => v.registrationDate.includes("-05-")).length },
      { month: "Jun", count: vendors.filter(v => v.registrationDate.includes("-06-")).length },
    ];

    // 3. Top Performers
    const topPerforming = [...vendors]
      .filter((v) => v.status === "Active")
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return { categoryDistribution, growthTrend, topPerforming };
  }, [vendors]);

  // Delete Action handler
  const triggerDelete = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (vendorToDelete) {
      setVendors(vendors.filter((v) => v.id !== vendorToDelete.id));
      setIsDeleteConfirmOpen(false);
      setVendorToDelete(null);
      // If page is empty after delete, go back
      if (paginatedVendors.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Form actions
  const openAddModal = () => {
    setSelectedVendorForEdit(null);
    setFormValues({
      name: "",
      companyName: "",
      category: "IT & Software",
      gstNumber: "",
      panNumber: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      status: "Pending Verification",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setSelectedVendorForEdit(vendor);
    setFormValues({
      name: vendor.name,
      companyName: vendor.companyName,
      category: vendor.category,
      gstNumber: vendor.gstNumber,
      panNumber: vendor.panNumber,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      status: vendor.status,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formValues.name.trim()) errors.name = "Vendor name is required";
    if (!formValues.companyName.trim()) errors.companyName = "Company name is required";
    if (!formValues.gstNumber.trim()) {
      errors.gstNumber = "GST Number is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formValues.gstNumber.trim().toUpperCase())) {
      errors.gstNumber = "Invalid Indian GST format (e.g. 27AAAAA1111A1Z1)";
    }
    if (!formValues.panNumber.trim()) {
      errors.panNumber = "PAN Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formValues.panNumber.trim().toUpperCase())) {
      errors.panNumber = "Invalid PAN format (e.g. AAAAA1111A)";
    }
    if (!formValues.contactPerson.trim()) errors.contactPerson = "Contact person is required";
    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email.trim())) {
      errors.email = "Invalid email format";
    }
    if (!formValues.phone.trim()) errors.phone = "Phone number is required";
    if (!formValues.address.trim()) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const today = new Date().toISOString().split("T")[0];

    if (selectedVendorForEdit) {
      // Edit mode
      setVendors(
        vendors.map((v) =>
          v.id === selectedVendorForEdit.id
            ? {
                ...v,
                name: formValues.name,
                companyName: formValues.companyName,
                category: formValues.category,
                gstNumber: formValues.gstNumber.toUpperCase(),
                panNumber: formValues.panNumber.toUpperCase(),
                contactPerson: formValues.contactPerson,
                email: formValues.email,
                phone: formValues.phone,
                address: formValues.address,
                status: formValues.status,
                lastUpdated: today,
                activities: [
                  {
                    id: `act-gen-${Date.now()}`,
                    type: "updated",
                    title: "Vendor Information Edited",
                    description: "User updated general compliance details and contact information.",
                    timestamp: today
                  },
                  ...v.activities
                ]
              }
            : v
        )
      );
    } else {
      // Create mode
      const newId = `VB-VEN-00${vendors.length + 1}`;
      const newVendor: Vendor = {
        id: newId,
        name: formValues.name,
        companyName: formValues.companyName,
        category: formValues.category,
        gstNumber: formValues.gstNumber.toUpperCase(),
        panNumber: formValues.panNumber.toUpperCase(),
        contactPerson: formValues.contactPerson,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address,
        status: formValues.status,
        rating: 5.0, // Default perfect rating for new onboarded vendors
        city: formValues.address.split(",").slice(-2)[0]?.trim() || "Mumbai",
        registrationDate: today,
        lastUpdated: today,
        ordersCount: 0,
        completedOrdersCount: 0,
        lastTransactionDate: "-",
        activities: [
          {
            id: `act-gen-${Date.now()}`,
            type: "created",
            title: "Vendor Onboarded",
            description: "Onboarding initiated. Status set to: " + formValues.status,
            timestamp: today
          }
        ]
      };
      setVendors([newVendor, ...vendors]);
    }

    setIsAddModalOpen(false);
  };

  // Mock Export CSV function
  const handleExportCSV = () => {
    const headers = ["Vendor ID", "Vendor Name", "Company Name", "Category", "GST Number", "Contact Person", "Email", "Phone", "Rating", "Status", "Last Updated"];
    const rows = filteredAndSortedVendors.map((v) => [
      v.id,
      v.name,
      v.companyName,
      v.category,
      v.gstNumber,
      v.contactPerson,
      v.email,
      v.phone,
      v.rating.toString(),
      v.status,
      v.lastUpdated
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vyaparsetu_vendors_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock File Drag & Drop Handlers
  const handleImportDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setImportDragActive(true);
    } else if (e.type === "dragleave") {
      setImportDragActive(false);
    }
  };

  const handleImportDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImportDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateImport(file);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateImport(e.target.files[0]);
    }
  };

  const simulateImport = (file: File) => {
    setImportMessage(`Processing "${file.name}"...`);
    setTimeout(() => {
      // Add a mock imported vendor
      const today = new Date().toISOString().split("T")[0];
      const newVendor: Vendor = {
        id: `VB-VEN-00${vendors.length + 1}`,
        name: "Mock Imported Contact",
        companyName: file.name.split(".")[0] || "Imported Enterprise",
        category: "Manufacturing",
        gstNumber: "27IMPORT1234A1Z",
        panNumber: "IMPORT1234A",
        contactPerson: "Mock Importer",
        email: "imported@vyaparsetu-mock.com",
        phone: "+91 90000 00000",
        address: "Imported industrial zone, Mumbai",
        status: "Pending Verification",
        rating: 4.0,
        city: "Mumbai",
        registrationDate: today,
        lastUpdated: today,
        ordersCount: 1,
        completedOrdersCount: 1,
        lastTransactionDate: today,
        activities: [
          {
            id: `act-imp-${Date.now()}`,
            type: "created",
            title: "Imported via CSV",
            description: "Vendor bulk loaded through procurement file integration.",
            timestamp: today
          }
        ]
      };
      setVendors(prev => [newVendor, ...prev]);
      setImportMessage(`Successfully imported vendor data from "${file.name}". 1 new record added.`);
    }, 1500);
  };

  // Mock Report Generation
  const handleDownloadReport = () => {
    const content = `
VENDORBRIDGE PROCUREMENT ERP REPORT
Report Type: Vendor Management Performance Audit
Generated: ${new Date().toLocaleString()}
--------------------------------------------------------
TOTAL MANAGED VENDORS: ${stats.total}
Active Vendors: ${stats.active}
Awaiting Review: ${stats.pending}
Suspended Accounts: ${stats.blacklisted}
Average Supplier Rating: ${stats.avgRating} / 5.0
--------------------------------------------------------
Detailed summary and system logs exported to system folder.
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VyaparSetu_Report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsReportOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* 1. Left Sidebar Navigation - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-muted/10 shrink-0 sticky top-0 h-screen transition-all duration-300">
        {/* Brand Logo & Name */}
        <div className="p-6 border-b border-muted/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-extrabold text-xl tracking-wider">V</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary dark:text-white leading-none">VyaparSetu</h1>
            <span className="text-xs text-muted font-medium">Procurement ERP</span>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/vendormanagement" },
            { name: "Vendors (Active)", icon: Users, active: true, path: "/vendormanagement" },
            { name: "RFQs", icon: FileText, active: false, path: "/vendormanagement" },
            { name: "Quotations", icon: ShoppingBag, active: false, path: "/vendorquotation" },
            { name: "Approvals", icon: CheckCircle2, active: false, path: "/vendormanagement" },
            { name: "Purchase Orders", icon: DollarSign, active: false, path: "/vendormanagement" },
            { name: "Invoices", icon: FileDown, active: false, path: "/vendormanagement" },
            { name: "Reports", icon: BarChart3, active: false, path: "/vendormanagement" },
            { name: "Activity Logs", icon: Activity, active: false, path: "/vendormanagement" },
            { name: "Settings", icon: Settings, active: false, path: "/vendormanagement" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? "bg-primary text-white shadow-md shadow-primary/10 dark:bg-accent dark:text-primary dark:shadow-none"
                  : "text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-muted/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:bg-white/10 dark:text-foreground flex items-center justify-center font-bold">
              OP
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">Omkar Patil</p>
              <p className="text-xs text-muted truncate">Procurement Head</p>
            </div>
            <button className="text-muted hover:text-red-500 transition-colors p-1" title="Logout">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <aside className="relative flex flex-col w-72 bg-card h-full p-6 shadow-2xl border-r border-muted/10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-muted/10">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-extrabold text-lg">V</span>
                </div>
                <div>
                  <h1 className="font-bold text-base text-primary dark:text-white leading-none">VyaparSetu</h1>
                  <span className="text-xs text-muted font-medium">Procurement ERP</span>
                </div>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-muted/10"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
              {[
                { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/vendormanagement" },
                { name: "Vendors (Active)", icon: Users, active: true, path: "/vendormanagement" },
                { name: "RFQs", icon: FileText, active: false, path: "/vendormanagement" },
                { name: "Quotations", icon: ShoppingBag, active: false, path: "/vendorquotation" },
                { name: "Approvals", icon: CheckCircle2, active: false, path: "/vendormanagement" },
                { name: "Purchase Orders", icon: DollarSign, active: false, path: "/vendormanagement" },
                { name: "Invoices", icon: FileDown, active: false, path: "/vendormanagement" },
                { name: "Reports", icon: BarChart3, active: false, path: "/vendormanagement" },
                { name: "Activity Logs", icon: Activity, active: false, path: "/vendormanagement" },
                { name: "Settings", icon: Settings, active: false, path: "/vendormanagement" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? "bg-primary text-white dark:bg-accent dark:text-primary"
                      : "text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* 2. Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-card border-b border-muted/10 h-16 flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center space-x-4 flex-1 max-w-lg">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search Bar */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Global Search (Vendors, POs, Invoices)..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background/50 border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Theme Toggle Component */}
            <ThemeToggle />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-card"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-muted/10 flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <button className="text-xs text-primary dark:text-accent font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {[
                      { title: "New Quotation Submitted", desc: "Aarav Sharma uploaded a quote for Cloud Migration.", time: "10 mins ago" },
                      { title: "Compliance Review Required", desc: "Banyan Corporate registered and awaits verification.", time: "2 hours ago" },
                      { title: "PO #VB-PO-041 Delayed", desc: "Matrix Systems reported potential transit delay.", time: "1 day ago" }
                    ].map((n, i) => (
                      <div key={i} className="px-4 py-3 border-b border-muted/5 hover:bg-primary/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <p className="text-xxs text-muted mt-0.5 line-clamp-2">{n.desc}</p>
                        <span className="text-xxxxs text-muted mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 p-1 bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  OP
                </div>
                <span className="text-sm font-medium hidden md:inline-block pr-1">Omkar Patil</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-card rounded-2xl border border-muted/15 shadow-xl py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-muted/10">
                    <p className="font-semibold text-sm">Omkar Patil</p>
                    <p className="text-xs text-muted">omkar.patil@vyaparsetu.com</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white transition-colors flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white transition-colors flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Manage Team</span>
                    </button>
                  </div>
                  <div className="border-t border-muted/10 pt-1 mt-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors flex items-center space-x-2">
                      <X className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. Main Dashboard Contents */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-muted/10 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">Vendor Management</h2>
              <p className="text-muted mt-1 text-sm md:text-base">
                Manage supplier information, compliance records, and procurement relationships from a centralized dashboard.
              </p>
            </div>
            
            {/* Primary Action Button */}
            <div>
              <Button
                onClick={openAddModal}
                className="shadow-lg shadow-primary/10 dark:shadow-none font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Vendor
              </Button>
            </div>
          </div>

          {/* 4. Summary Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                label: "Total Vendors",
                value: stats.total,
                icon: Users,
                color: "text-blue-500 bg-blue-500/5 border-blue-500/10",
                trend: "+4 this month",
                positive: true
              },
              {
                label: "Active Vendors",
                value: stats.active,
                icon: CheckCircle2,
                color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
                trend: "94.8% SLA rate",
                positive: true
              },
              {
                label: "Pending Verification",
                value: stats.pending,
                icon: Clock,
                color: "text-amber-500 bg-amber-500/5 border-amber-500/10",
                trend: "Awaiting approval",
                positive: false
              },
              {
                label: "Blacklisted Vendors",
                value: stats.blacklisted,
                icon: ShieldAlert,
                color: "text-rose-500 bg-rose-500/5 border-rose-500/10",
                trend: "Compliance check",
                positive: false
              },
              {
                label: "Average Vendor Rating",
                value: `${stats.avgRating} / 5.0`,
                icon: Star,
                color: "text-purple-500 bg-purple-500/5 border-purple-500/10",
                trend: "+0.2 improvement",
                positive: true
              }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-card rounded-2xl p-5 border border-muted/10 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-muted tracking-wider uppercase">{stat.label}</span>
                    <h3 className="text-2xl font-bold text-foreground mt-1.5 tracking-tight group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-muted/5 flex items-center text-xs text-muted">
                  <span className={`font-semibold mr-1.5 ${stat.positive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {stat.positive ? "↑" : "•"}
                  </span>
                  <span>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Analytics & Quick Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Growth Trend - SVG Interactive Line Chart */}
            <div className="bg-card rounded-2xl p-6 border border-muted/10 shadow-sm col-span-1 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2">
                  <h3 className="font-bold text-lg text-primary dark:text-white">Vendor Registration Growth</h3>
                  <span className="text-xs bg-primary/5 text-primary dark:bg-white/5 dark:text-foreground px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    H1 Growth
                  </span>
                </div>
                <p className="text-xs text-muted mb-4">Total new suppliers onboarded month-on-month</p>
                
                {/* SVG Graph */}
                <div className="relative h-48 w-full mt-2">
                  <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#013E37" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#013E37" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#013E37" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(100,116,139,0.06)" strokeWidth="1" />
                    <line x1="0" y1="75" x2="600" y2="75" stroke="rgba(100,116,139,0.06)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(100,116,139,0.06)" strokeWidth="1" />
                    <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(100,116,139,0.08)" strokeWidth="1" />

                    {/* Area under line */}
                    <path
                      d="M 50 160 C 120 160, 150 130, 200 130 C 250 130, 280 145, 320 145 C 360 145, 410 70, 470 70 C 530 70, 550 40, 580 40 L 580 160 Z"
                      fill="url(#chartGrad)"
                    />

                    {/* Line Chart Path */}
                    <path
                      d="M 50 160 C 120 160, 150 130, 200 130 C 250 130, 280 145, 320 145 C 360 145, 410 70, 470 70 C 530 70, 550 40, 580 40"
                      fill="none"
                      stroke="url(#chartLineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive nodes */}
                    <circle cx="50" cy="160" r="5" className="fill-primary dark:fill-accent stroke-white dark:stroke-primary hover:r-7 transition-all cursor-pointer" />
                    <circle cx="200" cy="130" r="5" className="fill-primary dark:fill-accent stroke-white dark:stroke-primary hover:r-7 transition-all cursor-pointer" />
                    <circle cx="320" cy="145" r="5" className="fill-primary dark:fill-accent stroke-white dark:stroke-primary hover:r-7 transition-all cursor-pointer" />
                    <circle cx="470" cy="70" r="5" className="fill-primary dark:fill-accent stroke-white dark:stroke-primary hover:r-7 transition-all cursor-pointer" />
                    <circle cx="580" cy="40" r="5" className="fill-primary dark:fill-accent stroke-white dark:stroke-primary hover:r-7 transition-all cursor-pointer" />
                  </svg>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between px-6 text-xxs font-bold text-muted mt-2">
                {analyticsData.growthTrend.map((t, idx) => (
                  <span key={idx} className="hover:text-primary dark:hover:text-accent cursor-pointer">
                    {t.month} ({t.count})
                  </span>
                ))}
              </div>
            </div>

            {/* Category & Status Overview & Quick Actions */}
            <div className="grid grid-cols-1 gap-6">
              
              {/* Category distribution */}
              <div className="bg-card rounded-2xl p-5 border border-muted/10 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-primary dark:text-white">Category Distribution</h3>
                  <div className="space-y-2.5 mt-4">
                    {analyticsData.categoryDistribution.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted">{item.count} vendors ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-primary/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary dark:bg-accent h-full rounded-full transition-all duration-1000"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-muted/5 flex items-center justify-between text-xs">
                  <span className="text-muted">Total 6 active domains</span>
                  <button
                    onClick={() => setCategoryFilter("IT & Software")}
                    className="text-primary dark:text-accent font-semibold flex items-center gap-1 hover:underline"
                  >
                    View IT Segment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-card rounded-2xl p-5 border border-muted/10 shadow-sm">
                <h3 className="font-bold text-base text-primary dark:text-white pb-3 border-b border-muted/5">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3 mt-3.5">
                  <button
                    onClick={openAddModal}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-foreground transition-all text-center border border-muted/5"
                  >
                    <Plus className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">Add Vendor</span>
                  </button>
                  
                  <button
                    onClick={handleExportCSV}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-foreground transition-all text-center border border-muted/5"
                  >
                    <Download className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">Export CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      setImportMessage(null);
                      setIsImportOpen(true);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-foreground transition-all text-center border border-muted/5"
                  >
                    <Upload className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">Import CSV</span>
                  </button>

                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-foreground transition-all text-center border border-muted/5"
                  >
                    <FileDown className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">Audit Report</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Top Performers (Compact List) */}
          <div className="bg-card rounded-2xl p-6 border border-muted/10 shadow-sm">
            <h3 className="font-bold text-lg text-primary dark:text-white mb-1">Top Performing Suppliers</h3>
            <p className="text-xs text-muted mb-4">Onboarded vendors with the highest average performance rating & SLA execution rate</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analyticsData.topPerforming.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-primary/5 dark:bg-white/5 border border-muted/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedVendorForView(v)}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent font-bold">
                    {v.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{v.companyName}</p>
                    <p className="text-xs text-muted truncate">{v.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold flex items-center gap-1 justify-end text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {v.rating}
                    </span>
                    <span className="text-xxs text-muted block mt-0.5">{v.ordersCount} total orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Vendor Search & Filter Section */}
          <div className="bg-card rounded-2xl p-6 border border-muted/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-primary dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters & Search
              </h3>
              
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-muted hover:text-primary dark:hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>

            {/* Inputs & Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Search text input */}
              <div className="lg:col-span-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, company, GST, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                >
                  <option disabled value="">Status</option>
                  {STATUSES.map((status, idx) => (
                    <option key={idx} value={status}>
                      {status === "All" ? "All Statuses" : status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                >
                  <option disabled value="">Category</option>
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                >
                  <option value="All">All Ratings</option>
                  <option value="4.5">4.5+ Rating</option>
                  <option value="4.0">4.0+ Rating</option>
                  <option value="3.0">3.0+ Rating</option>
                  <option value="2.0">Below 3.0</option>
                </select>
              </div>

              {/* City Filter */}
              <div>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-background border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                >
                  {CITIES.map((city, idx) => (
                    <option key={idx} value={city}>
                      {city === "All" ? "All Cities" : city}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Sorting & Date Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-muted/5">
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-muted font-medium">Sort By:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Name", value: "name" },
                    { label: "Rating", value: "rating" },
                    { label: "Most Orders", value: "ordersCount" },
                    { label: "Registration Date", value: "registrationDate" }
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSort(s.value as typeof sortBy)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        sortBy === s.value
                          ? "bg-primary text-white dark:bg-accent dark:text-primary"
                          : "bg-primary/5 hover:bg-primary/10 text-muted dark:bg-white/5 dark:hover:bg-white/10"
                      }`}
                    >
                      {s.label} {sortBy === s.value ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Date filter */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted font-medium">Joined:</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-background border border-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-semibold"
                >
                  <option value="All">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* 7. Vendor Data Table */}
          <div className="bg-card rounded-2xl border border-muted/10 shadow-sm overflow-hidden flex flex-col">
            
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                
                {/* Sticky Header */}
                <thead className="bg-primary/5 dark:bg-white/5 text-muted text-xs font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-muted/10">
                  <tr>
                    <th className="py-4 px-5">Vendor ID</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                      Vendor Name {sortBy === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th className="py-4 px-4">Company Name</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">GST Number</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("rating")}>
                      Rating {sortBy === "rating" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("registrationDate")}>
                      Joined {sortBy === "registrationDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-muted/10 text-sm">
                  {isLoading ? (
                    // 8. Loading Skeleton State
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-5"><div className="h-4 w-20 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-28 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-36 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-24 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-28 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-4">
                          <div className="h-3.5 w-32 bg-muted/20 rounded-md"></div>
                          <div className="h-3 w-24 bg-muted/20 rounded-md mt-1"></div>
                        </td>
                        <td className="py-4 px-4"><div className="h-4 w-12 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-4"><div className="h-5 w-16 bg-muted/20 rounded-full"></div></td>
                        <td className="py-4 px-4"><div className="h-4 w-20 bg-muted/20 rounded-md"></div></td>
                        <td className="py-4 px-5 text-right"><div className="h-8 w-24 bg-muted/20 rounded-xl ml-auto"></div></td>
                      </tr>
                    ))
                  ) : paginatedVendors.length === 0 ? (
                    // 9. Empty State Design
                    <tr>
                      <td colSpan={10} className="py-16 text-center">
                        <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                          <div className="p-4 rounded-full bg-primary/5 dark:bg-white/5 text-muted border border-muted/10">
                            <SlidersHorizontal className="w-8 h-8 text-muted" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-foreground">No matching suppliers found</h4>
                            <p className="text-xs text-muted mt-1 px-4">
                              We couldn't find any vendors matching your search queries or filter attributes. Please expand your parameters or reset filters.
                            </p>
                          </div>
                          <Button onClick={handleResetFilters} variant="outline" size="sm" className="mt-2">
                            Reset Search Filters
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedVendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="hover:bg-primary/2 dark:hover:bg-white/2 transition-colors duration-150 group"
                      >
                        {/* Vendor ID */}
                        <td className="py-4 px-5 font-semibold text-primary dark:text-accent select-all">
                          {vendor.id}
                        </td>
                        
                        {/* Vendor Name */}
                        <td className="py-4 px-4 font-medium text-foreground">
                          {vendor.name}
                        </td>

                        {/* Company Name */}
                        <td className="py-4 px-4 font-semibold text-foreground">
                          {vendor.companyName}
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 text-xxs font-bold rounded-lg bg-primary/5 text-primary dark:bg-white/5 dark:text-foreground">
                            {vendor.category}
                          </span>
                        </td>

                        {/* GST Number */}
                        <td className="py-4 px-4 font-mono text-xs text-muted uppercase">
                          {vendor.gstNumber}
                        </td>

                        {/* Contact info */}
                        <td className="py-4 px-4">
                          <p className="text-xs font-semibold">{vendor.email}</p>
                          <p className="text-xxs text-muted">{vendor.phone}</p>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{vendor.rating.toFixed(1)}</span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 text-xxs font-bold rounded-full border ${
                              vendor.status === "Active"
                                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10 dark:text-emerald-400"
                                : vendor.status === "Pending Verification"
                                ? "bg-amber-500/5 text-amber-600 border-amber-500/10 dark:text-amber-400"
                                : vendor.status === "Suspended"
                                ? "bg-orange-500/5 text-orange-600 border-orange-500/10 dark:text-orange-400"
                                : "bg-rose-500/5 text-rose-600 border-rose-500/10 dark:text-rose-400"
                            }`}
                          >
                            {vendor.status}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-4 text-xs text-muted">
                          {vendor.registrationDate}
                        </td>

                        {/* Row Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            
                            <button
                              onClick={() => setSelectedVendorForView(vendor)}
                              className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 dark:hover:text-accent dark:hover:bg-white/5 transition-all"
                              title="View Vendor Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openEditModal(vendor)}
                              className="p-1.5 rounded-lg text-muted hover:text-blue-500 hover:bg-blue-500/5 transition-all"
                              title="Edit Vendor"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => triggerDelete(vendor)}
                              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                              title="Delete Vendor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

            {/* Pagination Controls */}
            {filteredAndSortedVendors.length > 0 && (
              <div className="px-5 py-4 border-t border-muted/10 bg-primary/2 dark:bg-white/2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-muted font-medium">
                  Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedVendors.length)}
                  </span>{" "}
                  of <span className="font-semibold">{filteredAndSortedVendors.length}</span> suppliers
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-muted/20 text-muted disabled:opacity-40 hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                          currentPage === page
                            ? "bg-primary text-white dark:bg-accent dark:text-primary shadow-sm"
                            : "text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-muted/20 text-muted disabled:opacity-40 hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* ========================================================
          8. ADD / EDIT VENDOR MODAL OVERLAY
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsAddModalOpen(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-primary dark:text-white pb-3 border-b border-muted/10">
              {selectedVendorForEdit ? "Edit Vendor Credentials" : "Register New Supplier"}
            </h3>

            <form onSubmit={handleSaveVendor} className="space-y-6 mt-6">
              
              {/* SECTION A: COMPANY INFORMATION */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Company Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Vendor Name (Contact)"
                    name="name"
                    placeholder="Enter vendor primary representative"
                    value={formValues.name}
                    onChange={handleFormChange}
                    error={formErrors.name}
                  />

                  <Input
                    label="Company Legal Name"
                    name="companyName"
                    placeholder="Enter registered business entity name"
                    value={formValues.companyName}
                    onChange={handleFormChange}
                    error={formErrors.companyName}
                  />

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Vendor Service Category</label>
                    <select
                      name="category"
                      value={formValues.category}
                      onChange={handleFormChange}
                      className="w-full h-11 px-3 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-sm"
                    >
                      {CATEGORIES.filter(c => c !== "All").map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION B: COMPLIANCE DETAILS */}
              <div className="border-t border-muted/10 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Compliance & Taxation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GSTIN Number (GST)"
                    name="gstNumber"
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    value={formValues.gstNumber}
                    onChange={handleFormChange}
                    error={formErrors.gstNumber}
                  />

                  <Input
                    label="PAN Card Number"
                    name="panNumber"
                    placeholder="e.g. AAAAA1111A"
                    value={formValues.panNumber}
                    onChange={handleFormChange}
                    error={formErrors.panNumber}
                  />
                </div>
              </div>

              {/* SECTION C: CONTACT INFORMATION */}
              <div className="border-t border-muted/10 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Designated Contact Person"
                    name="contactPerson"
                    placeholder="Full name of representative"
                    value={formValues.contactPerson}
                    onChange={handleFormChange}
                    error={formErrors.contactPerson}
                  />

                  <Input
                    label="Business Email"
                    name="email"
                    type="email"
                    placeholder="corporate@business.com"
                    value={formValues.email}
                    onChange={handleFormChange}
                    error={formErrors.email}
                  />

                  <Input
                    label="Corporate Phone"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formValues.phone}
                    onChange={handleFormChange}
                    error={formErrors.phone}
                  />

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Billing / Operations Address</label>
                    <textarea
                      name="address"
                      rows={3}
                      placeholder="Enter registered address with city, state & pin"
                      value={formValues.address}
                      onChange={handleFormChange}
                      className={`w-full p-3 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-sm ${
                        formErrors.address ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    ></textarea>
                    {formErrors.address && <p className="text-sm font-medium text-red-500">{formErrors.address}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION D: STATUS SELECTION */}
              <div className="border-t border-muted/10 pt-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Operational Status</label>
                  <select
                    name="status"
                    value={formValues.status}
                    onChange={handleFormChange}
                    className="w-full h-11 px-3 bg-transparent rounded-xl border border-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground text-sm"
                  >
                    <option value="Active">Active (Verified & Operational)</option>
                    <option value="Pending Verification">Pending Verification (Under Review)</option>
                    <option value="Suspended">Suspended (Temporary Restriciton)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-muted/10 pt-5 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedVendorForEdit ? "Save Changes" : "Register Vendor"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          9. VENDOR DETAILS DRAWER OVERLAY
          ======================================================== */}
      {selectedVendorForView && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Drawer Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300"
            onClick={() => setSelectedVendorForView(null)}
          ></div>

          {/* Sliding Panel */}
          <aside className="relative w-full max-w-lg bg-card h-full shadow-2xl border-l border-muted/10 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-6 border-b border-muted/10 flex items-center justify-between">
              <div>
                <span className="text-xxs font-bold uppercase tracking-wider text-primary dark:text-accent select-all">
                  {selectedVendorForView.id}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">{selectedVendorForView.companyName}</h3>
              </div>
              <button
                onClick={() => setSelectedVendorForView(null)}
                className="p-1.5 rounded-lg text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body info */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              
              {/* Status Header Block */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/2 dark:bg-white/2 border border-muted/5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedVendorForView.status === "Active"
                        ? "bg-emerald-500"
                        : selectedVendorForView.status === "Pending Verification"
                        ? "bg-amber-500"
                        : selectedVendorForView.status === "Suspended"
                        ? "bg-orange-500"
                        : "bg-rose-500"
                    }`}
                  ></span>
                  <span className="text-sm font-semibold">{selectedVendorForView.status}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{selectedVendorForView.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {/* Company Information section */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted pb-1 border-b border-muted/5">
                  Company Profile
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted block">Legal Entity Name</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedVendorForView.companyName}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Primary Category</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedVendorForView.category}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Primary contact representative</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedVendorForView.name}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Operating Hub</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedVendorForView.city}</span>
                  </div>
                </div>
              </div>

              {/* Compliance & Registration */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted pb-1 border-b border-muted/5">
                  Compliance Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted block">GSTIN Number</span>
                    <span className="font-mono font-semibold text-foreground mt-0.5 block uppercase select-all">
                      {selectedVendorForView.gstNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">PAN Card Number</span>
                    <span className="font-mono font-semibold text-foreground mt-0.5 block uppercase select-all">
                      {selectedVendorForView.panNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Registration Date</span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      {selectedVendorForView.registrationDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Last Record Update</span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      {selectedVendorForView.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted pb-1 border-b border-muted/5">
                  Contact Coordinates
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-muted" />
                    <span className="font-semibold text-foreground select-all">{selectedVendorForView.email}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Phone className="w-4 h-4 text-muted" />
                    <span className="font-semibold text-foreground select-all">{selectedVendorForView.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                    <span className="font-semibold text-foreground leading-normal">{selectedVendorForView.address}</span>
                  </div>
                </div>
              </div>

              {/* Vendor metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted pb-1 border-b border-muted/5">
                  Procurement Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-primary/2 dark:bg-white/2 rounded-xl border border-muted/5">
                    <span className="text-[10px] font-bold text-muted block uppercase">Total Orders</span>
                    <span className="text-xl font-bold text-foreground block mt-0.5">
                      {selectedVendorForView.ordersCount}
                    </span>
                  </div>
                  <div className="p-3 bg-primary/2 dark:bg-white/2 rounded-xl border border-muted/5">
                    <span className="text-[10px] font-bold text-muted block uppercase">Completed Orders</span>
                    <span className="text-xl font-bold text-foreground block mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedVendorForView.completedOrdersCount}
                    </span>
                  </div>
                  <div className="p-3 bg-primary/2 dark:bg-white/2 rounded-xl border border-muted/5 col-span-2">
                    <span className="text-[10px] font-bold text-muted block uppercase">Last Transaction Date</span>
                    <span className="text-sm font-semibold text-foreground block mt-0.5">
                      {selectedVendorForView.lastTransactionDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent activities timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted pb-1 border-b border-muted/5">
                  Recent Activity Log
                </h4>
                
                <div className="relative pl-6 border-l border-muted/15 space-y-5">
                  {selectedVendorForView.activities.map((act) => (
                    <div key={act.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-card border border-muted/20 flex items-center justify-center">
                        {act.type === "po" ? (
                          <DollarSign className="w-2.5 h-2.5 text-blue-500" />
                        ) : act.type === "quotation" ? (
                          <ShoppingBag className="w-2.5 h-2.5 text-purple-500" />
                        ) : act.type === "updated" ? (
                          <RefreshCw className="w-2.5 h-2.5 text-amber-500 animate-spin-hover" />
                        ) : (
                          <Plus className="w-2.5 h-2.5 text-emerald-500" />
                        )}
                      </span>
                      
                      <div className="text-xs">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-foreground">{act.title}</p>
                          <span className="text-xxs text-muted font-mono">{act.timestamp}</span>
                        </div>
                        <p className="text-muted mt-0.5 leading-normal">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-muted/10 bg-primary/2 dark:bg-white/2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  openEditModal(selectedVendorForView);
                  setSelectedVendorForView(null);
                }}
                className="flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Credentials
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedVendorForView(null)}
              >
                Close Profile
              </Button>
            </div>

          </aside>
        </div>
      )}

      {/* ========================================================
          10. DELETE CONFIRMATION OVERLAY
          ======================================================== */}
      {isDeleteConfirmOpen && vendorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsDeleteConfirmOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-start space-x-3.5 text-red-500">
              <AlertOctagon className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-foreground">Remove Supplier Account?</h3>
                <p className="text-xs text-muted mt-1 leading-normal">
                  Are you sure you want to delete <span className="font-bold text-foreground">"{vendorToDelete.companyName}"</span> ({vendorToDelete.id})? This will permanently erase compliance profiles and transaction indexes.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-muted/5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Keep Account
              </Button>
              <button
                onClick={confirmDelete}
                className="px-4 h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          11. IMPORT CSV MODAL OVERLAY
          ======================================================== */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-300" onClick={() => setIsImportOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsImportOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-primary dark:text-white mb-1">Import Supplier Directory</h3>
            <p className="text-xs text-muted mb-4">Bulk load vendors using standard corporate CSV files.</p>
            
            <div
              onDragEnter={handleImportDrag}
              onDragOver={handleImportDrag}
              onDragLeave={handleImportDrag}
              onDrop={handleImportDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                importDragActive ? "border-primary bg-primary/5 dark:border-accent dark:bg-white/5" : "border-muted/20"
              }`}
            >
              <Upload className="w-8 h-8 text-muted mb-2.5" />
              <p className="text-xs text-center font-bold text-foreground">Drag and drop file here, or click to search</p>
              <p className="text-xxs text-muted text-center mt-1">Supported: .csv, .xls, .xlsx (max 10MB)</p>
              
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleImportFileChange}
                className="hidden"
                id="file-import-input"
              />
              <label
                htmlFor="file-import-input"
                className="mt-4 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary dark:bg-white/5 dark:text-foreground text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>

            {importMessage && (
              <div className="mt-4 p-3 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10 text-xs font-semibold">
                {importMessage}
              </div>
            )}

            <div className="flex items-center justify-end mt-6 pt-4 border-t border-muted/5 space-x-3">
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          12. AUDIT REPORT DOWNLOAD MODAL
          ======================================================== */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-300" onClick={() => setIsReportOpen(false)}></div>
          <div className="relative w-full max-w-md bg-card rounded-2xl border border-muted/15 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Compile Supplier Performance Report</h3>
            <p className="text-xs text-muted mb-4">Export vendor parameters, transaction count averages, and operational ratings to an offline audit report.</p>

            <div className="space-y-3 bg-primary/2 dark:bg-white/2 p-4 rounded-xl border border-muted/5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Total Vendors Evaluated</span>
                <span className="font-bold">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Average Vendor Rating</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {stats.avgRating} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Active Service Segments</span>
                <span className="font-bold">6 Segments</span>
              </div>
            </div>

      {/* Click-outside to close header dropdowns */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setIsProfileOpen(false); setIsNotificationsOpen(false); }} />
      )}

    </div>
  );
}
