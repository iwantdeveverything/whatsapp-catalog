"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import { useToast } from "@/components/ui/Toast";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Category } from "@/lib/services/interfaces";

type CategoryRow = Category & Record<string, unknown>;

export default function CategoriesPage() {
  const {
    categories,
    loading,
    fetchCategories,
    deleteCategory,
  } = useAdminCategoryStore();
  const { addToast } = useToast();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const rows = useMemo<CategoryRow[]>(
    () => categories as CategoryRow[],
    [categories],
  );

  function requestDelete(id: string) {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    if (target.productCount > 0) {
      addToast({
        type: "error",
        message: `Cannot delete: ${target.productCount} products in this category`,
      });
      return;
    }
    setPendingDeleteId(id);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteCategory(id);
      addToast({ type: "success", message: "Category deleted" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      addToast({ type: "error", message: msg });
    }
  }

  const columns: Column<CategoryRow>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "slug", label: "Slug" },
    {
      key: "description",
      label: "Description",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "—",
    },
    {
      key: "productCount",
      label: "Products",
      sortable: true,
      render: (value) => String(value ?? 0),
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/categories/${row.id}`}
            className="inline-flex items-center justify-center rounded-md border border-hairline bg-surface2 px-3 py-1.5 text-sm text-ink hover:bg-surface3 min-h-[44px]"
            aria-label={`Edit ${row.name}`}
          >
            Edit
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => requestDelete(row.id)}
            aria-label={`Delete ${row.name}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-onPrimary font-medium hover:opacity-90 min-h-[44px]"
        >
          New Category
        </Link>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted">
          Loading...
        </div>
      ) : (
        <DataTable columns={columns} data={rows} itemsPerPage={10} />
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete category"
        message="Are you sure you want to delete this category?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
