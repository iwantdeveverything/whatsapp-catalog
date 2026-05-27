"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CategoryFormSchema } from "@/lib/schemas";
import type { CategoryFormInput } from "@/lib/schemas";
import { slugify } from "@/lib/utils/slug";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
}

const emptyValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
};

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  submitLabel: string;
  cancelHref: string;
  loading?: boolean;
  onSubmit: (data: CategoryFormInput) => Promise<void> | void;
}

export function CategoryForm({
  initialValues,
  submitLabel,
  cancelHref,
  loading,
  onSubmit,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleNameChange(next: string) {
    setValues((prev) => ({
      ...prev,
      name: next,
      slug: slugify(next),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const candidate: CategoryFormInput = {
      name: values.name,
      description:
        values.description.trim() === "" ? undefined : values.description,
    };

    const result = CategoryFormSchema.safeParse(candidate);
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
        onChange={(e) => handleNameChange(e.target.value)}
        error={errors.name}
      />

      <Input
        label="Slug"
        value={values.slug}
        readOnly
        aria-readonly="true"
        // Slug is generated from name — read-only to keep the catalog deterministic
        onChange={() => {}}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="category-description"
          className="text-sm font-medium text-ink"
        >
          Description
        </label>
        <textarea
          id="category-description"
          value={values.description}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base"
        />
        {errors.description && (
          <p role="alert" className="text-sm text-danger">
            {errors.description}
          </p>
        )}
      </div>

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
