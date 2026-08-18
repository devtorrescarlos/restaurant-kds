import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        active:
          "border-brand-primary/20 bg-brand-primary/10 text-brand-primary",
        pending: "border-amber-500/30 bg-amber-500/10 text-amber-700",
        suspended: "border-slate-400/30 bg-slate-400/10 text-slate-500",
      },
    },
    defaultVariants: {
      variant: "active",
    },
  },
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label: string;
  live?: boolean;
  className?: string;
}

export function StatusBadge({
  variant,
  label,
  live = false,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      <span className="relative flex size-2">
        {live ? (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />
        ) : null}
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      {label}
    </span>
  );
}
