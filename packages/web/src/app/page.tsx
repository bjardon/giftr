import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function HomePage() {
  return (
    <Container className="py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Secret Santa Made Easy
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Organize gift exchanges, manage wishlists, and draw names automatically.
            All in one beautiful app.
          </p>
        </div>

        <SignedOut>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/events/new">Create Your First Event</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events">View My Events</Link>
            </Button>
          </div>
        </SignedIn>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Easy Setup</CardTitle>
              <CardDescription>
                Create an event in minutes with our simple interface
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Automatic Draws</CardTitle>
              <CardDescription>
                Schedule or manually trigger name draws with one click
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Wishlist Management</CardTitle>
              <CardDescription>
                Share your wishlist and see what others want
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Container>
  );
}
