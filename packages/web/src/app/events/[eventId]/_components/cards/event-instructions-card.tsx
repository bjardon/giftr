"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Pencil, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { updateInstructions } from "../../actions";
import type { JSONContent } from "novel";
import { Label } from "@/components/ui/label";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string>(instructions);
  const [isPending, startTransition] = useTransition();

  // Prevent hydration mismatch with Radix ID generation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Parse instructions as JSON if possible, otherwise null for empty state
  const parsedInstructions = instructions ? tryParseJSON(instructions) : null;
  const hasInstructions = parsedInstructions !== null;

  const handleEditInstructions = () => {
    setEditedContent(instructions);
    setIsEditing(true);
  };

  const handleContentChange = (content: JSONContent) => {
    setEditedContent(JSON.stringify(content));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateInstructions(eventId, editedContent);

      if (result.success) {
        toast.success("Instrucciones actualizadas");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Error al actualizar las instrucciones");
      }
    });
  };

  const handleCancel = () => {
    setEditedContent(instructions);
    setIsEditing(false);
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
            !isEditing &&
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
        {isEditing ? (
          <div className="space-y-4">
            <Label htmlFor="instructions">Instrucciones</Label>
            <textarea
              id="instructions"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[100px] p-2 border border-border rounded-md"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to safely parse JSON
 */
function tryParseJSON(str: string): JSONContent | null {
  try {
    const parsed = JSON.parse(str);
    // Check if it's a valid TipTap/ProseMirror JSON structure
    if (parsed && typeof parsed === "object" && parsed.type) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
