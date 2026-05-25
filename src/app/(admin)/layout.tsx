import type { ReactNode } from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-canvas">
        <Sidebar />
        <Header />
        {/* Main content — offset by sidebar width on desktop */}
        <main className="md:ml-64 pt-4 px-4 md:px-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
