// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

vi.mock("@/features/admin/actions/auth.action", () => ({
  login: vi.fn(),
  logout: vi.fn(),
}));

const mockRouter = vi.hoisted(() => ({ value: "/admin" }));
vi.mock("next/navigation", () => ({
  usePathname: () => mockRouter.value,
}));

describe("AppSidebar", () => {
  it("AppSidebar should render", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );

    expect(screen.getByText("Panel de administración")).toBeDefined();
  });

  it("should highlight active link", () => {
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
