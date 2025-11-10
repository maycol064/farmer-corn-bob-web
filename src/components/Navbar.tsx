import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useEffect, useState } from 'react';

function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <Link to={user ? '/app' : '/'} className="font-semibold tracking-tight">
          Bob’s Corn 🌽
        </Link>

        <nav className="flex items-center gap-3">
          {!user && (
            <Link
              to="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Home
            </Link>
          )}
          {user && (
            <Link
              to="/app"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user && (
            <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline mr-5 ml-5">
              {user.name}
            </span>
          )}
          <button
            onClick={toggle}
            className="btn btn-secondary h-9 w-9 p-0"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {dark ? '🌙' : '☀️'}
          </button>
          {user ? (
            <button className="btn btn-primary h-9" onClick={() => logout()}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/signin" className="btn btn-secondary h-9">
                LogIn
              </Link>
              <Link to="/signup" className="btn btn-primary h-9">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
