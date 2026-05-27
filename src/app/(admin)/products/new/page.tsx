"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminProductStore } from "@/lib/stores/adminProductStore";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import { useToast } from "@/components/ui/Toast";
import { ProductForm } from "@/app/(admin)/products/ProductForm";
import type { ProductFormInput } from "@/lib/schemas";

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct, loading } = useAdminProductStore();
  const { categories, fetchCategories } = useAdminCategoryStore();
  const { addToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleSubmit(data: ProductFormInput) {
    try {
      await createProduct(data);
      addToast({ type: "success", message: "Product created" });
      router.push("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Create failed";
      addToast({ type: "error", message: msg });
    }
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-ink">New product</h1>
      <ProductForm
        categories={categories}
        submitLabel="Create"
        cancelHref="/admin/products"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
