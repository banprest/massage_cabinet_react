import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import App from "./App";

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  it("shows the studio name on the home page", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: /Возрождение/ }),
    ).toBeInTheDocument();
  });

  it("shows the status on the status page", () => {
    renderAt("/status");
    expect(
      screen.getByRole("heading", { name: /Статус системы/ }),
    ).toBeInTheDocument();
  });

  it("shows the not found on the not found page", () => {
    renderAt("/not_found");
    expect(
      screen.getByRole("heading", { name: /Страница не найдена/ }),
    ).toBeInTheDocument();
  });
});
