import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/mock-data";

const MAP: Record<LeadStatus | string, string> = {
  "Nuevo Lead": "bg-brand/10 text-brand",
  "Contactado": "bg-info/10 text-info",
  "Calificado": "bg-muted text-foreground",
  "Cita Agendada": "bg-warning/15 text-[color:var(--warning-foreground)] dark:text-warning",
  "Cerrado Ganado": "bg-success/10 text-success",
  "Cerrado Perdido": "bg-destructive/10 text-destructive",
  "activo": "bg-success/10 text-success",
  "advertencia": "bg-warning/15 text-warning",
  "error": "bg-destructive/10 text-destructive",
  "inactivo": "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = MAP[status] ?? "bg-muted text-muted-foreground";
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
      cls,
    )}>
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
