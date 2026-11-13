import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderAt } from "@/test/renderAt";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";

describe("StatusPage", () => {
  it("shows API and DB as ok", async () => {
    renderAt("/status");

    expect(await screen.findByText("DB: ok")).toBeInTheDocument();
    expect(screen.getByText("API: ok")).toBeInTheDocument();
  });
  it("shows DB error when database is down", async () => {
    server.use(
      http.get("*/api/v1/health", () =>
        HttpResponse.json(
          { status: "error", db: "error", version: "test" },
          { status: 503 },
        ),
      ),
    );
    renderAt("/status");
    expect(await screen.findByText("DB: error")).toBeInTheDocument();
    expect(screen.getByText("API: ok")).toBeInTheDocument();
  });

  it("shows an error when API is unavailable", async () => {
    server.use(
      http.get(
        "*/api/v1/health",
        () => new HttpResponse(null, { status: 502 }),
      ),
    );
    renderAt("/status");
    expect(await screen.findByText(/502/)).toBeInTheDocument();
  });
});
