import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminService } from '../../services/superAdminService';
import { PAYMENT_METHODS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const RecordPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const paymentMutation = useMutation({
    mutationFn: (data) => superAdminService.recordPayment(id, data),
    onSuccess: () => {
      toast.success('Payment recorded successfully!');
      queryClient.invalidateQueries(['tenant', id]);
      queryClient.invalidateQueries(['tenants']);
      navigate(`/super-admin/tenants/${id}`);
    },
  });

  const onSubmit = (data) => {
    paymentMutation.mutate({
      ...data,
      amount: parseFloat(data.amount),
      subscriptionPeriod: parseInt(data.subscriptionPeriod),
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate(`/super-admin/tenants/${id}`)}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            required
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
            error={errors.amount?.message}
          />

          <Input
            label="Currency"
            type="text"
            defaultValue="USD"
            required
            {...register('currency', {
              required: 'Currency is required',
            })}
            error={errors.currency?.message}
          />

          <Select
            label="Payment Method"
            options={PAYMENT_METHODS.map((method) => ({
              value: method,
              label: method.replace('_', ' ').toUpperCase(),
            }))}
            required
            {...register('paymentMethod', {
              required: 'Payment method is required',
            })}
            error={errors.paymentMethod?.message}
          />

          <Input
            label="Subscription Period (Months)"
            type="number"
            min="1"
            required
            {...register('subscriptionPeriod', {
              required: 'Subscription period is required',
              min: { value: 1, message: 'Must be at least 1 month' },
            })}
            error={errors.subscriptionPeriod?.message}
          />

          <Input
            label="Receipt Number"
            type="text"
            {...register('receiptNumber')}
            error={errors.receiptNumber?.message}
          />

          <Input
            label="Notes"
            type="textarea"
            rows="4"
            {...register('notes')}
            error={errors.notes?.message}
          />

          <div className="flex space-x-4 mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={paymentMutation.isPending}
            >
              {paymentMutation.isPending ? 'Recording...' : 'Record Payment'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/super-admin/tenants/${id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecordPayment;

