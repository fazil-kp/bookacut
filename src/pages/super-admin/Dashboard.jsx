import { useQuery } from '@tanstack/react-query';
import { superAdminService } from '../../services/superAdminService';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { format } from 'date-fns';

const SuperAdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-dashboard'],
    queryFn: superAdminService.getDashboard,
  });

  if (isLoading) return <Loading fullScreen />;

  const stats = data?.stats || {};
  const recentRevenue = data?.recentRevenue || [];
  const tenants = data?.tenants || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{stats.totalTenants || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total Tenants</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.activeTenants || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Active Tenants</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats.expiredTenants || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Expired Tenants</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalShops || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total Shops</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.expiringSoon || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Expiring Soon</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              ${stats.recentRevenue?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Recent Revenue</p>
          </div>
        </Card>
      </div>

      {/* Tenant List */}
      <Card title="Recent Tenants">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.slice(0, 10).map((tenant) => (
                <tr key={tenant._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tenant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.shopCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tenant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : tenant.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.expiryDate ? format(new Date(tenant.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;

