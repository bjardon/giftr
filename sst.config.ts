/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "giftr",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        neon: "0.9.0",
        vercel: {
          version: "3.15.1",
          apiToken: process.env.VERCEL_TOKEN!,
          team: process.env.VERCEL_TEAM_ID!,
        },
      },
    };
  },
  async run() {
    // Core Services
    const { configureDatabase } = await import("./packages/core/sst.config");
    const { database } = configureDatabase();

    // API Gateway
    const { configureFunctions } = await import(
      "./packages/functions/sst.config"
    );
    const { api } = configureFunctions(database);

    // Web
    const { configureWeb } = await import("./packages/web/sst.config");
    const { webProject, webDeployment } = await configureWeb(database);

    return {
      database: database.properties.connectionString,
      api: api.url,
      webProject: webProject.urn,
      webDeployment: webDeployment.url,
    };
  },
});
