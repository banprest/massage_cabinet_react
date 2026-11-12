import { NavLink, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-dvh bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <nav className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
          <NavLink
            to="/"
            end
            className="mr-auto font-semibold text-emerald-800 hover:text-emerald-900"
          >
            Возрождение
          </NavLink>
          <NavLink
            to="/status"
            className={({ isActive }) =>
              `hover:text-emerald-900 ${isActive ? "font-semibold text-emerald-800" : "text-stone-600"}`
            }
          >
            Статус
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
