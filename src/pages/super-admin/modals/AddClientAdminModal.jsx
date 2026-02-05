import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminService } from '../../../services/superAdminService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import toast from 'react-hot-toast';

const AddClientAdminModal = ({ tenantId, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });

    const createAdminMutation = useMutation({
        mutationFn: (data) => superAdminService.createClientAdmin(tenantId, data),
        onSuccess: () => {
            toast.success('Client admin created successfully');
            queryClient.invalidateQueries(['tenant', tenantId]);
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create client admin');
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
        createAdminMutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Add Client Admin
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex justify-end pt-4 space-x-3">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            type="button"
                            disabled={createAdminMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={createAdminMutation.isPending}
                        >
                            Create Admin
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientAdminModal;
