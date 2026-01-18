import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getNavItems = () => {
    if (!user) return [];

    const role = user.role;

    if (role === USER_ROLES.SUPER_ADMIN) {
      return [
        { path: '/super-admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/super-admin/tenants', label: 'Tenants', icon: '🏢' },
      ];
    }

    if (role === USER_ROLES.CLIENT_ADMIN) {
      return [
        { path: '/client-admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/client-admin/shops', label: 'Shops', icon: '🏪' },
        { path: '/client-admin/invoices', label: 'Invoices', icon: '📄' },
      ];
    }

    if (role === USER_ROLES.STAFF) {
      return [
        { path: '/staff/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/staff/bookings', label: 'Bookings', icon: '📅' },
        { path: '/staff/walkin', label: 'Walk-in Booking', icon: '➕' },
        { path: '/staff/invoices', label: 'Invoices', icon: '📄' },
      ];
    }

    if (role === USER_ROLES.CUSTOMER) {
      return [
        { path: '/customer/services', label: 'Services', icon: '💇' },
        { path: '/customer/bookings', label: 'My Bookings', icon: '📅' },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

