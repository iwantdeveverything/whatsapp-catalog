"use client";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "@/lib/schemas";

type ProductRow = Product & Record<string, unknown>;

function formatPrice(price: Product["price"]): string {
  return typeof price === "number" ? `$${price}` : price;
}

export default function ProductsPage() {
  useDocumentTitle("Products");
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
        <div className="flex gap-4 justify-end items-center">
          <Link
            href={`/admin/products/${row.id}`}
            className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors min-h-[44px] flex items-center"
            aria-label={`Edit ${row.name}`}
          >
            Edit
          </Link>
          <button
            onClick={() => requestDelete(row.id)}
            className="text-xs uppercase tracking-widest text-accent hover:opacity-80 transition-opacity min-h-[44px] flex items-center"
            aria-label={`Delete ${row.name}`}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-end justify-between border-b border-hairline pb-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted mb-2 block">Catalog Management</span>
          <h1 className="text-4xl font-serif text-ink tracking-wide font-light">Inventory</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center border border-primary bg-primary px-8 py-3 text-xs uppercase tracking-widest text-onPrimary transition-all duration-300 hover:bg-transparent hover:text-primary min-h-[44px]"
        >
          Add Item
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="search-filter" className="text-xs uppercase tracking-widest text-muted">Search Collection</label>
          <input
            id="search-filter"
            placeholder="Type to filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-b border-hairline bg-transparent px-0 py-2 text-ink placeholder:text-muted focus:border-primary focus:outline-none min-h-[44px] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category-filter"
            className="text-xs uppercase tracking-widest text-muted"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-b border-hairline bg-transparent px-0 py-2 text-ink focus:border-primary focus:outline-none min-h-[44px] transition-colors appearance-none"
          >
            <option value="">All Categories</option>
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
