import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b-[length:var(--outline)] border-solid border-line-strong bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-token-4 px-token-4 py-token-4">
          <Link to="/" className="text-h3 text-fg no-underline">
            🛒 SwapMeet
          </Link>
          <nav className="flex items-center gap-token-3">
            <Link
              to="/sell"
              className="rounded-token-md bg-primary px-token-4 py-token-2 text-button text-on-primary no-underline"
            >
              Sell something
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-token-4 py-token-6">
        <Outlet />
      </main>
    </div>
  );
}
