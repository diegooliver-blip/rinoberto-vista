import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { fetchKpis, fetchWorkflows, fetchTrend, fetchSourceMix, fetchFunnel, fetchConversations } from "@/lib/data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Panel de Control — Rinoberto" }] }),
  component: DashboardPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function DashboardPage() {
  const { data: kpis = [] } = useQuery({
    queryKey: ["kpis"],
    queryFn: () => fetchKpis({ data: undefined }),
  });
  const { data: trend = [] } = useQuery({
    queryKey: ["trend"],
    queryFn: () => fetchTrend({ data: undefined }),
  });
  const { data: workflows = [] } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => fetchWorkflows({ data: undefined }),
  });
  const { data: recent = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations({ data: undefined }),
  });
  const { data: mix = [] } = useQuery({
    queryKey: ["sourceMix"],
    queryFn: () => fetchSourceMix({ data: undefined }),
  });
  const { data: funnel = [] } = useQuery({
    queryKey: ["funnel"],
    queryFn: () => fetchFunnel({ data: undefined }),
  });

  const topWorkflows = workflows.slice(0, 5);

  return (
    <AppShell
      title="Panel de Control"
      breadcrumb="Resumen Ejecutivo"
      description="Monitoreo en tiempo real del ecosistema de automatización Rinoberto para SLA."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" /> Exportar reporte
          </Button>
          <Button size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="size-3.5" /> Nueva automatización
          </Button>
        </>
      }
    >
      {/* Filtros de período */}
      <div className="flex flex-wrap gap-2">
        {["Hoy", "Últimos 7 días", "Últimos 30 días", "Rango personalizado"].map((p, i) => (
          <button
            key={p}
            className={
              i === 1
                ? "rounded-md bg-card border border-border px-3 py-1 text-xs font-medium shadow-sm"
                : "rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {kpis.slice(0, 10).map((k) => <KpiCard key={k.id} kpi={k} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold">Tendencia de Interacciones</h2>
              <p className="text-xs text-muted-foreground">Conversaciones, leads y citas — últimos 7 días</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-success">
              <Activity className="size-3" /> En vivo
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="gradConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)",
                  borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)",
                }}
              />
              <Area type="monotone" dataKey="conversaciones" stroke="var(--chart-1)" strokeWidth={2} fill="url(#gradConv)" />
              <Area type="monotone" dataKey="leads" stroke="var(--chart-2)" strokeWidth={2} fill="url(#gradLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Origen de Conversaciones</h2>
          <p className="text-xs text-muted-foreground mb-4">Distribución por canal</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={mix} dataKey="valor" nameKey="fuente" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {mix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)",
                  borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-1.5">
            {mix.map((m, i) => (
              <div key={m.fuente} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-sm" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{m.fuente}</span>
                </div>
                <span className="font-medium">{m.valor}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflows + Funnel + Recientes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Workflows n8n en tiempo real</h2>
              <p className="text-xs text-muted-foreground">Estado de los flujos críticos</p>
            </div>
            <span className="text-[10px] text-muted-foreground">Actualizado hace 2s</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Workflow</th>
                  <th className="px-4 py-2.5 font-semibold">Estado</th>
                  <th className="px-4 py-2.5 font-semibold">Ejec. 24h</th>
                  <th className="px-4 py-2.5 font-semibold">Éxito</th>
                  <th className="px-4 py-2.5 font-semibold">Latencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workflows.map((w) => (
                  <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{w.nombre}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{w.id}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={w.estado} /></td>
                    <td className="px-4 py-3 text-xs font-mono">{w.ejecuciones24h.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-medium">{w.exito.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{w.latenciaMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">Embudo de Conversión</h2>
            <p className="text-xs text-muted-foreground mb-4">Pipeline de leads</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={funnel} layout="vertical" margin={{ left: 0, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="etapa" type="category" width={90} stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)", border: "1px solid var(--border)",
                    borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="valor" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Conversaciones recientes</h2>
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <div className="space-y-4">
              {recent.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-muted text-brand text-[10px] font-semibold">
                    {c.iniciales}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium truncate">{c.contacto}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{c.hora}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{c.ultimoMensaje}</p>
                    <div className="mt-1.5"><StatusBadge status={c.estado} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insight card */}
      <div className="rounded-xl border border-brand/30 bg-brand-muted/50 p-5 flex items-start gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground">
          <Activity className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Insight de Rinoberto</p>
          <p className="text-xs text-muted-foreground mt-1 text-pretty">
            Se detecta un incremento del 28% en preguntas sobre "precios empresa" este mediodía.
            Sugerencia: actualiza la base de conocimientos con la FAQ de descuentos corporativos.
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">Optimizar respuestas</Button>
      </div>
    </AppShell>
  );
}
