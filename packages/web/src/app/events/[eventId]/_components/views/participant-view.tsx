"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, FileText, Users } from "lucide-react";
import { EventInfoCard } from "../cards/event-info-card";
import { RecipientRevealCard } from "../cards/recipient-reveal-card";
import { WishlistCard } from "../cards/wishlist-card";

// Helper function to get avatar color
const getAvatarColor = () => {
  return "bg-accent";
};

interface WishlistItem {
  id: string;
  name: string;
  link: string;
  notes: string | null;
}

interface RecipientData {
  name: string;
  wishlistItems: WishlistItem[];
}

interface ParticipantViewProps {
  eventId: string;
  participantId: string;
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
  recipient: RecipientData | null;
  wishlistItems: WishlistItem[];
}

export function ParticipantView({
  eventId,
  participantId,
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
  recipient,
  wishlistItems,
}: ParticipantViewProps) {
  const isDrawn = !!drawnAt;
  const showRecipientCard = isDrawn && !!recipient;

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
                        className={`${getAvatarColor()} text-accent-foreground`}
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
                          <Crown className="size-3 text-warning shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {participant.user.email}
                      </p>
                    </div>
                    <Badge
                      className={
                        participant.status === "accepted"
                          ? "bg-success text-success-foreground border-0"
                          : participant.status === "declined"
                          ? "bg-destructive text-destructive-foreground border-0"
                          : "bg-warning text-warning-foreground border-0"
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
        {showRecipientCard && recipient ? (
          <RecipientRevealCard
            recipientName={recipient.name}
            wishlistItems={recipient.wishlistItems}
            budget={budget}
          />
        ) : (
          <WishlistCard
            eventId={eventId}
            participantId={participantId}
            wishlistItems={wishlistItems}
          />
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
