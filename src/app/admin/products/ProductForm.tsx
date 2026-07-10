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
      className="flex flex-col gap-8 max-w-2xl bg-transparent border border-hairline p-8 md:p-12"
    >
      <h2 className="text-3xl font-serif text-ink tracking-wide font-light border-b border-hairline pb-4 mb-4 uppercase">
        Item Details
      </h2>
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="product-description"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          Description
        </label>
        <textarea
          id="product-description"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="rounded-none border-b border-hairline bg-transparent px-0 py-2 text-ink text-base transition-colors focus:border-primary focus:outline-none resize-none"
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

      <div className="flex flex-col gap-2">
        <label
          htmlFor="product-category"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          Category
        </label>
        <select
          id="product-category"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-none border-b border-hairline bg-transparent px-0 py-2 text-ink text-base min-h-[44px] transition-colors focus:border-primary focus:outline-none appearance-none"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p role="alert" className="text-xs tracking-widest uppercase text-danger mt-1">
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

      <div className="flex items-center gap-4 py-4 border-y border-hairline mt-4">
        <label className="text-xs uppercase tracking-[0.2em] text-muted flex-grow">
          Visibility Status
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={values.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            aria-label="Active"
          />
          <div className="w-11 h-6 bg-surface2 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-onPrimary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-canvas after:border-hairline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          <span className="ml-3 text-xs tracking-widest uppercase text-ink">
            {values.isActive ? "Published" : "Hidden"}
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-6 pt-8 mt-4">
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center border-b border-transparent text-xs tracking-widest uppercase text-muted hover:text-ink hover:border-ink transition-all min-h-[44px] px-2"
        >
          Cancel
        </Link>
        <Button type="submit" loading={loading} className="px-10">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
