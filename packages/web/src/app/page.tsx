"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Gift, Snowflake, Calendar, UserPlus, Shuffle } from "lucide-react";

export default function HomePage() {
  // Mock avatars for the hero illustration
  const participants = [
    { initials: "SJ", color: "bg-accent" },
    { initials: "MS", color: "bg-accent" },
    { initials: "ES", color: "bg-accent" },
    { initials: "DB", color: "bg-accent" },
    { initials: "LD", color: "bg-accent" },
    { initials: "RW", color: "bg-accent" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-muted-foreground/10">
          <Snowflake className="size-6" />
        </div>
        <div className="absolute top-40 right-20 text-muted-foreground/10">
          <Gift className="size-5 text-brand/20" />
        </div>
        <div className="absolute bottom-40 left-20 text-muted-foreground/10">
          <Snowflake className="size-8" />
        </div>
        <div className="absolute bottom-20 right-10 text-muted-foreground/10">
          <Gift className="size-4 text-success/20" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text and CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-brand">Giftr</span>
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
                <Button
                  size="lg"
                  className="bg-brand hover:bg-brand/90 text-brand-foreground"
                  asChild
                >
                  <Link href="/sign-up">Comenzar Gratis</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  className="bg-brand hover:bg-brand/90 text-brand-foreground"
                  asChild
                >
                  <Link href="/events/new">Comenzar Gratis</Link>
                </Button>
              </SignedIn>
              {/* <Button size="lg" variant="outline" className="gap-2">
                Ver Cómo Funciona
                <ArrowDown className="size-4" />
              </Button> */}
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
            <Image
              src="/illustration.svg"
              alt="Giftr"
              width={500}
              height={500}
            />
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
              <div className="size-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                <Calendar className="size-6 text-brand" />
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
              <div className="size-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <UserPlus className="size-6 text-success" />
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
              <div className="size-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Shuffle className="size-6 text-warning" />
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
              <div className="size-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                <Gift className="size-6 text-info" />
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
