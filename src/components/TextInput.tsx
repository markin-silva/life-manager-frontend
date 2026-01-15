import type { InputHTMLAttributes } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
};

export default function TextInput({
  id,
  label,
  error,
  required = false,
  className = '',
  ...props
}: TextInputProps) {
  const baseClasses =
    'block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500';
  const borderClasses = error
    ? 'border-red-300 dark:border-red-500'
    : 'border-gray-300';

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input id={id} {...props} className={`${baseClasses} ${borderClasses} ${className}`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
