import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const ServiceListing = () => {
  const navigate = useNavigate();
  // In a real app, shop selection would come from user choice or context
  // For now, we'll need to handle shop selection - this is a placeholder
  const shopId = 'shop-id-here'; // This should be selected by customer

  const { data, isLoading } = useQuery({
    queryKey: ['customer-services', shopId],
    queryFn: () => customerService.getServices(shopId),
    enabled: !!shopId && shopId !== 'shop-id-here',
  });

  if (isLoading) return <Loading fullScreen />;

  if (!shopId || shopId === 'shop-id-here') {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Please select a shop to view services</p>
        {/* In a real app, you'd have a shop selection interface here */}
      </div>
    );
  }

  const services = data?.services || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Our Services</h1>

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

