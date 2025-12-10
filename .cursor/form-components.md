# Form Components

## Two-Layer Architecture

```
components/
├── ui/          # Pure shadcn/ui (NO Conform dependency)
└── form/        # Conform-aware wrappers (uses useControl hook)
    ├── form-input.tsx
    ├── form-select.tsx
    ├── form-switch.tsx
    ├── form-textarea.tsx
    └── form-datepicker.tsx
```

**Principles:**

- Keep `ui/` components pure and framework-agnostic
- `form/` components wrap `ui/` with Conform integration
- Native HTML inputs work directly with Conform without wrappers
- Only use form wrappers for complex UI components (Select, Switch, etc.)

## When to Use Native vs Wrapper

- ✅ Native `<input>` for simple text/number/email fields
- ✅ `FormSelect` for dropdowns (doesn't emit native form events)
- ✅ `FormSwitch` for toggles (stores as "true"/"false" strings)
- ✅ `FormInput` only when you need prefix/suffix or consistent error handling

## Usage

### FormInput

```tsx
<FormInput
  field={fields.budget}
  label="Budget"
  required
  type="number"
  prefix="$"
/>
```

### FormSelect

```tsx
<FormSelect
  field={fields.currency}
  label="Currency"
  required
  options={[{ value: "USD", label: "USD" }]}
/>
```

### FormSwitch

Stores values as "true"/"false" strings.

```tsx
<FormSwitch field={fields.enabled} label="Enable" description="..." />
```

### FormTextarea

```tsx
<FormTextarea field={fields.notes} label="Notes" toolbar={<>...</>} />
```

### FormDatePicker

Date picker with input and calendar popover. Stores as ISO string (YYYY-MM-DD).

```tsx
<FormDatePicker
  field={fields.date}
  label="Date"
  required
  placeholder="Select date"
/>
```

## Creating New Components

Template pattern:

```tsx
"use client";
import { useControl } from "@conform-to/react/future";

export function FormYourComponent({ field, label, required, ...props }) {
  const control = useControl({ defaultValue: field.initialValue });

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={field.id}>{label}</Label>}
      <input
        type="hidden"
        name={field.name}
        ref={control.register}
        key={field.key}
      />
      <YourComponent
        id={field.id}
        value={control.value}
        onChange={(v) => control.change(v)}
        onBlur={() => control.blur()}
        aria-invalid={field.errors ? true : undefined}
        aria-describedby={field.errors ? field.errorId : undefined}
      />
      {field.errors && <div id={field.errorId}>{field.errors}</div>}
    </div>
  );
}
```

**Key patterns:**

1. Hidden input with `control.register`
2. Sync value with `control.value`
3. Emit events with `control.change()` and `control.blur()`
4. Handle errors consistently with ARIA attributes
5. For booleans, use "true"/"false" strings (FormData compatibility)

## Critical: FormData Values

Conform works with FormData, which only supports strings:

- Text/Numbers: strings naturally (use `type="number"` for conversion)
- Booleans: MUST use `"true"` or `"false"` strings
- Never use boolean values directly with FormData

```tsx
// ✅ Correct
control.change(checked ? "true" : "false");

// ❌ Wrong - doesn't work with FormData
control.change(checked);
```
