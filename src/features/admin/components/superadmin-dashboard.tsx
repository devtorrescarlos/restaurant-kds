import {
  Building2Icon,
  StoreIcon,
  UserPlusIcon,
  UsersIcon,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { TopOrganizations } from "@/features/admin/components/top-organizations";
import Link from "next/link";

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
          <Link
            href={"/admin/managers"}
            className="bg-brand-primary text-white hover:bg-brand-primary/80 cursor-pointer px-2  flex items-center gap-2 rounded-md"
          >
            <UserPlusIcon size={16} />
            Ver gerentes
          </Link>
          <Button
            size="lg"
            className="bg-brand-secondary text-white hover:bg-brand-secondary/80 cursor-pointer"
          >
            <Building2Icon />
            Ver organizaciones
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

        <StatCard
          label="Managers pendientes por aprobación"
          value={ORGANIZATION_COUNT}
          icon={Clock}
        />
      </section>

      <TopOrganizations />
    </div>
  );
}
