import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Container } from "@/components/layout/container";
import {
  Gift,
  Calendar,
  DollarSign,
  Clock,
  Hash,
  Snowflake,
  Pencil,
  Trash2,
  Plus,
  MoreVertical,
  Crown,
  ExternalLink,
  Info,
  Shuffle,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, events, participants, users } from "@giftr/core/db";

// Helper function to get avatar color
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-purple-500",
    "bg-amber-600",
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

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
  // const instructions = JSON.parse(event.instructions);

  const acceptedCount = event.participants.filter(
    (p) => p.status === "accepted"
  ).length;
  const totalCount = event.participants.length;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-blue-50/30">
      {/* Decorative snowflakes */}
      <div className="absolute top-20 right-10 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-8" />
      </div>
      <div className="absolute top-1/3 left-10 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-6" />
      </div>
      <div className="absolute bottom-20 right-20 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-7" />
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card className="relative">
              <div className="absolute top-2 left-2 text-muted-foreground/20">
                <Snowflake className="size-4" />
              </div>
              <div className="absolute top-2 right-2 text-muted-foreground/20">
                <Snowflake className="size-4" />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-1">
                      {event.title}
                    </CardTitle>
                    {!isOrganizer && (
                      <p className="text-sm text-muted-foreground">
                        Organizado por {event.organizer.name}
                      </p>
                    )}
                  </div>
                  <Badge className="bg-green-500 text-white border-0">
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gift className="size-4" />
                  <span className="text-sm">{event.topic}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" />
                  <span className="text-sm">{event.scheduledOn}</span>
                </div>
                {isOrganizer && (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="size-4" />
                      <span className="text-sm">{event.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4" />
                      <span className="text-sm">
                        Sorteado el {event.drawnAt?.toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="size-4" />
                  <span className="text-sm">{event.budget}</span>
                </div>
              </CardContent>
            </Card>

            {/* Event Instructions Card */}
            <Card className="relative">
              <div className="absolute top-2 left-2 text-muted-foreground/20">
                <Snowflake className="size-4" />
              </div>
              <div className="absolute top-2 right-2 text-muted-foreground/20">
                <Snowflake className="size-4" />
              </div>
              <CardHeader>
                <CardTitle>Instrucciones del evento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                  <li>Instrucciones</li>{" "}
                  {/* TODO: display formatted instructions */}
                </ul>
                <div className="flex justify-center mt-4">
                  <Snowflake className="size-4 text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>

            {/* Owner-specific: Event Actions Card */}
            {isOrganizer && (
              <Card className="relative">
                <div className="absolute top-2 left-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <div className="absolute top-2 right-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <CardHeader>
                  <CardTitle>Acciones del evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/events/${event.id}/edit`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Pencil className="size-4 mr-2" />
                      Editar evento
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Shuffle className="size-4 mr-2" />
                    Sortear nuevamente
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Eliminar evento
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Owner View: Participants Card */}
            {isOrganizer && (
              <Card className="relative">
                <div className="absolute top-2 left-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <div className="absolute top-2 right-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Participantes</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {totalCount} total • {acceptedCount} aceptados
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full border-dashed">
                    <Plus className="size-4 mr-2" />
                    Agregar participante
                  </Button>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {event.participants.map((participant) => {
                      const initials = participant.user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("");
                      const isOrganizerParticipant =
                        participant.user.id === event.organizer.id;
                      return (
                        <div
                          key={participant.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <Avatar>
                            <AvatarFallback
                              className={`${getAvatarColor(
                                participant.user.name
                              )} text-white`}
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">
                                {participant.user.name}
                              </p>
                              {isOrganizerParticipant && (
                                <Crown className="size-3 text-amber-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {participant.user.email}
                            </p>
                          </div>
                          <Badge
                            className={
                              participant.status === "accepted"
                                ? "bg-green-500 text-white border-0"
                                : "bg-yellow-500 text-white border-0"
                            }
                          >
                            {participant.status.charAt(0).toUpperCase() +
                              participant.status.slice(1)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Los participantes pueden ver a los demás después de aceptar.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Secret Santa Assignment Card */}
            <Card className="relative bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <div className="absolute top-2 left-2 text-green-200/30">
                <Snowflake className="size-4" />
              </div>
              <div className="absolute top-2 right-2 text-green-200/30">
                <Snowflake className="size-4" />
              </div>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Gift className="size-8 text-green-600" />
                </div>
                <CardTitle>Tu asignación de Secret Santa</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Estás comprando un regalo para:
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {userParticipation?.recipient?.user?.name}
                </p>
                <Link href={`/events/${event.id}/recipient`} className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    {!isOrganizer ? (
                      <>
                        <Gift className="size-4 mr-2" />
                        Ver{" "}
                        {userParticipation?.recipient?.user?.name.split(" ")[0]}
                        &apos;s Wishlist
                      </>
                    ) : (
                      <>
                        Ver lista de deseos <span className="ml-1">&gt;</span>
                      </>
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Participant View: My Wishlist Card */}
            {!isOrganizer && (
              <Card className="relative">
                <div className="absolute top-2 left-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <div className="absolute top-2 right-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Mi lista de deseos</CardTitle>
                    <Link
                      href={`/events/${event.id}/wishlist`}
                      className="text-sm text-destructive hover:underline flex items-center gap-1"
                    >
                      Gestionar lista de deseos
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userParticipation?.recipient?.wishlistItems.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.link && (
                        <a
                          href={`https://${item.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {item.link}
                        </a>
                      )}
                      {/* {item.store && (
                        <p className="text-xs text-muted-foreground">
                          {item.store}
                        </p>
                      )} */}
                      <p className="text-xs text-muted-foreground">
                        {item.notes}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Participant View: Other Participants Card */}
            {!isOrganizer && (
              <Card className="relative">
                <div className="absolute top-2 left-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <div className="absolute top-2 right-2 text-muted-foreground/20">
                  <Snowflake className="size-4" />
                </div>
                <CardHeader>
                  <div>
                    <CardTitle>Otros participantes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.participants.length} otros participantes
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {event.participants.slice(0, 6).map((participant) => {
                      const initials = participant.user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("");
                      const isOrganizerParticipant =
                        participant.user.id === event.organizer.id;
                      return (
                        <div
                          key={participant.id}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarFallback
                                className={`${getAvatarColor(
                                  participant.user.name
                                )} text-white`}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            {isOrganizerParticipant && (
                              <Crown className="absolute -top-1 -right-1 size-3 text-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-center font-medium">
                            {participant.user.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participant View: Info Banner */}
            {!isOrganizer && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Los nombres han sido sorteados! Revisa tu asignación arriba
                  para ver a quién estás comprando.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
