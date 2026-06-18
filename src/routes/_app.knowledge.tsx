import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText, Tag as TagIcon, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getKnowledge } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/knowledge")({
  head: () => ({ meta: [{ title: "Centro de Conocimiento — Rinoberto" }] }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const docs = useMemo(() => getKnowledge(), []);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const categorias = ["Todas", ...Array.from(new Set(docs.map((d) => d.categoria)))];

  const filtered = docs.filter((d) => {
    const matchQ = !q || d.titulo.toLowerCase().includes(q.toLowerCase()) || d.resumen.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "Todas" || d.categoria === cat;
    return matchQ && matchC;
  });

  return (
    <AppShell
      title="Centro de Conocimiento"
      breadcrumb="Knowledge Base"
      description="Documentación interna, SOPs y guías técnicas de Rinoberto y su ecosistema."
      actions={
        <Button size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="size-3.5" /> Nuevo documento
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar documentación…" className="pl-9 h-9 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1">
          {categorias.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                cat === c ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <article key={d.id} className="rounded-xl border border-border bg-card p-5 hover:border-brand/30 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="grid size-9 place-items-center rounded-lg bg-brand-muted text-brand">
                <FileText className="size-4" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{d.version}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-brand font-semibold">{d.categoria}</p>
            <h3 className="mt-1 text-sm font-semibold leading-snug group-hover:text-brand transition-colors">{d.titulo}</h3>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{d.resumen}</p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
              <div className="flex flex-wrap gap-1">
                {d.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    <TagIcon className="size-2.5" /> {t}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">{d.actualizado}</span>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
