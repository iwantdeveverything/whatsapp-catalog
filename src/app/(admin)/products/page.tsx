"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdminProductStore } from "@/lib/stores/adminProductStore";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import { useToast } from "@/components/ui/Toast";
import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "@/lib/schemas";

type ProductRow = Product & Record<string, unknown>;

function formatPrice(price: Product["price"]): string {
  return typeof price === "number" ? `$${price}` : price;
}

export default function ProductsPage() {
  const {
    products,
    loading,
    fetchProducts,
    deleteProduct,
  } = useAdminProductStore();
  const { categories, fetchCategories } = useAdminCategoryStore();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<SortState | undefined>(undefined);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts({ includeInactive: true });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Client-side filter + sort over the store's current product list
  const visibleProducts = useMemo<ProductRow[]>(() => {
    let rows: Product[] = [...products];

    const q = search.trim().toLowerCase();
    if (q !== "") {
      rows = rows.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (category.trim() !== "") {
      rows = rows.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (sort) {
      const order = sort.order === "desc" ? -1 : 1;
      rows = [...rows].sort((a, b) => {
        if (sort.key === "name") {
          return order * a.name.localeCompare(b.name);
        }
        if (sort.key === "price") {
          const av = typeof a.price === "number" ? a.price : Infinity;
          const bv = typeof b.price === "number" ? b.price : Infinity;
          return order * (av - bv);
        }
        return 0;
      });
    }

    return rows as ProductRow[];
  }, [products, search, category, sort]);

  function requestDelete(id: string) {
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
      await deleteProduct(id);
      addToast({ type: "success", message: "Product deleted" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      addToast({ type: "error", message: msg });
    }
  }

  const columns: Column<ProductRow>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category" },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => formatPrice(value as Product["price"]),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (value ? "Active" : "Inactive"),
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/products/${row.id}`}
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
        <h1 className="text-2xl font-semibold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-onPrimary font-medium hover:opacity-90 min-h-[44px]"
        >
          New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label
            htmlFor="category-filter"
            className="text-sm font-medium text-ink"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base min-h-[44px]"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted">
          Loading...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={visibleProducts}
          itemsPerPage={10}
          currentSort={sort}
          onSort={setSort}
        />
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete product"
        message="Are you sure you want to delete this product?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
