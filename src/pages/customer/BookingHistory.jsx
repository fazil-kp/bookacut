import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BookingHistory = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['customer-bookings'],
    queryFn: customerService.getBookings,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: ({ bookingId, reason }) => customerService.cancelBooking(bookingId, reason),
    onSuccess: () => {
      toast.success('Booking cancelled successfully!');
      queryClient.invalidateQueries(['customer-bookings']);
    },
  });

  const handleCancel = (bookingId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      cancelBookingMutation.mutate({ bookingId, reason });
    }
  };

  if (isLoading) return <Loading fullScreen />;

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      <Card>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-900">{booking.service?.name}</p>
                  <p className="text-sm text-gray-500">
                    {booking.shop?.name || 'Shop'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(booking.slot?.startTime), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      booking.status === 'completed'
                        ? 'success'
                        : booking.status === 'cancelled'
                        ? 'danger'
                        : booking.status === 'in_progress'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-medium text-gray-900 mt-2">${booking.price}</p>
                </div>
              </div>
              {booking.status === 'confirmed' || booking.status === 'pending' ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BookingHistory;

