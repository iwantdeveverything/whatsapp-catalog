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
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "rounded-none border-b border-hairline bg-transparent px-0 py-2 text-ink text-base transition-colors",
            "min-h-[44px]",
            "placeholder:text-muted placeholder:font-light",
            "focus:border-primary focus:outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-danger focus:border-danger text-danger",
            className,
          )}
          {...rest}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs tracking-widest uppercase text-danger mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);
