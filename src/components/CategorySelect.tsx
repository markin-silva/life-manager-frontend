import { useEffect, useMemo, useRef, useState } from 'react';
import type { Category } from '../types/categories';
import CategoryBadge from './CategoryBadge';

type CategorySelectProps = {
  categories: Category[];
  value: string | null | undefined;
  placeholder: string;
  uncategorizedLabel: string;
  createLabel: string;
  manageLabel: string;
  onChange: (value: string) => void;
  onCreateClick: () => void;
  onManageClick: () => void;
  getLabel: (category: Category) => string;
  disabled?: boolean;
};

export default function CategorySelect({
  categories,
  value,
  placeholder,
  uncategorizedLabel,
  createLabel,
  manageLabel,
  onChange,
  onCreateClick,
  onManageClick,
  getLabel,
  disabled = false,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedCategory = useMemo(() => {
    if (!value) return null;
    return categories.find((category) => category.id === value) || null;
  }, [categories, value]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-800"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedCategory ? (
          <CategoryBadge category={selectedCategory} label={getLabel(selectedCategory)} className="text-sm" />
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
        <span className="text-gray-400">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="max-h-64 space-y-1 overflow-auto">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              <span className="h-2 w-2 rounded-full bg-gray-300" aria-hidden="true" />
              <span>{uncategorizedLabel}</span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  onChange(category.id);
                  setIsOpen(false);
                }}
              >
                <CategoryBadge category={category} label={getLabel(category)} className="text-sm" />
              </button>
            ))}
          </div>

          <div className="mt-2 space-y-1 border-t border-gray-200 pt-2 dark:border-gray-700">
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-primary-600 transition hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-700"
              onClick={() => {
                setIsOpen(false);
                onCreateClick();
              }}
            >
              + {createLabel}
            </button>
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => {
                setIsOpen(false);
                onManageClick();
              }}
            >
              {manageLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
