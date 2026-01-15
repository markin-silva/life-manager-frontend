import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import type { LoginRequest } from '../types/auth';
import type { AxiosError } from 'axios';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setApiError(null);
    setIsLoading(true);

    try {
      await authService.login(data);
      navigate('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<Record<string, unknown>>;

      if (axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;
        const errorMessage = Array.isArray(errors)
          ? errors[0]
          : Object.values(errors).flat()[0];

        setApiError(String(errorMessage) || 'Failed to sign in');
      } else if (axiosError.message) {
        setApiError(axiosError.message);
      } else {
        setApiError('Unexpected error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
      {apiError && <Alert>{apiError}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <TextInput
          id="email"
          type="email"
          label="Your email"
          placeholder="name@company.com"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />

        <TextInput
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
          })}
        />

        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
