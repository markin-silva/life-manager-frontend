import { NavLink } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-4 ${
    isActive
      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
  }`;

type HeaderProps = {
  onLogout: () => void;
};

export default function Header({ onLogout }: HeaderProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-600" aria-hidden="true" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.appName')}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/dashboard" className={navLinkClasses}>
            {t('common.dashboard')}
          </NavLink>
          <NavLink to="/transactions" className={navLinkClasses}>
            {t('common.transactions')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="locale">
            Language
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(event) => setLocale(event.target.value as 'en' | 'pt-BR')}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-primary-800"
          >
            <option value="en">EN</option>
            <option value="pt-BR">PT-BR</option>
          </select>

          <button
            type="button"
            onClick={onLogout}
            title={t('common.logout')}
            aria-label={t('common.logout')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-primary-800"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
