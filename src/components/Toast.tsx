import type { ReactNode } from 'react';

type ToastProps = {
  children: ReactNode;
  onClose?: () => void;
};

export default function Toast({ children, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-lg dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
        <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-700/70 transition hover:text-emerald-900 dark:text-emerald-200/70 dark:hover:text-emerald-100"
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
