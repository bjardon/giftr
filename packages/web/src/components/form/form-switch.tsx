"use client";

import { useControl } from "@conform-to/react/future";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FormSwitchProps {
  field: {
    id: string;
    name: string;
    key?: string;
    initialValue?: string;
    errorId?: string;
    errors?: string[];
    value?: string;
  };
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  onFocus?: () => void;
}

/**
 * Form-aware Switch component that integrates with Conform using useControl.
 * Wraps the shadcn Switch component with automatic form state management.
 * 
 * Stores the value as "true" or "false" strings to work with FormData.
 * 
 * @see https://conform.guide/integration/ui-libraries
 */
export function FormSwitch({
  field,
  label,
  description,
  required,
  className,
  onFocus,
}: FormSwitchProps) {
  const control = useControl({
    defaultValue: field.initialValue || "false",
    onFocus,
  });

  const isChecked = control.value === "true";

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {label && (
            <Label htmlFor={field.id} className="text-base">
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <input
          type="hidden"
          name={field.name}
          ref={control.register}
          key={field.key}
        />
        <Switch
          id={field.id}
          checked={isChecked}
          onCheckedChange={(checked) =>
            control.change(checked ? "true" : "false")
          }
          aria-invalid={field.errors ? true : undefined}
          aria-describedby={field.errors ? field.errorId : undefined}
        />
      </div>
      {field.errors && (
        <div id={field.errorId} className="text-sm text-destructive mt-2">
          {field.errors}
        </div>
      )}
    </div>
  );
}

