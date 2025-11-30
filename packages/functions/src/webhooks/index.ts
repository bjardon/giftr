import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

import clerkWebhook from "./clerk";

const app = new Hono().basePath("/webhooks");
app.route("/clerk", clerkWebhook);

export const handler = handle(app);
