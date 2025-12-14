"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-brand hover:bg-brand/90 text-brand-foreground disabled:opacity-50"
    >
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Creando...
        </>
      ) : (
        "Crear evento"
      )}
    </Button>
  );
}
