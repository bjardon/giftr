"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EventInstructionsCardProps {
  eventId: string;
  instructions: string;
  isOrganizer: boolean;
}

export function EventInstructionsCard({
  eventId,
  instructions,
  isOrganizer,
}: EventInstructionsCardProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with Radix ID generation
  useEffect(() => {
    setMounted(true);
  }, []);

  // For now, display raw instructions text
  // TODO: Parse and render TipTap JSON content when editor is integrated
  const hasInstructions = instructions && instructions.trim().length > 0;

  const handleEditInstructions = () => {
    // TODO: Implement edit instructions dialog
    toast.info("Función de editar instrucciones próximamente");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Instrucciones del evento
          </CardTitle>

          {isOrganizer &&
            (mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Acciones de instrucciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={handleEditInstructions}>
                    <Pencil className="size-4" />
                    Editar instrucciones
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                disabled
              >
                <MoreHorizontal className="size-4" />
              </Button>
            ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* TipTap rich text content will render here */}
        <div className="prose prose-sm max-w-none min-h-[100px]">
          {hasInstructions ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {instructions}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No se han proporcionado instrucciones para este evento.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
