import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section className={cn("rounded-xl border bg-card p-4 shadow-sm lg:p-6", className)}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-0.5">
          <h2 className="text-base font-semibold tracking-tight lg:text-lg">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
