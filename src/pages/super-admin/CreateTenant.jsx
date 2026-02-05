import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { superAdminService } from '../../services/superAdminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const CreateTenant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        subscriptionPlan: 'basic',
        maxShops: 1,
        maxStaff: 5,
        subscriptionExpiresAt: '',
    });

    const createTenantMutation = useMutation({
        mutationFn: superAdminService.createTenant,
        onSuccess: () => {
            toast.success('Tenant created successfully');
            navigate('/super-admin/tenants');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create tenant');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            adminFirstName: formData.firstName,
            adminLastName: formData.lastName,
            adminPassword: formData.password,
            adminPhone: formData.phone,
            // email and phone are directly used for ClientAdmin and initial User
        };
        createTenantMutation.mutate(payload);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="secondary" onClick={() => navigate('/super-admin/tenants')}>
                    ← Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Add New Tenant</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">
                            Personal Information
                        </h3>

                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            disabled={createTenantMutation.isPending}
                        />

                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            disabled={createTenantMutation.isPending}
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={createTenantMutation.isPending}
                        />

                        <Input
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={createTenantMutation.isPending}
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={createTenantMutation.isPending}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h3 className="col-span-full text-lg font-medium text-gray-900 border-b pb-2">
                            Subscription Details
                        </h3>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Subscription Plan
                            </label>
                            <select
                                name="subscriptionPlan"
                                value={formData.subscriptionPlan}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                disabled={createTenantMutation.isPending}
                            >
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>

                        <Input
                            label="Subscription Expiry Date"
                            name="subscriptionExpiresAt"
                            type="date"
                            value={formData.subscriptionExpiresAt}
                            onChange={handleChange}
                            required
                            disabled={createTenantMutation.isPending}
                        />

                        <Input
                            label="Max Shops"
                            name="maxShops"
                            type="number"
                            value={formData.maxShops}
                            onChange={handleChange}
                            min="1"
                            required
                            disabled={createTenantMutation.isPending}
                        />

                        <Input
                            label="Max Staff"
                            name="maxStaff"
                            type="number"
                            value={formData.maxStaff}
                            onChange={handleChange}
                            min="1"
                            required
                            disabled={createTenantMutation.isPending}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={createTenantMutation.isPending}
                        >
                            Create Tenant
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateTenant;
