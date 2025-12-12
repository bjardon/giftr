"use client";

import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Gift,
  Snowflake,
  Calendar,
  UserPlus,
  Shuffle,
  ChevronDown,
  ArrowDown,
} from "lucide-react";

export default function HomePage() {
  // Mock avatars for the hero illustration
  const participants = [
    { initials: "SJ", color: "bg-purple-500" },
    { initials: "MS", color: "bg-amber-600" },
    { initials: "ES", color: "bg-amber-600" },
    { initials: "DB", color: "bg-purple-500" },
    { initials: "LD", color: "bg-orange-500" },
    { initials: "RW", color: "bg-blue-500" },
  ];

  const userAvatars = [
    { initials: "AB", color: "bg-blue-500" },
    { initials: "CD", color: "bg-green-500" },
    { initials: "EF", color: "bg-pink-500" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-muted-foreground/10">
          <Snowflake className="size-6" />
        </div>
        <div className="absolute top-40 right-20 text-muted-foreground/10">
          <Gift className="size-5 text-red-500/20" />
        </div>
        <div className="absolute bottom-40 left-20 text-muted-foreground/10">
          <Snowflake className="size-8" />
        </div>
        <div className="absolute bottom-20 right-10 text-muted-foreground/10">
          <Gift className="size-4 text-green-500/20" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text and CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-red-600">Giftr</span>
                <br />
                <span className="text-foreground">
                  Una forma sencilla de organizar intercambios de regalos.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Organiza intercambios de regalos con amigos, familia y colegas.
                Sin hojas de cálculo, ni papelitos, ni confusión, solo
                diversión.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Comenzar Gratis
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/events/new">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Comenzar Gratis
                  </Button>
                </Link>
              </SignedIn>
              <Button size="lg" variant="outline" className="gap-2">
                Ver Cómo Funciona
                <ArrowDown className="size-4" />
              </Button>
            </div>

            {/* <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Join thousands organizing Secret Santa events</span>
              <div className="flex -space-x-2">
                {userAvatars.map((avatar, index) => (
                  <Avatar key={index} className="border-2 border-background">
                    <AvatarFallback className={avatar.color}>
                      <span className="text-white text-xs">
                        {avatar.initials}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div> */}
          </div>

          {/* Right Side - Illustration Card */}
          <div className="relative flex justify-center lg:justify-end">
            <Card className="w-full max-w-md relative overflow-visible">
              {/* Festive Border Decoration */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-green-500 to-red-500 rounded-xl opacity-20 blur-sm"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 via-green-400 to-red-400 rounded-xl"></div>

              <CardContent className="relative bg-card rounded-lg p-8 space-y-6">
                <h3 className="text-xl font-bold text-center">
                  Smith Family Christmas
                </h3>

                {/* Circular Avatar Arrangement */}
                <div className="relative w-64 h-64 mx-auto">
                  {/* Gift boxes around the circle */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                    <Gift className="size-5 text-red-500" />
                  </div>
                  <div className="absolute top-1/2 right-0 translate-x-2 -translate-y-1/2">
                    <Gift className="size-4 text-green-500" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                    <Gift className="size-5 text-red-500" />
                  </div>
                  <div className="absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2">
                    <Gift className="size-4 text-green-500" />
                  </div>

                  {/* Participants in circle */}
                  {participants.map((participant, index) => {
                    const angle = (index * 360) / participants.length - 90;
                    const radius = 100;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar>
                          <AvatarFallback className={participant.color}>
                            <span className="text-white text-xs">
                              {participant.initials}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    );
                  })}

                  {/* Center Speech Bubble */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-200 min-w-[140px] text-center">
                      <p className="text-sm font-medium mb-2">
                        You&apos;re buying for:
                      </p>
                      <p className="text-base font-bold">Sarah</p>
                      <div className="flex justify-center mt-2">
                        <Gift className="size-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Todo lo que necesitas
          </h2>
          <p className="text-lg text-muted-foreground">
            Organiza intercambios de regalos con amigos, familia y colegas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="size-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <Calendar className="size-6 text-red-600" />
              </div>
              <CardTitle>Configuración Rápida</CardTitle>
              <CardDescription>
                Crea un evento en minutos con nuestro formulario simple.
                Configura tu presupuesto, fecha y tema con facilidad.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <UserPlus className="size-6 text-green-600" />
              </div>
              <CardTitle>Invitaciones Fáciles</CardTitle>
              <CardDescription>
                Invita a tus participantes via email y rastrea las aceptaciones.
                Envía recordatorios y administra tu lista de invitados sin
                esfuerzo.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="size-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                <Shuffle className="size-6 text-yellow-600" />
              </div>
              <CardTitle>Sorteo Automático</CardTitle>
              <CardDescription>
                Nos encargamos del sorteo aleatorio y el envío de notificaciones
                instantáneas. No requiere trabajo manual.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Gift className="size-6 text-blue-600" />
              </div>
              <CardTitle>Gestión de Wishlist</CardTitle>
              <CardDescription>
                Los participantes pueden agregar artículos a su wishlist para
                ayudar a los participantes a elegir el regalo perfecto.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
