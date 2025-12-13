"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Snowflake, Sparkles } from "lucide-react";
import Link from "next/link";

interface RecipientRevealCardProps {
  eventId: string;
}

export function RecipientRevealCard({ eventId }: RecipientRevealCardProps) {
  return (
    <Card className="relative bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
      <div className="absolute top-2 left-2 text-green-200/50">
        <Snowflake className="size-4" />
      </div>
      <div className="absolute top-2 right-2 text-green-200/50">
        <Snowflake className="size-4" />
      </div>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <Gift className="size-12 text-green-600" />
            <Sparkles className="size-5 text-amber-500 absolute -top-1 -right-1" />
          </div>
        </div>
        <CardTitle className="text-green-800">
          ¡El sorteo se ha realizado!
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-green-700">
          Ya tienes asignado a tu destinatario secreto. Descubre quién es y
          revisa su lista de deseos.
        </p>
        <div className="py-4">
          <p className="text-2xl font-bold text-green-800 blur-sm select-none">
            ??? ??????
          </p>
          <p className="text-xs text-green-600 mt-2">
            Nombre oculto - haz clic en revelar para descubrirlo
          </p>
        </div>
        <Link href={`/events/${eventId}/recipient`} className="block">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Gift className="size-4 mr-2" />
            Revelar destinatario
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

