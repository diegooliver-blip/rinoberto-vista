import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchLeads } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Inteligencia de Leads — Rinoberto" }] }),
  component: LeadsPage,
});

function scoreTone(score: number) {
  if (score >= 75) return "bg-success/10 text-success";
  if (score >= 50) return "bg-warning/15 text-warning";
  return "bg-destructive/10 text-destructive";
}

function LeadsPage() {
  const { data: all = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads(),
  });
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("Todas");
  const [estado, setEstado] = useState("Todos");

  const regions = ["Todas", ...Array.from(new Set(all.map((l) => l.region)))];
  const estados = ["Todos", ...Array.from(new Set(all.map((l) => l.estado)))];

  const filtered = all.filter((l) => {
    const matchQ = !q || l.nombre.toLowerCase().includes(q.toLowerCase()) || l.empresa.toLowerCase().includes(q.toLowerCase());
    const matchR = region === "Todas" || l.region === region;
    const matchE = estado === "Todos" || l.estado === estado;
    return matchQ && matchR && matchE;
  });

  const stats = {
    total: all.length,
    calificados: all.filter((l) => l.estado === "Calificado" || l.estado === "Cita Agendada").length,
    valorTotal: all.reduce((s, l) => s + l.valor, 0),
    scorePromedio: Math.round(all.reduce((s, l) => s + l.score, 0) / all.length),
  };

  return (
    <AppShell
      title="Inteligencia de Leads"
      breadcrumb="Pipeline Comercial"
      description="Scoring automático, ranking y segmentación de leads generados por Rinoberto."
      actions={
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" /> Exportar CSV
        </Button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total de leads" value={stats.total.toString()} />
        <StatCard label="Calificados" value={stats.calificados.toString()} />
        <StatCard label="Score promedio" value={`${stats.scorePromedio}/100`} />
        <StatCard label="Valor potencial" value={`$${(stats.valorTotal / 1000).toFixed(1)}K`} highlight />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar lead o empresa…" className="pl-9 h-8 text-xs" />
          </div>
          <Select value={region} onChange={setRegion} options={regions} label="Región" />
          <Select value={estado} onChange={setEstado} options={estados} label="Estado" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-2.5 font-semibold">Lead</th>
                <th className="px-4 py-2.5 font-semibold">Score</th>
                <th className="px-4 py-2.5 font-semibold">Estado</th>
                <th className="px-4 py-2.5 font-semibold">Fuente</th>
                <th className="px-4 py-2.5 font-semibold">Región</th>
                <th className="px-4 py-2.5 font-semibold">Probabilidad</th>
                <th className="px-4 py-2.5 font-semibold text-right">Valor</th>
                <th className="px-4 py-2.5 font-semibold text-right">Última act.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{l.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">{l.empresa} · {l.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold font-mono", scoreTone(l.score))}>
                      {l.score}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={l.estado} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.fuente}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.region}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${l.probabilidad}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{l.probabilidad}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-medium font-mono">${l.valor.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[10px] text-muted-foreground">{l.ultimaActividad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border p-4",
      highlight ? "border-brand/30 bg-brand-muted/40" : "border-border bg-card"
    )}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={cn("mt-1.5 text-xl font-semibold tracking-tight", highlight && "text-brand flex items-center gap-1.5")}>
        {value}
        {highlight && <TrendingUp className="size-4" />}
      </p>
    </div>
  );
}

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-border bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring/30">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
