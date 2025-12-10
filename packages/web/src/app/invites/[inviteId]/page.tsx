"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Snowflake } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data - will be replaced with real data later
const inviteData = {
  inviteId: "1",
  organizer: "Sarah Johnson",
  event: {
    title: "Smith Family Christmas 2024",
    theme: "White Elephant",
    date: "December 25, 2024",
    budget: "$50 USD",
  },
};

export default function InvitePage() {
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">(
    "pending"
  );

  const handleAccept = () => {
    setStatus("accepted");
    // TODO: Implement API call to accept invitation
  };

  const handleDecline = () => {
    setStatus("declined");
    // TODO: Implement API call to decline invitation
  };

  if (status === "accepted") {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <Gift className="size-12 text-red-600 mx-auto" />
            <h1 className="text-2xl font-bold">Invitation Accepted!</h1>
            <p className="text-muted-foreground">
              You&apos;ve successfully joined {inviteData.event.title}
            </p>
            <Link href={`/events/${inviteData.inviteId}`}>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Go to Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold">Invitation Declined</h1>
            <p className="text-muted-foreground">
              You&apos;ve declined the invitation to {inviteData.event.title}
            </p>
            <Link href="/events">
              <Button variant="outline" className="w-full">
                Back to Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Giftr Logo (top-left, outside card) */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-700">Giftr</span>
            <Snowflake className="size-5 text-amber-500" />
          </Link>
        </div>

        {/* Invitation Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Gift className="size-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  You&apos;re Invited!
                </h1>
                <p className="text-muted-foreground">
                  {inviteData.organizer} invited you to join a Secret Santa
                  event
                </p>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-blue-100/50 rounded-lg p-6 space-y-4 relative">
              {/* Green Snowflakes */}
              <div className="flex justify-center gap-2 absolute -top-3 left-1/2 -translate-x-1/2">
                <Snowflake className="size-4 text-green-500" />
                <Snowflake className="size-4 text-green-500" />
                <Snowflake className="size-4 text-green-500" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">EVENT:</span>
                  <span className="text-sm font-bold text-foreground">
                    {inviteData.event.title}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">THEME:</span>
                  <span className="text-sm font-bold text-foreground">
                    {inviteData.event.theme}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    EVENT DATE:
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {inviteData.event.date}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">BUDGET:</span>
                  <span className="text-sm font-bold text-foreground">
                    {inviteData.event.budget}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Accept Invitation
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1"
              >
                No Thanks
              </Button>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-muted-foreground text-center">
              By accepting, you&apos;ll be able to add items to your wishlist
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
