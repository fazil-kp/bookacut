import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../../services/staffService';
import { useShopStore } from '../../store/shopStore';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StaffBookings = () => {
  const { selectedShop } = useShopStore();
  const shopId = selectedShop?._id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['staff-bookings', shopId],
    queryFn: () => staffService.getBookings(shopId),
    enabled: !!shopId,
  });

  const markArrivedMutation = useMutation({
    mutationFn: (bookingId) => staffService.markArrived(shopId, bookingId),
    onSuccess: () => {
      toast.success('Booking marked as arrived!');
      queryClient.invalidateQueries(['staff-bookings', shopId]);
    },
  });

  const startServiceMutation = useMutation({
    mutationFn: (bookingId) => staffService.startService(shopId, bookingId),
    onSuccess: () => {
      toast.success('Service started!');
      queryClient.invalidateQueries(['staff-bookings', shopId]);
    },
  });

  const completeServiceMutation = useMutation({
    mutationFn: (bookingId) => staffService.completeService(shopId, bookingId),
    onSuccess: () => {
      toast.success('Service completed!');
      queryClient.invalidateQueries(['staff-bookings', shopId]);
    },
  });

  if (!shopId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a shop to view bookings
      </div>
    );
  }

  if (isLoading) return <Loading fullScreen />;

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>

      <Card>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-900">{booking.customer?.name}</p>
                  <p className="text-sm text-gray-500">{booking.service?.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(booking.slot?.startTime), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      booking.status === 'completed'
                        ? 'success'
                        : booking.status === 'in_progress'
                        ? 'info'
                        : booking.status === 'arrived'
                        ? 'warning'
                        : 'warning'
                    }
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-medium text-gray-900 mt-2">${booking.price}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {booking.status === 'confirmed' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => markArrivedMutation.mutate(booking._id)}
                  >
                    Mark Arrived
                  </Button>
                )}
                {booking.status === 'arrived' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => startServiceMutation.mutate(booking._id)}
                  >
                    Start Service
                  </Button>
                )}
                {booking.status === 'in_progress' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => completeServiceMutation.mutate(booking._id)}
                  >
                    Complete Service
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StaffBookings;

