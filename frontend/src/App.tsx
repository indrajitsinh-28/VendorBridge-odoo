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

// Custom Standalone Pages
import { Vendor } from './pages/Vendor';
import { VendorQuotation } from './pages/VendorQuotation';
import { RFQ } from './pages/RFQ';
import { Approvals } from './pages/Approvals';
import { POInvoice } from './pages/POInvoice';
import { ActivityLogs } from './pages/ActivityLogs';
import { Reports } from './pages/Reports';
import { SettingsPage } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Nested Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Standalone ERP Pages */}
          <Route path="/vendors" element={<Vendor />} />
          <Route path="/quotations" element={<VendorQuotation />} />
          <Route path="/rfqs" element={<RFQ />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/purchase-orders" element={<POInvoice />} />
          <Route path="/invoices" element={<POInvoice />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
