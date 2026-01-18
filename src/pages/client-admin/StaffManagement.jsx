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

const StaffManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => clientAdminService.getStaff(id),
  });

  const addStaffMutation = useMutation({
    mutationFn: (data) => clientAdminService.addStaff(id, data),
    onSuccess: () => {
      toast.success('Staff added successfully!');
      queryClient.invalidateQueries(['staff', id]);
      setIsModalOpen(false);
      reset();
    },
  });

  const onSubmit = (data) => {
    addStaffMutation.mutate({
      ...data,
      specialization: Array.isArray(data.specialization) ? data.specialization : [],
      hourlyRate: parseFloat(data.hourlyRate) || 0,
      commissionRate: parseFloat(data.commissionRate) || 0,
    });
  };

  if (isLoading) return <Loading fullScreen />;

  const staff = data?.staff || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate(`/client-admin/shops/${id}`)}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Staff
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {member.specialization?.join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-primary-600 hover:text-primary-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Remove</button>
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
        title="Add Staff"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            required
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            required
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
          />
          <Input
            label="Name"
            type="text"
            required
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Phone"
            type="tel"
            required
            {...register('phone', { required: 'Phone is required' })}
            error={errors.phone?.message}
          />
          <Input
            label="Hourly Rate"
            type="number"
            step="0.01"
            {...register('hourlyRate')}
          />
          <Input
            label="Commission Rate (%)"
            type="number"
            step="0.01"
            {...register('commissionRate')}
          />
          <div className="flex space-x-4 mt-6">
            <Button type="submit" variant="primary" disabled={addStaffMutation.isPending}>
              {addStaffMutation.isPending ? 'Adding...' : 'Add Staff'}
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

export default StaffManagement;

