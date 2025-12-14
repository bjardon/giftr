"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Gift,
  Pencil,
  Plus,
  Snowflake,
  Trash2,
} from "lucide-react";
import { WishlistItemDialog } from "../dialogs/wishlist-item-dialog";
import { DeleteWishlistItemDialog } from "../dialogs/delete-wishlist-item-dialog";
import { isUrl } from "@/lib/utils";

interface WishlistItem {
  id: string;
  name: string;
  link: string;
  notes: string | null;
}

interface WishlistCardProps {
  eventId: string;
  participantId: string;
  wishlistItems: WishlistItem[];
}

export function WishlistCard({
  eventId,
  participantId,
  wishlistItems,
}: WishlistCardProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  const handleEdit = (item: WishlistItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (item: WishlistItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Card className="relative">
        <div className="absolute top-2 left-2 text-muted-foreground/20">
          <Snowflake className="size-4" />
        </div>
        <div className="absolute top-2 right-2 text-muted-foreground/20">
          <Snowflake className="size-4" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="size-5" /> Mi lista de deseos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wishlistItems.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {wishlistItems.map((item) => {
                const isLink = isUrl(item.link);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-md bg-accent/30"
                  >
                    <div className="flex items-center justify-center">
                      <Snowflake className="size-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.link && (
                        <>
                          {isLink ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline block truncate"
                            >
                              {new URL(item.link).hostname}
                              <ExternalLink className="size-2.5 inline-block ml-1" />
                            </a>
                          ) : (
                            <p className="text-xs text-muted-foreground truncate">
                              {item.link}
                            </p>
                          )}
                        </>
                      )}
                      {item.notes && (
                        <p className="text-xs text-muted-foreground">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleEdit(item)}
                        aria-label="Editar artículo"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item)}
                        aria-label="Eliminar artículo"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No has agregado artículos a tu lista de deseos.
            </p>
          )}

          <Button
            onClick={() => setAddDialogOpen(true)}
            className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            <Plus className="size-4 mr-2" />
            Agregar artículo
          </Button>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <WishlistItemDialog
        eventId={eventId}
        participantId={participantId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      {/* Edit Dialog */}
      {selectedItem && (
        <WishlistItemDialog
          eventId={eventId}
          participantId={participantId}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          item={selectedItem}
        />
      )}

      {/* Delete Dialog */}
      {selectedItem && (
        <DeleteWishlistItemDialog
          eventId={eventId}
          itemId={selectedItem.id}
          itemName={selectedItem.name}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  );
}
