import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { KpiCard as KpiCardType } from "@/lib/mock-data";

export function KpiCard({ kpi }: { kpi: KpiCardType }) {
  const Icon = kpi.delta > 0 ? ArrowUpRight : kpi.delta < 0 ? ArrowDownRight : Minus;
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/30">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {kpi.label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight text-card-foreground">{kpi.value}</p>
        {kpi.delta !== 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold",
              kpi.tone === "positive" && "bg-success/10 text-success",
              kpi.tone === "negative" && "bg-destructive/10 text-destructive",
              kpi.tone === "neutral" && "bg-muted text-muted-foreground",
              kpi.tone === "brand" && "bg-brand-muted text-brand"
            )}
          >
            <Icon className="size-3" />
            {kpi.delta > 0 ? "+" : ""}{kpi.delta}%
          </span>
        )}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">{kpi.helper}</p>
    </div>
  );
}
