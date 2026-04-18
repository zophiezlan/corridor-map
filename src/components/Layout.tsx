import { Link, Outlet, useLocation } from 'react-router-dom';
import { FINANCIAL_YEAR_LABEL } from '../calc/constants';

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg tracking-tight">
            Corridor Map
          </Link>
          <nav className="text-sm text-stone-600 flex gap-4" aria-label="Primary">
            {!isHome && <Link to="/inputs" className="hover:text-stone-900">Inputs</Link>}
            {!isHome && <Link to="/map" className="hover:text-stone-900">Map</Link>}
            <Link to="/about" className="hover:text-stone-900">About</Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 focus:outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-xs text-stone-500 leading-relaxed">
          <p>
            Not financial advice. Tax rules change annually; numbers shown are for {FINANCIAL_YEAR_LABEL}.
            Always verify with a qualified professional before acting on any number here.
          </p>
          <p className="mt-1">
            All calculations run locally in your browser. No data is sent anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
