import  { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PageLoader, SpinnerLoader } from './Components/ui/PageLoader';

// ── Auth pages (lazy) ──────────────────────────────────────────────────────
const LoginPage        = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage       = lazy(() => import('./pages/auth/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

// ── Layout (lazy) ──────────────────────────────────────────────────────────
const DashboardLayout  = lazy(() => import('./layouts/DashboardLayout').then(m => ({ default: m.DashboardLayout })));

// ── Dashboard pages (lazy) ────────────────────────────────────────────────
const DashboardPage    = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));

// ── Standalone ERP pages (lazy) ───────────────────────────────────────────
const Vendor           = lazy(() => import('./pages/Vendor').then(m => ({ default: m.Vendor })));
const VendorQuotation  = lazy(() => import('./pages/VendorQuotation').then(m => ({ default: m.VendorQuotation })));
const RFQ              = lazy(() => import('./pages/RFQ').then(m => ({ default: m.RFQ })));
const Approvals        = lazy(() => import('./pages/Approvals').then(m => ({ default: m.Approvals })));
const PurchaseOrders   = lazy(() => import('./pages/PurchaseOrders').then(m => ({ default: m.PurchaseOrders })));
const Invoices         = lazy(() => import('./pages/Invoices').then(m => ({ default: m.Invoices })));
const ActivityLogs     = lazy(() => import('./pages/ActivityLogs').then(m => ({ default: m.ActivityLogs })));
const Reports          = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const SettingsPage     = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Auth routes — light spinner (no sidebar chrome needed) ── */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<SpinnerLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<SpinnerLoader />}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<SpinnerLoader />}>
                <ForgotPasswordPage />
              </Suspense>
            }
          />

          {/* ── Dashboard shell + nested page — full skeleton loader ── */}
          <Route
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardLayout />
              </Suspense>
            }
          >
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              }
            />
          </Route>

          {/* ── Standalone ERP pages — full skeleton loader ── */}
          <Route
            path="/vendors"
            element={
              <Suspense fallback={<PageLoader />}>
                <Vendor />
              </Suspense>
            }
          />
          <Route
            path="/quotations"
            element={
              <Suspense fallback={<PageLoader />}>
                <VendorQuotation />
              </Suspense>
            }
          />
          <Route
            path="/rfqs"
            element={
              <Suspense fallback={<PageLoader />}>
                <RFQ />
              </Suspense>
            }
          />
          <Route
            path="/approvals"
            element={
              <Suspense fallback={<PageLoader />}>
                <Approvals />
              </Suspense>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <Suspense fallback={<PageLoader />}>
                <PurchaseOrders />
              </Suspense>
            }
          />
          <Route
            path="/invoices"
            element={
              <Suspense fallback={<PageLoader />}>
                <Invoices />
              </Suspense>
            }
          />
          <Route
            path="/activity-logs"
            element={
              <Suspense fallback={<PageLoader />}>
                <ActivityLogs />
              </Suspense>
            }
          />
          <Route
            path="/reports"
            element={
              <Suspense fallback={<PageLoader />}>
                <Reports />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="*"
            element={
              <Suspense fallback={<SpinnerLoader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
