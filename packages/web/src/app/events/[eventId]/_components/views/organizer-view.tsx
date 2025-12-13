"use client";

import { EventInfoCard } from "../cards/event-info-card";
import { EventInstructionsCard } from "../cards/event-instructions-card";
import { ParticipantsCard } from "../cards/participants-card";
import { AssignmentCard } from "../cards/assignment-card";
import { WishlistCard } from "../cards/wishlist-card";
import { RecipientRevealCard } from "../cards/recipient-reveal-card";

interface Participant {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

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

interface OrganizerViewProps {
  eventId: string;
  topic: string | null;
  scheduledOn: string;
  budget: string;
  currency: string;
  drawnAt: Date | null;
  scheduledDrawAt: Date | null;
  instructions: string;
  participants: Participant[];
  organizerId: string;
  currentUserId: string;
  recipient: RecipientData | null;
  isParticipating: boolean;
  participantId?: string;
  wishlistItems?: WishlistItem[];
}

export function OrganizerView({
  eventId,
  topic,
  scheduledOn,
  budget,
  currency,
  drawnAt,
  scheduledDrawAt,
  instructions,
  participants,
  organizerId,
  currentUserId,
  recipient,
  isParticipating,
  participantId,
  wishlistItems,
}: OrganizerViewProps) {
  const isDrawn = !!drawnAt;
  const showRecipientCard = isDrawn && isParticipating && !!recipient;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Column */}
      <div className="space-y-6">
        <EventInfoCard
          eventId={eventId}
          topic={topic}
          scheduledOn={scheduledOn}
          budget={budget}
          currency={currency}
          drawnAt={drawnAt}
          scheduledDrawAt={scheduledDrawAt}
          isOrganizer={true}
        />

        <ParticipantsCard
          eventId={eventId}
          participants={participants}
          organizerId={organizerId}
          currentUserId={currentUserId}
          isDrawn={isDrawn}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Show AssignmentCard only when RecipientRevealCard is not being shown */}
        {!showRecipientCard && (
          <AssignmentCard
            recipientName={recipient?.name}
            isDrawn={isDrawn}
            isParticipating={isParticipating}
          />
        )}

        {isParticipating &&
          participantId &&
          (showRecipientCard && recipient ? (
            <RecipientRevealCard
              recipientName={recipient.name}
              wishlistItems={recipient.wishlistItems}
              budget={budget}
            />
          ) : wishlistItems ? (
            <WishlistCard
              eventId={eventId}
              participantId={participantId}
              wishlistItems={wishlistItems}
            />
          ) : null)}

        <EventInstructionsCard
          eventId={eventId}
          instructions={instructions}
          isOrganizer={true}
        />
      </div>
    </div>
  );
}
