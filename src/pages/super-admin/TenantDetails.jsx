import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/superAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { format } from 'date-fns';

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => superAdminService.getTenant(id),
  });

  if (isLoading) return <Loading fullScreen />;

  const tenant = data?.tenant || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/super-admin/tenants')}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Details</h1>
      </div>

      <Card title="Tenant Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.address || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="mt-1">
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
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Subscription Expiry</label>
            <p className="mt-1 text-lg text-gray-900">
              {tenant.expiryDate ? format(new Date(tenant.expiryDate), 'MMM dd, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Admin User">
        {tenant.adminUser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-lg text-gray-900">{tenant.adminUser.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg text-gray-900">{tenant.adminUser.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1 text-lg text-gray-900">{tenant.adminUser.phone}</p>
            </div>
          </div>
        )}
      </Card>

      <div className="flex space-x-4">
        <Button
          variant="primary"
          onClick={() => navigate(`/super-admin/tenants/${id}/payment`)}
        >
          Record Payment
        </Button>
      </div>
    </div>
  );
};

export default TenantDetails;

