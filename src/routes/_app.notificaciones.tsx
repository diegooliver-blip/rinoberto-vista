import { createFileRoute } from "@tanstack/react-router";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notificaciones")({
  head: () => ({ meta: [{ title: "Notificaciones — Rinoberto" }] }),
  component: NotificacionesPage,
});

const ICON = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TONE = {
  critical: "text-destructive bg-destructive/10 border-destructive/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  info: "text-info bg-info/10 border-info/20",
};

function NotificacionesPage() {
  const ns = getNotifications();
  return (
    <AppShell
      title="Centro de Notificaciones"
      breadcrumb="Alertas del Sistema"
      description="Eventos críticos, advertencias e informativos del ecosistema Rinoberto."
      actions={
        <Button variant="outline" size="sm" className="gap-1.5">
          <CheckCheck className="size-3.5" /> Marcar todo como leído
        </Button>
      }
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {ns.map((n) => {
            const Icon = ICON[n.tipo];
            return (
              <div key={n.id} className={cn("flex items-start gap-4 p-5 transition-colors", !n.leido && "bg-muted/20")}>
                <div className={cn("grid size-9 shrink-0 place-items-center rounded-lg border", TONE[n.tipo])}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{n.titulo}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.hora}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{n.mensaje}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded",
                      n.tipo === "critical" && "text-destructive bg-destructive/10",
                      n.tipo === "warning" && "text-warning bg-warning/10",
                      n.tipo === "info" && "text-info bg-info/10",
                    )}>{n.tipo === "critical" ? "Crítico" : n.tipo === "warning" ? "Advertencia" : "Informativo"}</span>
                    {!n.leido && <span className="text-[10px] text-brand font-medium">Sin leer</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {ns.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Bell className="size-8 mx-auto mb-2 opacity-40" />
            No hay notificaciones.
          </div>
        )}
      </div>
    </AppShell>
  );
}
