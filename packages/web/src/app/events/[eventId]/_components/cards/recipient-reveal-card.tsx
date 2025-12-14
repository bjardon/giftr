"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gift,
  Snowflake,
  Sparkles,
  ExternalLink,
  Store,
  Info,
  Lightbulb,
  ChevronUp,
} from "lucide-react";
import { isUrl } from "@/lib/utils";
import { ConfettiButton } from "@/components/ui/confetti";

interface WishlistItem {
  id: string;
  name: string;
  link: string;
  notes: string | null;
}

interface RecipientRevealCardProps {
  recipientName: string;
  wishlistItems: WishlistItem[];
  budget: string;
}

export function RecipientRevealCard({
  recipientName,
  wishlistItems,
  budget,
}: RecipientRevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isRevealed) {
    // Collapsed state - teaser UI
    return (
      <Card className="relative bg-gradient-to-br from-success/10 to-success/20 border-success/30">
        <div className="absolute top-2 left-2 text-success/30">
          <Snowflake className="size-4" />
        </div>
        <div className="absolute top-2 right-2 text-success/30">
          <Snowflake className="size-4" />
        </div>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Gift className="size-12 text-success" />
              <Sparkles className="size-5 text-warning absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-success">
            ¡El sorteo se ha realizado!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-success">
            Ya tienes asignado a tu destinatario secreto. Descubre quién es y
            revisa su lista de deseos.
          </p>
          <div className="py-4">
            <p className="text-2xl font-bold text-success blur-sm select-none">
              Xxxxx Xxxxxx
            </p>
            <p className="text-xs text-success/80 mt-2">
              Nombre oculto - haz clic en revelar para descubrirlo
            </p>
          </div>
          <ConfettiButton
            onClick={() => setIsRevealed(true)}
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
          >
            <Gift className="size-4 mr-2" />
            Revelar destinatario
          </ConfettiButton>
        </CardContent>
      </Card>
    );
  }

  // Expanded state - recipient info and wishlist
  return (
    <Card className="relative bg-gradient-to-br from-success/10 to-success/20 border-success/30">
      <div className="absolute top-2 left-2 text-success/30">
        <Snowflake className="size-4" />
      </div>
      <div className="absolute top-2 right-2 text-success/30">
        <Snowflake className="size-4" />
      </div>

      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <Gift className="size-12 text-success" />
            <Sparkles className="size-5 text-warning absolute -top-1 -right-1" />
          </div>
        </div>
        <p className="text-sm text-success mb-1">Le compras regalo a:</p>
        <CardTitle className="text-2xl text-success">{recipientName}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Wishlist Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="size-4 text-success" />
            <h3 className="font-semibold text-success">
              Lista de deseos ({wishlistItems.length})
            </h3>
          </div>

          {wishlistItems.length === 0 ? (
            <p className="text-sm text-success text-center py-4">
              {recipientName.split(" ")[0]} no ha agregado artículos a su lista
              de deseos todavía.
            </p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {wishlistItems.map((item, index) => {
                const isLink = isUrl(item.link);
                return (
                  <div
                    key={item.id}
                    className="bg-card/60 rounded-lg p-3 border border-success/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-6 bg-success rounded-full flex items-center justify-center text-success-foreground text-xs font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {item.name}
                        </h4>
                        <div className="mt-1">
                          {isLink ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-success hover:text-success/80 hover:underline flex items-center gap-1"
                            >
                              {new URL(item.link).hostname}
                              <ExternalLink className="size-3" />
                            </a>
                          ) : item.link ? (
                            <div className="text-xs text-success flex items-center gap-1">
                              <Store className="size-3" />
                              {item.link}
                            </div>
                          ) : (
                            <div className="text-xs text-success/80 flex items-center gap-1">
                              <Info className="size-3" />
                              Sin tienda específica
                            </div>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-xs text-success mt-1 line-clamp-2">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gift Shopping Tips */}
        <div className="bg-info/10 border border-info/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="size-4 text-info" />
            <h4 className="font-medium text-foreground text-sm">
              Consejos para comprar
            </h4>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Puedes elegir cualquier artículo de la lista</li>
            <li>Siéntete libre de añadir tu toque personal</li>
            <li>Recuerda el presupuesto de {budget}</li>
          </ul>
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          onClick={() => setIsRevealed(false)}
          className="w-full text-success hover:text-success/80 hover:bg-success/10"
        >
          <ChevronUp className="size-4 mr-2" />
          Ocultar
        </Button>
      </CardContent>
    </Card>
  );
}
