import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Snowflake } from "lucide-react";

interface AssignmentCardProps {
  recipientName: string | undefined;
  isDrawn: boolean;
  isParticipating: boolean;
}

export function AssignmentCard({
  recipientName,
  isDrawn,
  isParticipating,
}: AssignmentCardProps) {
  // Only show if event is drawn AND user is participating
  if (!isDrawn || !isParticipating) {
    return null;
  }

  // If no recipient assigned yet (shouldn't happen if drawn, but be safe)
  if (!recipientName) {
    return (
      <Card className="relative bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tu asignación aún no está disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
      {/* Decorative snowflakes */}
      <div className="absolute top-2 left-2 text-green-200/50">
        <Snowflake className="size-4" />
      </div>
      <div className="absolute top-2 right-2 text-green-200/50">
        <Snowflake className="size-4" />
      </div>

      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-green-100 p-3">
            <Gift className="size-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-lg">Tu asignación de Secret Santa</CardTitle>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Estás comprando un regalo para:
        </p>
        <p className="text-3xl font-bold text-foreground">{recipientName}</p>
      </CardContent>
    </Card>
  );
}





