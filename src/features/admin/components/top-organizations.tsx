import { CheckCircle2Icon, TrophyIcon } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";

const TOP_ORGANIZATIONS = [
  { id: "1", name: "Restaurante El Fogón", completedOrders: 128 },
  { id: "2", name: "Café de la Plaza", completedOrders: 94 },
  { id: "3", name: "Sushi Nikkei House", completedOrders: 76 },
  { id: "4", name: "Pizzería Don Luigi", completedOrders: 53 },
  { id: "5", name: "Cervecería Artesanal 7", completedOrders: 41 },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export function TopOrganizations() {
  return (
    <SectionCard
      title="Organizaciones con más órdenes completadas"
      description="Ranking de las organizaciones más activas del sistema"
      action={
        <span className="flex items-center gap-1.5 text-sm font-medium text-brand-primary">
          <TrophyIcon className="size-4" />
          Top 5
        </span>
      }
    >
      <ol className="grid gap-3">
        {TOP_ORGANIZATIONS.map((organization, index) => (
          <li
            key={organization.id}
            className="flex items-center gap-3 rounded-lg border bg-background p-3 sm:gap-4"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-primary-foreground sm:size-8">
              {index + 1}
            </span>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-sm font-semibold text-brand-primary sm:size-10">
              {getInitials(organization.name)}
            </div>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p className="truncate text-sm font-medium">{organization.name}</p>
              <p className="text-xs text-muted-foreground">Organización activa</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-primary/10 px-2.5 py-1 text-sm font-semibold text-brand-primary">
              <CheckCircle2Icon className="size-4" />
              {organization.completedOrders}
            </div>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}
