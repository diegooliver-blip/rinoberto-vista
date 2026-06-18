import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, MessageCircle, Bot, Workflow as WorkflowIcon, Tag } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchConversations, fetchConversationStats } from "@/lib/data";
import { getConversationById, type Conversation } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/conversaciones")({
  head: () => ({ meta: [{ title: "Conversaciones — Rinoberto" }] }),
  component: ConversacionesPage,
});

const ESTADOS = ["Todos", "Nuevo Lead", "Contactado", "Calificado", "Cita Agendada", "Cerrado Ganado", "Cerrado Perdido"];

function ConversacionesPage() {
  const { data: all = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(),
  });
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [selectedId, setSelectedId] = useState<string>(all[0]?.id ?? "");

  const filtered = all.filter((c) => {
    const q = query.toLowerCase();
    const matchesQ = !q || c.contacto.toLowerCase().includes(q) || c.ultimoMensaje.toLowerCase().includes(q);
    const matchesE = estado === "Todos" || c.estado === estado;
    return matchesQ && matchesE;
  });

  const detail = getConversationById(selectedId);

  return (
    <AppShell
      title="Conversaciones"
      breadcrumb="Centro de Conversaciones"
      description="Historial completo de interacciones entre Rinoberto y los contactos de SLA."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Lista */}
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar contacto o mensaje…" className="pl-9 h-8 text-xs" />
            </div>
            <div className="flex flex-wrap gap-1">
              {ESTADOS.map((s) => (
                <button key={s} onClick={() => setEstado(s)}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                    estado === s ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-y-auto max-h-[600px] divide-y divide-border">
            {filtered.map((c) => (
              <ConversationRow key={c.id} c={c} active={c.id === selectedId} onClick={() => setSelectedId(c.id)} />
            ))}
            {filtered.length === 0 && (
              <p className="p-6 text-xs text-center text-muted-foreground">Sin resultados.</p>
            )}
          </div>
        </div>

        {/* Detalle */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {detail ? (
            <>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-brand-muted text-brand text-sm font-semibold">
                    {detail.iniciales}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{detail.contacto}</p>
                    <p className="text-xs text-muted-foreground">{detail.telefono} · {detail.canal} · {detail.region}</p>
                  </div>
                </div>
                <StatusBadge status={detail.estado} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
                <InfoCell label="Fuente" value={detail.fuente} />
                <InfoCell label="Sentimiento" value={`${detail.sentimiento} · ${detail.sentimientoScore.toFixed(2)}`} />
                <InfoCell label="Última actividad" value={detail.hora} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                {/* Mensajes */}
                <div className="bg-card p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                    <MessageCircle className="size-3" /> Historial de mensajes
                  </p>
                  <div className="space-y-3">
                    {detail.mensajes.map((m, i) => (
                      <div key={i} className={cn("flex gap-2", m.role === "bot" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[85%] rounded-lg px-3 py-2 text-xs",
                          m.role === "bot"
                            ? "bg-brand text-brand-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        )}>
                          <p>{m.text}</p>
                          <p className={cn("mt-1 text-[9px] opacity-70")}>{m.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones IA + Workflows */}
                <div className="bg-card p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Bot className="size-3" /> Acciones de IA y Workflows
                  </p>
                  <ol className="relative border-l border-border ml-2 space-y-3">
                    {detail.acciones.map((a, i) => (
                      <li key={i} className="ml-4">
                        <span className={cn(
                          "absolute -left-1.5 grid size-3 place-items-center rounded-full border-2 border-card",
                          a.tipo === "ai" ? "bg-brand" : "bg-info"
                        )} />
                        <p className="text-xs font-medium flex items-center gap-1.5">
                          {a.tipo === "workflow" ? <WorkflowIcon className="size-3 text-info" /> : <Bot className="size-3 text-brand" />}
                          {a.accion}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">{a.hora}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5"><Tag className="size-3.5" /> Etiquetar</Button>
                <Button size="sm" variant="outline" className="gap-1.5"><Filter className="size-3.5" /> Reasignar</Button>
                <Button size="sm" className="ml-auto bg-brand text-brand-foreground hover:bg-brand/90">
                  Intervención humana
                </Button>
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">Selecciona una conversación.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ConversationRow({ c, active, onClick }: { c: Conversation; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        "w-full text-left p-3 transition-colors flex gap-3",
        active ? "bg-brand-muted/60" : "hover:bg-muted/40"
      )}>
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-muted text-brand text-[11px] font-semibold">
        {c.iniciales}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold truncate">{c.contacto}</p>
          <span className="text-[10px] text-muted-foreground shrink-0">{c.hora}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{c.ultimoMensaje}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <StatusBadge status={c.estado} />
          <span className="text-[10px] text-muted-foreground">· {c.canal}</span>
        </div>
      </div>
    </button>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-1 capitalize">{value}</p>
    </div>
  );
}
