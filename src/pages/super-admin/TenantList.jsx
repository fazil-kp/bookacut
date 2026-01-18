import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/superAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { format } from 'date-fns';
import Badge from '../../components/common/Badge';

const TenantList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: superAdminService.getTenants,
  });

  if (isLoading) return <Loading fullScreen />;

  const tenants = data?.tenants || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <Button variant="primary" onClick={() => navigate('/super-admin/tenants/new')}>
          Add Tenant
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tenant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.shopCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tenant.status === 'active' && <Badge variant="success">Active</Badge>}
                    {tenant.status === 'expired' && <Badge variant="danger">Expired</Badge>}
                    {tenant.status === 'demo' && <Badge variant="warning">Demo</Badge>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.expiryDate ? format(new Date(tenant.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/super-admin/tenants/${tenant._id}`)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/super-admin/tenants/${tenant._id}/payment`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Record Payment
                    </button>
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

export default TenantList;

