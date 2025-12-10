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
import type { events, participants as participantsTable } from "@giftr/core/db";

export async function EventCard({
  event,
  participants = [],
}: {
  event: typeof events.$inferSelect;
  participants: (typeof participantsTable.$inferSelect)[];
}) {
  const status = event.drawnAt ? "Sorteado" : "No Sorteado";
  const statusColor = event.drawnAt ? "bg-green-500" : "bg-red-500";

  const pending = participants.filter(
    (participant) => participant.status === "pending"
  ).length;
  const accepted = participants.filter(
    (participant) => participant.status === "accepted"
  ).length;

  return (
    <Card key={event.id} className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge className={`${statusColor} text-white border-0`}>
            {status}
          </Badge>
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
          </span>{" "}
          {/* TODO: format currency */}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="size-4" />
          <span className="text-sm">
            {participants.length} participantes
            {pending > 0
              ? ` • ${accepted} aceptados, ${pending} pendientes`
              : ` • ${accepted} aceptados`}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/events/${event.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Gestionar Evento
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
