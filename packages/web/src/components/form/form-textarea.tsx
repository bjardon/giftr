"use client";

import { useControl } from "@conform-to/react/future";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface FormTextareaProps {
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
  placeholder?: string;
  rows?: number;
  className?: string;
  toolbar?: React.ReactNode;
}

/**
 * Form-aware Textarea component that integrates with Conform using useControl.
 * 
 * For simple textareas, you can use the native textarea element directly without
 * this wrapper, as Conform supports native inputs out of the box. Use this
 * wrapper when you need additional features like a toolbar or consistent error handling.
 * 
 * @see https://conform.guide/integration/ui-libraries
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      field,
      label,
      required,
      placeholder,
      rows = 6,
      className,
      toolbar,
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
        {toolbar && (
          <div className="flex items-center gap-1 p-2 border rounded-t-md bg-muted/30">
            {toolbar}
          </div>
        )}
        <textarea
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
          rows={rows}
          placeholder={placeholder}
          defaultValue={field.initialValue}
          key={field.key}
          onChange={(e) => control.change(e.target.value)}
          onBlur={() => control.blur()}
          aria-invalid={field.errors ? true : undefined}
          aria-describedby={field.errors ? field.errorId : undefined}
          className={`w-full min-h-[120px] ${
            toolbar ? "rounded-b-md rounded-t-none border-t-0" : "rounded-md"
          } border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm placeholder:text-muted-foreground resize-none ${
            field.errors
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
              : "focus-visible:border-ring focus-visible:ring-ring/50"
          } ${className || ""}`}
        />
        {field.errors && (
          <div id={field.errorId} className="text-sm text-destructive">
            {field.errors}
          </div>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

