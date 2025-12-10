"use client";

import { useControl } from "@conform-to/react/future";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSelectProps {
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
  options: Array<{ value: string; label: string }>;
  className?: string;
  onFocus?: () => void;
}

/**
 * Form-aware Select component that integrates with Conform using useControl.
 * Wraps the shadcn Select component with automatic form state management.
 *
 * @see https://conform.guide/integration/ui-libraries
 */
export function FormSelect({
  field,
  label,
  required,
  placeholder,
  options,
  className,
  onFocus,
}: FormSelectProps) {
  const control = useControl({
    defaultValue: field.initialValue,
    onFocus,
  });

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={field.id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <input
        type="hidden"
        name={field.name}
        ref={control.register}
        key={field.key}
      />
      <Select
        // eslint-disable-next-line react-hooks/refs
        value={control.value}
        onValueChange={(value) => control.change(value)}
        onOpenChange={(open) => {
          if (!open) {
            control.blur();
          }
        }}
        required={required}
      >
        <SelectTrigger
          id={field.id}
          className={cn(
            field.errors &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50",
            className
          )}
          aria-invalid={field.errors ? true : undefined}
          aria-describedby={field.errors ? field.errorId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {field.errors && (
        <div id={field.errorId} className="text-sm text-destructive">
          {field.errors}
        </div>
      )}
    </div>
  );
}
