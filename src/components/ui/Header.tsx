"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSidebar } from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ── Breadcrumb label mapping ──────────────────────────────

function getPageLabel(pathname: string): string {
  if (pathname.startsWith("/admin/dashboard")) return "Dashboard";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/categories")) return "Categories";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  if (pathname.startsWith("/admin/login")) return "Login";
  return "Admin";
}

export function Header() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const { toggle } = useSidebar();

  const pageLabel = getPageLabel(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-hairline bg-canvas md:px-6">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open sidebar"
          className="md:hidden p-2 rounded-md bg-surface1 border border-hairline text-ink min-h-[44px] min-w-[44px]"
          onClick={toggle}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-3">
          <span className="text-muted text-[10px] tracking-widest uppercase">Admin</span>
          <span className="text-muted text-[10px]" aria-hidden="true">
            /
          </span>
          <span className="text-ink text-xs tracking-widest uppercase">{pageLabel}</span>
        </nav>
      </div>

      {/* Right: logout */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
