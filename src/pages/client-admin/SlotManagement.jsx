import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { format } from 'date-fns';

const SlotManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['slots', id],
    queryFn: () => clientAdminService.getSlots(id),
  });

  const generateSlotsMutation = useMutation({
    mutationFn: (data) => clientAdminService.generateSlots(id, data),
    onSuccess: () => {
      toast.success('Slots generated successfully!');
      queryClient.invalidateQueries(['slots', id]);
      setIsModalOpen(false);
      reset();
    },
  });

  const onSubmit = (data) => {
    generateSlotsMutation.mutate({
      startDate: data.startDate,
      endDate: data.endDate,
    });
  };

  if (isLoading) return <Loading fullScreen />;

  const slots = data?.slots || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate(`/client-admin/shops/${id}`)}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Slot Management</h1>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Generate Slots
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {slots.slice(0, 50).map((slot) => (
                <tr key={slot._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(slot.startTime), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(slot.startTime), 'hh:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(slot.endTime), 'hh:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {slot.bookings?.length || 0} / {slot.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        slot.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : slot.status === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {slot.status === 'available' && (
                      <button className="text-red-600 hover:text-red-900">Block</button>
                    )}
                    {slot.status === 'blocked' && (
                      <button className="text-green-600 hover:text-green-900">Unblock</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Generate Slots"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Start Date"
            type="date"
            required
            {...register('startDate', { required: 'Start date is required' })}
            error={errors.startDate?.message}
          />
          <Input
            label="End Date"
            type="date"
            required
            {...register('endDate', {
              required: 'End date is required',
            })}
            error={errors.endDate?.message}
          />
          <div className="flex space-x-4 mt-6">
            <Button type="submit" variant="primary" disabled={generateSlotsMutation.isPending}>
              {generateSlotsMutation.isPending ? 'Generating...' : 'Generate Slots'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SlotManagement;

