import { useEffect, useMemo, useRef, useState } from 'react';
import type { Category } from '../types/categories';
import CategoryBadge from './CategoryBadge';

type CategorySelectProps = {
  id: string;
  categories: Category[];
  value: string | null | undefined;
  placeholder: string;
  uncategorizedLabel: string;
  uncategorizedValue?: string;
  createLabel: string;
  manageLabel: string;
  onChange: (value: string) => void;
  onCreateClick: () => void;
  onManageClick: () => void;
  getLabel: (category: Category) => string;
  disabled?: boolean;
  required?: boolean;
  error?: string | string[];
};

export default function CategorySelect({
  id,
  categories,
  value,
  placeholder,
  uncategorizedLabel,
  uncategorizedValue = 'uncategorized',
  createLabel,
  manageLabel,
  onChange,
  onCreateClick,
  onManageClick,
  getLabel,
  disabled = false,
  required = false,
  error,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const errorMessages = Array.isArray(error) ? error : error ? [error] : [];
  const isUncategorized = value === uncategorizedValue;

  const selectedCategory = useMemo(() => {
    if (!value || isUncategorized) return null;
    return categories.find((category) => category.id === value) || null;
  }, [categories, isUncategorized, value]);

  const borderClasses = errorMessages.length > 0
    ? 'border-red-300 dark:border-red-500'
    : 'border-gray-300 dark:border-gray-600';

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
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-800 ${borderClasses}`}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={errorMessages.length > 0}
        aria-describedby={errorMessages.length > 0 ? `${id}-error` : undefined}
      >
        {selectedCategory ? (
          <CategoryBadge category={selectedCategory} label={getLabel(selectedCategory)} className="text-sm" />
        ) : isUncategorized ? (
          <span className="text-gray-700 dark:text-gray-200">{uncategorizedLabel}</span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
        <span className="text-gray-400">▾</span>
      </button>

      {required && (
        <span className="sr-only" aria-hidden="true">
          *
        </span>
      )}

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex max-h-72 flex-col overflow-hidden">
            <div className="flex-1 space-y-1 overflow-auto pr-1">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => {
                onChange(uncategorizedValue);
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
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  onChange(category.id);
                  setIsOpen(false);
                }}
              >
                <CategoryBadge category={category} label={getLabel(category)} className="text-sm" />
              </button>
            ))}
          </div>

            <div className="sticky bottom-0 mt-2 space-y-1 border-t border-gray-200 bg-white pt-2 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-primary-600 transition hover:bg-primary-50 dark:text-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setIsOpen(false);
                  onCreateClick();
                }}
              >
                + {createLabel}
              </button>
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => {
                  setIsOpen(false);
                  onManageClick();
                }}
              >
                {manageLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessages.length > 0 && (
        <div id={`${id}-error`} className="mt-1 space-y-1">
          {errorMessages.map((message) => (
            <p key={message} className="text-xs text-red-500">
              {message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
