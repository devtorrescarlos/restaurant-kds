import { ActivityIcon, CirclePauseIcon, UsersIcon } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { ManagersTable } from "@/features/admin/components/managers-table";
import { getManagers, getManagerStats } from "@/features/admin/services/managers.service";
import { getManagerSchema } from "@/features/admin/validations/manager.schema";

export const dynamic = "force-dynamic";

export default async function ManagersSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }>;
}) {
  const params = getManagerSchema.parse(await searchParams);

  const [managers, stats] = await Promise.all([
    getManagers({
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
    }),
    getManagerStats(),
  ]);

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
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Gerentes registrados"
          value={stats.total}
          icon={UsersIcon}
        />
        <StatCard
          label="En servicio"
          value={stats.approved}
          icon={ActivityIcon}
        />
        <StatCard
          label="En pausa"
          value={stats.pending + stats.suspended}
          icon={CirclePauseIcon}
        />
      </section>

      <ManagersTable
        initialData={managers.data}
        initialTotal={managers.pagination.total}
        initialTotalPages={managers.pagination.totalPages}
        initialPage={params.page}
        limit={params.limit}
        initialSearch={params.search ?? ""}
        initialStatus={params.status}
      />
    </div>
  );
}
