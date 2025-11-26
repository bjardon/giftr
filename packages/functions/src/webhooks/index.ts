import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

import clerkWebhook from "./clerk";

const app = new Hono().basePath("/webhooks");

app.get("/ping", async (c) => {
  return c.json({ message: "pong" });
});

app.route("/clerk", clerkWebhook);

// app.all("*", async (c) => {
//   return c.json(
//     {
//       message: "Catch-all route",
//       path: c.req.path,
//       method: c.req.method,
//       url: c.req.url,
//     },
//     404
//   );
// });

export const handler = handle(app);
