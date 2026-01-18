import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staffService';
import { clientAdminService } from '../../services/clientAdminService';
import { useShopStore } from '../../store/shopStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const WalkInBooking = () => {
  const navigate = useNavigate();
  const { selectedShop } = useShopStore();
  const shopId = selectedShop?._id;
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', shopId],
    queryFn: () => clientAdminService.getServices(shopId),
    enabled: !!shopId,
  });

  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', shopId],
    queryFn: () => clientAdminService.getSlots(shopId, { date: new Date().toISOString().split('T')[0] }),
    enabled: !!shopId,
  });

  const createWalkInMutation = useMutation({
    mutationFn: (data) => staffService.createWalkIn(shopId, data),
    onSuccess: () => {
      toast.success('Walk-in booking created successfully!');
      queryClient.invalidateQueries(['staff-bookings', shopId]);
      navigate('/staff/bookings');
    },
  });

  const onSubmit = (data) => {
    createWalkInMutation.mutate({
      ...data,
      price: parseFloat(data.price) || 0,
    });
  };

  if (!shopId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a shop to create walk-in booking
      </div>
    );
  }

  if (servicesLoading || slotsLoading) return <Loading fullScreen />;

  const services = servicesData?.services || [];
  const slots = slotsData?.slots || [];

  const availableSlots = slots.filter((slot) => slot.status === 'available');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Create Walk-in Booking</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Customer Name"
            type="text"
            required
            {...register('customerName', { required: 'Customer name is required' })}
            error={errors.customerName?.message}
          />
          <Input
            label="Customer Phone"
            type="tel"
            required
            {...register('customerPhone', { required: 'Customer phone is required' })}
            error={errors.customerPhone?.message}
          />
          <Input
            label="Customer Email"
            type="email"
            {...register('customerEmail')}
            error={errors.customerEmail?.message}
          />
          <Select
            label="Service"
            options={services
              .filter((s) => s.active)
              .map((service) => ({
                value: service._id,
                label: `${service.name} - $${service.price}`,
              }))}
            required
            {...register('serviceId', { required: 'Service is required' })}
            error={errors.serviceId?.message}
          />
          <Select
            label="Slot"
            options={availableSlots.map((slot) => ({
              value: slot._id,
              label: new Date(slot.startTime).toLocaleString(),
            }))}
            required
            {...register('slotId', { required: 'Slot is required' })}
            error={errors.slotId?.message}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            required
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be greater than 0' },
            })}
            error={errors.price?.message}
          />
          <div className="flex space-x-4 mt-6">
            <Button type="submit" variant="primary" disabled={createWalkInMutation.isPending}>
              {createWalkInMutation.isPending ? 'Creating...' : 'Create Booking'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/staff/bookings')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WalkInBooking;

