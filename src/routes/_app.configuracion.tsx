import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Plug, Shield, Plus, KeyRound, Activity } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROLE_LABEL, DEMO_USERS } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — Rinoberto" }] }),
  component: ConfiguracionPage,
});

const TABS = [
  { id: "users", label: "Usuarios", icon: Users },
  { id: "integrations", label: "Integraciones", icon: Plug },
  { id: "security", label: "Seguridad", icon: Shield },
] as const;

const INTEGRATIONS = [
  { name: "n8n", desc: "Motor de workflows de automatización", status: "Conectado", on: true },
  { name: "WhatsApp Cloud API", desc: "Canal principal de conversaciones", status: "Conectado", on: true },
  { name: "OpenAI", desc: "Modelos GPT-4 para Rinoberto", status: "Conectado", on: true },
  { name: "Salesforce CRM", desc: "Sincronización bidireccional de leads", status: "Error", on: true },
  { name: "Google Sheets", desc: "Exportación de reportes y dashboards", status: "Conectado", on: true },
  { name: "PostgreSQL", desc: "Base de datos transaccional", status: "Conectado", on: true },
  { name: "Airtable", desc: "Knowledge base estructurada", status: "Desconectado", on: false },
  { name: "Slack", desc: "Notificaciones internas para el equipo SLA", status: "Conectado", on: true },
];

function ConfiguracionPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("users");
  return (
    <AppShell
      title="Configuración"
      breadcrumb="Ajustes del Portal"
      description="Administración de usuarios, integraciones y políticas de seguridad."
    >
      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px",
              tab === t.id ? "border-brand text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            <t.icon className="size-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <p className="text-sm font-semibold">Usuarios del portal</p>
              <p className="text-xs text-muted-foreground">Administra accesos y roles de SLA.</p>
            </div>
            <Button size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="size-3.5" /> Agregar usuario
            </Button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Usuario</th>
                <th className="px-4 py-2.5 font-semibold">Correo</th>
                <th className="px-4 py-2.5 font-semibold">Rol</th>
                <th className="px-4 py-2.5 font-semibold">Estado</th>
                <th className="px-4 py-2.5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.values(DEMO_USERS).map((u) => (
                <tr key={u.user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-full bg-brand-muted text-brand text-[11px] font-semibold">
                        {u.user.avatarInitials}
                      </div>
                      <span className="text-sm font-medium">{u.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-brand-muted px-2 py-0.5 text-[10px] font-semibold text-brand">
                      {ROLE_LABEL[u.user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-success">
                      <span className="size-1.5 rounded-full bg-success" /> Activo
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Editar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "integrations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
              <div className="grid size-10 place-items-center rounded-lg bg-brand-muted text-brand">
                <Plug className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{i.name}</p>
                  <Switch checked={i.on} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{i.desc}</p>
                <p className={cn(
                  "mt-2 text-[10px] font-semibold uppercase tracking-widest",
                  i.status === "Conectado" && "text-success",
                  i.status === "Error" && "text-destructive",
                  i.status === "Desconectado" && "text-muted-foreground",
                )}>{i.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid size-9 place-items-center rounded-lg bg-brand-muted text-brand">
                <KeyRound className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Política de contraseñas</p>
                <p className="text-xs text-muted-foreground">Reglas aplicadas a todos los usuarios.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ["Mínimo 12 caracteres", true],
                ["Requiere mayúsculas y minúsculas", true],
                ["Requiere número y símbolo", true],
                ["Renovación cada 90 días", true],
                ["Bloqueo tras 5 intentos fallidos", true],
              ].map(([label, on]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <span className="text-xs">{label}</span>
                  <Switch checked={on as boolean} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid size-9 place-items-center rounded-lg bg-brand-muted text-brand">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Registro de auditoría</p>
                <p className="text-xs text-muted-foreground">Últimos accesos al portal.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ["Carlos Ortega", "Inició sesión desde IP 189.203.x.x", "hace 4m"],
                ["Lucía Rojas", "Modificó workflow WhatsApp → CRM", "hace 22m"],
                ["Miguel Ángel", "Exportó reporte semanal en PDF", "hace 1h"],
                ["Carlos Ortega", "Agregó usuario manager@sla.com", "ayer"],
              ].map(([n, m, t]) => (
                <div key={m} className="flex items-start gap-3 text-xs">
                  <span className="size-1.5 mt-1.5 rounded-full bg-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p><span className="font-medium">{n}</span> <span className="text-muted-foreground">— {m}</span></p>
                    <p className="text-[10px] text-muted-foreground font-mono">{t}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
