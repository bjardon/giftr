"use client";

import Link from "next/link";
import { Gift, Calendar, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransition } from "react";
import { toast } from "sonner";
import { acceptInvitation, declineInvitation } from "../[eventId]/actions";

interface ParticipantEventCardProps {
  event: {
    id: string;
    title: string;
    topic: string | null;
    scheduledOn: string;
    budget: string;
    currency: string;
    drawnAt: Date | null;
  };
  participantId: string;
  status: string;
}

export function ParticipantEventCard({
  event,
  participantId,
  status,
}: ParticipantEventCardProps) {
  const [isPending, startTransition] = useTransition();

  const isDrawn = !!event.drawnAt;
  const isPendingStatus = status === "pending";

  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptInvitation(event.id, participantId);
      if (result.success) {
        toast.success("¡Invitación aceptada!");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDecline = () => {
    startTransition(async () => {
      const result = await declineInvitation(event.id, participantId);
      if (result.success) {
        toast.success("Invitación rechazada");
      } else {
        toast.error(result.error);
      }
    });
  };

  // Determine card styling based on state
  const cardClassName = isDrawn
    ? "flex flex-col bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
    : "flex flex-col";

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          {/* Hide badge when drawn, show participation status otherwise */}
          {!isDrawn && (
            <Badge
              className={`${
                isPendingStatus
                  ? "bg-yellow-500"
                  : "bg-green-500"
              } text-white border-0`}
            >
              {isPendingStatus ? "Pendiente" : "Aceptado"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gift className="size-4" />
          <span className="text-sm">{event.topic}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" />
          <span className="text-sm">
            {new Date(event.scheduledOn).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="size-4" />
          <span className="text-sm">
            {event.budget} {event.currency}
          </span>
        </div>
        {/* No participant count for participant cards */}
      </CardContent>
      <CardFooter>
        {/* Pending status: show Accept/Decline buttons */}
        {isPendingStatus ? (
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleAccept}
              disabled={isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Aceptar
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isPending}
              variant="outline"
              className="flex-1"
            >
              Rechazar
            </Button>
          </div>
        ) : isDrawn ? (
          /* Drawn: show reveal recipient button */
          <Link href={`/events/${event.id}`} className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Gift className="size-4 mr-2" />
              Descubrir mi destinatario
            </Button>
          </Link>
        ) : (
          /* Accepted: show open event button */
          <Link href={`/events/${event.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Abrir evento
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

