export default function App() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-stone-50">
      <h1 className="text-4xl font-semibold text-emerald-700 md:text-5xl">
        Возрождение
      </h1>
      <p className="text-stone-600">Кабинет массажа · сайт в разработке</p>
      <button className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">
        Записаться
      </button>
    </main>
  );
}
