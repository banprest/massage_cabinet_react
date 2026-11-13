import type { ReactNode } from "react";
import { useHealth } from "@/api/useHealth";

export function StatusPage() {
  const { data, error, isPending, isError } = useHealth();

  let content: ReactNode;
  if (isPending) {
    content = <p>Проверяем…</p>;
  } else if (isError) {
    content = <p className="text-red-700">{error.message}</p>;
  } else {
    content = (
      <div className="text-emerald-700">
        <p>API: ok </p>
        <p className={data.db === "ok" ? "text-emerald-700" : "text-red-700"}>
          DB: {data.db}
        </p>
        <p className="text-sm text-gray-500">версия: {data.version}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-semibold text-emerald-700 md:text-5xl">
        Статус системы
      </h1>
      {content}
    </section>
  );
}
