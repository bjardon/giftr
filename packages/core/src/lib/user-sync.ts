import { db, users } from "../db";
import { eq, or } from "drizzle-orm";

export interface ClerkUser {
  id: string;
  emailAddresses: { email_address: string }[];
  firstName: string | null;
  lastName: string | null;
}

export async function syncUserToDatabase(user: ClerkUser) {
  const email = user.emailAddresses[0]?.email_address;
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || email;

  if (!email) {
    throw new Error("Email is required");
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(or(eq(users.clerkId, user.id), eq(users.email, email)))
    .limit(1);

  if (existingUser) {
    const [updatedUser] = await db
      .update(users)
      .set({
        clerkId: user.id,
        email,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    return updatedUser;
  } else {
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: user.id,
        email,
        name,
      })
      .returning();

    return newUser;
  }
}
