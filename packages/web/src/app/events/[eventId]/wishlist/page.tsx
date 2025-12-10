"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import {
  ArrowLeft,
  Gift,
  Plus,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Info,
  Snowflake,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data - will be replaced with real data later
const eventData = {
  id: "1",
  title: "Smith Family Christmas",
  budget: "$50 USD",
};

const wishlistItems = [
  {
    id: "1",
    title: "Wireless Noise-Canceling Headphones",
    link: "amazon.com/headphones-sony-wh1000xm5",
    store: null,
    notes: "Prefer black or silver color. Size doesn't matter.",
  },
  {
    id: "2",
    title: "Coffee Table Book - Photography",
    link: null,
    store: "Barnes & Noble",
    notes: "Travel photography or architecture themed. Hardcover preferred.",
  },
  {
    id: "3",
    title: "Cozy Throw Blanket",
    link: null,
    store: null,
    notes:
      "Neutral colors like gray, beige, or cream. Soft material like fleece or chenille.",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems);

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-amber-50/50 to-blue-50/50">
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
        <div className="max-w-4xl mx-auto">
          {/* Event Context Bar */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <Link
              href={`/events/${eventData.id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Event
            </Link>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Wishlist for {eventData.title}</span>
              <span>{eventData.budget} budget</span>
            </div>
          </div>

          {/* Page Title and Description */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              My Wishlist
              <Gift className="size-8" />
            </h1>
            <p className="text-muted-foreground text-lg">
              Add items you&apos;d like to receive. Your Secret Santa will see
              this list.
            </p>
          </div>

          {/* Add Item Button */}
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base mb-6">
            <Plus className="size-5 mr-2" />
            Add Item
          </Button>

          {/* Wishlist Items List */}
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <LinkIcon className="size-4" />
                          {item.link ? (
                            <a
                              href={`https://${item.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {item.link}
                            </a>
                          ) : item.store ? (
                            <span>{item.store}</span>
                          ) : (
                            <span className="italic">(No store specified)</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span>{" "}
                          {item.notes}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9"
                        aria-label="Edit item"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete item"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-900">
                    Tips for your wishlist:
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-900 list-disc list-inside">
                    <li>Include links to make shopping easier</li>
                    <li>Add size, color, or style preferences in notes</li>
                    <li>List a few options so your Santa has choices</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
