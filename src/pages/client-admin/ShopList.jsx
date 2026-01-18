import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Badge from '../../components/common/Badge';

const ShopList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: clientAdminService.getShops,
  });

  if (isLoading) return <Loading fullScreen />;

  const shops = data?.shops || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
        <Button variant="primary" onClick={() => navigate('/client-admin/shops/new')}>
          Add Shop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <Card key={shop._id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/client-admin/shops/${shop._id}`)}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
              {shop.status === 'active' ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="danger">Inactive</Badge>
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{shop.address}</p>
              <p>{shop.phone}</p>
              <p>{shop.email}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopList;

