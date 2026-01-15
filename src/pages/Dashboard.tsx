import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Dashboard() {
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
      {/* Simple navbar */}
      <nav className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Life Manager</h1>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] transition hover:bg-[var(--surface-hover)]"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Welcome to your dashboard
          </h2>
          <p className="text-sm text-[var(--muted)]">
            This is your home base. Financial tracking features are coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
