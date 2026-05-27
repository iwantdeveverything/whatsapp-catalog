"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAdminProductStore } from "@/lib/stores/adminProductStore";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-hairline bg-surface1 p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { products, loading: productsLoading, fetchProducts } =
    useAdminProductStore();
  const { categories, loading: categoriesLoading, fetchCategories } =
    useAdminCategoryStore();

  useEffect(() => {
    fetchProducts({ includeInactive: true });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const activeProducts = products.filter((p) => p.isActive).length;

  if (productsLoading && categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>

      <section
        aria-label="Stats"
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <StatCard label="Total Products" value={totalProducts} />
        <StatCard label="Total Categories" value={totalCategories} />
        <StatCard label="Active Products" value={activeProducts} />
      </section>

      <section aria-label="Quick actions" className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-onPrimary font-medium hover:opacity-90 min-h-[44px]"
        >
          New Product
        </Link>
        <Link
          href="/admin/categories"
          className="inline-flex items-center justify-center rounded-md border border-hairline bg-surface2 px-4 py-2 text-ink font-medium hover:bg-surface3 min-h-[44px]"
        >
          Categories
        </Link>
      </section>
    </div>
  );
}
