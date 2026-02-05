import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const ServiceListing = () => {
  const navigate = useNavigate();
  const { shopId: paramShopId } = useParams();
  const { user, isAuthenticated } = useAuthStore();

  // Use param shopId or placeholder if strictly needed, but logic below handles missing shopId
  const shopId = paramShopId;

  // Query for Shop Services (only if shopId is present)
  const { data: serviceData, isLoading: servicesLoading } = useQuery({
    queryKey: ['customer-services', shopId],
    queryFn: () => customerService.getShopServices(shopId),
    enabled: !!shopId,
  });

  // Query for All Shops (only if NO shopId is present)
  const { data: shopData, isLoading: shopsLoading } = useQuery({
    queryKey: ['all-shops'],
    queryFn: customerService.getAllShops,
    enabled: !shopId,
  });

  // Query for Shop Details (to Key databaseName for login context)
  const { data: shopDetails } = useQuery({
    queryKey: ['shop-details', shopId],
    queryFn: () => customerService.getShopDetails(shopId),
    enabled: !!shopId,
  });

  if (servicesLoading || shopsLoading) return <Loading fullScreen />;

  // MODE 1: SHOP SELECTION
  if (!shopId) {
    const shops = shopData?.shops || [];

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Select a Shop</h1>

        {shops.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No shops found. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Card key={shop._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/shop/${shop._id}`)}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{shop.address}</p>
                <p className="text-sm text-gray-500 mb-4">{shop.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {shop.tenantName}
                  </span>
                  <Button variant="outline" size="sm">
                    View Services
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // MODE 2: SERVICE LISTING
  const services = serviceData?.services || [];
  const databaseName = shopDetails?.shop?.databaseName; // Need this for login context

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="secondary" onClick={() => navigate('/')} className="mb-2">
            ← Back to Shops
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {shopDetails?.shop?.name ? `${shopDetails.shop.name} - Services` : 'Our Services'}
          </h1>
        </div>
        {!isAuthenticated && (
          <Button
            variant="primary"
            onClick={() => navigate('/login', { state: { databaseName } })}
          >
            Login to Book
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services
          .filter((service) => service.active)
          .map((service) => (
            <Card key={service._id}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary-600">${service.price}</p>
                  <p className="text-sm text-gray-500">{service.duration} minutes</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/customer/book/${shopId}?serviceId=${service._id}`)}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default ServiceListing;

