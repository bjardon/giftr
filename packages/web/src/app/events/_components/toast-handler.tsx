"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const created = searchParams.get("created");
    if (created) {
      toast.success("Evento creado exitosamente", {
        description: "El evento ha sido creado y está listo para usar.",
        action: {
          label: "Ver evento",
          onClick: () => router.push(`/events/${created}`),
        },
      });
      // Clean up the query parameter
      router.replace("/events");
    }
  }, [searchParams, router]);

  return null;
}
