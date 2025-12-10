# Common Patterns

## Creating a New Form

```tsx
"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { FormInput, FormSelect } from "@/components/form";
import { mySchema } from "@/lib/schemas/my-schema";
import { myAction } from "./actions";

export function MyForm() {
  const [lastResult, formAction] = useActionState(myAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: mySchema });
    },
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction}>
      <FormInput field={fields.name} label="Name" required />
      <FormSelect field={fields.type} label="Type" options={options} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Page Structure

```tsx
// page.tsx - Layout only
export default function MyPage() {
  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>My Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <MyForm />
        </CardContent>
      </Card>
    </Container>
  );
}
```

## Server Action

```tsx
"use server";

import { parseWithZod } from "@conform-to/zod";
import { mySchema } from "@/lib/schemas/my-schema";

export async function myAction(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: mySchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Process data
  const data = submission.value;

  // Save to database...

  return submission.reply({ resetForm: true });
}
```

## Validation Schema

```tsx
import { z } from "zod";

export const mySchema = z.object({
  name: z.string().min(1, "Required"),
  budget: z.string().regex(/^\d+(\.\d{2})?$/, "Invalid format"),
  enabled: z.enum(["true", "false"]), // Booleans as strings for FormData
});
```
