"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname === "/admin/login";

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-canvas">
        {!isStandalone && <Sidebar />}
        {!isStandalone && <Header />}
        <main
          className={cn(
            "pt-4 px-4 md:px-6",
            !isStandalone && "md:ml-64",
          )}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
