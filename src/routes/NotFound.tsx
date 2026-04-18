import { Link } from "react-router-dom";
import { useDocumentTitle } from "../components/DocumentTitle";

export function NotFound() {
  useDocumentTitle("Not found");
  return (
    <div className="max-w-xl">
      <p className="text-xs uppercase tracking-wide text-stone-500">404</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Not a corridor we recognise.
      </h1>
      <p className="mt-3 text-stone-700 leading-relaxed">
        That URL doesn't match any page. It may have been a typo, or the link
        could be from an older version of this tool.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2"
        >
          Home
        </Link>
        <Link
          to="/map"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-700/40 focus:ring-offset-2"
        >
          Your map
        </Link>
      </div>
    </div>
  );
}
