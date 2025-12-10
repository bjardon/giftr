import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Snowflake } from "lucide-react";
import { EventForm } from "./_components/event-form";

export default function CreateEventPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-amber-50/50 to-blue-50/50">
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
      <div className="absolute top-1/2 left-20 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-5" />
      </div>

      <Container className="py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Crear evento</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Configura un nuevo intercambio de regalos
            </p>
          </CardHeader>
          <CardContent>
            <EventForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
