"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db, events, users } from "@giftr/core/db";
import { eq } from "drizzle-orm";
import { parseWithZod } from "@conform-to/zod/v4";
import { createEventSchema } from "@/lib/schemas/events";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function createEvent(_: unknown, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Get the user from the database
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    redirect("/");
  }

  // Parse and validate with Conform
  const submission = parseWithZod(formData, {
    schema: createEventSchema,
  });

  // Send the submission back to the client if validation fails
  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = submission.value;

  try {
    // Create the event
    const [event] = await db
      .insert(events)
      .values({
        organizerId: user.id,
        title: data.title,
        topic: data.topic || null,
        instructions: data.instructions,
        budget: data.budget.toString(),
        currency: data.currency,
        scheduledOn: data.scheduledOn,
        scheduledDrawAt: data.scheduledDrawAt
          ? new Date(data.scheduledDrawAt)
          : null,
      })
      .returning();

    // Redirect to the events list page with success query param
    redirect(`/events?created=${event.id}`);
  } catch (error) {
    // Rethrow redirect errors
    if (isRedirectError(error)) {
      throw error;
    }

    // Log other errors
    console.error("Error creating event:", error);
    return submission.reply({
      formErrors: ["Failed to create event. Please try again."],
    });
  }
}
