"use client";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminProductStore } from "@/lib/stores/adminProductStore";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import { useToast } from "@/components/ui/Toast";
import { ProductForm } from "@/app/admin/products/ProductForm";
import type { ProductFormInput } from "@/lib/schemas";

export default function EditProductPage() {
  useDocumentTitle("Edit Product");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const {
    products,
    loading,
    fetchProducts,
    updateProduct,
  } = useAdminProductStore();
  const { categories, fetchCategories } = useAdminCategoryStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({ includeInactive: true });
    }
    fetchCategories();
  }, [products.length, fetchProducts, fetchCategories]);

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id],
  );

  async function handleSubmit(data: ProductFormInput) {
    if (!product) return;
    try {
      await updateProduct(product.id, data);
      addToast({ type: "success", message: "Product updated" });
      router.push("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed";
      addToast({ type: "error", message: msg });
    }
  }

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center py-12 text-muted">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-4 py-12 items-center text-muted">
        <p>Product not found.</p>
      </div>
    );
  }

  const initialValues = {
    name: product.name,
    description: product.description ?? "",
    price: typeof product.price === "number" ? String(product.price) : "",
    category: product.category,
    whatsapp: product.contact?.whatsapp ?? "",
    phone: product.contact?.phone ?? "",
    imageUrl: product.images?.[0] ?? "",
    isActive: product.isActive,
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-ink">Edit product</h1>
      <ProductForm
        initialValues={initialValues}
        categories={categories}
        submitLabel="Save"
        cancelHref="/admin/products"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
