import { BuildOptions } from "esbuild";

export default function inlineWorkerPlugin(buildConfig?: BuildOptions): {
  name: "esbuild-plugin-string-worker";
  setup: (build: unknown) => void;
};
