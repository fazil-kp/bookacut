import { useQuery } from '@tanstack/react-query';
import { staffService } from '../../services/staffService';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useShopStore } from '../../store/shopStore';
import Badge from '../../components/common/Badge';
import { format } from 'date-fns';

const StaffDashboard = () => {
  const { selectedShop } = useShopStore();
  const shopId = selectedShop?._id;

  const { data, isLoading } = useQuery({
    queryKey: ['staff-dashboard', shopId],
    queryFn: () => staffService.getDashboard(shopId),
    enabled: !!shopId,
  });

  if (!shopId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a shop to view dashboard
      </div>
    );
  }

  if (isLoading) return <Loading fullScreen />;

  const todayBookings = data?.todayBookings || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{stats.todayBookings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Today's Bookings</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completedBookings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
        </Card>
      </div>

      <Card title="Today's Bookings">
        <div className="space-y-4">
          {todayBookings.map((booking) => (
            <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{booking.customer?.name}</p>
                <p className="text-sm text-gray-500">{booking.service?.name}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.slot?.startTime), 'hh:mm a')}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'in_progress' ? 'info' : 'warning'}>
                  {booking.status}
                </Badge>
                <p className="text-sm font-medium text-gray-900 mt-2">${booking.price}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StaffDashboard;

