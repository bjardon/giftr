"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Gift,
  Link as LinkIcon,
  Snowflake,
  Type,
  FileText,
} from "lucide-react";
import { addWishlistItem, updateWishlistItem } from "../../actions";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  name: string;
  link: string;
  notes: string | null;
}

interface WishlistItemDialogProps {
  eventId: string;
  participantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WishlistItem;
}

export function WishlistItemDialog({
  eventId,
  participantId,
  open,
  onOpenChange,
  item,
}: WishlistItemDialogProps) {
  const isEditing = !!item;
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(item?.name ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setName(item?.name ?? "");
      setLink(item?.link ?? "");
      setNotes(item?.notes ?? "");
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Basic client-side validation
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      const data = {
        name: name.trim(),
        link: link.trim(),
        notes: notes.trim(),
      };

      const result = isEditing
        ? await updateWishlistItem(eventId, item.id, data)
        : await addWishlistItem(eventId, participantId, data);

      if (result?.success) {
        toast.success(
          isEditing
            ? "Artículo actualizado correctamente"
            : "Artículo agregado correctamente"
        );
        onOpenChange(false);
      } else {
        toast.error(result?.error ?? "Error al guardar el artículo");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Decorative snowflakes */}
        <div className="absolute top-4 left-6 text-muted-foreground/20">
          <Snowflake className="size-4" />
        </div>
        <div className="absolute top-4 right-12 text-muted-foreground/20">
          <Snowflake className="size-4" />
        </div>
        <div className="absolute top-12 left-12 text-muted-foreground/20">
          <Snowflake className="size-3" />
        </div>
        <div className="absolute top-12 right-6 text-muted-foreground/20">
          <Snowflake className="size-3" />
        </div>

        <DialogHeader className="text-center sm:text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-brand/10 p-3">
              <Gift className="size-8 text-brand" />
            </div>
          </div>
          <DialogTitle className="text-xl">
            {isEditing ? "Editar Artículo" : "Agregar Artículo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los detalles de tu artículo"
              : "Agrega un artículo a tu lista de deseos"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Type className="size-4" />
              </span>
              <Input
                id="name"
                type="text"
                placeholder="¿Qué te gustaría recibir?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`pl-10 ${
                  errors.name
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                    : ""
                }`}
                disabled={isPending}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Link or Store */}
          <div className="space-y-2">
            <Label htmlFor="link">Link o tienda (opcional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <LinkIcon className="size-4" />
              </span>
              <Input
                id="link"
                type="text"
                placeholder="https://... o nombre de tienda"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="pl-10"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">
                <FileText className="size-4" />
              </span>
              <textarea
                id="notes"
                placeholder="Talla, color, preferencias..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[80px] rounded-md border px-3 py-2 pl-10 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm placeholder:text-muted-foreground resize-none focus-visible:border-ring focus-visible:ring-ring/50"
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none bg-brand hover:bg-brand/90 text-brand-foreground"
            >
              {isPending
                ? "Guardando..."
                : isEditing
                ? "Guardar cambios"
                : "Agregar artículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
