import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import type { SignUpRequest } from '../types/auth';
import type { AxiosError } from 'axios';

export default function SignUp() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpRequest>({
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpRequest) => {
    setApiError(null);
    setIsLoading(true);

    try {
      await authService.signup(data);
      navigate('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<Record<string, unknown>>;
      
      if (axiosError.response?.data?.errors) {
        // Handle Rails validation errors
        const errors = axiosError.response.data.errors;
        const errorMessage = Array.isArray(errors)
          ? errors[0]
          : Object.values(errors).flat()[0];
        
        setApiError(String(errorMessage) || 'Failed to create account');
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
    <section className="bg-gray-50 font-sans dark:bg-gray-900">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 flex w-full max-w-md items-center justify-between">
          <div className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
            <div className="mr-2 h-8 w-8 rounded-full bg-primary-600" />
            Life Manager
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 sm:max-w-md">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create an account
            </h1>

            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 ${
                    errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 ${
                    errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  {...register('password_confirmation', {
                    required: 'Password confirmation is required',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className={`block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 ${
                    errors.password_confirmation ? 'border-red-300 dark:border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-70 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isLoading ? 'Creating account...' : 'Create an account'}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
