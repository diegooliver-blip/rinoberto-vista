import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/login", replace: true });
    } else {
      setChecked(true);
    }
  }, [navigate]);

  if (!checked) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm">Verificando sesión…</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
