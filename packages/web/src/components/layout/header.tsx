import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gift } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="size-5 text-red-600" />
            <span className="text-xl font-bold text-red-700">Giftr</span>
          </Link>
          <nav className="flex items-center gap-6">
            <SignedIn>
              <Link
                href="/events"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Mis Eventos
              </Link>
              <Link
                href="/events/new"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Crear Evento
              </Link>
            </SignedIn>
            <SignedOut>
              <Button variant="ghost" asChild>
                <Link href="/sign-up">Registrarse</Link>
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                asChild
              >
                <Link href="/sign-in">Iniciar Sesión</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  );
}
