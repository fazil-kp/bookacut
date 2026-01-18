import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ShopSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['shop-settings', id],
    queryFn: () => clientAdminService.getShopSettings(id),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data?.settings || {},
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => clientAdminService.updateShopSettings(id, data),
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      queryClient.invalidateQueries(['shop-settings', id]);
    },
  });

  const onSubmit = (data) => {
    updateSettingsMutation.mutate({
      ...data,
      allowPriceEditing: data.allowPriceEditing === 'true' || data.allowPriceEditing === true,
      autoConfirmBooking: data.autoConfirmBooking === 'true' || data.autoConfirmBooking === true,
      maxDiscountPercentage: parseFloat(data.maxDiscountPercentage) || 0,
      noShowTimeoutMinutes: parseInt(data.noShowTimeoutMinutes) || 30,
      bookingAdvanceDays: parseInt(data.bookingAdvanceDays) || 7,
      taxRate: parseFloat(data.taxRate) || 0,
    });
  };

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate(`/client-admin/shops/${id}`)}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Allow Price Editing"
            type="checkbox"
            {...register('allowPriceEditing')}
          />
          <Input
            label="Max Discount Percentage"
            type="number"
            step="0.01"
            {...register('maxDiscountPercentage')}
          />
          <Input
            label="Auto Confirm Booking"
            type="checkbox"
            {...register('autoConfirmBooking')}
          />
          <Input
            label="No-Show Timeout (minutes)"
            type="number"
            {...register('noShowTimeoutMinutes')}
          />
          <Input
            label="Booking Advance Days"
            type="number"
            {...register('bookingAdvanceDays')}
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            step="0.01"
            {...register('taxRate')}
          />
          <Input
            label="Currency"
            type="text"
            defaultValue="USD"
            {...register('currency')}
          />
          <div className="flex space-x-4 mt-6">
            <Button type="submit" variant="primary" disabled={updateSettingsMutation.isPending}>
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(`/client-admin/shops/${id}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ShopSettings;

