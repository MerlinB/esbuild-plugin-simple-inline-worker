/* eslint-env node */
import esbuild from "esbuild";
import findCacheDir from "find-cache-dir";
import fs from "fs";
import path from "path";

export { inlineWorkerPlugin as default };

function inlineWorkerPlugin(extraConfig) {
  return {
    name: "esbuild-plugin-string-worker",

    setup(build) {
      build.onLoad(
        { filter: /\.worker\.(js|jsx|ts|tsx)$/ },
        async ({ path: workerPath }) => {
          let workerCode = await buildWorker(workerPath, extraConfig);
          return {
            contents: `
            export default ${JSON.stringify(workerCode)};`,
            loader: "js",
          };
        }
      );
    },
  };
}

let cacheDir = findCacheDir({
  name: "esbuild-plugin-string-worker",
  create: true,
});

async function buildWorker(workerPath, extraConfig) {
  let scriptNameParts = path.basename(workerPath).split(".");
  scriptNameParts.pop();
  scriptNameParts.push("js");
  let scriptName = scriptNameParts.join(".");
  let bundlePath = path.resolve(cacheDir, scriptName);

  if (extraConfig) {
    delete extraConfig.entryPoints;
    delete extraConfig.outfile;
    delete extraConfig.outdir;
    delete extraConfig.workerName;
  }

  await esbuild.build({
    entryPoints: [workerPath],
    bundle: true,
    minify: true,
    outfile: bundlePath,
    target: "es2017",
    format: "esm",
    ...extraConfig,
  });

  return fs.promises.readFile(bundlePath, { encoding: "utf-8" });
}
