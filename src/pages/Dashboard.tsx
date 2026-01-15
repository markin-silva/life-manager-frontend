import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Button from '../components/Button';
import Header from '../components/Header';
import { useLocale } from '../contexts/LocaleContext';

export default function Dashboard() {
  const { t } = useLocale();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header onLogout={handleLogout} />

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            {t('dashboard.title')}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {t('dashboard.body')}
          </p>
          <div className="mt-6">
            <Link to="/transactions">
              <Button>{t('dashboard.openTransactions')}</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
