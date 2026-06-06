export type VendorStatus = "Active" | "Pending" | "Blocked";
export type VendorCategory =
  | "Construction"
  | "IT"
  | "Logistics"
  | "Manufacturing"
  | "Healthcare"
  | "Finance";

export interface VendorDocument {
  name: string;
  type: string;
  uploadedOn: string;
  size: string;
}

export interface PerformanceMetrics {
  deliveryRating: number;
  qualityScore: number;
  responseRate: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  gstNumber: string;
  contactNumber: string;
  status: VendorStatus;
  contactPerson: string;
  email: string;
  address: string;
  documents: VendorDocument[];
  performance: PerformanceMetrics;
  joinedDate: string;
}

export const VENDOR_DATA: Vendor[] = [
  {
    id: "VND-001",
    name: "Infra Supplies Pvt Ltd",
    category: "Construction",
    gstNumber: "27AABCI1234A1Z5",
    contactNumber: "+91 98765 43210",
    status: "Active",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@infrasupplies.in",
    address: "Plot 12, MIDC Industrial Area, Pune, Maharashtra 411019",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "12 Jan 2024", size: "245 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "12 Jan 2024", size: "102 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "15 Jan 2024", size: "890 KB" },
    ],
    performance: { deliveryRating: 4.7, qualityScore: 4.5, responseRate: 92 },
    joinedDate: "Jan 2024",
  },
  {
    id: "VND-002",
    name: "Tech Core Ltd",
    category: "IT",
    gstNumber: "07AABCT5678B1Z3",
    contactNumber: "+91 87654 32109",
    status: "Active",
    contactPerson: "Priya Sharma",
    email: "priya.sharma@techcore.io",
    address: "Tower B, Cyber City, Gurugram, Haryana 122002",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "5 Feb 2024", size: "312 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "5 Feb 2024", size: "98 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "8 Feb 2024", size: "1.2 MB" },
    ],
    performance: { deliveryRating: 4.9, qualityScore: 4.8, responseRate: 97 },
    joinedDate: "Feb 2024",
  },
  {
    id: "VND-003",
    name: "FastLog Transport",
    category: "Logistics",
    gstNumber: "19AABCF9012C1Z1",
    contactNumber: "+91 76543 21098",
    status: "Pending",
    contactPerson: "Ankit Verma",
    email: "ankit@fastlog.co.in",
    address: "NH-8, Logistics Park, Bhiwandi, Thane, Maharashtra 421302",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "20 Mar 2024", size: "189 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "20 Mar 2024", size: "87 KB" },
    ],
    performance: { deliveryRating: 3.8, qualityScore: 3.9, responseRate: 74 },
    joinedDate: "Mar 2024",
  },
  {
    id: "VND-004",
    name: "BuildMate Industries",
    category: "Construction",
    gstNumber: "24AABCB3456D1Z7",
    contactNumber: "+91 95432 10987",
    status: "Active",
    contactPerson: "Suresh Patel",
    email: "suresh@buildmate.com",
    address: "Plot 45, GIDC Estate, Vadodara, Gujarat 390010",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "3 Apr 2024", size: "267 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "3 Apr 2024", size: "115 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "6 Apr 2024", size: "745 KB" },
    ],
    performance: { deliveryRating: 4.3, qualityScore: 4.1, responseRate: 88 },
    joinedDate: "Apr 2024",
  },
  {
    id: "VND-005",
    name: "NexaIT Solutions",
    category: "IT",
    gstNumber: "29AABCN7890E1Z9",
    contactNumber: "+91 84321 09876",
    status: "Active",
    contactPerson: "Kavitha Rajan",
    email: "kavitha@nexait.in",
    address: "Embassy Tech Village, Outer Ring Road, Bengaluru, Karnataka 560103",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "10 May 2024", size: "298 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "10 May 2024", size: "104 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "14 May 2024", size: "1.1 MB" },
    ],
    performance: { deliveryRating: 4.6, qualityScore: 4.7, responseRate: 95 },
    joinedDate: "May 2024",
  },
  {
    id: "VND-006",
    name: "SwiftShip Logistics",
    category: "Logistics",
    gstNumber: "33AABCS2345F1Z5",
    contactNumber: "+91 73210 98765",
    status: "Blocked",
    contactPerson: "Mohammed Farooq",
    email: "farooq@swiftship.in",
    address: "Ambattur Industrial Estate, Chennai, Tamil Nadu 600058",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "22 Jun 2024", size: "201 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "22 Jun 2024", size: "93 KB" },
    ],
    performance: { deliveryRating: 2.1, qualityScore: 2.4, responseRate: 51 },
    joinedDate: "Jun 2024",
  },
  {
    id: "VND-007",
    name: "MediCraft Healthcare",
    category: "Healthcare",
    gstNumber: "06AABCM6789G1Z3",
    contactNumber: "+91 62109 87654",
    status: "Active",
    contactPerson: "Dr. Neha Gupta",
    email: "neha.gupta@medicraft.in",
    address: "Sector 18, Noida, Uttar Pradesh 201301",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "7 Jul 2024", size: "334 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "7 Jul 2024", size: "121 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "11 Jul 2024", size: "970 KB" },
    ],
    performance: { deliveryRating: 4.8, qualityScore: 4.9, responseRate: 99 },
    joinedDate: "Jul 2024",
  },
  {
    id: "VND-008",
    name: "SteelEdge Manufacturing",
    category: "Manufacturing",
    gstNumber: "21AABCS1234H1Z7",
    contactNumber: "+91 91098 76543",
    status: "Active",
    contactPerson: "Vikram Singh",
    email: "vikram@steeledge.co.in",
    address: "Phase 2, Industrial Growth Centre, Rourkela, Odisha 769003",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "15 Aug 2024", size: "276 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "15 Aug 2024", size: "109 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "18 Aug 2024", size: "830 KB" },
    ],
    performance: { deliveryRating: 4.4, qualityScore: 4.2, responseRate: 86 },
    joinedDate: "Aug 2024",
  },
  {
    id: "VND-009",
    name: "CapitalFlow Finance",
    category: "Finance",
    gstNumber: "27AABCC4567I1Z1",
    contactNumber: "+91 80987 65432",
    status: "Pending",
    contactPerson: "Sneha Joshi",
    email: "sneha@capitalflow.in",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "29 Aug 2024", size: "258 KB" },
    ],
    performance: { deliveryRating: 3.5, qualityScore: 3.7, responseRate: 68 },
    joinedDate: "Sep 2024",
  },
  {
    id: "VND-010",
    name: "GreenBuild Corp",
    category: "Construction",
    gstNumber: "36AABCG7890J1Z9",
    contactNumber: "+91 79876 54321",
    status: "Active",
    contactPerson: "Arun Reddy",
    email: "arun@greenbuild.com",
    address: "Hi-Tech City, Madhapur, Hyderabad, Telangana 500081",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "5 Oct 2024", size: "291 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "5 Oct 2024", size: "117 KB" },
      { name: "Vendor Agreement", type: "PDF", uploadedOn: "9 Oct 2024", size: "1.0 MB" },
    ],
    performance: { deliveryRating: 4.5, qualityScore: 4.3, responseRate: 90 },
    joinedDate: "Oct 2024",
  },
  {
    id: "VND-011",
    name: "DataSync IT Services",
    category: "IT",
    gstNumber: "09AABCD3456K1Z5",
    contactNumber: "+91 68765 43210",
    status: "Blocked",
    contactPerson: "Rohit Malhotra",
    email: "rohit@datasync.io",
    address: "Sector 62, Electronic City, Noida, Uttar Pradesh 201309",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "12 Nov 2024", size: "223 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "12 Nov 2024", size: "88 KB" },
    ],
    performance: { deliveryRating: 2.6, qualityScore: 2.9, responseRate: 55 },
    joinedDate: "Nov 2024",
  },
  {
    id: "VND-012",
    name: "AgroTech Supplies",
    category: "Manufacturing",
    gstNumber: "18AABCA6789L1Z3",
    contactNumber: "+91 57654 32109",
    status: "Pending",
    contactPerson: "Lalitha Devi",
    email: "lalitha@agrotech.in",
    address: "Peenya Industrial Area, Bengaluru, Karnataka 560058",
    documents: [
      { name: "GST Certificate", type: "PDF", uploadedOn: "20 Dec 2024", size: "178 KB" },
      { name: "PAN Card", type: "PDF", uploadedOn: "20 Dec 2024", size: "94 KB" },
    ],
    performance: { deliveryRating: 3.6, qualityScore: 3.4, responseRate: 71 },
    joinedDate: "Dec 2024",
  },
];
