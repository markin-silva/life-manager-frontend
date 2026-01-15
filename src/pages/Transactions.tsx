import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { transactionsService } from '../services/transactions';
import type { Transaction, TransactionCreateRequest } from '../types/transactions';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useLocale } from '../contexts/LocaleContext';

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
  const { locale, t } = useLocale();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: 0,
      kind: 'expense',
      description: '',
      category: '',
      occurred_date: defaultOccurredAt().date,
      occurred_time: defaultOccurredAt().time,
    },
  });

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await transactionsService.list();
        setTransactions(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const occurredAt = new Date(`${data.occurred_date}T${data.occurred_time}`).toISOString();
      const payload: TransactionCreateRequest = {
        ...data,
        amount: Number(data.amount),
        occurred_at: occurredAt,
      };

      const created = await transactionsService.create(payload);
      setTransactions((prev) => [created, ...prev]);
      const nextOccurred = defaultOccurredAt();
      reset({
        amount: 0,
        kind: data.kind,
        description: '',
        category: '',
        occurred_date: nextOccurred.date,
        occurred_time: nextOccurred.time,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionsService.remove(id);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError((err as Error).message);
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
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [locale]);

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

        {error && <Alert>{error}</Alert>}

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
                required
                error={errors.amount?.message}
                {...register('amount', {
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
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
                {...register('kind')}
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
                  {...register('occurred_date', {
                    required: 'Date is required',
                  })}
                />
                <TextInput
                  id="occurred_time"
                  type="time"
                  label={t('transactions.time')}
                  required
                  {...register('occurred_time', {
                    required: 'Time is required',
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
