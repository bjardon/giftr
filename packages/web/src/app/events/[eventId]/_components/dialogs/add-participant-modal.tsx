"use client";

import { parseWithZod } from "@conform-to/zod/v4";
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
import { Gift, Info, Mail, Send, Snowflake } from "lucide-react";
import { inviteParticipantSchema } from "@/lib/schemas/events";
import { inviteParticipant } from "../../actions";
import { toast } from "sonner";

interface AddParticipantModalProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddParticipantModal({
  eventId,
  open,
  onOpenChange,
}: AddParticipantModalProps) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("email", email);

    // Client-side validation
    const validation = parseWithZod(formData, {
      schema: inviteParticipantSchema,
    });
    if (validation.status !== "success") {
      setError(validation.error?.email?.[0] ?? "Email inválido");
      return;
    }

    startTransition(async () => {
      const result = await inviteParticipant(eventId, undefined, formData);

      if (result?.success) {
        toast.success("Participante agregado correctamente");
        setEmail("");
        onOpenChange(false);
      } else {
        setError(result?.error ?? "Error al enviar invitación");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="rounded-full bg-red-100 p-3">
              <Gift className="size-8 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-xl">Agregar Participante</DialogTitle>
          <DialogDescription>
            Envía una invitación para unirse a este evento de Secret Santa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo Electrónico <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="participante@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          {/* Email notification note */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4 text-muted-foreground" />
            <span>Recibirán una invitación por correo electrónico</span>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Los participantes pueden aceptar o rechazar la invitación por
              correo electrónico
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
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? (
                "Enviando..."
              ) : (
                <>
                  Enviar Invitación
                  <Send className="size-4 ml-2" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
