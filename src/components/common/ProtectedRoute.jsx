import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { isPlatformDomain } from '../../utils/domain';

const ProtectedRoute = ({ children, allowedRoles, redirectTo }) => {
  const { user } = useAuthStore();

  // Not authenticated → always go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role;

  // Enforce domain-level separation:
  // - Platform super admin can only access on platform domain
  // - Client roles (client_admin, staff, customer) can only access on client domains
  const platformRoles = ['super_admin', 'platform_super_admin'];
  const clientRoles = ['client_admin', 'staff', 'customer'];

  const onPlatform = isPlatformDomain();

  if (platformRoles.includes(role) && !onPlatform) {
    return <Navigate to="/login" replace />;
  }

  if (clientRoles.includes(role) && onPlatform) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;

