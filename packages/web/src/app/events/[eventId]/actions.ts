"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, events, participants, users } from "@giftr/core/db";
import { and, eq } from "drizzle-orm";
import { parseWithZod } from "@conform-to/zod/v4";
import {
  inviteParticipantSchema,
  updateEventSchema,
  scheduleDrawSchema,
} from "@/lib/schemas/events";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * Helper to get authenticated user and verify organizer access
 */
async function getAuthenticatedOrganizer(eventId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    redirect("/");
  }

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) {
    return { user, event: null, isOrganizer: false };
  }

  const isOrganizer = event.organizerId === user.id;

  return { user, event, isOrganizer };
}

/**
 * Invite a participant by email
 */
export async function inviteParticipant(
  eventId: string,
  _: unknown,
  formData: FormData
) {
  const { user, event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para invitar participantes",
    };
  }

  const submission = parseWithZod(formData, {
    schema: inviteParticipantSchema,
  });

  if (submission.status !== "success") {
    const emailError = submission.error?.email?.[0];
    return {
      success: false,
      error: emailError ?? "Email inválido",
    };
  }

  const { email } = submission.value;

  try {
    // Check if user exists in the system
    let invitedUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // If user doesn't exist, create a placeholder user
    if (!invitedUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name: email, // Use email as temporary name
          clerkId: `pending_${email}`, // Placeholder until they sign up
        })
        .returning();
      invitedUser = newUser;
    }

    // Check if already a participant
    const existingParticipant = await db.query.participants.findFirst({
      where: and(
        eq(participants.eventId, eventId),
        eq(participants.userId, invitedUser.id)
      ),
    });

    if (existingParticipant) {
      return {
        success: false,
        error: "Este usuario ya es participante del evento",
      };
    }

    // Create participant with pending status
    await db.insert(participants).values({
      eventId,
      userId: invitedUser.id,
      status: "pending",
    });

    // TODO: Send invitation email

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error inviting participant:", error);
    return {
      success: false,
      error: "Error al invitar participante. Intenta de nuevo.",
    };
  }
}

/**
 * Remove a participant from the event
 */
export async function removeParticipant(
  eventId: string,
  participantId: string
) {
  const { event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para eliminar participantes",
    };
  }

  try {
    // Don't allow removing if event has been drawn
    if (event.drawnAt) {
      return {
        success: false,
        error: "No puedes eliminar participantes después del sorteo",
      };
    }

    await db.delete(participants).where(eq(participants.id, participantId));

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error removing participant:", error);
    return { success: false, error: "Error al eliminar participante" };
  }
}

/**
 * Organizer joins as a participant
 */
export async function joinAsParticipant(eventId: string) {
  const { user, event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para unirte a este evento",
    };
  }

  try {
    // Check if already participating
    const existingParticipant = await db.query.participants.findFirst({
      where: and(
        eq(participants.eventId, eventId),
        eq(participants.userId, user.id)
      ),
    });

    if (existingParticipant) {
      return { success: false, error: "Ya eres participante de este evento" };
    }

    // Create participant with accepted status (organizer auto-accepts)
    await db.insert(participants).values({
      eventId,
      userId: user.id,
      status: "accepted",
    });

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error joining event:", error);
    return { success: false, error: "Error al unirte al evento" };
  }
}

/**
 * Leave the event (for organizer who is participating)
 */
export async function leaveEvent(eventId: string, participantId: string) {
  const { user, event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event) {
    return { success: false, error: "Evento no encontrado" };
  }

  try {
    // Verify the participant belongs to the current user
    const participant = await db.query.participants.findFirst({
      where: and(
        eq(participants.id, participantId),
        eq(participants.userId, user.id)
      ),
    });

    if (!participant) {
      return { success: false, error: "No eres participante de este evento" };
    }

    // Don't allow leaving if event has been drawn
    if (event.drawnAt) {
      return {
        success: false,
        error: "No puedes abandonar el evento después del sorteo",
      };
    }

    await db.delete(participants).where(eq(participants.id, participantId));

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error leaving event:", error);
    return { success: false, error: "Error al abandonar el evento" };
  }
}

/**
 * Delete the event
 */
export async function deleteEvent(eventId: string) {
  const { event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para eliminar este evento",
    };
  }

  try {
    // Delete all participants first (cascade)
    await db.delete(participants).where(eq(participants.eventId, eventId));

    // Delete the event
    await db.delete(events).where(eq(events.id, eventId));

    redirect("/events?deleted=true");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Error deleting event:", error);
    return { success: false, error: "Error al eliminar el evento" };
  }
}

/**
 * Update event details (title, topic, budget, currency)
 */
export async function updateEvent(
  eventId: string,
  data: {
    title: string;
    topic: string | null;
    budget: number;
    currency: string;
  }
) {
  const { event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para editar este evento",
    };
  }

  // Validate data with schema
  const validationResult = updateEventSchema.safeParse(data);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0];
    return {
      success: false,
      error: firstError ?? "Datos inválidos",
    };
  }

  try {
    await db
      .update(events)
      .set({
        title: validationResult.data.title,
        topic: validationResult.data.topic,
        budget: validationResult.data.budget.toString(),
        currency: validationResult.data.currency,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Error al actualizar el evento" };
  }
}

/**
 * Enable auto-draw by setting a scheduled draw date
 */
export async function enableAutoDraw(eventId: string, scheduledDrawAt: string) {
  const { event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para programar el sorteo",
    };
  }

  // Don't allow if already drawn
  if (event.drawnAt) {
    return {
      success: false,
      error: "El evento ya ha sido sorteado",
    };
  }

  // Validate the date
  const validationResult = scheduleDrawSchema.safeParse({ scheduledDrawAt });

  if (!validationResult.success) {
    return {
      success: false,
      error: "Fecha y hora inválida",
    };
  }

  try {
    await db
      .update(events)
      .set({
        scheduledDrawAt: new Date(validationResult.data.scheduledDrawAt),
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    // TODO: Call external scheduling service to schedule the draw job
    // Example: await schedulerService.scheduleJob(eventId, new Date(validationResult.data.scheduledDrawAt));

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error enabling auto-draw:", error);
    return { success: false, error: "Error al programar el sorteo automático" };
  }
}

/**
 * Update the scheduled draw date
 */
export async function updateAutoDraw(eventId: string, scheduledDrawAt: string) {
  const { event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para actualizar el sorteo",
    };
  }

  // Don't allow if already drawn
  if (event.drawnAt) {
    return {
      success: false,
      error: "El evento ya ha sido sorteado",
    };
  }

  // Validate the date
  const validationResult = scheduleDrawSchema.safeParse({ scheduledDrawAt });

  if (!validationResult.success) {
    return {
      success: false,
      error: "Fecha y hora inválida",
    };
  }

  try {
    await db
      .update(events)
      .set({
        scheduledDrawAt: new Date(validationResult.data.scheduledDrawAt),
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    // TODO: Call external scheduling service to update the scheduled job
    // Example: await schedulerService.updateJob(eventId, new Date(validationResult.data.scheduledDrawAt));

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating auto-draw:", error);
    return {
      success: false,
      error: "Error al actualizar el sorteo automático",
    };
  }
}

/**
 * Disable auto-draw by setting scheduledDrawAt to null
 */
export async function disableAutoDraw(eventId: string) {
  const { event, isOrganizer } = await getAuthenticatedOrganizer(eventId);

  if (!event || !isOrganizer) {
    return {
      success: false,
      error: "No tienes permiso para desactivar el sorteo",
    };
  }

  // Don't allow if already drawn
  if (event.drawnAt) {
    return {
      success: false,
      error: "El evento ya ha sido sorteado",
    };
  }

  try {
    await db
      .update(events)
      .set({
        scheduledDrawAt: null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    // TODO: Call external scheduling service to cancel the scheduled job
    // Example: await schedulerService.cancelJob(eventId);

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error disabling auto-draw:", error);
    return {
      success: false,
      error: "Error al desactivar el sorteo automático",
    };
  }
}
