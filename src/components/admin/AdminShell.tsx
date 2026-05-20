"use client";

import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function AdminShell({
  children,
  title,
  description,
  action,
}: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-iron-950 text-silver-300">
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {(title || action) && (
            <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-iron-950/90 px-4 py-5 backdrop-blur-xl sm:px-8">
              <div>
                {title && (
                  <h1 className="text-xl font-semibold tracking-tight text-silver-100 sm:text-2xl">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-silver-500">{description}</p>
                )}
              </div>
              {action}
            </header>
          )}
          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
