"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, ExternalLink, FileText, Snowflake, Users } from "lucide-react";
import Link from "next/link";
import { EventInfoCard } from "../cards/event-info-card";
import { RecipientRevealCard } from "../cards/recipient-reveal-card";

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

interface ParticipantViewProps {
  eventId: string;
  topic: string | null;
  scheduledOn: string;
  budget: string;
  currency: string;
  drawnAt: Date | null;
  instructions: string;
  organizerId: string;
  organizerName: string;
  currentUserId: string;
  participants: Array<{
    id: string;
    status: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  hasRecipient: boolean;
  wishlistItems: Array<{
    id: string;
    name: string;
    link: string;
    notes: string | null;
  }>;
}

export function ParticipantView({
  eventId,
  topic,
  scheduledOn,
  budget,
  currency,
  drawnAt,
  instructions,
  organizerId,
  organizerName,
  currentUserId,
  participants,
  hasRecipient,
  wishlistItems,
}: ParticipantViewProps) {
  const isDrawn = !!drawnAt;
  const showRecipientCard = isDrawn && hasRecipient;

  // Sort participants so current user is always first
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.user.id === currentUserId) return -1;
    if (b.user.id === currentUserId) return 1;
    return 0;
  });

  // Count accepted participants
  const acceptedCount = participants.filter(
    (p) => p.status === "accepted"
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Event Info Card */}
        <EventInfoCard
          eventId={eventId}
          topic={topic}
          scheduledOn={scheduledOn}
          budget={budget}
          currency={currency}
          drawnAt={drawnAt}
          scheduledDrawAt={null}
          isOrganizer={false}
          organizerName={organizerName}
        />

        {/* Participants Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Participantes
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {acceptedCount} confirmados / {participants.length} invitados
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Participants List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sortedParticipants.map((participant) => {
                const initials = participant.user.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase();
                const isOrganizer = participant.user.id === organizerId;
                const isSelf = participant.user.id === currentUserId;

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
                          {isSelf && (
                            <span className="text-muted-foreground font-normal">
                              {" "}
                              (Yo)
                            </span>
                          )}
                        </p>
                        {isOrganizer && (
                          <Crown className="size-3 text-amber-500 shrink-0" />
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
                          : participant.status === "declined"
                          ? "bg-red-500 text-white border-0"
                          : "bg-yellow-500 text-white border-0"
                      }
                    >
                      {participant.status === "accepted"
                        ? "Confirmado"
                        : participant.status === "declined"
                        ? "Declinado"
                        : "Pendiente"}
                    </Badge>
                  </div>
                );
              })}

              {participants.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay participantes todavía.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Recipient Reveal Card OR Wishlist Card */}
        {showRecipientCard ? (
          <RecipientRevealCard eventId={eventId} />
        ) : (
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
                  href={`/events/${eventId}/wishlist`}
                  className="text-sm text-destructive hover:underline flex items-center gap-1"
                >
                  Gestionar lista de deseos
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.link && (
                    <a
                      href={
                        item.link.startsWith("http")
                          ? item.link
                          : `https://${item.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {item.link}
                    </a>
                  )}
                  {item.notes && (
                    <p className="text-xs text-muted-foreground">{item.notes}</p>
                  )}
                </div>
              ))}
              {wishlistItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No has agregado artículos a tu lista de deseos.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions Card (read-only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Instrucciones del evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{instructions}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
