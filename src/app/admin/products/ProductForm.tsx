"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ProductFormSchema } from "@/lib/schemas";
import type { ProductFormInput } from "@/lib/schemas";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface ProductFormCategory {
  id: string;
  name: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  whatsapp: string;
  phone: string;
  imageUrl: string;
  isActive: boolean;
}

const emptyValues: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  whatsapp: "",
  phone: "",
  imageUrl: "",
  isActive: true,
};

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  categories: ProductFormCategory[];
  submitLabel: string;
  cancelHref: string;
  loading?: boolean;
  onSubmit: (data: ProductFormInput) => Promise<void> | void;
}

export function ProductForm({
  initialValues,
  categories,
  submitLabel,
  cancelHref,
  loading,
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const priceNumber = values.price === "" ? Number.NaN : Number(values.price);

    const candidate: ProductFormInput = {
      name: values.name,
      description: values.description || undefined,
      price: priceNumber,
      category: values.category,
      whatsapp: values.whatsapp || undefined,
      phone: values.phone || undefined,
      imageUrl: values.imageUrl || undefined,
      isActive: values.isActive,
    };

    const result = ProductFormSchema.safeParse(candidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSubmit(result.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 max-w-2xl"
    >
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="product-description"
          className="text-sm font-medium text-ink"
        >
          Description
        </label>
        <textarea
          id="product-description"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base"
        />
      </div>

      <Input
        label="Price"
        type="number"
        step="0.01"
        value={values.price}
        onChange={(e) => update("price", e.target.value)}
        error={errors.price}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="product-category"
          className="text-sm font-medium text-ink"
        >
          Category
        </label>
        <select
          id="product-category"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base min-h-[44px]"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p role="alert" className="text-sm text-danger">
            {errors.category}
          </p>
        )}
      </div>

      <Input
        label="WhatsApp"
        value={values.whatsapp}
        onChange={(e) => update("whatsapp", e.target.value)}
        error={errors.whatsapp}
      />

      <Input
        label="Phone"
        value={values.phone}
        onChange={(e) => update("phone", e.target.value)}
        error={errors.phone}
      />

      <Input
        label="Image URL"
        type="url"
        value={values.imageUrl}
        onChange={(e) => update("imageUrl", e.target.value)}
        error={errors.imageUrl}
      />

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
          aria-label="Active"
        />
        Active
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center rounded-md border border-hairline bg-surface2 px-4 py-2 text-ink font-medium hover:bg-surface3 min-h-[44px]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
