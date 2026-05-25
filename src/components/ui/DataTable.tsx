"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = Record<string, any>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface SortState {
  key: string;
  order: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (sort: SortState) => void;
  currentSort?: SortState;
  itemsPerPage?: number;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  currentSort,
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, page, itemsPerPage]);

  function handleSort(key: string) {
    if (!onSort) return;

    if (currentSort?.key === key) {
      const nextOrder: "asc" | "desc" =
        currentSort.order === "asc" ? "desc" : "asc";
      onSort({ key, order: nextOrder });
    } else {
      onSort({ key, order: "asc" });
    }
  }

  function getSortIndicator(key: string): string {
    if (currentSort?.key !== key) return "";
    return currentSort.order === "asc" ? " ▲" : " ▼";
  }

  // ── Empty state ──
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted">
        No data
      </div>
    );
  }

  // ── Mobile: card view ──
  return (
    <div>
      {/* Mobile card layout (hidden on md+) */}
      <div className="block md:hidden space-y-4">
        {paginatedData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="rounded-lg border border-hairline bg-surface1 p-4 space-y-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between gap-2">
                <span className="text-muted text-sm min-w-[44px]">{col.label}:</span>
                <span className="text-ink text-sm text-right">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop table layout (hidden below md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-hairline">
              {columns.map((col) => {
                const isSortable = col.sortable && onSort;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-muted",
                      isSortable && "cursor-pointer select-none hover:text-ink min-h-[44px]",
                    )}
                    onClick={() => isSortable && handleSort(col.key)}
                    role={isSortable ? "columnheader button" : "columnheader"}
                  >
                    {col.label}
                    {getSortIndicator(col.key)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-hairline hover:bg-surface1 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-ink">
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-hairline">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
