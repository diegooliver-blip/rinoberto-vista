import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, MessagesSquare, Users, Workflow, Brain,
  BookOpen, FileBarChart, Bell, Settings, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, ROLE_LABEL } from "@/lib/auth";
import { useEffect, useState } from "react";

const NAV = [
  {
    section: "Principal",
    items: [
      { to: "/dashboard", label: "Panel de Control", icon: LayoutDashboard },
      { to: "/conversaciones", label: "Conversaciones", icon: MessagesSquare },
      { to: "/leads", label: "Inteligencia de Leads", icon: Users },
    ],
  },
  {
    section: "Inteligencia",
    items: [
      { to: "/automatizaciones", label: "Automatizaciones n8n", icon: Workflow },
      { to: "/ia-performance", label: "IA Performance", icon: Brain },
      { to: "/knowledge", label: "Centro de Conocimiento", icon: BookOpen },
    ],
  },
  {
    section: "Operación",
    items: [
      { to: "/reportes", label: "Reportes", icon: FileBarChart },
      { to: "/notificaciones", label: "Notificaciones", icon: Bell },
      { to: "/configuracion", label: "Configuración", icon: Settings },
    ],
  },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState(() => getSession());

  useEffect(() => {
    const h = () => setUser(getSession());
    window.addEventListener("rinoberto:auth", h);
    return () => window.removeEventListener("rinoberto:auth", h);
  }, []);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm">
          <Sparkles className="size-4" strokeWidth={2.5} />
        </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight leading-none">Rhinoberto</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              Portal SLA Asociados
            </div>
          </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon }) => {
                const active = pathname === to || pathname.startsWith(to + "/");
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active && "text-brand")} />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-sidebar-accent/60 transition-colors">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-muted text-brand text-xs font-semibold">
            {user?.avatarInitials ?? "—"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{user?.name ?? "Invitado"}</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {user ? ROLE_LABEL[user.role] : ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
