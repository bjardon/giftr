"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useActionState } from "react";
import { createEvent } from "../actions";
import { createEventSchema } from "@/lib/schemas/events";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormSwitch,
  FormDatePicker,
} from "@/components/form";
import { SubmitButton } from "./submit-button";

const CURRENCY_OPTIONS = [
  { value: "MXN", label: "MXN" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
];

export function EventForm() {
  const [lastResult, formAction] = useActionState(createEvent, undefined);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createEventSchema });
    },
    defaultValue: {
      budget: "500",
      currency: "MXN",
      enableAutomaticDraw: "false",
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={formAction}
      noValidate
      className="space-y-6"
    >
      {form.errors && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {Array.isArray(form.errors)
            ? form.errors.map((error, index) => <div key={index}>{error}</div>)
            : form.errors}
        </div>
      )}

      {/* Event Title */}
      <div className="space-y-2">
        <Label htmlFor={fields.title.id}>
          Título del evento <span className="text-destructive">*</span>
        </Label>
        <Input
          id={fields.title.id}
          name={fields.title.name}
          type="text"
          placeholder="e.g., Navidad 2025"
          defaultValue={fields.title.initialValue}
          key={fields.title.key}
          aria-invalid={fields.title.errors ? true : undefined}
          aria-describedby={
            fields.title.errors ? fields.title.errorId : undefined
          }
          className={
            fields.title.errors
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
              : ""
          }
        />
        {fields.title.errors && (
          <div id={fields.title.errorId} className="text-sm text-destructive">
            {fields.title.errors}
          </div>
        )}
      </div>

      {/* Topic or Theme */}
      <div className="space-y-2">
        <Label htmlFor={fields.topic.id}>
          Tema del evento{" "}
          <span className="text-muted-foreground">(Opcional)</span>
        </Label>
        <Input
          id={fields.topic.id}
          name={fields.topic.name}
          type="text"
          placeholder="e.g., Navidad, Año Nuevo, Intercambio de calcetines, etc."
          defaultValue={fields.topic.initialValue}
          key={fields.topic.key}
        />
        {fields.topic.errors && (
          <div id={fields.topic.errorId} className="text-sm text-destructive">
            {fields.topic.errors}
          </div>
        )}
      </div>

      {/* Event Instructions */}
      <FormTextarea
        field={fields.instructions}
        label="Instrucciones del evento"
        required
        placeholder="Añade detalles sobre las reglas del intercambio de regalos, información de envío, o cualquier instrucción especial..."
        toolbar={
          <>
            <button
              type="button"
              className="p-1.5 hover:bg-accent rounded transition-colors"
              aria-label="Bold"
            >
              <Bold className="size-4" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-accent rounded transition-colors"
              aria-label="Italic"
            >
              <Italic className="size-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              type="button"
              className="p-1.5 hover:bg-accent rounded transition-colors"
              aria-label="Bullet List"
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-accent rounded transition-colors"
              aria-label="Numbered List"
            >
              <ListOrdered className="size-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              type="button"
              className="p-1.5 hover:bg-accent rounded transition-colors"
              aria-label="Link"
            >
              <LinkIcon className="size-4" />
            </button>
          </>
        }
      />

      {/* Budget and Currency Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          field={fields.currency}
          label="Moneda"
          required
          placeholder="Selecciona una moneda"
          options={CURRENCY_OPTIONS}
          className="w-full"
        />
        <FormInput
          field={fields.budget}
          label="Presupuesto"
          required
          type="number"
          min="0"
          step="0.01"
          prefix="$"
        />
      </div>

      {/* Gift Exchange Date */}
      <div className="space-y-2 pt-2">
        <Label htmlFor={fields.scheduledOn.id}>
          Fecha del evento <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id={fields.scheduledOn.id}
            name={fields.scheduledOn.name}
            type="date"
            placeholder="Selecciona la fecha del evento"
            defaultValue={fields.scheduledOn.initialValue}
            key={fields.scheduledOn.key}
            required={fields.enableAutomaticDraw.value === "true"}
          />
          {/* <Clock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" /> */}
        </div>
        {fields.scheduledOn.errors && (
          <div
            id={fields.scheduledOn.errorId}
            className="text-sm text-destructive"
          >
            {fields.scheduledOn.errors}
          </div>
        )}
      </div>

      {/* Automatic Draw Toggle */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <FormSwitch
          field={fields.enableAutomaticDraw}
          label="Activar sorteo automático"
          description="Programa un sorteo automático para que los nombres se asignen automáticamente en la fecha y hora especificadas. Si está desactivado, deberás sortear manualmente cuando lo desees."
        />

        {fields.enableAutomaticDraw.value === "true" && (
          <div className="space-y-2 pt-2">
            <Label htmlFor={fields.scheduledDrawAt.id}>
              Fecha y hora de sorteo <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id={fields.scheduledDrawAt.id}
                name={fields.scheduledDrawAt.name}
                type="datetime-local"
                placeholder="Selecciona la fecha y la hora"
                defaultValue={fields.scheduledDrawAt.initialValue}
                key={fields.scheduledDrawAt.key}
                required={fields.enableAutomaticDraw.value === "true"}
                className="pr-10"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
            {fields.scheduledDrawAt.errors && (
              <div
                id={fields.scheduledDrawAt.errorId}
                className="text-sm text-destructive"
              >
                {fields.scheduledDrawAt.errors}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Link href="/events">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
