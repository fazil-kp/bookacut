import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/superAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Input from '../../components/common/Input';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AddClientAdminModal from './modals/AddClientAdminModal';

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [formData, setFormData] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => superAdminService.getTenantDetails(id),
  });

  const updateTenantMutation = useMutation({
    mutationFn: (data) => superAdminService.updateTenant(id, data),
    onSuccess: () => {
      toast.success('Tenant updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries(['tenant', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update tenant');
    },
  });

  if (isLoading) return <Loading fullScreen />;

  const tenant = data?.tenant || {};

  const handleEditClick = () => {
    setFormData({
      subscriptionExpiresAt: tenant.subscriptionExpiresAt ? tenant.subscriptionExpiresAt.split('T')[0] : '',
      maxShops: tenant.maxShops,
      maxStaff: tenant.maxStaff,
      subscriptionPlan: tenant.subscriptionPlan,
      isActive: tenant.isActive,
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    updateTenantMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/super-admin/tenants')}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Details</h1>
      </div>

      <Card title="Tenant Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.firstName} {tenant.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Database Name</label>
            <p className="mt-1 text-lg text-gray-900">{tenant.databaseName}</p>
          </div>

          {isEditing ? (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={(e) => handleChange({ target: { name: 'isActive', value: e.target.value === 'true' } })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Subscription Plan
                </label>
                <select
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <Input
                label="Subscription Expiry"
                name="subscriptionExpiresAt"
                type="date"
                value={formData.subscriptionExpiresAt}
                onChange={handleChange}
              />
              <Input
                label="Max Shops"
                name="maxShops"
                type="number"
                value={formData.maxShops}
                onChange={handleChange}
              />
              <Input
                label="Max Staff"
                name="maxStaff"
                type="number"
                value={formData.maxStaff}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tenant.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {tenant.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subscription Plan</label>
                <p className="mt-1 text-lg text-gray-900 capitalize">{tenant.subscriptionPlan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subscription Expiry</label>
                <p className="mt-1 text-lg text-gray-900">
                  {tenant.subscriptionExpiresAt ? format(new Date(tenant.subscriptionExpiresAt), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Shops</label>
                <p className="mt-1 text-lg text-gray-900">{tenant.maxShops}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Staff</label>
                <p className="mt-1 text-lg text-gray-900">{tenant.maxStaff}</p>
              </div>
            </>
          )}

        </div>

        <div className="mt-6 flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSave} isLoading={updateTenantMutation.isPending}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleCancel} disabled={updateTenantMutation.isPending}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleEditClick}>
              Edit Tenant
            </Button>
          )}
        </div>
      </Card>

      <div className="flex space-x-4">
        <Button
          variant="secondary"
          onClick={() => navigate(`/super-admin/tenants/${id}/payment`)}
        >
          Record Payment
        </Button>
      </div>

      {/* Client Admin Section */}
      <Card title="Client Admins">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">to Manage Tenant Administrators</p>
            <Button variant="outline" onClick={() => setShowAddAdminModal(true)}>
              Add Client Admin
            </Button>
          </div>

          <div className="space-y-3">
            {tenant.clientAdmins && tenant.clientAdmins.length > 0 ? (
              tenant.clientAdmins.map((admin) => (
                <div key={admin._id} className="bg-gray-50 p-4 rounded-md border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{admin.firstName} {admin.lastName}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                    <p className="text-sm text-gray-500">{admin.phone || 'No phone'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No client admins found.</p>
            )}
          </div>
        </div>
      </Card>

      {showAddAdminModal && (
        <AddClientAdminModal
          tenantId={id}
          onClose={() => setShowAddAdminModal(false)}
        />
      )}
    </div>
  );
};

export default TenantDetails;
