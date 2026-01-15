import type { ReactNode } from 'react';

type AlertProps = {
  children: ReactNode;
};

export default function Alert({ children }: AlertProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
      {children}
    </div>
  );
}
