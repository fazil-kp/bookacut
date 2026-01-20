import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';
import { useTenantInitialization } from './hooks/useTenantInitialization';
import { isPlatformDomain } from './utils/domain';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Super Admin pages (platform domain)
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import TenantList from './pages/super-admin/TenantList';
import TenantDetails from './pages/super-admin/TenantDetails';
import RecordPayment from './pages/super-admin/RecordPayment';

// Client Admin pages (client domain, /admin area)
import ClientAdminDashboard from './pages/client-admin/Dashboard';
import ShopList from './pages/client-admin/ShopList';
import ShopDetails from './pages/client-admin/ShopDetails';
import StaffManagement from './pages/client-admin/StaffManagement';
import ServiceManagement from './pages/client-admin/ServiceManagement';
import SlotManagement from './pages/client-admin/SlotManagement';
import ShopSettings from './pages/client-admin/ShopSettings';
import InvoiceList from './pages/client-admin/InvoiceList';

// Staff pages (client domain)
import StaffDashboard from './pages/staff/Dashboard';
import StaffBookings from './pages/staff/Bookings';
import WalkInBooking from './pages/staff/WalkInBooking';
import StaffInvoices from './pages/staff/Invoices';

// Customer pages (client domain, public & authenticated)
import ServiceListing from './pages/customer/ServiceListing';
import BookSlot from './pages/customer/BookSlot';
import BookingHistory from './pages/customer/BookingHistory';

function AppRoutes() {
  const { user } = useAuthStore();
  const platform = isPlatformDomain();
  const { isLoading: tenantLoading, isError: tenantError } = useTenantInitialization();

  // On client domains, wait for tenant resolution before rendering app
  if (!platform && tenantLoading) {
    return <Loading fullScreen />;
  }

  if (!platform && tenantError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Salon not found</h1>
          <p className="text-gray-600">
            We couldn't find a salon configured for this domain. Please check the URL or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Shared auth routes (behavior differs by domain & role inside pages) */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : platform ? (
            // Platform super admin → platform dashboard
            <Navigate to="/super-admin/dashboard" />
          ) : user.role === 'client_admin' ? (
            <Navigate to="/admin/dashboard" />
          ) : user.role === 'staff' ? (
            <Navigate to="/staff/dashboard" />
          ) : user.role === 'customer' ? (
            <Navigate to="/customer/services" />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      {/* PLATFORM DOMAIN: super admin SPA */}
      {platform && (
        <>
          <Route
            path="/super-admin/*"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'platform_super_admin']}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<SuperAdminDashboard />} />
                    <Route path="tenants" element={<TenantList />} />
                    <Route path="tenants/:id" element={<TenantDetails />} />
                    <Route path="tenants/:id/payment" element={<RecordPayment />} />
                    <Route path="*" element={<Navigate to="/super-admin/dashboard" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Root on platform domain → super admin dashboard or login */}
          <Route
            path="/"
            element={
              user && (user.role === 'super_admin' || user.role === 'platform_super_admin') ? (
                <Navigate to="/super-admin/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

      {/* CLIENT DOMAIN: client admin + staff + customer-facing app */}
      {!platform && (
        <>
          {/* Public customer-facing routes */}
          <Route path="/" element={<ServiceListing />} />

          {/* Customer authenticated area */}
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={['customer']} redirectTo="/login">
                <Layout>
                  <Routes>
                    <Route path="services" element={<ServiceListing />} />
                    <Route path="book/:shopId" element={<BookSlot />} />
                    <Route path="bookings" element={<BookingHistory />} />
                    <Route path="*" element={<Navigate to="/customer/services" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Client admin panel, mounted under /admin as required (alias /client-admin for backwards compat) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['client_admin']} redirectTo="/login">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<ClientAdminDashboard />} />
                    <Route path="shops" element={<ShopList />} />
                    <Route path="shops/:id" element={<ShopDetails />} />
                    <Route path="shops/:id/staff" element={<StaffManagement />} />
                    <Route path="shops/:id/services" element={<ServiceManagement />} />
                    <Route path="shops/:id/slots" element={<SlotManagement />} />
                    <Route path="shops/:id/settings" element={<ShopSettings />} />
                    <Route path="invoices" element={<InvoiceList />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Legacy client admin routes still work */}
          <Route
            path="/client-admin/*"
            element={<Navigate to="/admin/dashboard" />}
          />

          {/* Staff routes on client domain */}
          <Route
            path="/staff/*"
            element={
              <ProtectedRoute allowedRoles={['staff']} redirectTo="/login">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<StaffDashboard />} />
                    <Route path="bookings" element={<StaffBookings />} />
                    <Route path="walkin" element={<WalkInBooking />} />
                    <Route path="invoices" element={<StaffInvoices />} />
                    <Route path="*" element={<Navigate to="/staff/dashboard" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallbacks on client domain */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}


