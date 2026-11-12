export function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-semibold text-emerald-700 md:text-5xl">
        Возрождение
      </h1>
      <p className="text-stone-600">Кабинет массажа · сайт в разработке</p>
      <button className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50">
        Записаться
      </button>
    </section>
  );
}
