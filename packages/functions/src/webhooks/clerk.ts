import { Hono } from "hono";
import { Webhook } from "svix";
import { syncUserToDatabase } from "@giftr/core";

const app = new Hono();

app.post("/", async (c) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return c.json({ error: "CLERK_WEBHOOK_SECRET is not set" }, 500);
  }

  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: "Missing svix headers" }, 400);
  }

  const payload = await c.req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    return c.json({ error: "Invalid svix signature" }, 400);
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      await syncUserToDatabase({
        id,
        emailAddresses: email_addresses,
        firstName: first_name,
        lastName: last_name,
      });
    } catch (err) {
      return c.json({ error: "Failed to sync user to database" }, 500);
    }
  }

  return c.json({ received: true }, 200);
});

export default app;
