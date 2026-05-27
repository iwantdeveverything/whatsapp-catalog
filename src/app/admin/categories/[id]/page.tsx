"use client";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import { useToast } from "@/components/ui/Toast";
import { CategoryForm } from "@/app/admin/categories/CategoryForm";
import type { CategoryFormInput } from "@/lib/schemas";

export default function EditCategoryPage() {
  useDocumentTitle("Edit Category");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const {
    categories,
    loading,
    fetchCategories,
    updateCategory,
  } = useAdminCategoryStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const category = useMemo(
    () => categories.find((c) => c.id === id),
    [categories, id],
  );

  async function handleSubmit(data: CategoryFormInput) {
    if (!category) return;
    try {
      await updateCategory(category.id, data);
      addToast({ type: "success", message: "Category updated" });
      router.push("/admin/categories");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed";
      addToast({ type: "error", message: msg });
    }
  }

  if (loading && !category) {
    return (
      <div className="flex items-center justify-center py-12 text-muted">
        Loading...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col gap-4 py-12 items-center text-muted">
        <p>Category not found.</p>
      </div>
    );
  }

  const initialValues = {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-ink">Edit category</h1>
      <CategoryForm
        initialValues={initialValues}
        submitLabel="Save"
        cancelHref="/admin/categories"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
