import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { transactionsService } from '../services/transactions';
import type { Transaction, TransactionCreateRequest } from '../types/transactions';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import Button from '../components/Button';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useLocale } from '../contexts/LocaleContext';
import Toast from '../components/Toast';
import { getErrorMessage, normalizeEmptyStrings } from '../services/apiResponse';

type TransactionFormValues = Omit<TransactionCreateRequest, 'occurred_at'> & {
  occurred_date: string;
  occurred_time: string;
};

const defaultOccurredAt = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
};

export default function Transactions() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: undefined,
      kind: 'expense',
      description: '',
      category: '',
      occurred_date: defaultOccurredAt().date,
      occurred_time: defaultOccurredAt().time,
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setFormError(null);

      try {
        const data = await transactionsService.list();
        setTransactions(data);
      } catch (err) {
        setFormError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const occurredAt = new Date(`${data.occurred_date}T${data.occurred_time}`).toISOString();
      const payload: TransactionCreateRequest = normalizeEmptyStrings({
        ...data,
        amount: Number(data.amount),
        occurred_at: occurredAt,
      });

      const result = await transactionsService.create(payload);
      setTransactions((prev) => [result.transaction, ...prev]);
      const message = result.message || 'Transaction created successfully';
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
      const nextOccurred = defaultOccurredAt();
      reset({
        amount: undefined,
        kind: data.kind,
        description: '',
        category: '',
        occurred_date: nextOccurred.date,
        occurred_time: nextOccurred.time,
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionsService.remove(id);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const formatMoney = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }, []);

  const formatDateTime = useMemo(() => {
    return new Intl.DateTimeFormat(navigator.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, []);

  const total = useMemo(() => {
    return transactions.reduce((sum, item) => {
      const amount = Number(item.amount) || 0;
      return item.kind === 'income' ? sum + amount : sum - amount;
    }, 0);
  }, [transactions]);

  const handleLogout = () => {
    authService.logout();
    navigate('/signup');
  };

  return (
    <section className="bg-gray-50 font-sans dark:bg-gray-900">
      <Header onLogout={handleLogout} />

      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('transactions.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('transactions.subtitle')}
            </p>
          </div>
        </header>

        <div className="min-h-[44px]">
          {formError && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-red-600/70 transition hover:text-red-800 dark:text-red-200/70 dark:hover:text-red-100"
                aria-label="Dismiss error"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {successMessage && (
          <Toast onClose={() => setSuccessMessage(null)}>{successMessage}</Toast>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t('transactions.newTransaction')}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                label={t('transactions.amount')}
                placeholder="0.00"
                required
                error={errors.amount?.message}
                value={formValues.amount ?? ''}
                {...register('amount', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                  onChange: () => {
                    clearErrors('amount');
                    setFormError(null);
                  },
                })}
              />

              <SelectInput
                id="kind"
                label={t('transactions.kind')}
                required
                options={[
                  { value: 'expense', label: t('transactions.expense') },
                  { value: 'income', label: t('transactions.income') },
                ]}
                {...register('kind', {
                  onChange: () => {
                    clearErrors('kind');
                    setFormError(null);
                  },
                })}
              />

              <TextInput
                id="description"
                type="text"
                label={t('transactions.description')}
                {...register('description')}
              />

              <TextInput
                id="category"
                type="text"
                label={t('transactions.category')}
                {...register('category')}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="occurred_date"
                  type="date"
                  label={t('transactions.date')}
                  required
                  value={formValues.occurred_date ?? ''}
                  error={errors.occurred_date?.message}
                  {...register('occurred_date', {
                    required: 'Date is required',
                    onChange: () => {
                      clearErrors('occurred_date');
                      setFormError(null);
                    },
                  })}
                />
                <TextInput
                  id="occurred_time"
                  type="time"
                  label={t('transactions.time')}
                  required
                  value={formValues.occurred_time ?? ''}
                  error={errors.occurred_time?.message}
                  {...register('occurred_time', {
                    required: 'Time is required',
                    onChange: () => {
                      clearErrors('occurred_time');
                      setFormError(null);
                    },
                  })}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? t('transactions.saving') : t('transactions.addTransaction')}
              </Button>
            </form>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('transactions.recentActivity')}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {transactions.length} {t('common.items')}
              </span>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('common.loading')}
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('transactions.noTransactions')}
              </p>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description || 'Untitled'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.category || 'Uncategorized'} •{' '}
                        {formatDateTime.format(new Date(transaction.occurred_at))}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={transaction.kind === 'income' ? 'text-emerald-500' : 'text-red-500'}>
                        {transaction.kind === 'income' ? '+' : '-'}
                        {formatMoney.format(Math.abs(Number(transaction.amount)))}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
