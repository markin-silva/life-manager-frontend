import type { SelectHTMLAttributes } from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string | string[];
  required?: boolean;
};

export default function SelectInput({
  id,
  label,
  options,
  error,
  required = false,
  className = '',
  ...props
}: SelectInputProps) {
  const baseClasses =
    'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

  const errorMessages = Array.isArray(error) ? error : error ? [error] : [];

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select id={id} {...props} className={`${baseClasses} ${className}`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessages.length > 0 && (
        <div className="mt-1 space-y-1">
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
