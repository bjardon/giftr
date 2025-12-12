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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Pencil, Snowflake, Tag, Type } from "lucide-react";
import { updateEvent } from "../../actions";
import { toast } from "sonner";

interface EditEventDialogProps {
  eventId: string;
  currentTitle: string;
  currentTopic: string | null;
  currentBudget: string;
  currentCurrency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const currencies = [
  { value: "USD", label: "USD - Dólar estadounidense", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - Libra esterlina", symbol: "£" },
  { value: "CAD", label: "CAD - Dólar canadiense", symbol: "CA$" },
  { value: "AUD", label: "AUD - Dólar australiano", symbol: "A$" },
  { value: "MXN", label: "MXN - Peso mexicano", symbol: "$" },
];

export function EditEventDialog({
  eventId,
  currentTitle,
  currentTopic,
  currentBudget,
  currentCurrency,
  open,
  onOpenChange,
}: EditEventDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(currentTitle);
  const [topic, setTopic] = useState(currentTopic ?? "");
  const [budget, setBudget] = useState(currentBudget);
  const [currency, setCurrency] = useState(currentCurrency);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens with current values
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTitle(currentTitle);
      setTopic(currentTopic ?? "");
      setBudget(currentBudget);
      setCurrency(currentCurrency);
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Basic client-side validation
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    }
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = "El presupuesto debe ser un número positivo";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      const result = await updateEvent(eventId, {
        title: title.trim(),
        topic: topic.trim() || null,
        budget: budgetNum,
        currency,
      });

      if (result?.success) {
        toast.success("Evento actualizado correctamente");
        onOpenChange(false);
      } else {
        toast.error(result?.error ?? "Error al actualizar el evento");
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
            <div className="rounded-full bg-blue-100 p-3">
              <Pencil className="size-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-xl">Editar Evento</DialogTitle>
          <DialogDescription>
            Actualiza los detalles de tu evento de Secret Santa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Type className="size-4" />
              </span>
              <Input
                id="title"
                type="text"
                placeholder="Nombre del evento"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`pl-10 ${
                  errors.title
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                    : ""
                }`}
                disabled={isPending}
              />
            </div>
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Tema (opcional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Tag className="size-4" />
              </span>
              <Input
                id="topic"
                type="text"
                placeholder="Ej: Navidad, Cumpleaños..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="pl-10"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Budget and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">
                Presupuesto <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <DollarSign className="size-4" />
                </span>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={`pl-10 ${
                    errors.budget
                      ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                      : ""
                  }`}
                  disabled={isPending}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={currency}
                onValueChange={setCurrency}
                disabled={isPending}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              className="flex-1 sm:flex-none"
            >
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

