import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, ExternalLink, Gift, Info, Snowflake } from "lucide-react";
import Link from "next/link";

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
  event: {
    id: string;
    title: string;
    organizer: {
      id: string;
      name: string;
    };
    participants: Array<{
      id: string;
      status: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>;
    drawnAt: Date | null;
  };
  userParticipation:
    | {
        recipient?: {
          user?: {
            name: string;
          } | null;
          wishlistItems: Array<{
            id: string;
            name: string;
            link: string;
            notes: string | null;
          }>;
        } | null;
      }
    | null
    | undefined;
}

export function ParticipantView({
  event,
  userParticipation,
}: ParticipantViewProps) {
  const isDrawn = !!event.drawnAt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Column - Placeholder for now */}
      <div className="space-y-6">
        {/* Event info for participants will be added later */}
        <Card className="relative">
          <div className="absolute top-2 left-2 text-muted-foreground/20">
            <Snowflake className="size-4" />
          </div>
          <CardHeader>
            <CardTitle>Detalles del evento</CardTitle>
            <p className="text-sm text-muted-foreground">
              Organizado por {event.organizer.name}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              La vista de participante será implementada próximamente.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Secret Santa Assignment Card */}
        {isDrawn && userParticipation?.recipient?.user && (
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
                {userParticipation.recipient.user.name}
              </p>
              <Link href={`/events/${event.id}/recipient`} className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Gift className="size-4 mr-2" />
                  Ver {userParticipation.recipient.user.name.split(" ")[0]}
                  &apos;s Wishlist
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* My Wishlist Card */}
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
            {(!userParticipation?.recipient?.wishlistItems ||
              userParticipation.recipient.wishlistItems.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No has agregado artículos a tu lista de deseos.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Other Participants Card */}
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
                {event.participants.length} participantes
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

        {/* Info Banner */}
        {isDrawn && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Los nombres han sido sorteados! Revisa tu asignación arriba para
              ver a quién estás comprando.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

