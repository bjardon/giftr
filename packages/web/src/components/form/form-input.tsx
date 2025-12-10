"use client";

import { useControl } from "@conform-to/react/future";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface FormInputProps {
  field: {
    id: string;
    name: string;
    key?: string;
    initialValue?: string;
    errorId?: string;
    errors?: string[];
  };
  label?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * Form-aware Input component that integrates with Conform using useControl.
 * Wraps the shadcn Input component with automatic form state management.
 * 
 * For simple text inputs, you can use the Input component directly without
 * this wrapper, as Conform supports native inputs out of the box. Use this
 * wrapper when you need additional features like prefix/suffix elements or
 * consistent error handling.
 * 
 * @see https://conform.guide/integration/ui-libraries
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      field,
      label,
      required,
      type = "text",
      placeholder,
      className,
      min,
      max,
      step,
      prefix,
      suffix,
    },
    ref
  ) => {
    const control = useControl({
      defaultValue: field.initialValue,
    });

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={field.id}>
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {prefix}
            </span>
          )}
          <input
            ref={(element) => {
              control.register(element);
              if (typeof ref === "function") {
                ref(element);
              } else if (ref) {
                ref.current = element;
              }
            }}
            id={field.id}
            name={field.name}
            type={type}
            placeholder={placeholder}
            defaultValue={field.initialValue}
            key={field.key}
            min={min}
            max={max}
            step={step}
            onChange={(e) => control.change(e.target.value)}
            onBlur={() => control.blur()}
            aria-invalid={field.errors ? true : undefined}
            aria-describedby={field.errors ? field.errorId : undefined}
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${
              prefix ? "pl-8" : ""
            } ${suffix ? "pr-10" : ""} ${
              field.errors
                ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                : "focus-visible:border-ring focus-visible:ring-ring/50"
            } ${className || ""}`}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {field.errors && (
          <div id={field.errorId} className="text-sm text-destructive">
            {field.errors}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

