"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserStatus } from "@/generated/prisma/enums";
import { GetManagersResponse } from "@/features/admin/validations/manager.schema";

type ManagerData = GetManagersResponse["data"][number];

type UseManagersParams = {
  initialData: ManagerData[];
  initialTotal: number;
  initialTotalPages: number;
  initialPage: number;
  limit: number;
  initialSearch: string;
  initialStatus: UserStatus | undefined;
};

type FetchResponse = GetManagersResponse;

export const useManagers = ({
  initialData,
  initialTotal,
  initialTotalPages,
  initialPage,
  limit,
  initialSearch,
  initialStatus,
}: UseManagersParams) => {
  const [data, setData] = useState<ManagerData[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPageState] = useState(initialPage);
  const [search, setSearchState] = useState(initialSearch);
  const [status, setStatusState] = useState<UserStatus | undefined>(
    initialStatus,
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    setIsPending(true);
    setError(null);

    fetch(`/api/managers?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar los gerentes");
        }
        return res.json() as Promise<FetchResponse>;
      })
      .then((json) => {
        setData(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      })
      .catch((err: unknown) => {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Error al cargar los gerentes");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsPending(false);
        }
      });

    return () => controller.abort();
  }, [page, limit, search, status]);

  const setPage = useCallback((next: number) => setPageState(next), []);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPageState(1);
  }, []);

  const setStatus = useCallback((value: UserStatus | undefined) => {
    setStatusState(value);
    setPageState(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchState("");
    setStatusState(undefined);
    setPageState(1);
  }, []);

  const isEmpty = useMemo(() => data.length === 0, [data]);

  return {
    data,
    total,
    totalPages,
    page,
    search,
    status,
    limit,
    setSearch,
    setStatus,
    setPage,
    clearFilters,
    isPending,
    error,
    isEmpty,
  };
};
