import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { transactionsService } from '../services/transactions';
import type { Transaction, TransactionCreateRequest } from '../types/transactions';
import type { Category } from '../types/categories';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import Button from '../components/Button';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useLocale } from '../contexts/LocaleContext';
import Toast from '../components/Toast';
import { getErrorMessage, normalizeEmptyStrings } from '../services/apiResponse';
import Modal from '../components/Modal';
import CategoryBadge from '../components/CategoryBadge';
import CategorySelect from '../components/CategorySelect';
import IconButton from '../components/IconButton';
import TransactionListSkeleton from '../components/TransactionListSkeleton';
import {
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Dumbbell,
  Briefcase,
  Gift,
  HeartPulse,
  Film,
  Plane,
  LineChart,
  Tag,
} from 'lucide-react';
import { categoriesService } from '../services/categories';
import type { CategoryCreateRequest } from '../types/categories';
import { usePagination } from '../hooks/usePagination';
import { createDateTimeFormatter } from '../utils/formatters';
import { getLoadingLabel } from '../utils/loadingLabels';

type TransactionFormValues = Omit<TransactionCreateRequest, 'occurred_at' | 'amount'> & {
  amount: string;
  occurred_date: string;
  occurred_time: string;
};

const colorOptions = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

const iconOptions = [
  { key: 'food', Icon: Utensils },
  { key: 'shopping', Icon: ShoppingBag },
  { key: 'transport', Icon: Car },
  { key: 'home', Icon: Home },
  { key: 'fitness', Icon: Dumbbell },
  { key: 'salary', Icon: Briefcase },
  { key: 'gifts', Icon: Gift },
  { key: 'health', Icon: HeartPulse },
  { key: 'entertainment', Icon: Film },
  { key: 'travel', Icon: Plane },
  { key: 'investment', Icon: LineChart },
  { key: 'other', Icon: Tag },
];

const currencyOptions = [
  { value: 'BRL', label: 'BRL' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

const DEFAULT_PER_PAGE = 30;
const UNCATEGORIZED_VALUE = 'uncategorized';

const defaultOccurredAt = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
};

const parseAmountFromDigits = (digits: string) => {
  if (!digits) return null;
  const parsed = Number(digits);
  if (!Number.isFinite(parsed)) return null;
  return parsed / 100;
};

export default function Transactions() {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const hasFetchedCategories = useRef(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: '',
      kind: 'expense',
      description: '',
      category_id: '',
      occurred_date: defaultOccurredAt().date,
      occurred_time: defaultOccurredAt().time,
    },
  });

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategory,
    watch: watchCategory,
    formState: { errors: categoryErrors },
  } = useForm<CategoryCreateRequest>({
    defaultValues: {
      name: '',
      color: colorOptions[0],
      icon: iconOptions[0].key,
    },
  });

  const categoryFormValues = watchCategory();
  const selectedColor = categoryFormValues.color;
  const selectedIcon = categoryFormValues.icon;

  const formValues = watch();

  const {
    page,
    perPage,
    setPage,
    setMeta,
    adjustTotalCount,
    totalCount,
    totalPages,
    canGoPrev,
    canGoNext,
    visiblePages,
  } = usePagination({ defaultPerPage: DEFAULT_PER_PAGE, windowSize: 5 });

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setListError(null);

      try {
        const response = await transactionsService.list(page, perPage);
        setTransactions(response.transactions);
        setMeta(response.meta ?? null);
      } catch (err) {
        setListError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, perPage, setMeta]);

  useEffect(() => {
    if (hasFetchedCategories.current) return;
    hasFetchedCategories.current = true;

    const fetchCategories = async () => {
      setIsCategoriesLoading(true);

      try {
        const data = await categoriesService.list();
        setCategories(data);
      } catch (err) {
        setCategoryFormError(getErrorMessage(err));
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const nextOccurred = defaultOccurredAt();
    setFormError(null);
    reset({
      amount: '',
      kind: 'expense',
      description: '',
      category_id: '',
      occurred_date: nextOccurred.date,
      occurred_time: nextOccurred.time,
    });
    setSelectedCurrency('BRL');
  }, [isModalOpen, reset]);

  useEffect(() => {
    if (!isCategoryCreateOpen) return;
    setCategoryFormError(null);
    if (editingCategory) {
      resetCategory({
        name: editingCategory.name,
        color: editingCategory.color,
        icon: editingCategory.icon,
      });
      return;
    }
    resetCategory({ name: '', color: colorOptions[0], icon: iconOptions[0].key });
  }, [editingCategory, isCategoryCreateOpen, resetCategory]);

  useEffect(() => {
    if (!isCategoryManageOpen) return;
    setCategoryFormError(null);
  }, [isCategoryManageOpen]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }
    setToast({ message, variant });
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const occurredAt = new Date(`${data.occurred_date}T${data.occurred_time}`).toISOString();
      const normalizedCategoryId = data.category_id === UNCATEGORIZED_VALUE ? null : data.category_id;
      const parsedAmount = parseAmountFromDigits(data.amount);
      const payload: TransactionCreateRequest = normalizeEmptyStrings({
        ...data,
        amount: parsedAmount ?? 0,
        currency: selectedCurrency,
        category_id: normalizedCategoryId,
        occurred_at: occurredAt,
      });

      const result = await transactionsService.create(payload);
      setTransactions((prev) => [result.transaction, ...prev]);
      adjustTotalCount(1);
      const message = result.message || t('transactions.createSuccess');
      showToast(message, 'success');
      setIsModalOpen(false);
      const nextOccurred = defaultOccurredAt();
      reset({
        amount: '',
        kind: data.kind,
        description: '',
        category_id: data.category_id || '',
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
      adjustTotalCount(-1);
      showToast(t('transactions.deleteSuccess'), 'success');
    } catch (err) {
      showToast(getErrorMessage(err) || t('transactions.deleteError'), 'error');
    }
  };

  const formatTransactionAmount = useCallback(
    (amount: number, currency: string) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
    [locale],
  );

  const amountFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [locale, selectedCurrency]);

  const formatDateTime = useMemo(() => createDateTimeFormatter(locale), [locale]);


  const getCategoryLabel = useCallback((category: Category) => {
    if (category.system) {
      const translated = t(`categories.${category.key}`);
      return translated === `categories.${category.key}` ? category.name || category.key : translated;
    }
    return category.name;
  }, [t]);

  const selectedCategoryId = formValues.category_id || '';

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormError(null);
    resetCategory({ name: '', color: colorOptions[0], icon: iconOptions[0].key });
    setIsCategoryManageOpen(false);
    setIsCategoryCreateOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormError(null);
    resetCategory({ name: category.name, color: category.color, icon: category.icon });
    setIsCategoryManageOpen(false);
    setIsCategoryCreateOpen(true);
  };

  const onSubmitCategory = async (data: CategoryCreateRequest) => {
    setIsCategorySaving(true);
    setCategoryFormError(null);

    try {
      if (editingCategory) {
        const updated = await categoriesService.update(editingCategory.id, data);
        setCategories((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setEditingCategory(null);
      } else {
        const created = await categoriesService.create(data);
        setCategories((prev) => [created, ...prev]);
        setValue('category_id', created.id);
      }

      setIsCategoryCreateOpen(false);
    } catch (err) {
      setCategoryFormError(getErrorMessage(err));
    } finally {
      setIsCategorySaving(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.system) return;

    try {
      await categoriesService.remove(category.id);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));

      if (selectedCategoryId === category.id) {
        setValue('category_id', '');
      }
    } catch (err) {
      setCategoryFormError(getErrorMessage(err));
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/signup');
  };

  return (
    <section className="min-h-screen bg-gray-50 font-sans dark:bg-gray-900">
      <Header onLogout={handleLogout} />

      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col gap-5 px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <ReceiptText className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <h1 className="text-2xl font-semibold">
                {t('transactions.title')}
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('transactions.subtitle')}
            </p>
          </div>
          <div className="hidden sm:block">
            <Button onClick={() => setIsModalOpen(true)}>
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('transactions.addTransaction')}
              </span>
            </Button>
          </div>
        </header>

        {toast && (
          <Toast variant={toast.variant} onClose={() => setToast(null)}>
            {toast.message}
          </Toast>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">

          <div className="hidden sm:grid grid-cols-[140px_1.4fr_200px_120px_60px] gap-4 border-b border-gray-200 pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <span>{t('transactions.date')}</span>
            <span>{t('transactions.description')}</span>
            <span>{t('transactions.category')}</span>
            <span className="text-right">{t('transactions.amount')}</span>
            <span className="text-right">{t('transactions.actions')}</span>
          </div>

          {isLoading ? (
            <TransactionListSkeleton />
          ) : listError ? (
            <p className="text-sm text-red-600 dark:text-red-300">
              {listError}
            </p>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
              <ReceiptText className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <p>{t('transactions.noTransactions')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid gap-3 py-4 text-sm sm:grid-cols-[140px_1.4fr_200px_120px_60px] sm:items-center"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {formatDateTime.format(new Date(transaction.occurred_at))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description || 'Untitled'}
                    </p>
                  </div>
                  <div>
                    <CategoryBadge
                      category={transaction.category}
                      label={transaction.category
                        ? getCategoryLabel(transaction.category)
                        : t('transactions.uncategorized')}
                      className="text-xs"
                    />
                  </div>
                  <div className="text-right font-semibold">
                    <span className={transaction.kind === 'income' ? 'text-emerald-500' : 'text-red-500'}>
                      {transaction.kind === 'income' ? '+' : '-'}
                      {formatTransactionAmount(
                        Math.abs(Number(transaction.amount)),
                        transaction.currency || 'BRL',
                      )}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <IconButton
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(transaction.id)}
                      aria-label={t('transactions.deleteTransactionTooltip')}
                      title={t('transactions.deleteTransactionTooltip')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <span>
              {t('transactions.pageLabel')} {page} {t('transactions.pageOf')} {totalPages} • {totalCount} {t('common.items')}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="px-3 py-1 text-xs"
                disabled={isLoading || !canGoPrev}
                onClick={() => setPage(page - 1)}
              >
                {t('transactions.previousPage')}
              </Button>
              {visiblePages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  type="button"
                  variant="outline"
                  className={`px-3 py-1 text-xs ${
                    pageNumber === page
                      ? 'border-gray-300 bg-gray-200 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      : ''
                  }`}
                  disabled={isLoading || totalPages === 1 || pageNumber === page}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                className="px-3 py-1 text-xs"
                disabled={isLoading || !canGoNext}
                onClick={() => setPage(page + 1)}
              >
                {t('transactions.nextPage')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 sm:hidden"
        aria-label={t('transactions.addTransaction')}
        title={t('transactions.addTransaction')}
      >
        <Plus className="h-5 w-5" />
      </button>

      <Modal
        isOpen={isModalOpen}
        title={t('transactions.newTransaction')}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {formError}
            </div>
          )}

          <div className="grid sm:grid-cols-[2fr_1fr_1fr] sm:items-end">
            <label
              htmlFor="amount"
              className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white sm:col-span-3"
            >
              {t('transactions.amount')}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <div className={`flex items-center rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition focus-within:ring-4 dark:bg-gray-700 dark:text-white sm:col-span-3 ${
              errors.amount
                ? 'border-red-300 focus-within:ring-red-200 dark:border-red-500 dark:focus-within:ring-red-900/40'
                : 'border-gray-300 focus-within:ring-primary-200 dark:border-gray-600 dark:focus-within:ring-primary-800'
            }`}>
              <input
                id="amount"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder={amountFormatter.format(0)}
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-400"
                value={formValues.amount
                  ? amountFormatter.format((Number(formValues.amount) || 0) / 100)
                  : ''}
                {...register('amount', {
                  required: t('transactions.amountRequired'),
                  validate: (value) => {
                    const parsed = parseAmountFromDigits(value);
                    if (parsed === null) return t('transactions.amountRequired');
                    if (parsed <= 0) return t('transactions.amountMin');
                    return true;
                  },
                  onChange: (event) => {
                    const digits = (event.target.value as string).replace(/\D/g, '');
                    setValue('amount', digits, { shouldValidate: true });
                    clearErrors('amount');
                    setFormError(null);
                  },
                })}
              />
              <div className="mx-3 h-5 w-px bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(event) => setSelectedCurrency(event.target.value)}
                className="cursor-pointer bg-transparent text-xs font-semibold uppercase text-gray-500 outline-none dark:text-gray-300"
                aria-label={t('transactions.currency')}
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.amount?.message && (
              <div className="mt-1 space-y-1 sm:col-span-3">
                <p className="text-xs text-red-500">{errors.amount.message}</p>
              </div>
            )}
          </div>

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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              {t('transactions.category')}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="hidden"
              {...register('category_id', {
                required: t('transactions.categoryRequired'),
              })}
            />
            <CategorySelect
              id="category_id"
              categories={categories}
              value={selectedCategoryId}
              placeholder={isCategoriesLoading ? t('common.loading') : t('transactions.categoryPlaceholder')}
              uncategorizedLabel={t('transactions.uncategorized')}
              uncategorizedValue={UNCATEGORIZED_VALUE}
              createLabel={t('transactions.createCategory')}
              manageLabel={t('transactions.manageCategories')}
              disabled={isCategoriesLoading}
              getLabel={getCategoryLabel}
              required
              error={errors.category_id?.message}
              onChange={(value) => {
                setValue('category_id', value);
                clearErrors('category_id');
                setFormError(null);
              }}
              onCreateClick={openCreateCategory}
              onManageClick={() => setIsCategoryManageOpen(true)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              id="occurred_date"
              type="date"
              label={t('transactions.date')}
              required
              value={formValues.occurred_date ?? ''}
              error={errors.occurred_date?.message}
              {...register('occurred_date', {
                required: t('transactions.dateRequired'),
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
                required: t('transactions.timeRequired'),
                onChange: () => {
                  clearErrors('occurred_time');
                  setFormError(null);
                },
              })}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? getLoadingLabel(t, 'saveTransaction') : t('transactions.addTransaction')}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isCategoryCreateOpen}
        title={editingCategory ? t('transactions.editCategory') : t('transactions.createCategory')}
        onClose={() => setIsCategoryCreateOpen(false)}
      >
        <form onSubmit={handleSubmitCategory(onSubmitCategory)} className="space-y-4">
          {categoryFormError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {categoryFormError}
            </div>
          )}

          <TextInput
            id="category_name"
            label={t('transactions.categoryName')}
            placeholder={t('transactions.categoryName')}
            required
            error={categoryErrors.name?.message}
            {...registerCategory('name', {
              required: t('transactions.categoryNameRequired'),
            })}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {t('transactions.categoryColor')}
            </p>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <label key={color} className="relative">
                  <input
                    type="radio"
                    value={color}
                    {...registerCategory('color')}
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-transparent transition ${
                      selectedColor === color ? 'border-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {t('transactions.categoryIcon')}
            </p>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map(({ key, Icon }) => (
                <label key={key} className="relative">
                  <input
                    type="radio"
                    value={key}
                    {...registerCategory('icon')}
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-gray-600 transition dark:text-gray-300 ${
                      selectedIcon === key
                        ? 'border-primary-500 bg-primary-50 text-primary-600 ring-2 ring-primary-500 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isCategorySaving} fullWidth>
            {isCategorySaving ? t('transactions.savingCategory') : t('transactions.saveCategory')}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isCategoryManageOpen}
        title={t('transactions.manageCategories')}
        onClose={() => setIsCategoryManageOpen(false)}
      >
        <div className="space-y-4">
          {categoryFormError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {categoryFormError}
            </div>
          )}
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                <CategoryBadge category={category} label={getCategoryLabel(category)} />
                <div className="flex items-center gap-2">
                  {category.system ? (
                    <span className="text-xs text-gray-400">{t('transactions.systemCategory')}</span>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        className="px-3 py-1 text-xs"
                        onClick={() => openEditCategory(category)}
                      >
                        <Pencil className="mr-1 h-3 w-3" />
                        {t('transactions.editCategory')}
                      </Button>
                      <IconButton
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        aria-label={t('transactions.deleteCategoryTooltip')}
                        title={t('transactions.deleteCategoryTooltip')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button type="button" onClick={openCreateCategory} fullWidth>
            <Plus className="mr-2 h-4 w-4" />
            {t('transactions.createCategory')}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
