"use client";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { useRouter } from "next/navigation";
import { useAdminCategoryStore } from "@/lib/stores/adminCategoryStore";
import { useToast } from "@/components/ui/Toast";
import { CategoryForm } from "@/app/admin/categories/CategoryForm";
import type { CategoryFormInput } from "@/lib/schemas";

export default function NewCategoryPage() {
  useDocumentTitle("New Category");
  const router = useRouter();
  const { createCategory, loading } = useAdminCategoryStore();
  const { addToast } = useToast();

  async function handleSubmit(data: CategoryFormInput) {
    try {
      await createCategory(data);
      addToast({ type: "success", message: "Category created" });
      router.push("/admin/categories");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Create failed";
      addToast({ type: "error", message: msg });
    }
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-ink">New category</h1>
      <CategoryForm
        submitLabel="Create"
        cancelHref="/admin/categories"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
