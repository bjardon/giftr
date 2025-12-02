import { db, users } from "../db";
import { eq } from "drizzle-orm";

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

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);

  if (existingUser.length > 0) {
    await db
      .update(users)
      .set({
        email,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, user.id));

    return existingUser[0];
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
