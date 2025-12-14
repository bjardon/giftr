"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Check,
  DollarSign,
  Gift,
  MoreHorizontal,
  Power,
  PowerOff,
  RefreshCw,
  Shuffle,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScheduleDrawDialog } from "../dialogs/schedule-draw-dialog";
import { DisableDrawDialog } from "../dialogs/disable-draw-dialog";

interface EventInfoCardProps {
  eventId: string;
  topic: string | null;
  scheduledOn: string;
  budget: string;
  currency: string;
  drawnAt: Date | null;
  scheduledDrawAt: Date | null;
  isOrganizer: boolean;
  organizerName?: string;
}

export function EventInfoCard({
  eventId,
  topic,
  scheduledOn,
  budget,
  currency,
  drawnAt,
  scheduledDrawAt,
  isOrganizer,
  organizerName,
}: EventInfoCardProps) {
  const [mounted, setMounted] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);

  // Prevent hydration mismatch with Radix ID generation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const formattedDate = format(parseISO(scheduledOn), "d 'de' MMMM, yyyy", {
    locale: es,
  });

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "CA$",
    AUD: "A$",
    MXN: "$",
  };

  const symbol = currencySymbols[currency] || currency;

  const isDrawn = !!drawnAt;
  const hasScheduledDraw = !!scheduledDrawAt;

  const handleRedraw = () => {
    // TODO: Implement redraw
    toast.info("Función de volver a sortear próximamente");
  };

  return (
    <>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* Event Date */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Fecha del evento
                </span>
              </div>
              <p className="font-semibold">{formattedDate}</p>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Presupuesto
                </span>
              </div>
              <p className="font-semibold">
                {symbol}
                {parseFloat(budget).toLocaleString()} {currency}
              </p>
            </div>

            {/* Topic */}
            {topic && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gift className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Tema
                  </span>
                </div>
                <p className="font-semibold">{topic}</p>
              </div>
            )}

            {/* Organizer (participant only) */}
            {!isOrganizer && organizerName && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Organizador
                  </span>
                </div>
                <p className="font-semibold">{organizerName}</p>
              </div>
            )}

            {/* Draw Status (organizer only) */}
            {isOrganizer && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shuffle className="size-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {isDrawn ? "Sorteado" : "Sorteo automático"}
                    </span>
                  </div>

                  {mounted ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 -mr-1"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Acciones de sorteo</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        {isDrawn ? (
                          // Event has been drawn - show redraw option
                          <DropdownMenuItem onSelect={handleRedraw}>
                            <RefreshCw className="size-4" />
                            Volver a sortear
                          </DropdownMenuItem>
                        ) : hasScheduledDraw ? (
                          // Has scheduled draw - show update and disable options
                          <>
                            <DropdownMenuItem
                              onSelect={() => setScheduleDialogOpen(true)}
                            >
                              <Calendar className="size-4" />
                              Actualizar fecha de sorteo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setDisableDialogOpen(true)}
                            >
                              <PowerOff className="size-4" />
                              Desactivar sorteo automático
                            </DropdownMenuItem>
                          </>
                        ) : (
                          // No scheduled draw - show enable option
                          <DropdownMenuItem
                            onSelect={() => setScheduleDialogOpen(true)}
                          >
                            <Power className="size-4" />
                            Activar sorteo automático
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 -mr-1"
                      disabled
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isDrawn ? (
                    <>
                      <Check className="size-4 text-success" />
                      <p className="font-semibold">
                        {format(drawnAt, "d MMM yyyy, HH:mm", { locale: es })}
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold">
                      {scheduledDrawAt
                        ? format(scheduledDrawAt, "d MMM yyyy, HH:mm", {
                            locale: es,
                          })
                        : "Apagado"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ScheduleDrawDialog
        eventId={eventId}
        currentScheduledAt={scheduledDrawAt}
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
      />

      <DisableDrawDialog
        eventId={eventId}
        open={disableDialogOpen}
        onOpenChange={setDisableDialogOpen}
      />
    </>
  );
}
