import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db, events, participants, users } from "@giftr/core/db";
import { Plus, Snowflake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/container";
import { EventCard } from "./_components/event-card";
import { ToastHandler } from "./_components/toast-handler";

export default async function EventsPage() {
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

  const [organizingEvents, userParticipations] = await Promise.all([
    db.query.events.findMany({
      where: eq(events.organizerId, user.id),
      with: {
        participants: true,
        organizer: true,
      },
    }),
    db.query.participants.findMany({
      where: and(eq(participants.userId, user.id)),
      with: {
        event: {
          with: {
            participants: true,
          },
        },
      },
    }),
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <ToastHandler />
      </Suspense>
      <div className="relative min-h-screen bg-background">
        {/* Decorative snowflakes */}
        <div className="absolute top-20 right-10 text-muted-foreground/20 text-4xl pointer-events-none select-none">
          <Snowflake className="size-8" />
        </div>
        <div className="absolute top-1/2 right-20 text-muted-foreground/20 text-4xl pointer-events-none select-none">
          <Snowflake className="size-6" />
        </div>
        <div className="absolute bottom-20 left-10 text-muted-foreground/20 text-4xl pointer-events-none select-none">
          <Snowflake className="size-7" />
        </div>

        <Container className="py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Mis Eventos
                </h1>
                <p className="text-muted-foreground text-lg">
                  Organiza y participa en intercambios de regalos
                </p>
              </div>
              <Link href="/events/new">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="size-4" />
                  Crear Evento
                </Button>
              </Link>
            </div>
          </div>

          {/* Events I'm Organizing Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              Eventos que Organizo ({organizingEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  participants={event.participants ?? []}
                />
              ))}
            </div>
          </section>

          {/* Separator */}
          <div className="flex items-center gap-4 mb-12">
            <Separator className="flex-1" />
            <Snowflake className="size-4 text-muted-foreground/40" />
            <Separator className="flex-1" />
          </div>

          {/* Events I'm Participating In Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Eventos en los que Participo ({userParticipations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userParticipations.map((participant) => (
                <EventCard
                  key={participant.id}
                  event={participant.event}
                  participants={participant.event.participants ?? []}
                />
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
