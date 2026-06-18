import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const session = getSession();
    navigate({ to: session ? "/dashboard" : "/login", replace: true });
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="size-2 rounded-full bg-brand animate-pulse" />
        <span className="text-sm">Cargando Portal Rhinoberto SLA...</span>
      </div>
    </div>
  );
}
