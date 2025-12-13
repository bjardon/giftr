import { Container } from "@/components/layout/container";
import { Snowflake } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, events, participants, users } from "@giftr/core/db";

import { EventHeader, OrganizerView, ParticipantView } from "./_components";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { userId } = await auth();
  const { eventId } = await params;

  if (!userId) {
    redirect("/");
  }

  const [user, event] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    }),
    db.query.events.findFirst({
      where: eq(events.id, eventId),
      with: {
        participants: {
          with: {
            user: true,
          },
        },
        organizer: true,
      },
    }),
  ]);

  if (!user) {
    redirect("/");
  }

  if (!event) {
    notFound();
  }

  const userParticipation = await db.query.participants.findFirst({
    where: and(
      eq(participants.eventId, event.id),
      eq(participants.userId, user.id)
    ),
    with: {
      user: true,
      wishlistItems: true,
      recipient: {
        with: {
          user: true,
          wishlistItems: true,
        },
      },
    },
  });

  const isOrganizer = event.organizer.id === user.id;
  const isParticipating = !!userParticipation;

  if (!isParticipating && !isOrganizer) {
    redirect("/");
  }

  const status = event.drawnAt
    ? "drawn"
    : event.scheduledDrawAt
    ? "scheduled"
    : "not started";

  // Transform participants for the card component
  const participantsData = event.participants.map((p) => ({
    id: p.id,
    status: p.status,
    user: {
      id: p.user.id,
      name: p.user.name,
      email: p.user.email,
    },
  }));

  return (
    <div className="relative min-h-screen">
      {/* Decorative snowflakes */}
      <div className="absolute top-20 right-10 text-muted-foreground/10 pointer-events-none select-none">
        <Snowflake className="size-8" />
      </div>
      <div className="absolute top-1/3 left-10 text-muted-foreground/10 pointer-events-none select-none">
        <Snowflake className="size-6" />
      </div>
      <div className="absolute bottom-20 right-20 text-muted-foreground/10 pointer-events-none select-none">
        <Snowflake className="size-7" />
      </div>

      <Container className="py-8">
        {/* Event Header */}
        <EventHeader
          eventId={event.id}
          title={event.title}
          topic={event.topic}
          budget={event.budget}
          currency={event.currency}
          status={status}
          isOrganizer={isOrganizer}
        />

        {isOrganizer ? (
          <OrganizerView
            eventId={event.id}
            topic={event.topic}
            scheduledOn={event.scheduledOn}
            budget={event.budget}
            currency={event.currency}
            drawnAt={event.drawnAt}
            scheduledDrawAt={event.scheduledDrawAt}
            instructions={event.instructions}
            participants={participantsData}
            organizerId={event.organizer.id}
            currentUserId={user.id}
            recipientName={userParticipation?.recipient?.user?.name}
            isParticipating={isParticipating}
            participantId={userParticipation?.id}
            wishlistItems={userParticipation?.wishlistItems}
          />
        ) : (
          <ParticipantView
            eventId={event.id}
            participantId={userParticipation!.id}
            topic={event.topic}
            scheduledOn={event.scheduledOn}
            budget={event.budget}
            currency={event.currency}
            drawnAt={event.drawnAt}
            instructions={event.instructions}
            organizerId={event.organizer.id}
            organizerName={event.organizer.name}
            currentUserId={user.id}
            participants={participantsData}
            hasRecipient={!!userParticipation?.recipient}
            wishlistItems={userParticipation?.wishlistItems ?? []}
          />
        )}
      </Container>
    </div>
  );
}
