import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-emerald-500 text-white
    hover:bg-emerald-600
    active:bg-emerald-700
    shadow-md hover:shadow-lg
    focus:ring-emerald-400/40
  `,

  secondary: `
    bg-gray-800 text-white
    hover:bg-gray-700
    active:bg-gray-600
    dark:bg-gray-700 dark:text-gray-100
    dark:hover:bg-gray-600 dark:active:bg-gray-500
    focus:ring-gray-400/30
  `,

  outline: `
    border border-gray-400 text-gray-800
    hover:bg-gray-100
    dark:border-gray-600 dark:text-gray-200
    dark:hover:bg-gray-700
    focus:ring-gray-400/30
  `,

  ghost: `
    text-gray-500
    hover:bg-gray-100 hover:text-gray-900
    dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white
    focus:ring-transparent
  `,

  destructive: `
    bg-red-500 text-white
    hover:bg-red-600
    active:bg-red-700
    shadow-md hover:shadow-lg
    focus:ring-red-400/40
  `,
};

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
