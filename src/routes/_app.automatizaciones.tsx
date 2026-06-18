import { createFileRoute } from "@tanstack/react-router";
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getWorkflows } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/automatizaciones")({
  head: () => ({ meta: [{ title: "Automatizaciones n8n — Rinoberto" }] }),
  component: AutomatizacionesPage,
});

function AutomatizacionesPage() {
  const workflows = getWorkflows();
  const activos = workflows.filter((w) => w.estado === "activo").length;
  const errores = workflows.filter((w) => w.estado === "error").length;
  const totalEjec = workflows.reduce((s, w) => s + w.ejecuciones24h, 0);
  const exitoProm = workflows.filter((w) => w.exito > 0).reduce((s, w) => s + w.exito, 0) / workflows.filter((w) => w.exito > 0).length;

  return (
    <AppShell
      title="Centro de Automatizaciones"
      breadcrumb="Monitoreo n8n"
      description="Visualización en tiempo real del ecosistema n8n: workflows activos, ejecuciones, fallas y latencia."
      actions={
        <Button variant="outline" size="sm" className="gap-1.5">
          <RefreshCw className="size-3.5" /> Sincronizar
        </Button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SystemStat icon={CheckCircle2} label="Workflows activos" value={`${activos}/${workflows.length}`} tone="success" />
        <SystemStat icon={Activity} label="Ejecuciones 24h" value={totalEjec.toLocaleString()} tone="info" />
        <SystemStat icon={AlertTriangle} label="Errores activos" value={errores.toString()} tone={errores > 0 ? "destructive" : "muted"} />
        <SystemStat icon={CheckCircle2} label="Tasa de éxito" value={`${exitoProm.toFixed(1)}%`} tone="brand" />
      </div>

      {/* Workflow cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {workflows.map((w) => (
          <div key={w.id} className="rounded-xl border border-border bg-card p-5 hover:border-brand/30 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{w.nombre}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{w.id} · {w.fuente}</p>
              </div>
              <StatusBadge status={w.estado} />
            </div>

            <div className="grid grid-cols-3 gap-2 my-4">
              <Metric label="Ejec. 24h" value={w.ejecuciones24h.toLocaleString()} />
              <Metric label="Éxito" value={`${w.exito.toFixed(1)}%`} />
              <Metric label="Latencia" value={`${w.latenciaMs}ms`} />
            </div>

            {/* Health bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Salud del flujo</span>
                <span className="font-mono">{w.exito.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn(
                  "h-full transition-all",
                  w.exito >= 99 ? "bg-success" : w.exito >= 90 ? "bg-warning" : "bg-destructive"
                )} style={{ width: `${w.exito || 5}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-[10px] text-muted-foreground">Última: {w.ultimaEjecucion}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="size-7">
                  {w.estado === "inactivo" ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="size-7"><RefreshCw className="size-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 p-2">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold font-mono mt-0.5">{value}</p>
    </div>
  );
}

function SystemStat({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone: "success" | "destructive" | "info" | "brand" | "muted" }) {
  const toneMap = {
    success: "text-success bg-success/10",
    destructive: "text-destructive bg-destructive/10",
    info: "text-info bg-info/10",
    brand: "text-brand bg-brand-muted",
    muted: "text-muted-foreground bg-muted",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={cn("grid size-9 place-items-center rounded-lg", toneMap[tone])}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
