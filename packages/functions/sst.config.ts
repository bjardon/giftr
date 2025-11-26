/// <reference path="../../.sst/platform/config.d.ts" />

export function configureFunctions(
  database: ReturnType<
    typeof import("../core/sst.config").configureDatabase
  >["database"]
) {
  const stage = $app.stage;
  const domain = process.env.DOMAIN;

  const api = new sst.aws.ApiGatewayV2(`giftr-${stage}-api`, {
    domain: `api.${domain}`,
  });

  // Webhooks Service
  api.route("ANY /webhooks/{proxy+}", {
    handler: "packages/functions/src/webhooks/index.handler",
    link: [database],
    environment: {
      DATABASE_URL: database.properties.connectionString,
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET!,
    },
  });

  return {
    api,
  };
}
