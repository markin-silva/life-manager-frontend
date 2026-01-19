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
import {
  Clock,
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

type TransactionFormValues = Omit<TransactionCreateRequest, 'occurred_at'> & {
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
  const hasFetchedCategories = useRef(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
      amount: undefined,
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

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setListError(null);

      try {
        const data = await transactionsService.list();
        setTransactions(data);
      } catch (err) {
        setListError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      const nextOccurred = defaultOccurredAt();
      reset({
        amount: undefined,
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
    <section className="bg-gray-50 font-sans dark:bg-gray-900">
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

        {successMessage && (
          <Toast onClose={() => setSuccessMessage(null)}>{successMessage}</Toast>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold">
                {t('transactions.recentActivity')}
              </h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {transactions.length} {t('common.items')}
            </span>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.loading')}
            </p>
          ) : listError ? (
            <p className="text-sm text-red-600 dark:text-red-300">
              {listError}
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
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <CategoryBadge
                        category={transaction.category}
                        label={transaction.category
                          ? getCategoryLabel(transaction.category)
                          : t('transactions.uncategorized')}
                      />
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>{formatDateTime.format(new Date(transaction.occurred_at))}</span>
                    </div>
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              {t('transactions.category')}
            </label>
            <input type="hidden" {...register('category_id')} />
            <CategorySelect
              categories={categories}
              value={selectedCategoryId}
              placeholder={isCategoriesLoading ? t('common.loading') : t('transactions.categoryPlaceholder')}
              uncategorizedLabel={t('transactions.uncategorized')}
              createLabel={t('transactions.createCategory')}
              manageLabel={t('transactions.manageCategories')}
              disabled={isCategoriesLoading}
              getLabel={getCategoryLabel}
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
              required: 'Name is required',
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
                        variant="outline"
                        className="px-3 py-1 text-xs"
                        onClick={() => openEditCategory(category)}
                      >
                        <Pencil className="mr-1 h-3 w-3" />
                        {t('transactions.editCategory')}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-3 py-1 text-xs"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        {t('transactions.deleteCategory')}
                      </Button>
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
