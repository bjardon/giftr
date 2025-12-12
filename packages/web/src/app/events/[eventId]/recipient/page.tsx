"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import {
  Gift,
  MapPin,
  Lightbulb,
  Store,
  ExternalLink,
  Info,
  ArrowLeft,
  Snowflake,
} from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with real data later
const eventData = {
  id: "1",
  title: "Smith Family Christmas",
  budget: "$50 USD",
  date: "December 25, 2024",
};

const recipient = {
  name: "Michael Smith",
  address: {
    name: "Michael Smith",
    line1: "123 Pine Street, Apt 48",
    city: "Boston",
    state: "MA",
    zip: "02108",
    country: "United States",
  },
};

const wishlistItems = [
  {
    id: "1",
    number: 1,
    title: "Wireless Noise-Canceling Headphones",
    link: "amazon.com/headphones-sony-wh1000xm5",
    store: null,
    notes: "Prefer black or silver color. Size doesn't matter.",
  },
  {
    id: "2",
    number: 2,
    title: "Coffee Table Book - Photography",
    link: null,
    store: "Barnes & Noble",
    notes: "Travel photography or architecture themed. Hardcover preferred.",
  },
  {
    id: "3",
    number: 3,
    title: "Cozy Throw Blanket",
    link: null,
    store: null,
    notes:
      "Neutral colors like gray, beige, or cream. Soft material like fleece or chenille.",
  },
];

export default function RecipientPage() {
  return (
    <div className="relative min-h-screen">
      {/* Decorative snowflakes */}
      <div className="absolute top-20 right-10 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-8" />
      </div>
      <div className="absolute top-1/3 left-10 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-6" />
      </div>
      <div className="absolute bottom-20 right-20 text-muted-foreground/10 text-4xl pointer-events-none select-none">
        <Snowflake className="size-7" />
      </div>

      <Container className="py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Recipient Information Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Gift className="size-16 text-red-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-lg mb-2">
                You&apos;re buying a gift for:
              </p>
              <h1 className="text-4xl font-bold">{recipient.name}</h1>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge className="bg-green-500 text-white border-0 px-4 py-1.5">
                <span className="font-semibold">EVENT:</span> {eventData.title}
              </Badge>
              <Badge className="bg-green-500 text-white border-0 px-4 py-1.5">
                <span className="font-semibold">BUDGET:</span>{" "}
                {eventData.budget}
              </Badge>
              <Badge className="bg-green-500 text-white border-0 px-4 py-1.5">
                <span className="font-semibold">EVENT DATE:</span>{" "}
                {eventData.date}
              </Badge>
            </div>
          </div>

          {/* Shipping Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-red-600" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{recipient.address.name}</p>
                <p>{recipient.address.line1}</p>
                <p>
                  {recipient.address.city}, {recipient.address.state}{" "}
                  {recipient.address.zip}
                </p>
                <p>{recipient.address.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="size-6 text-red-600" />
              <h2 className="text-2xl font-bold">
                {recipient.name.split(" ")[0]}&apos;s Wishlist
              </h2>
              <span className="text-muted-foreground">
                {wishlistItems.length} items
              </span>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="relative">
                  {/* Numbered Circle */}
                  <div className="absolute -top-3 -left-3 size-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.number}
                  </div>
                  <CardContent className="p-6 pt-8">
                    <h3 className="font-bold text-lg mb-4">{item.title}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Where to buy:
                        </p>
                        {item.link ? (
                          <a
                            href={`https://${item.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {item.link}
                            <ExternalLink className="size-3" />
                          </a>
                        ) : item.store ? (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Store className="size-4" />
                            {item.store}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Info className="size-4" />
                            No specific store mentioned - your choice!
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Notes:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.notes}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gift Shopping Tips Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Lightbulb className="size-5 text-blue-600" />
                Gift Shopping Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-900 list-disc list-inside">
                <li>You can choose any item from the list</li>
                <li>Feel free to add your own creative touch</li>
                <li>Keep the {eventData.budget} budget in mind</li>
              </ul>
            </CardContent>
          </Card>

          {/* Bottom Navigation */}
          <div className="flex justify-center pt-4">
            <Link href={`/events/${eventData.id}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="size-4" />
                Back to Event Details
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
