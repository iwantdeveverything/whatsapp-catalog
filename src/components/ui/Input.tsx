"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id, ...rest }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base",
            "min-h-[44px]",
            "placeholder:text-muted",
            "focus:outline-2 focus:outline-offset-1 focus:outline-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-danger focus:outline-danger",
            className,
          )}
          {...rest}
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
