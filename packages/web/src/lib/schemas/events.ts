import { z } from "zod";
import { isBefore, parseISO } from "date-fns";

/**
 * Zod schema for creating a new event
 * Matches the Drizzle events schema defined in @giftr/core/db/schema.ts
 */
export const createEventSchema = z
  .object({
    title: z
      .string("El título del evento es requerido")
      .trim()
      .min(1, "El título del evento es requerido")
      .max(255, "El título del evento no puede exceder los 255 caracteres"),
    topic: z
      .string()
      .trim()
      .max(255, "El tema del evento no puede exceder los 255 caracteres")
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
    instructions: z
      .string("Las instrucciones del evento son requeridas")
      .min(1, "Las instrucciones del evento son requeridas"),
    budget: z
      .number("El presupuesto debe ser un número válido")
      .positive("El presupuesto debe ser un número positivo"),
    currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD", "MXN"], {
      message:
        "La moneda debe ser una de las siguientes: USD, EUR, GBP, CAD, AUD, MXN",
    }),
    scheduledOn: z.iso.date("La fecha del evento debe ser una fecha válida"),
    enableAutomaticDraw: z.string().transform((val) => val === "true"),
    scheduledDrawAt: z.iso
      .datetime({ local: true, error: "Formato de fecha y hora inválido" })
      .optional(),
  })
  .refine(
    (data) => {
      console.log("data.scheduledOn", data.scheduledOn);
      console.log(parseISO(data.scheduledOn));
      return !isBefore(parseISO(data.scheduledOn), new Date());
    },
    {
      error: "La fecha del evento no puede ser en el pasado",
      path: ["scheduledOn"],
    }
  )
  .refine(
    (data) => {
      // If automatic draw is enabled, scheduledDrawAt must be provided
      if (!data.enableAutomaticDraw) return true;
      return !!data.scheduledDrawAt;
    },
    {
      error:
        "La fecha y hora de sorteo es requerida cuando el sorteo automático está activado",
      path: ["scheduledDrawAt"],
    }
  )
  .refine(
    (data) => {
      // If drawDateTime is provided, it must not be after exchangeDate
      if (!data.scheduledDrawAt) return true;

      const scheduledDrawAt = parseISO(data.scheduledDrawAt);
      const scheduledOn = parseISO(data.scheduledOn);
      return isBefore(scheduledDrawAt, scheduledOn);
    },
    {
      error:
        "La fecha y hora de sorteo no puede ser posterior a la fecha del evento",
      path: ["scheduledDrawAt"],
    }
  );

export type CreateEventFormData = z.infer<typeof createEventSchema>;
