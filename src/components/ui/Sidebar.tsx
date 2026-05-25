"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── SidebarProvider context ────────────────────────────────

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((prev) => !prev),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// ── Navigation items ──────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: string; // single-letter placeholder
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "D" },
  { label: "Products", href: "/admin/products", icon: "P" },
  { label: "Categories", href: "/admin/categories", icon: "C" },
  { label: "Settings", href: "/admin/settings", icon: "S" },
];

// ── Sidebar component ─────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, close } = useSidebar();

  return (
    <>
      {/* Hamburger button — visible on mobile */}
      <button
        type="button"
        aria-label="Open sidebar"
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-surface1 border border-hairline text-ink min-h-[44px] min-w-[44px]"
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

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — fixed on desktop, off-screen drawer on mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-surface1 border-r border-hairline flex flex-col transition-transform duration-300",
          // On desktop: always visible
          "md:translate-x-0",
          // On mobile: translate off-screen when closed
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-hairline">
          <span className="text-lg font-semibold text-ink">Admin</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px]",
                      "hover:bg-surface2",
                      isActive && "bg-primary/10 border-l-2 border-primary text-ink",
                      !isActive && "text-muted",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={close}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-md text-sm font-bold",
                        isActive
                          ? "bg-primary text-onPrimary"
                          : "bg-surface2 text-muted",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
