import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => clientAdminService.getShop(id),
  });

  if (isLoading) return <Loading fullScreen />;

  const shop = data?.shop || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/client-admin/shops')}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{shop.name || 'Shop Details'}</h1>
      </div>

      <Card title="Shop Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg text-gray-900">{shop.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="mt-1 text-lg text-gray-900">{shop.address}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-lg text-gray-900">{shop.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{shop.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Slot Duration</label>
            <p className="mt-1 text-lg text-gray-900">{shop.slotDuration || 30} minutes</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  shop.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {shop.status}
              </span>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="primary" onClick={() => navigate(`/client-admin/shops/${id}/staff`)}>
          Manage Staff
        </Button>
        <Button variant="primary" onClick={() => navigate(`/client-admin/shops/${id}/services`)}>
          Manage Services
        </Button>
        <Button variant="primary" onClick={() => navigate(`/client-admin/shops/${id}/slots`)}>
          Manage Slots
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/client-admin/shops/${id}/settings`)}>
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ShopDetails;

