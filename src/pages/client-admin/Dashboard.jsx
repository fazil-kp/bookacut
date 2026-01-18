import { useQuery } from '@tanstack/react-query';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

const ClientAdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['client-admin-dashboard'],
    queryFn: clientAdminService.getDashboard,
  });

  if (isLoading) return <Loading fullScreen />;

  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{stats.todayBookings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Today's Bookings</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Pending Bookings</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.activeStaff || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Active Staff</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              ${stats.monthlyRevenue?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Monthly Revenue</p>
          </div>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card title="Recent Bookings">
        <div className="space-y-4">
          {recentBookings.slice(0, 10).map((booking) => (
            <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{booking.customer?.name}</p>
                <p className="text-sm text-gray-500">{booking.service?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${booking.price}</p>
                <p className="text-sm text-gray-500">{new Date(booking.slot?.startTime).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ClientAdminDashboard;

