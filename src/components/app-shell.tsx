import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function AppShell({
  title,
  breadcrumb,
  description,
  actions,
  children,
}: {
  title: string;
  breadcrumb?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        <AppSidebar />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <AppTopbar title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl text-pretty">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
