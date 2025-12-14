"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DeleteEventDialog } from "../dialogs/delete-event-dialog";
import { EditEventDialog } from "../dialogs/edit-event-dialog";

type EventStatus = "drawn" | "scheduled" | "not started";

interface EventHeaderProps {
  eventId: string;
  title: string;
  topic: string | null;
  budget: string;
  currency: string;
  status: EventStatus;
  isOrganizer: boolean;
}

const statusConfig: Record<EventStatus, { label: string; className: string }> =
  {
    drawn: {
      label: "Sorteado",
      className: "bg-success text-success-foreground border-0",
    },
    scheduled: {
      label: "Programado",
      className: "bg-info text-info-foreground border-0",
    },
    "not started": {
      label: "Sin iniciar",
      className: "bg-muted text-muted-foreground border-0",
    },
  };

export function EventHeader({
  eventId,
  title,
  topic,
  budget,
  currency,
  status,
  isOrganizer,
}: EventHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const statusStyle = statusConfig[status];

  // Prevent hydration mismatch with Radix ID generation
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <Badge className={statusStyle.className}>{statusStyle.label}</Badge>
        </div>

        {isOrganizer &&
          (mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="size-5" />
                  <span className="sr-only">Acciones del evento</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
                  <Pencil className="size-4" />
                  Editar evento
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Eliminar evento
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // SSR placeholder to prevent layout shift
            <Button variant="ghost" size="icon" className="shrink-0" disabled>
              <MoreHorizontal className="size-5" />
              <span className="sr-only">Acciones del evento</span>
            </Button>
          ))}
      </div>

      <EditEventDialog
        eventId={eventId}
        currentTitle={title}
        currentTopic={topic}
        currentBudget={budget}
        currentCurrency={currency}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteEventDialog
        eventId={eventId}
        eventTitle={title}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
