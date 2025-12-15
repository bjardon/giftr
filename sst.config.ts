/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "giftr",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          //   accessKey: process.env.AWS_ACCESS_KEY_ID!,
          //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
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
    const stage = $app.stage;
    const path = await import("path");
    const projectRootPath = path.join(__dirname, "../.."); // Relative to .sst/platform (WTF?)

    // CORE SERVICES
    // #region Core Services

    // - Neon Database
    const autoscalingLimitMinCu = stage === "production" ? 1 : 0.25;
    const autoscalingLimitMaxCu = stage === "production" ? 2 : 0.25;

    const neonProject = new neon.Project(`NeonProject`, {
      name: `giftr-${stage}`,
      pgVersion: 17,
      regionId: "aws-us-east-1",
      orgId: process.env.NEON_ORG_ID!,
      historyRetentionSeconds: 21600,
      branch: {
        name: stage,
        databaseName: `giftr-${stage}-db`,
      },
      defaultEndpointSettings: {
        autoscalingLimitMinCu,
        autoscalingLimitMaxCu,
      },
    });

    const database = new sst.Linkable(`Database`, {
      properties: {
        connectionString: neonProject.connectionUri,
      },
    });

    // #endregion Core Services

    // EVENT BUS
    // #region Event Bus

    const bus = new sst.aws.Bus("EventBus");

    // - Draw Handler
    const drawSubscription = bus.subscribe(
      "Draw",
      {
        handler: "packages/functions/src/events/draw/index.handler",
        link: [database],
        environment: {
          DATABASE_URL: database.properties.connectionString,
        },
      },
      {
        pattern: {
          detailType: ["Event.Draw"],
        },
      }
    );

    // #endregion Event Bus

    // API GATEWAY
    // #region API Gateway

    const api = new sst.aws.ApiGatewayV2(`ApiGateway`, {
      domain: `api.${process.env.DOMAIN!}`,
    });

    // - Webhooks Service
    const webhooksRoute = api.route("ANY /webhooks/{proxy+}", {
      handler: "packages/functions/src/webhooks/index.handler",
      link: [database],
      environment: {
        DATABASE_URL: database.properties.connectionString,
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET!,
      },
    });

    // #endregion API Gateway

    // WEB APP
    // #region Web App

    const webProject = new vercel.Project(`giftr-${stage}-site`, {
      name: `giftr-${stage}-site`,
      framework: "nextjs",
      rootDirectory: "packages/web",
    });

    const webDomain = new vercel.ProjectDomain(`giftr-${stage}-web-domain`, {
      projectId: webProject.id,
      domain: process.env.DOMAIN!,
    });

    const nextDeploymentFiles = await vercel.getProjectDirectory({
      path: projectRootPath,
    });

    const webDeployment = new vercel.Deployment(`giftr-${stage}-deployment`, {
      projectId: webProject.id,
      production: true, // Enable production deployment even if stage is not production
      files: nextDeploymentFiles.files,
      pathPrefix: projectRootPath, // Strip the leading full path to the project root
      environment: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET!,
        DATABASE_URL: database.properties.connectionString,
        EVENT_BUS_NAME: bus.name,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
      },
    });

    const webRecord = new aws.route53.Record(`giftr-${stage}-record`, {
      zoneId: process.env.ROUTE53_ZONE_ID!,
      name: process.env.DOMAIN!,
      type: "CNAME",
      ttl: 300,
      records: [webDeployment.url],
    });

    // #endregion Web App

    return {
      "database.connectionString": database.properties.connectionString,
      "eventBus.name": bus.name,
      "api.url": api.url,
      "api.webhooksRoute": webhooksRoute.urn,
      "webApp.project": webProject.id,
      "webApp.deployment": webDeployment.id,
      "webApp.dnsRecord": webRecord.id,
      "webApp.url": webDomain.domain,
    };
  },
});
