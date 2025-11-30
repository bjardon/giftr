/// <reference path="../../.sst/platform/config.d.ts" />

export async function configureWeb(
  database: ReturnType<
    typeof import("../core/sst.config").configureDatabase
  >["database"]
) {
  const path = await import("path");

  const stage = $app.stage;
  const domain = process.env.DOMAIN!;
  const projectRootPath = path.join(__dirname, "../.."); // Relative to .sst/platform (WTF?)

  const webProject = new vercel.Project(`giftr-${stage}-site`, {
    name: `giftr-${stage}-site`,
    framework: "nextjs",
    rootDirectory: "packages/web",
  });

  const webDomain = new vercel.ProjectDomain(`giftr-${stage}-web-domain`, {
    projectId: webProject.id,
    domain: domain,
  });

  const nextDeploymentFiles = await vercel.getProjectDirectory({
    path: projectRootPath,
  });

  const webDeployment = new vercel.Deployment(`giftr-${stage}-deployment`, {
    projectId: webProject.id,
    production: true,
    files: nextDeploymentFiles.files,
    pathPrefix: projectRootPath, // Strip the leading full path to the project root
    environment: {
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET!,
      DATABASE_URL: process.env.DATABASE_URL!,
      DOMAIN: process.env.DOMAIN!,
      NEON_API_KEY: process.env.NEON_API_KEY!,
      NEON_ORG_ID: process.env.NEON_ORG_ID!,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
      SST_STAGE: process.env.SST_STAGE!,
    },
  });

  const webRecord = new aws.route53.Record(`giftr-${stage}-record`, {
    zoneId: process.env.ROUTE53_ZONE_ID!,
    name: domain,
    type: "CNAME",
    ttl: 300,
    records: [webDeployment.url],
  });

  return {
    webProject,
    webDeployment,
    webRecord,
    webDomainUrn: webDomain.urn,
  };
}
