import type { FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

function messageOf(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-stone-900"
    >
      <h2 className="text-lg font-semibold">Something went wrong.</h2>
      <p className="mt-2 text-sm text-stone-700">
        The calculator hit an unexpected error. Your inputs are still saved —
        you can try again, or reset them from the inputs page.
      </p>
      <pre className="mt-3 overflow-x-auto rounded bg-white p-3 text-xs text-stone-700 border border-stone-200">
        {messageOf(error)}
      </pre>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2"
        >
          Try again
        </button>
        <Link
          to="/inputs"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-2"
        >
          Back to inputs
        </Link>
      </div>
    </div>
  );
}
