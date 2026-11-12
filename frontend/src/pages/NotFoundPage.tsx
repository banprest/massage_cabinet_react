import { Link } from "react-router";
export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-semibold text-emerald-700 md:text-5xl">
        Страница не найдена
      </h1>
      <Link to="/">На главную</Link>
    </section>
  );
}
