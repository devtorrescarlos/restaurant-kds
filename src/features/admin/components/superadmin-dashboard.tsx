import {
  Building2Icon,
  StoreIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { TopOrganizations } from "@/features/admin/components/top-organizations";

const MANAGER_COUNT = 12;
const ORGANIZATION_COUNT = 5;

export function SuperadminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground lg:text-base">
            Resumen general del sistema
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="lg"
            className="bg-brand-primary text-white hover:bg-brand-primary/80 cursor-pointer"
          >
            <UserPlusIcon />
            Agregar gerente
          </Button>
          <Button
            size="lg"
            className="bg-brand-secondary text-white hover:bg-brand-secondary/80 cursor-pointer"
          >
            <Building2Icon />
            Crear organización
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Gerentes registrados"
          value={MANAGER_COUNT}
          icon={UsersIcon}
        />
        <StatCard
          label="Organizaciones"
          value={ORGANIZATION_COUNT}
          icon={StoreIcon}
        />
      </section>

      <TopOrganizations />
    </div>
  );
}
