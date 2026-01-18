import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAdminService } from '../../services/clientAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { SERVICE_CATEGORIES } from '../../utils/constants';

const ServiceManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['services', id],
    queryFn: () => clientAdminService.getServices(id),
  });

  const addServiceMutation = useMutation({
    mutationFn: (data) => clientAdminService.createService(id, data),
    onSuccess: () => {
      toast.success('Service added successfully!');
      queryClient.invalidateQueries(['services', id]);
      setIsModalOpen(false);
      reset();
    },
  });

  const onSubmit = (data) => {
    addServiceMutation.mutate({
      ...data,
      duration: parseInt(data.duration),
      price: parseFloat(data.price),
      active: data.active === 'true' || data.active === true,
    });
  };

  if (isLoading) return <Loading fullScreen />;

  const services = data?.services || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate(`/client-admin/shops/${id}`)}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Service
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${service.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-primary-600 hover:text-primary-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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
        title="Add Service"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            type="text"
            required
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Description"
            type="textarea"
            rows="3"
            {...register('description')}
          />
          <Select
            label="Category"
            options={SERVICE_CATEGORIES.map((cat) => ({
              value: cat,
              label: cat.replace('_', ' ').toUpperCase(),
            }))}
            required
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            required
            {...register('duration', {
              required: 'Duration is required',
              min: { value: 1, message: 'Duration must be at least 1 minute' },
            })}
            error={errors.duration?.message}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            required
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be greater than or equal to 0' },
            })}
            error={errors.price?.message}
          />
          <Select
            label="Status"
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            required
            {...register('active', { required: 'Status is required' })}
            error={errors.active?.message}
          />
          <div className="flex space-x-4 mt-6">
            <Button type="submit" variant="primary" disabled={addServiceMutation.isPending}>
              {addServiceMutation.isPending ? 'Adding...' : 'Add Service'}
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

export default ServiceManagement;

