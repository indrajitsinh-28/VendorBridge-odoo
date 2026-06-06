import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Dashboard pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { VendorsPage } from './pages/dashboard/VendorsPage';
import { PlaceholderPage } from './pages/dashboard/PlaceholderPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/rfqs" element={<PlaceholderPage title="RFQs" description="Manage your Request for Quotations from vendors." />} />
            <Route path="/quotations" element={<PlaceholderPage title="Quotations" description="Review and compare vendor quotations." />} />
            <Route path="/approvals" element={<PlaceholderPage title="Approvals" description="Manage pending approvals and sign-offs." />} />
            <Route path="/purchase-orders" element={<PlaceholderPage title="Purchase Orders" description="Track and manage all purchase orders." />} />
            <Route path="/invoices" element={<PlaceholderPage title="Invoices" description="View and process vendor invoices." />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" description="Analytics and procurement reports." />} />
            <Route path="/activity-logs" element={<PlaceholderPage title="Activity Logs" description="Audit trail of all procurement activities." />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
