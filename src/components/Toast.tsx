import type { ReactNode } from 'react';

type ToastProps = {
  children: ReactNode;
  onClose?: () => void;
  variant?: 'success' | 'error';
};

const variantClasses: Record<NonNullable<ToastProps['variant']>, string> = {
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300',
  error:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300',
};

const dotClasses: Record<NonNullable<ToastProps['variant']>, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
};

export default function Toast({ children, onClose, variant = 'success' }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${variantClasses[variant]}`}>
        <span className={`mt-0.5 h-2 w-2 rounded-full ${dotClasses[variant]}`} aria-hidden="true" />
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-current/70 transition hover:text-current"
            aria-label="Close notification"
            title="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
