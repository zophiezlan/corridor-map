import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FINANCIAL_YEAR_LABEL } from "../calc/constants";
import { ThemeToggle } from "./ThemeToggle";

function BrandMark() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <path d="M3 14 L8 9 L12 12 L17 6" />
        <circle cx="8" cy="9" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm transition-colors",
    isActive
      ? "text-stone-900 font-medium dark:text-stone-100"
      : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100",
  ].join(" ");

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="border-b border-stone-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-stone-800 dark:bg-stone-950/80 dark:supports-[backdrop-filter]:bg-stone-950/70">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight text-stone-900 dark:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 rounded-sm"
            aria-label="Corridor Map — home"
          >
            <BrandMark />
            <span className="text-[15px] leading-none">Corridor Map</span>
            <span
              className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400 ml-1 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700"
              aria-label={`Financial year ${FINANCIAL_YEAR_LABEL}`}
            >
              {FINANCIAL_YEAR_LABEL}
            </span>
          </Link>
          <nav className="flex items-center gap-5" aria-label="Primary">
            {!isHome && (
              <NavLink to="/inputs" className={navLinkClass}>
                Inputs
              </NavLink>
            )}
            {!isHome && (
              <NavLink to="/map" className={navLinkClass}>
                Map
              </NavLink>
            )}
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 focus:outline-none"
      >
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-6 py-6 text-xs text-stone-500 dark:text-stone-400 leading-relaxed grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="space-y-1.5">
            <p>
              <span className="font-medium text-stone-700 dark:text-stone-200">
                Not financial advice.
              </span>{" "}
              Tax rules change annually; numbers shown are for{" "}
              {FINANCIAL_YEAR_LABEL}. Verify with a qualified professional
              before acting on any figure here.
            </p>
            <p>
              All calculations run locally in your browser — nothing is sent
              anywhere, nothing is stored on a server.
            </p>
          </div>
          <div className="sm:text-right sm:pl-6 sm:border-l sm:border-stone-200 dark:sm:border-stone-800 space-y-1">
            <p className="font-mono uppercase tracking-[0.12em] text-[10px] text-stone-400 dark:text-stone-500">
              Corridor Map · v1
            </p>
            <p>
              <Link
                to="/about"
                className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700"
              >
                About &amp; methodology
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
