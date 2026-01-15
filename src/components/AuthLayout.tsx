import type { ReactNode } from 'react';
import { useLocale } from '../contexts/LocaleContext';

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  const { t } = useLocale();

  return (
    <section className="bg-gray-50 font-sans dark:bg-gray-900">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 flex w-full max-w-md items-center justify-between">
          <div className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
            <div className="mr-2 h-8 w-8 rounded-full bg-primary-600" />
            {t('common.appName')}
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 sm:max-w-md">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {title}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
