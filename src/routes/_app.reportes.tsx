import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getReports } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reportes")({
  head: () => ({ meta: [{ title: "Reportes — Rinoberto" }] }),
  component: ReportesPage,
});

function ReportesPage() {
  const reports = getReports();
  return (
    <AppShell
      title="Centro de Reportes"
      breadcrumb="Reportes Descargables"
      description="Genera y descarga reportes ejecutivos en múltiples formatos."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-brand-muted text-brand">
                <FileBarChart className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{r.nombre}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{r.periodicidad}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-pretty">{r.descripcion}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {r.formatos.map((f) => (
                <Button key={f} variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]">
                  <Download className="size-3" /> {f}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
