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
import { Calendar, Shuffle, Snowflake } from "lucide-react";
import { enableAutoDraw, updateAutoDraw } from "../../actions";
import { toast } from "sonner";
import { format } from "date-fns";

interface ScheduleDrawDialogProps {
  eventId: string;
  /** If provided, this is an update operation; otherwise it's enabling */
  currentScheduledAt?: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDrawDialog({
  eventId,
  currentScheduledAt,
  open,
  onOpenChange,
}: ScheduleDrawDialogProps) {
  const [isPending, startTransition] = useTransition();

  // Format the initial date for datetime-local input
  const getInitialValue = () => {
    if (currentScheduledAt) {
      return format(currentScheduledAt, "yyyy-MM-dd'T'HH:mm");
    }
    return "";
  };

  const [scheduledAt, setScheduledAt] = useState(getInitialValue);
  const [error, setError] = useState<string | null>(null);

  const isUpdate = !!currentScheduledAt;

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setScheduledAt(getInitialValue());
      setError(null);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!scheduledAt) {
      setError("La fecha y hora son requeridas");
      return;
    }

    // Basic validation: must be in the future
    const selectedDate = new Date(scheduledAt);
    if (selectedDate <= new Date()) {
      setError("La fecha debe ser en el futuro");
      return;
    }

    startTransition(async () => {
      const action = isUpdate ? updateAutoDraw : enableAutoDraw;
      const result = await action(eventId, scheduledAt);

      if (result?.success) {
        toast.success(
          isUpdate
            ? "Sorteo automático actualizado"
            : "Sorteo automático activado"
        );
        onOpenChange(false);
      } else {
        setError(result?.error ?? "Error al programar el sorteo");
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

        <DialogHeader className="text-center sm:text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-info/10 p-3">
              <Shuffle className="size-8 text-info" />
            </div>
          </div>
          <DialogTitle className="text-xl">
            {isUpdate
              ? "Actualizar Sorteo Automático"
              : "Activar Sorteo Automático"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Cambia la fecha y hora en que se realizará el sorteo automáticamente"
              : "Programa una fecha y hora para que el sorteo se realice automáticamente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">
              Fecha y hora del sorteo{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Calendar className="size-4" />
              </span>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className={`pl-10 ${
                  error
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                    : ""
                }`}
                disabled={isPending}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="bg-info/10 border border-info/30 rounded-md p-3 flex items-start gap-3">
            <Calendar className="size-5 text-info shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              El sorteo se realizará automáticamente en la fecha y hora
              seleccionada. Los participantes recibirán su asignación por
              correo.
            </p>
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
              className="flex-1 sm:flex-none"
            >
              {isPending
                ? "Guardando..."
                : isUpdate
                ? "Actualizar"
                : "Activar sorteo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
