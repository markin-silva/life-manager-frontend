import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import type { LoginRequest } from '../types/auth';
import AuthLayout from '../components/AuthLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useLocale } from '../contexts/LocaleContext';
import { getLoadingLabel } from '../utils/loadingLabels';

export default function Login() {
  const { t } = useLocale();
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
      setApiError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.signInToAccount')}>
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
          })}
        />

        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? getLoadingLabel(t, 'signIn') : t('auth.signIn')}
        </Button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {t('auth.dontHaveAccount')}{' '}
          <a
            href="/signup"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {t('auth.signUp')}
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
