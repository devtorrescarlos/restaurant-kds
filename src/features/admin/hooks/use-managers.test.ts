// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useManagers } from "./use-managers";
import { UserStatus } from "@/generated/prisma/enums";
import type { GetManager } from "../validations/manager.schema";
import { mockManagers, mockUseManagersParams as BASE_PARAMS } from "../managers.fixtures";

type FetchBody = {
  data: GetManager[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const createFetchBody = (overrides: Partial<FetchBody> = {}): FetchBody => ({
  data: mockManagers,
  total: mockManagers.length,
  page: 1,
  limit: 10,
  totalPages: 1,
  ...overrides,
});

const fetchMock = vi.fn<
  () => Promise<{
    ok: boolean;
    json: () => Promise<FetchBody>;
  }>
>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal(
    "fetch",
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createFetchBody()),
      }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useManagers", () => {
  it("should not fetch on first render", async () => {
    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {});

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockManagers);
    expect(result.current.total).toBe(mockManagers.length);
    expect(result.current.page).toBe(1);
    expect(result.current.isPending).toBe(false);
  });

  it("should refetch when page changes", async () => {
    const newPage = 2;
    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setPage(newPage);
    });

    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("page=2"),
      expect.objectContaining({ signal: expect.anything() }),
    );
    expect(result.current.page).toBe(newPage);
    expect(result.current.isPending).toBe(false);
  });

  it("should refetch when search changes", async () => {
    const newSearch = "Juan";
    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setSearch(newSearch);
    });

    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("search=Juan"),
      expect.objectContaining({ signal: expect.anything() }),
    );
    expect(result.current.search).toBe(newSearch);
    expect(result.current.page).toBe(1);
    expect(result.current.isPending).toBe(false);
  });

  it("should refetch when status changes", async () => {
    const newStatus = UserStatus.SUSPENDED;
    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setStatus(newStatus);
    });

    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("status=SUSPENDED"),
      expect.objectContaining({ signal: expect.anything() }),
    );
    expect(result.current.status).toBe(newStatus);
    expect(result.current.page).toBe(1);
    expect(result.current.isPending).toBe(false);
  });

  it("should refetch when filters are cleared without setting other parameters", async () => {
    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setSearch("juan");
      result.current.setStatus(UserStatus.SUSPENDED);
      result.current.setPage(2);
    });

    await act(async () => {});

    await act(async () => {
      result.current.clearFilters();
    });

    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/api\/managers\?page=1&limit=10$/),
      expect.objectContaining({ signal: expect.anything() }),
    );
    expect(result.current.search).toBe("");
    expect(result.current.status).toBeUndefined();
    expect(result.current.page).toBe(1);
    expect(result.current.isPending).toBe(false);
  });

  it("should update data, total and totalPages from a successful fetch", async () => {
    const updatedManagers: GetManager[] = [
      {
        id: "660e8400-e29b-41d4-a716-446655440010",
        name: "Nuevo Gerente",
        email: "nuevo@test.com",
        status: UserStatus.APPROVED,
        role: "MANAGER",
        organizationId: "org-9",
        organization: { name: "Organización Nueva" },
      },
    ];

    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            createFetchBody({
              data: updatedManagers,
              total: 1,
              totalPages: 1,
            }),
          ),
      }),
    );

    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setSearch("nuevo");
    });

    await act(async () => {});

    expect(result.current.data).toEqual(updatedManagers);
    expect(result.current.total).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isPending).toBe(false);
  });

  it("should set error when the fetch response is not ok", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Internal server error" }),
      } as never),
    );

    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setPage(2);
    });

    await act(async () => {});

    expect(result.current.error).toBe("Error al cargar los gerentes");
    expect(result.current.data).toEqual(mockManagers);
    expect(result.current.isPending).toBe(false);
  });

  it("should keep error state when the fetch rejects", async () => {
    fetchMock.mockImplementation(() =>
      Promise.reject(new Error("Network failure")),
    );

    const { result } = renderHook(() => useManagers(BASE_PARAMS));

    await act(async () => {
      result.current.setPage(2);
    });

    await act(async () => {});

    expect(result.current.error).toBe("Network failure");
    expect(result.current.data).toEqual(mockManagers);
    expect(result.current.isPending).toBe(false);
  });
});
