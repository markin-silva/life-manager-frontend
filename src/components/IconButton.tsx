import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonVariant = 'default' | 'destructive';

type IconButtonSize = 'sm' | 'md';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
};

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-800',
  destructive:
    'text-red-500 hover:bg-red-50 hover:text-red-600 focus:ring-red-100 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 dark:focus:ring-red-900',
};

export default function IconButton({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center rounded-lg transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
