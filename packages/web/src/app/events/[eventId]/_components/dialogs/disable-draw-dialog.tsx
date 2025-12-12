"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { disableAutoDraw } from "../../actions";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface DisableDrawDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisableDrawDialog({
  eventId,
  open,
  onOpenChange,
}: DisableDrawDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDisable = () => {
    startTransition(async () => {
      const result = await disableAutoDraw(eventId);

      if (result?.success) {
        toast.success("Sorteo automático desactivado");
        onOpenChange(false);
      } else {
        toast.error(result?.error ?? "Error al desactivar el sorteo");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desactivar sorteo automático?</AlertDialogTitle>
          <AlertDialogDescription>
            El sorteo automático programado será cancelado. Podrás activarlo
            nuevamente en cualquier momento o realizar el sorteo manualmente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDisable} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="size-4" />
                Desactivando...
              </>
            ) : (
              "Desactivar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
