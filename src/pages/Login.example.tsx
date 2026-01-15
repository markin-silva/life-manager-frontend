/**
 * EXEMPLO: Como seria uma página de Login
 * Descomente e adapte quando precisar implementar o fluxo de login
 * 
 * Diferenças principais:
 * - POST /api/v1/auth/sign_in (ao invés de POST /api/v1/auth)
 * - Sem campo password_confirmation
 * - Mesma lógica de token storage e redirect
 */

/*
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import type { AxiosError } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

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
      // Criar método em services/api.ts
      // await authService.login(data);
      navigate('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<Record<string, unknown>>;
      setApiError(axiosError.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Fazer Login
          </h1>
          <p className="text-slate-600">
            Bem-vindo de volta ao Life Manager
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Senha obrigatória',
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-blue-200'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition"
          >
            {isLoading ? 'Entrando...' : 'Fazer Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600 text-sm">
          Não tem uma conta?{' '}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}
*/
