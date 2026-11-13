import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const server = setupServer(
  // ответ по умолчанию: «всё хорошо»
  http.get("*/api/v1/health", () =>
    HttpResponse.json({ status: "ok", db: "ok", version: "test" }),
  ),
);
