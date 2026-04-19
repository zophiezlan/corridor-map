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
            <p>
              <a
                href="https://github.com/zophiezlan/corridor-map"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 rounded-sm"
                aria-label="Corridor Map source on GitHub (opens in new tab)"
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                <span>Source on GitHub</span>
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
