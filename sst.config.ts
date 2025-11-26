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
        vercel: "3.15.1",
      },
    };
  },
  async run() {
    const { configureDatabase } = await import("./packages/core/sst.config");
    const { configureFunctions } = await import(
      "./packages/functions/sst.config"
    );
    // Core Services
    const { database } = configureDatabase();
    // API Gateway
    const { api } = configureFunctions(database);
    return {
      database,
      api,
    };
  },
});
