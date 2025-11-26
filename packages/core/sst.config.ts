/// <reference path="../../.sst/platform/config.d.ts" />

export function configureDatabase() {
  const stage = $app.stage;
  const neonOrgId = process.env.NEON_ORG_ID;

  if (!neonOrgId) {
    throw new Error("NEON_ORG_ID is not set");
  }

  const autoscalingLimitMinCu = stage === "production" ? 1 : 0.25;
  const autoscalingLimitMaxCu = stage === "production" ? 2 : 0.25;

  const neonProject = new neon.Project(`giftr-${stage}-neon`, {
    name: `giftr-${stage}`,
    pgVersion: 17,
    regionId: "aws-us-east-1",
    orgId: neonOrgId,
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

  const database = new sst.Linkable(`giftr-${stage}-db`, {
    properties: {
      connectionString: neonProject.connectionUri,
    },
  });

  return { database, neonProject };
}
