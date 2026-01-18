import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Super Admin pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import TenantList from './pages/super-admin/TenantList';
import TenantDetails from './pages/super-admin/TenantDetails';
import RecordPayment from './pages/super-admin/RecordPayment';

// Client Admin pages
import ClientAdminDashboard from './pages/client-admin/Dashboard';
import ShopList from './pages/client-admin/ShopList';
import ShopDetails from './pages/client-admin/ShopDetails';
import StaffManagement from './pages/client-admin/StaffManagement';
import ServiceManagement from './pages/client-admin/ServiceManagement';
import SlotManagement from './pages/client-admin/SlotManagement';
import ShopSettings from './pages/client-admin/ShopSettings';
import InvoiceList from './pages/client-admin/InvoiceList';

// Staff pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffBookings from './pages/staff/Bookings';
import WalkInBooking from './pages/staff/WalkInBooking';
import StaffInvoices from './pages/staff/Invoices';

// Customer pages
import ServiceListing from './pages/customer/ServiceListing';
import BookSlot from './pages/customer/BookSlot';
import BookingHistory from './pages/customer/BookingHistory';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}/dashboard`} />} />
        
        {/* Super Admin routes */}
        <Route
          path="/super-admin/*"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
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

        {/* Client Admin routes */}
        <Route
          path="/client-admin/*"
          element={
            <ProtectedRoute allowedRoles={['client_admin']}>
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
                  <Route path="*" element={<Navigate to="/client-admin/dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
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

        {/* Customer routes */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
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

        {/* Root redirect */}
        <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} />} />
        <Route path="*" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;

