import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { AppShell } from "@/components/app-shell";
import { Brain, MessageSquare, ArrowUpRight, Users } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { getAiMetrics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ia-performance")({
  head: () => ({ meta: [{ title: "IA Performance — Rinoberto" }] }),
  component: IaPerformancePage,
});

function IaPerformancePage() {
  const m = getAiMetrics();
  const max = Math.max(...m.heatmap.flat());

  return (
    <AppShell
      title="IA Performance"
      breadcrumb="Analítica de Rinoberto"
      description="Métricas de desempeño cognitivo, calidad de respuesta y tópicos de Rinoberto."
    >
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Interacciones totales" value={m.interacciones.toLocaleString()} icon={MessageSquare} />
        <Stat label="Precisión de intención" value={`${m.intencionAccuracy}%`} icon={Brain} tone="brand" />
        <Stat label="Calidad de respuesta" value={`${m.calidadRespuesta}/5`} icon={ArrowUpRight} tone="success" />
        <Stat label="Tasa de escalación" value={`${m.escalacion}%`} icon={Users} />
        <Stat label="Intervención humana" value={`${m.intervencion}%`} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top preguntas */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Preguntas más frecuentes</h2>
          <p className="text-xs text-muted-foreground mb-4">Intents detectados con mayor recurrencia</p>
          <div className="space-y-3">
            {m.topPreguntas.map((p, i) => {
              const pct = (p.veces / m.topPreguntas[0].veces) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="truncate pr-2">{p.pregunta}</span>
                    <span className="font-mono text-muted-foreground shrink-0">{p.veces.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topics */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Tópicos principales</h2>
          <p className="text-xs text-muted-foreground mb-4">Clusterización de conversaciones</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={m.topicos} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 40]} tick={false} />
              <RadialBar background dataKey="peso" cornerRadius={4} fill="var(--chart-1)" />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {m.topicos.map((t) => (
              <div key={t.topico} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.topico}</span>
                <span className="font-mono">{t.peso}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
        <h2 className="text-sm font-semibold">Mapa de calor — Actividad por hora</h2>
        <p className="text-xs text-muted-foreground mb-4">Volumen de mensajes procesados por Rinoberto (últimos 7 días)</p>
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 text-[9px]">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center text-muted-foreground">{h}</div>
            ))}
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, di) => (
              <Fragment key={d}>
                <div className="flex items-center text-muted-foreground">{d}</div>
                {m.heatmap[di].map((v, hi) => {
                  const intensity = v / max;
                  return (
                    <div
                      key={`${di}-${hi}`}
                      className="h-5 rounded-sm border border-border/40"
                      style={{ background: `color-mix(in oklch, var(--brand) ${intensity * 100}%, transparent)` }}
                      title={`${v} mensajes`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
            <span>Bajo</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 1].map((a) => (
                <div key={a} className="size-3 rounded-sm" style={{ background: `color-mix(in oklch, var(--brand) ${a * 100}%, transparent)` }} />
              ))}
            </div>
            <span>Alto</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Brain; tone?: "brand" | "success" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className={cn("size-3.5", tone === "brand" ? "text-brand" : tone === "success" ? "text-success" : "text-muted-foreground")} />
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
