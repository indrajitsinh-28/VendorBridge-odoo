# VendorBridge

<div align="center">

### Modern Procurement & Vendor Management ERP

Manage Vendors, RFQs, Quotations, Approvals, Purchase Orders, Invoices, Analytics and Audit Logs from a single platform.


</div>

---

## 📖 Overview

VendorBridge is a modern Procurement & Vendor Management ERP designed to streamline the complete purchasing lifecycle.

Organizations can create RFQs, receive quotations from vendors, compare proposals, approve procurement requests, generate purchase orders, manage invoices, and monitor spending through powerful analytics dashboards.

---



## ✨ Features

| Feature | Description |
|----------|-------------|
| 📋 RFQ Management | Create and manage procurement requests |
| 💬 Quotations | Collect and evaluate vendor quotations |
| ⚖️ Quote Comparison | Compare quotations side-by-side |
| ✅ Approval Workflow | Multi-level approval system |
| 📦 Purchase Orders | Generate and manage purchase orders |
| 🧾 Invoice Management | Invoice tracking and payment monitoring |
| 📊 Reports & Analytics | Procurement insights and trends |
| 🔔 Notifications | Real-time alerts and updates |
| 📝 Audit Logs | Complete activity tracking |
| ⚙️ Settings Management | ERP-wide configuration controls |

---

## 🔐 Authentication Module

VendorBridge includes modern authentication screens with enterprise-grade user experience.

### Features

- User Registration
- Secure Login
- Password Visibility Toggle
- Remember Me
- Responsive Layout
- Dark Mode Support

---

## 📊 Dashboard

The Dashboard provides a centralized overview of procurement operations.

### Dashboard Metrics

- Total Vendors
- Purchase Orders
- Pending Invoices
- Monthly Spend
- Vendor Distribution
- Recent Activity Feed

---

## 📋 RFQ Management

Create and distribute Requests for Quotations to vendors.

### Workflow

1. Create RFQ
2. Define Category
3. Add Requirements
4. Set Deadline
5. Invite Vendors
6. Collect Quotations

---

## ✅ Approval Workflow

VendorBridge supports multi-level approval processes.

### Features

- Approval Chain Visualization
- Reviewer Comments
- Approval History
- Approve / Reject Actions
- Compliance Audit Trail

---

## 📦 Purchase Orders

Convert approved quotations into Purchase Orders.

### Features

- Vendor Assignment
- Delivery Tracking
- PDF Export
- Print Support
- Status Management

---

## 🧾 Invoice Management

Track invoices from creation to payment completion.

### Features

- Invoice Listing
- Payment Tracking
- PDF Download
- Email Delivery
- Invoice Printing

---

## 📈 Reports & Analytics

Gain insights into procurement performance.

### Analytics

- Monthly Spend Trends
- Vendor Performance
- Category-wise Spending
- PO Fulfillment Rate
- Invoice Monitoring
- Export Reports

---

## 📝 Activity Logs

Every procurement activity is recorded for transparency.

### Tracked Activities

- RFQ Published
- Vendor Registration
- Approvals
- Purchase Orders
- Invoice Payments
- Compliance Updates

---

## ⚙️ Configuration Panel

Configure ERP-wide settings and workflow rules.

### Settings

- Base Currency
- GST Configuration
- Approval Limits
- Notification Preferences
- Workflow Rules

---

## 🔄 Procurement Workflow

```text
User Login
    │
    ▼
Create RFQ
    │
    ▼
Invite Vendors
    │
    ▼
Receive Quotations
    │
    ▼
Compare Quotations
    │
    ▼
Approval Workflow
    │
    ▼
Generate Purchase Order
    │
    ▼
Create Invoice
    │
    ▼
Payment Processing
    │
    ▼
Reports & Audit Logs
```

---

## 🛠️ Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- React Hook Form

### Backend

- FastAPI
- PostgreSQL
- SQLAlchemy Async
- AsyncPG
- Alembic
- JWT Authentication
- ReportLab
- OpenPyXL

---

## 📂 Project Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── layouts/
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── vendorbridge-backend/
│   ├── app/
│   │   ├── crud/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── utils/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── alembic.ini
│
└── docs/
    └── images/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Python 3.10+
- PostgreSQL

### Backend Setup

```bash
cd vendorbridge-backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

### Environment Variables

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/vendorbridge
SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Run Migrations

```bash
alembic upgrade head
```

### Start Backend

```bash
uvicorn app.main:app --reload
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 📚 API Reference

| Module | Endpoints |
|----------|-----------|
| Auth | /auth/signup, /auth/login |
| RFQs | /rfqs |
| Quotations | /quotations |
| Purchase Orders | /purchase-orders |
| Invoices | /invoices |
| Approvals | /approvals |
| Activity Logs | /activity/logs |
| Dashboard | /dashboard |
| Analytics | /analytics |

---

## 💻 Development Commands

### Backend

```bash
uvicorn app.main:app --reload

alembic upgrade head

alembic revision --autogenerate -m "migration"
```

### Frontend

```bash
npm run dev

npm run build

npm run lint
```

---

## 📌 Current Status

| Module | Status |
|----------|----------|
| Authentication | ✅ Complete |
| Dashboard | ✅ Complete |
| Vendors | ✅ Complete |
| RFQs | ✅ Complete |
| Quotations | ✅ Complete |
| Approvals | ✅ Complete |
| Purchase Orders | ✅ Complete |
| Invoices | ✅ Complete |
| Reports & Analytics | ✅ Complete |
| Activity Logs | ✅ Complete |
| Settings | ✅ Complete |
| Backend APIs | ✅ Complete |
| Database Models | ✅ Complete |
| PDF Generation | ✅ Complete |
| Excel Export | ✅ Complete |

---

## 🚀 Upcoming Features

- Role-Based Access Control (RBAC)
- Real-Time Notifications
- Vendor Portal
- Email Automation
- Mobile Optimization
- CI/CD Pipeline
- Production Deployment

---

<div align="center">

### Built with ❤️ using FastAPI, PostgreSQL, React & TypeScript

**VendorBridge — Simplifying Procurement Management**

</div>
