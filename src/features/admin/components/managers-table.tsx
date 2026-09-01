"use client";
import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/getInitials";
import { useManagers } from "../hooks/use-managers";
import { useDebounce } from "@/hooks/use-debounce";
import { UserStatus } from "@/generated/prisma/enums";
import { GetManager } from "../validations/manager.schema";
import Pagination from "@/components/shared/pagination";

const STATUS_FILTERS: { label: string; value: UserStatus | undefined }[] = [
  { label: "Todos", value: undefined },
  { label: "En servicio", value: UserStatus.APPROVED },
  { label: "Pendiente", value: UserStatus.PENDING },
  { label: "Suspendidos", value: UserStatus.SUSPENDED },
];

const STATUS_META = {
  APPROVED: { variant: "active", label: "En servicio" },
  PENDING: { variant: "pending", label: "Pendiente" },
  SUSPENDED: { variant: "suspended", label: "Suspendido" },
} as const;

type ManagerStatus = keyof typeof STATUS_META;

function getStatusVariant(status: string) {
  return STATUS_META[status as ManagerStatus] ?? STATUS_META.APPROVED;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

type ManagersTableProps = {
  initialData: GetManager[];
  initialTotal: number;
  initialTotalPages: number;
  initialPage: number;
  limit: number;
  initialSearch: string;
  initialStatus: UserStatus | undefined;
};

export function ManagersTable({
  initialData,
  initialTotal,
  initialTotalPages,
  initialPage,
  limit,
  initialSearch,
  initialStatus,
}: ManagersTableProps) {
  const {
    data,
    total,
    totalPages,
    page: currentPage,
    status,
    setSearch,
    setStatus,
    setPage,
    clearFilters,
    isPending,
    isEmpty,
  } = useManagers({
    initialData,
    initialTotal,
    initialTotalPages,
    initialPage,
    limit,
    initialSearch,
    initialStatus,
  });

  const [input, setInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(input);

  useEffect(() => {
    if (debouncedSearch === initialSearch) return;
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch, initialSearch]);
  return (
    <SectionCard
      title="Directorio de gerentes"
      description="Consulta y administra las cuentas de los gerentes por organización"
    >
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, correo u organización"
            className="pl-8"
            aria-label="Buscar gerente"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_FILTERS.map((filter) => {
            const isActive = status === filter.value;
            return (
              <Button
                key={filter.label}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatus(filter.value)}
                className={cn(
                  "cursor-pointer",
                  isActive &&
                    "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15",
                )}
              >
                {filter.label}
              </Button>
            );
          })}

          <Button
            className={cn(
              "cursor-pointer",
              "bg-red-500/10 text-red-500 hover:bg-red-500/15",
            )}
            onClick={() => {
              setInput("");
              clearFilters();
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <table className="w-full min-w-180 border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium tracking-wide text-muted-foreground">
              <th className="py-2.5 pr-4 font-medium">Gerente</th>
              <th className="py-2.5 pr-4 font-medium">Organización</th>
              <th className="py-2.5 pr-4 font-medium">Estado</th>
              <th className="py-2.5 pr-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 shrink-0 rounded-lg" />
                      <div className="grid min-w-0 gap-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-3 pr-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="py-3">
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </td>
                </tr>
              ))
            ) : isEmpty ? (
              <tr className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-muted/50">
                <td className="py-3 text-center" colSpan={4}>
                  Aún no hay gerentes registrados
                </td>
              </tr>
            ) : (
              data.map((manager) => {
                const { variant, label } = getStatusVariant(manager.status);
                return (
                  <tr
                    key={manager.id}
                    className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                            manager.status === "SUSPENDED"
                              ? "bg-slate-400/10 text-slate-500"
                              : "bg-brand-primary/10 text-brand-primary",
                          )}
                        >
                          {getInitials(manager.name)}
                        </div>
                        <div className="grid min-w-0 gap-0.5">
                          <p
                            className={cn(
                              "truncate text-sm font-medium",
                              manager.status === "SUSPENDED" &&
                                "text-muted-foreground",
                            )}
                          >
                            {manager.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {manager.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="truncate text-sm">
                        {manager.organization?.name}
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge
                        variant={variant}
                        label={label}
                        live={manager.status === "APPROVED"}
                      />
                    </td>
                    <td className="py-3">
                      {manager.status === "APPROVED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                        >
                          Suspender
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-brand-primary text-white hover:bg-brand-primary/80 cursor-pointer"
                        >
                          Activar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando{" "}
          <span className="font-medium text-foreground">1–{data.length}</span>{" "}
          de <span className="font-medium text-foreground">{total}</span>{" "}
          gerentes
        </p>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </SectionCard>
  );
}
