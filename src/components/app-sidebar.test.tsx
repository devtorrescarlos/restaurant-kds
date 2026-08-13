import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

afterEach(cleanup);

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

const mockRouter = vi.hoisted(() => ({ value: "/admin" }));
vi.mock("next/navigation", () => ({
  usePathname: () => mockRouter.value,
}));

describe("AppSidebar", () => {
  test("AppSidebar should render", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );

    expect(screen.getByText("Panel de administración")).toBeDefined();
  });

  test("should highlight active link", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );

    expect(
      screen
        .getByRole("link", { name: "Dashboard" })
        .getAttribute("data-active"),
    ).not.toBeNull();

    expect(
      screen
        .getByRole("link", { name: "Gerentes" })
        .getAttribute("data-active"),
    ).toBeNull();
  });
});
