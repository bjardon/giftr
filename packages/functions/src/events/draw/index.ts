import { db, events, participants } from "@giftr/core/db";
import type { EventBridgeEvent } from "aws-lambda";
import { and, eq } from "drizzle-orm";
import { arrayShuffle } from "@giftr/core";

export const handler = async (
  ebEvent: EventBridgeEvent<"Event.Draw", { eventId: string }>
) => {
  const { eventId } = ebEvent.detail;

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      participants: {
        where: eq(participants.status, "accepted"),
        with: {
          user: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const acceptedParticipants = event.participants;

  if (acceptedParticipants.length < 2) {
    throw new Error("At least 2 participants are required to draw");
  }

  const shuffledParticipants = arrayShuffle(acceptedParticipants);
  const assignments = shuffledParticipants.map((participant, index) => {
    const nextParticipant =
      index === shuffledParticipants.length - 1
        ? shuffledParticipants[0]
        : shuffledParticipants[index + 1];
    return {
      participantId: participant.id,
      assignedParticipantId: nextParticipant.id,
    };
  });

  await Promise.allSettled([
    ...assignments.map((assignment) =>
      db
        .update(participants)
        .set({
          recipientId: assignment.assignedParticipantId,
        })
        .where(
          and(
            eq(participants.id, assignment.participantId),
            eq(participants.eventId, eventId)
          )
        )
    ),
    db
      .update(events)
      .set({
        drawnAt: new Date(),
      })
      .where(eq(events.id, eventId)),
  ]);
};
