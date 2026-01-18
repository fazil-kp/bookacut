import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const BookSlot = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      serviceId: serviceId || '',
    },
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['customer-services', shopId],
    queryFn: () => customerService.getServices(shopId),
    enabled: !!shopId,
  });

  const selectedServiceId = serviceId || watch('serviceId');

  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ['customer-slots', shopId, selectedServiceId],
    queryFn: () =>
      customerService.getSlots(shopId, {
        serviceId: selectedServiceId,
        date: new Date().toISOString().split('T')[0],
      }),
    enabled: !!shopId && !!selectedServiceId,
  });

  const createBookingMutation = useMutation({
    mutationFn: (data) => customerService.createBooking(shopId, data),
    onSuccess: () => {
      toast.success('Booking created successfully!');
      queryClient.invalidateQueries(['customer-bookings']);
      navigate('/customer/bookings');
    },
  });

  const onSubmit = (data) => {
    createBookingMutation.mutate({
      serviceId: data.serviceId,
      slotId: data.slotId,
    });
  };

  if (servicesLoading || slotsLoading) return <Loading fullScreen />;

  const services = servicesData?.services || [];
  const slots = slotsData?.slots || [];

  const availableSlots = slots.filter((slot) => slot.status === 'available');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Service"
            options={services
              .filter((s) => s.active)
              .map((service) => ({
                value: service._id,
                label: `${service.name} - $${service.price} (${service.duration} min)`,
              }))}
            required
            {...register('serviceId', { required: 'Service is required' })}
            error={errors.serviceId?.message}
            disabled={!!serviceId}
          />
          {selectedServiceId && (
            <Select
              label="Available Slot"
              options={availableSlots.map((slot) => ({
                value: slot._id,
                label: new Date(slot.startTime).toLocaleString(),
              }))}
              required
              {...register('slotId', { required: 'Slot is required' })}
              error={errors.slotId?.message}
            />
          )}
          <div className="flex space-x-4 mt-6">
            <Button type="submit" variant="primary" disabled={createBookingMutation.isPending}>
              {createBookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/customer/services')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookSlot;

