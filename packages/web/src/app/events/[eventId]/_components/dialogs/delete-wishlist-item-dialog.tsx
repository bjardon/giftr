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
import { deleteWishlistItem } from "../../actions";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface DeleteWishlistItemDialogProps {
  eventId: string;
  itemId: string;
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteWishlistItemDialog({
  eventId,
  itemId,
  itemName,
  open,
  onOpenChange,
}: DeleteWishlistItemDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteWishlistItem(eventId, itemId);

      if (result?.success) {
        toast.success("Artículo eliminado correctamente");
        onOpenChange(false);
      } else {
        toast.error(result?.error ?? "Error al eliminar el artículo");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar <strong>&quot;{itemName}&quot;</strong> de
            tu lista de deseos. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Spinner className="size-4" />
                Eliminando...
              </>
            ) : (
              "Eliminar artículo"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

