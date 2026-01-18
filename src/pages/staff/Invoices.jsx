import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../../services/staffService';
import { useShopStore } from '../../store/shopStore';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { PAYMENT_METHODS } from '../../utils/constants';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StaffInvoices = () => {
  const { selectedShop } = useShopStore();
  const shopId = selectedShop?._id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['staff-invoices', shopId],
    queryFn: () => staffService.getInvoices(shopId),
    enabled: !!shopId,
  });

  const markPaidMutation = useMutation({
    mutationFn: ({ invoiceId, paymentMethod }) =>
      staffService.markInvoicePaid(shopId, invoiceId, paymentMethod),
    onSuccess: () => {
      toast.success('Invoice marked as paid!');
      queryClient.invalidateQueries(['staff-invoices', shopId]);
    },
  });

  const handleMarkPaid = (invoiceId, paymentMethod = 'cash') => {
    markPaidMutation.mutate({ invoiceId, paymentMethod });
  };

  if (!shopId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a shop to view invoices
      </div>
    );
  }

  if (isLoading) return <Loading fullScreen />;

  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.booking?.customer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.paymentStatus === 'paid' ? (
                      <Badge variant="success">Paid</Badge>
                    ) : (
                      <Badge variant="warning">Unpaid</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {invoice.paymentStatus !== 'paid' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleMarkPaid(invoice._id)}
                      >
                        Mark Paid
                      </Button>
                    )}
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

export default StaffInvoices;

