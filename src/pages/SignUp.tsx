import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import type { SignUpRequest } from '../types/auth';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useLocale } from '../contexts/LocaleContext';
import { getLoadingLabel } from '../utils/loadingLabels';

export default function SignUp() {
  const { t } = useLocale();
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
      setApiError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.createAccount')}>
      {apiError && <Alert>{apiError}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <TextInput
          id="email"
          type="email"
          label={t('auth.yourEmail')}
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
          label={t('auth.password')}
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <TextInput
          id="password_confirmation"
          type="password"
          label={t('auth.confirmPassword')}
          placeholder="••••••••"
          required
          error={errors.password_confirmation?.message}
          {...register('password_confirmation', {
            required: 'Password confirmation is required',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? getLoadingLabel(t, 'signUp') : t('auth.createAccountButton')}
        </Button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {t('auth.alreadyHaveAccount')}{' '}
          <a
            href="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {t('auth.loginHere')}
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
