/// <reference path="../../.sst/platform/config.d.ts" />

export function configureWeb(
  database: ReturnType<
    typeof import("../core/sst.config").configureDatabase
  >["database"]
) {
  const stage = $app.stage;
  const domain = process.env.DOMAIN!;

  const site = new vercel.Project(`giftr-${stage}-site`, {
    name: `giftr-${stage}-site`,
    framework: "nextjs",
  });
}
