"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crown,
  MoreHorizontal,
  MoreVertical,
  Plus,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { AddParticipantModal } from "../dialogs/add-participant-modal";
import {
  joinAsParticipant,
  leaveEvent,
  removeParticipant,
} from "../../actions";
import { toast } from "sonner";

interface Participant {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ParticipantsCardProps {
  eventId: string;
  participants: Participant[];
  organizerId: string;
  currentUserId: string;
  isDrawn: boolean;
}

// Helper function to get avatar color
const getAvatarColor = () => {
  return "bg-accent";
};

export function ParticipantsCard({
  eventId,
  participants,
  organizerId,
  currentUserId,
  isDrawn,
}: ParticipantsCardProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with Radix ID generation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const acceptedCount = participants.filter(
    (p) => p.status === "accepted"
  ).length;
  const totalCount = participants.length;

  // Check if the organizer is currently participating
  const organizerParticipation = participants.find(
    (p) => p.user.id === organizerId
  );
  const isOrganizerParticipating = !!organizerParticipation;

  // Sort participants so current user is always first
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.user.id === currentUserId) return -1;
    if (b.user.id === currentUserId) return 1;
    return 0;
  });

  const handleJoinEvent = () => {
    startTransition(async () => {
      const result = await joinAsParticipant(eventId);
      if (result.success) {
        toast.success("Te has unido al evento como participante");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleLeaveEvent = () => {
    if (!organizerParticipation) return;

    startTransition(async () => {
      const result = await leaveEvent(eventId, organizerParticipation.id);
      if (result.success) {
        toast.success("Has abandonado el evento");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleRemoveParticipant = (participantId: string) => {
    startTransition(async () => {
      const result = await removeParticipant(eventId, participantId);
      if (result.success) {
        toast.success("Participante eliminado");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Participantes
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {acceptedCount} confirmados / {totalCount} invitados
              </p>
            </div>

            {mounted && !isDrawn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="size-5" />
                    <span className="sr-only">Acciones de participantes</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onSelect={() => setAddModalOpen(true)}>
                    <Plus className="size-4" />
                    Agregar participante
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isOrganizerParticipating ? (
                    <DropdownMenuItem
                      onSelect={handleLeaveEvent}
                      disabled={isPending}
                    >
                      <UserMinus className="size-4" />
                      Abandonar como participante
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={handleJoinEvent}
                      disabled={isPending}
                    >
                      <UserPlus className="size-4" />
                      Unirme como participante
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isDrawn && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  disabled
                >
                  <MoreHorizontal className="size-5" />
                </Button>
              )
            )}
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
                            (tú)
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

                  {/* Don't show actions for the organizer's own participation or after draw */}
                  {!isOrganizer && !isDrawn && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            handleRemoveParticipant(participant.id)
                          }
                          disabled={isPending}
                        >
                          Eliminar participante
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}

            {participants.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay participantes todavía. ¡Invita a alguien!
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Los participantes pueden ver a los demás después de aceptar la
            invitación.
          </p>
        </CardContent>
      </Card>

      <AddParticipantModal
        eventId={eventId}
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />
    </>
  );
}
