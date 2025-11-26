import { relations } from "drizzle-orm";
import {
  check,
  date,
  decimal,
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizerId: uuid("organizer_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 255 }),
  instructions: text("instructions").notNull(), // JSON string
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  scheduledOn: date("scheduled_on").notNull(),
  scheduledDrawAt: timestamp("scheduled_draw_at"),
  drawnAt: timestamp("drawn_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const participants = pgTable(
  "participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    recipientId: uuid("recipient_id"),
    status: varchar("status", { length: 255 }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (participantsTable) => [
    unique("unique_event_user").on(
      participantsTable.eventId,
      participantsTable.userId
    ),
    check("status_check", sql`status IN ('pending', 'accepted', 'declined')`),
    foreignKey({
      columns: [participantsTable.recipientId],
      foreignColumns: [participantsTable.id],
      name: "fk_participants_recipient_id",
    }),
  ]
);

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id),
  name: varchar("name", { length: 255 }).notNull(),
  link: text("link").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownEvents: many(events),
  participatedEvents: many(participants),
}));

export const eventsRelations = relations(events, ({ many, one }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  participants: many(participants),
}));

export const participantsRelations = relations(
  participants,
  ({ many, one }) => ({
    event: one(events, {
      fields: [participants.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    recipient: one(participants, {
      fields: [participants.recipientId],
      references: [participants.id],
    }),
    wishlistItems: many(wishlistItems),
  })
);

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  participant: one(participants, {
    fields: [wishlistItems.participantId],
    references: [participants.id],
  }),
}));
