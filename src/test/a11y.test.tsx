/* @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { axe } from "vitest-axe";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});
import { Home } from "../routes/Home";
import { Inputs } from "../routes/Inputs";
import { Map } from "../routes/Map";
import { NotFound } from "../routes/NotFound";
import { Layout } from "../components/Layout";
import { InputsProvider } from "../state/InputsContext";

function renderAt(path: string, element: React.ReactElement) {
  return render(
    <InputsProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route path={path} element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </InputsProvider>,
  );
}

describe("Accessibility (axe)", () => {
  it("Home has no violations", async () => {
    const { container } = renderAt("/", <Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Inputs has no violations", async () => {
    const { container } = renderAt("/inputs", <Inputs />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("404 has no violations", async () => {
    const { container } = renderAt("/nope", <NotFound />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Map has no violations with inputs filled", async () => {
    sessionStorage.setItem(
      "corridor-map.inputs.v1",
      JSON.stringify({ grossAnnualSalary: 110_000, employerType: "PBI" }),
    );
    const { container } = renderAt("/map", <Map />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
