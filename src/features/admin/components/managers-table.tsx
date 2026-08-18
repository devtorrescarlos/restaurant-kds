import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/getInitials";

const STATUS_FILTERS = ["Todos", "En servicio", "En pausa", "Suspendidos"];

const MANAGERS = [
  {
    id: "1",
    name: "Jorge Sosa",
    email: "jorge.sosa@elfogon.com",
    organization: "Restaurante El Fogón",
    status: "active",
    orders: 128,
    joinedAt: "12 mar 2025",
  },
  {
    id: "2",
    name: "María Fernández",
    email: "maria.fernandez@plaza.com",
    organization: "Café de la Plaza",
    status: "active",
    orders: 94,
    joinedAt: "28 ene 2025",
  },
  {
    id: "3",
    name: "Kenji Tanaka",
    email: "kenji.tanaka@nikkei.com",
    organization: "Sushi Nikkei House",
    status: "active",
    orders: 76,
    joinedAt: "04 feb 2025",
  },
  {
    id: "4",
    name: "Luciana Rossi",
    email: "luciana.rossi@luigi.com",
    organization: "Pizzería Don Luigi",
    status: "standby",
    orders: 53,
    joinedAt: "19 nov 2024",
  },
  {
    id: "5",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@cerveceria7.com",
    organization: "Cervecería Artesanal 7",
    status: "active",
    orders: 41,
    joinedAt: "07 jul 2025",
  },
  {
    id: "6",
    name: "Ana Beltrán",
    email: "ana.beltran@mariscos.com",
    organization: "Mariscos La Perla",
    status: "suspended",
    orders: 22,
    joinedAt: "30 sep 2024",
  },
];

const STATUS_META = {
  active: { variant: "active", label: "En servicio" },
  standby: { variant: "standby", label: "En pausa" },
  suspended: { variant: "suspended", label: "Suspendido" },
} as const;

type ManagerStatus = keyof typeof STATUS_META;

function getStatusVariant(status: string) {
  return STATUS_META[status as ManagerStatus] ?? STATUS_META.active;
}

export function ManagersTable() {
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
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_FILTERS.map((filter, index) => {
            const isActive = index === 0;
            return (
              <Button
                key={filter}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "cursor-pointer",
                  isActive &&
                    "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15",
                )}
              >
                {filter}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium tracking-wide text-muted-foreground">
              <th className="py-2.5 pr-4 font-medium">Gerente</th>
              <th className="py-2.5 pr-4 font-medium">Organización</th>
              <th className="py-2.5 pr-4 font-medium">Estado</th>
              <th className="py-2.5 pr-4 text-right font-medium">
                Órdenes atendidas
              </th>
              <th className="py-2.5 pr-4 font-medium">Ingreso</th>
              <th className="py-2.5 font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {MANAGERS.map((manager) => {
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
                          manager.status === "suspended"
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
                            manager.status === "suspended" &&
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
                    <p className="truncate text-sm">{manager.organization}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge
                      variant={variant}
                      label={label}
                      live={manager.status === "active"}
                    />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary">
                      {manager.orders}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {manager.joinedAt}
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">1–6</span> de{" "}
          <span className="font-medium text-foreground">12</span> gerentes
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="cursor-pointer"
            aria-label="Página anterior"
            disabled
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="cursor-pointer"
            aria-label="Página siguiente"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
