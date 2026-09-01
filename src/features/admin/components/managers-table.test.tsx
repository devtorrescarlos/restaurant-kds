// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { ManagersTable } from "./managers-table";
import { useManagers } from "../hooks/use-managers";
import { mockManagers, mockManagersProps } from "../managers.fixtures";
import { UserStatus } from "@/generated/prisma/enums";

vi.mock("../hooks/use-managers", () => ({
  useManagers: vi.fn(),
}));

const mockUseManagers = vi.mocked(useManagers);

const defaultHookValue = {
  data: mockManagers,
  total: mockManagers.length,
  totalPages: 1,
  page: 1,
  search: "",
  status: undefined,
  limit: 10,
  setSearch: vi.fn(),
  setStatus: vi.fn(),
  setPage: vi.fn(),
  clearFilters: vi.fn(),
  isPending: false,
  error: null,
  isEmpty: false,
};

const defaultProps = {
  ...mockManagersProps,
};

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

  mockUseManagers.mockReturnValue({ ...defaultHookValue });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  cleanup();
  vi.clearAllMocks();
});

const renderTable = () => render(<ManagersTable {...defaultProps} />);

describe("ManagersTable", () => {
  it("renders managers table with data", () => {
    renderTable();

    expect(screen.getByText("Juan Carlos")).toBeDefined();
    expect(screen.getByText("María Pérez")).toBeDefined();
    expect(screen.getByText("juan@test.com")).toBeDefined();
  });

  it("renders initials and organization for each manager", () => {
    renderTable();

    const rows = screen.getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("JC")).toBeDefined();
    expect(within(rows[1]).getByText("MP")).toBeDefined();
    expect(within(rows[0]).getByText("Restaurante El Fogón")).toBeDefined();
    expect(within(rows[1]).getByText("Café de la Plaza")).toBeDefined();
  });

  it("shows skeleton rows while loading", () => {
    mockUseManagers.mockReturnValue({ ...defaultHookValue, isPending: true });

    renderTable();

    expect(document.querySelectorAll("tbody tr").length).toBe(6);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText("Juan Carlos")).toBeNull();
  });

  it("shows empty state message when there are no managers", () => {
    mockUseManagers.mockReturnValue({
      ...defaultHookValue,
      data: [],
      total: 0,
      isEmpty: true,
    });

    renderTable();

    expect(screen.getByText("Aún no hay gerentes registrados")).toBeDefined();
    expect(screen.queryByText("Juan Carlos")).toBeNull();
  });

  it("calls setStatus with the right value for each filter button", () => {
    const { setStatus } = defaultHookValue;

    renderTable();

    fireEvent.click(screen.getByRole("button", { name: "En servicio" }));
    expect(setStatus).toHaveBeenCalledWith(UserStatus.APPROVED);

    fireEvent.click(screen.getByRole("button", { name: "Pendiente" }));
    expect(setStatus).toHaveBeenCalledWith(UserStatus.PENDING);

    fireEvent.click(screen.getByRole("button", { name: "Suspendidos" }));
    expect(setStatus).toHaveBeenCalledWith(UserStatus.SUSPENDED);

    fireEvent.click(screen.getByRole("button", { name: "Todos" }));
    expect(setStatus).toHaveBeenCalledWith(undefined);
  });

  it("marks the active filter button with the active style", () => {
    mockUseManagers.mockReturnValue({
      ...defaultHookValue,
      status: UserStatus.APPROVED,
    });

    renderTable();

    const active = screen.getByRole("button", { name: "En servicio" });
    expect(active.className).toContain("bg-brand-primary/10");

    const others = [
      screen.getByRole("button", { name: "Pendiente" }),
      screen.getByRole("button", { name: "Suspendidos" }),
      screen.getByRole("button", { name: "Todos" }),
    ];
    others.forEach((button) => {
      expect(button.className).not.toContain("bg-brand-primary/10");
    });
  });

  it("does not trigger setSearch before the debounce elapses", () => {
    vi.useFakeTimers();
    const { setSearch } = defaultHookValue;

    renderTable();

    fireEvent.change(screen.getByLabelText("Buscar gerente"), {
      target: { value: "Juan" },
    });

    expect(setSearch).not.toHaveBeenCalled();
  });

  it("triggers setSearch with the input value after debounce", () => {
    vi.useFakeTimers();
    const { setSearch } = defaultHookValue;

    renderTable();

    fireEvent.change(screen.getByLabelText("Buscar gerente"), {
      target: { value: "Juan" },
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(setSearch).toHaveBeenCalledWith("Juan");
  });

  it("clears filters and resets the search input", () => {
    const { clearFilters } = defaultHookValue;

    renderTable();

    const input = screen.getByLabelText("Buscar gerente");
    fireEvent.change(input, { target: { value: "Juan" } });

    fireEvent.click(screen.getByRole("button", { name: "Limpiar Filtros" }));

    expect(clearFilters).toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("renders the correct status badge for each manager status", () => {
    const suspendedManager = {
      ...mockManagers[0],
      id: "660e8400-e29b-41d4-a716-446655440002",
      name: "Carlos Ruiz",
      email: "carlos@test.com",
      status: UserStatus.SUSPENDED,
    };
    mockUseManagers.mockReturnValue({
      ...defaultHookValue,
      data: [...mockManagers, suspendedManager],
      total: 3,
      isEmpty: false,
    });

    renderTable();

    const rows = screen.getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("En servicio")).toBeDefined();
    expect(within(rows[1]).getByText("Pendiente")).toBeDefined();
    expect(within(rows[2]).getByText("Suspendido")).toBeDefined();
  });

  it("renders the right action button per status", () => {
    const suspendedManager = {
      ...mockManagers[0],
      id: "660e8400-e29b-41d4-a716-446655440002",
      name: "Carlos Ruiz",
      email: "carlos@test.com",
      status: UserStatus.SUSPENDED,
    };
    mockUseManagers.mockReturnValue({
      ...defaultHookValue,
      data: [...mockManagers, suspendedManager],
      total: 3,
      isEmpty: false,
    });

    renderTable();

    const rows = screen.getAllByRole("row").slice(1);

    expect(
      within(rows[0]).getByRole("button", { name: "Suspender" }),
    ).toBeDefined();
    expect(
      within(rows[1]).getByRole("button", { name: "Activar" }),
    ).toBeDefined();
    expect(
      within(rows[2]).getByRole("button", { name: "Activar" }),
    ).toBeDefined();
  });

  it("calls setPage when using pagination arrows and disables them on boundary pages", () => {
    mockUseManagers.mockReturnValue({
      ...defaultHookValue,
      totalPages: 3,
      page: 2,
      total: 30,
    });

    renderTable();

    const prev = screen.getByRole("button", { name: "Página anterior" });
    const next = screen.getByRole("button", { name: "Página siguiente" });

    expect((prev as HTMLButtonElement).disabled).toBe(false);
    expect((next as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(next);
    expect(defaultHookValue.setPage).toHaveBeenCalledWith(3);

    fireEvent.click(prev);
    expect(defaultHookValue.setPage).toHaveBeenCalledWith(1);
  });

  it("disables both pagination arrows when there is a single page", () => {
    mockUseManagers.mockReturnValue({
      ...defaultHookValue,
      page: 1,
      totalPages: 1,
    });

    renderTable();

    expect(
      (
        screen.getByRole("button", {
          name: "Página anterior",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      (
        screen.getByRole("button", {
          name: "Página siguiente",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
