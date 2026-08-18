import { ActivityIcon, CirclePauseIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";

import { ManagersTable } from "@/features/admin/components/managers-table";

const MANAGER_COUNT = 12;
const ACTIVE_COUNT = 8;
const STANDBY_COUNT = 2;

export function ManagersPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Gerentes
          </h1>
          <p className="text-sm text-muted-foreground lg:text-base">
            Equipo de gestión de las organizaciones del sistema
          </p>
        </div>
        <Button
          size="lg"
          className="bg-brand-primary text-white hover:bg-brand-primary/80 cursor-pointer"
        >
          <UserPlusIcon />
          Agregar gerente
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Gerentes registrados"
          value={MANAGER_COUNT}
          icon={UsersIcon}
        />
        <StatCard
          label="En servicio"
          value={ACTIVE_COUNT}
          icon={ActivityIcon}
        />
        <StatCard
          label="En pausa"
          value={STANDBY_COUNT}
          icon={CirclePauseIcon}
        />
      </section>

      <ManagersTable />
    </div>
  );
}
