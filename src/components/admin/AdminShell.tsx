"use client";

import { AdminSidebar } from "./AdminSidebar";
import { AdminNoticeBar } from "./AdminNoticeBar";

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
    <div className="min-h-dvh bg-[#0f1014] text-zinc-200">
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminNoticeBar />
          {(title || action) && (
            <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#14141c]/90 px-4 py-5 backdrop-blur-xl sm:px-8">
              <div>
                {title && (
                  <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-zinc-300">{description}</p>
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
