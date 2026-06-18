import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signIn, getSession } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesion — Portal Rhinoberto" },
      { name: "description", content: "Accede al portal de control de Rhinoberto para SLA Asociados." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@sla.com");
  const [password, setPassword] = useState("rinoberto");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const user = signIn(email, password);
    setLoading(false);
    if (!user) {
      setError("Credenciales inválidas. Usa admin@sla.com / rinoberto para la demo.");
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-background grid lg:grid-cols-2">
      {/* Panel izquierdo de marca */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[oklch(0.20_0.020_260)] via-[oklch(0.18_0.020_260)] to-[oklch(0.16_0.018_260)] text-white overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-brand text-brand-foreground">
            <Sparkles className="size-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">Rinoberto</p>
            <p className="text-[10px] uppercase tracking-widest text-white/60">Intelligence Portal</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight text-balance">
            Centro de control de automatizacion para SLA Asociados.
          </h2>
          <p className="text-sm text-white/70 text-pretty">
            Monitorea cada conversacion, lead y workflow del ecosistema Rhinoberto desde un solo lugar.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { k: "98.4%", v: "Precisión IA" },
              { k: "24.1K", v: "Conversaciones" },
              { k: "38", v: "Workflows" },
            ].map((s) => (
              <div key={s.v} className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <p className="text-lg font-semibold">{s.k}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/60">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[10px] uppercase tracking-widest text-white/40">
          © 2026 SLA · v2.4.1
        </p>

        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -left-32 -bottom-32 size-96 rounded-full bg-[oklch(0.55_0.18_320)]/15 blur-3xl" />
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground">
              <Sparkles className="size-4" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-semibold">Rinoberto Intelligence Portal</p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de vuelta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa con tu correo corporativo para acceder al portal de SLA Asociados.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.nombre@sla.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link to="/login" className="text-xs text-brand hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
              <Label htmlFor="remember" className="text-xs font-normal text-muted-foreground cursor-pointer">
                Mantener sesión iniciada
              </Label>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
              {loading ? "Verificando…" : "Iniciar sesión"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
