import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Moon, Search, Sun, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./app-sidebar";
import { getSession, signOut, ROLE_LABEL } from "@/lib/auth";
import { getNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AppTopbar({ title, breadcrumb }: { title: string; breadcrumb?: string }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(() => getSession());
  const [dark, setDark] = useState(false);
  const notifications = getNotifications();
  const unread = notifications.filter((n) => !n.leido).length;

  useEffect(() => {
    const stored = localStorage.getItem("rinoberto_theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const h = () => setUser(getSession());
    window.addEventListener("rinoberto:auth", h);
    return () => window.removeEventListener("rinoberto:auth", h);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("rinoberto_theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="hidden sm:flex items-center gap-2 text-sm min-w-0">
            <span className="text-muted-foreground">Portal de Inteligencia</span>
            <span className="text-border">/</span>
            <span className="font-medium truncate">{breadcrumb ?? title}</span>
          </div>
          <h1 className="sm:hidden text-sm font-semibold truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              placeholder="Buscar leads, workflows, conversaciones…"
              className="w-72 rounded-md border border-border bg-muted/40 pl-9 pr-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <Button variant="ghost" size="icon" onClick={toggleDark} title="Cambiar tema">
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">Notificaciones</p>
                <span className="text-[10px] text-muted-foreground">{unread} sin leer</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-1 size-1.5 shrink-0 rounded-full",
                          n.tipo === "critical" && "bg-destructive",
                          n.tipo === "warning" && "bg-warning",
                          n.tipo === "info" && "bg-info"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium">{n.titulo}</p>
                        <p className="text-xs text-muted-foreground truncate">{n.mensaje}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.hora}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 px-2 gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-brand-muted text-brand text-[10px] font-semibold">
                  {user?.avatarInitials ?? "—"}
                </span>
                <span className="hidden sm:inline text-xs font-medium">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2">
              <div className="px-2 py-2 border-b border-border mb-2">
                <p className="text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                <p className="text-[10px] text-brand mt-1 font-medium">
                  {user ? ROLE_LABEL[user.role] : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-8 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="size-3.5" /> Cerrar sesión
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
