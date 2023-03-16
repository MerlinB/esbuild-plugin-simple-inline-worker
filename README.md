# esbuild-plugin-string-worker

This is a plugin for [esbuild](https://esbuild.github.io) which allows you to import `.worker.js` files to get the constructor for a Web Worker, similar to [worker-loader](https://github.com/webpack-contrib/worker-loader) for Webpack.

```sh
yarn add esbuild-plugin-string-worker
```

Example:

```js
// example.worker.js
postMessage("hello from worker!");
```

```js
// example.js
import Worker from "./example.worker.js";

const blob = new Blob([Worker], { type: "text/javascript" });
const worker = new Worker(URL.createObjectURL(blob));

worker.onmessage = ({ data }) => console.log(data);
```

## Usage

```js
import { build } from "esbuild";
import inlineWorkerPlugin from "esbuild-plugin-string-worker";

build({
  /* ... */
  plugins: [inlineWorkerPlugin()],
});
```

## Build configuration

Optionally, you can pass a configuration object which has the same interface as esbuild's [build API](https://esbuild.github.io/api/#build-api), which determines how the worker code is bundled:

```js
inlineWorkerPlugin(extraConfig);
```

This is how your custom config is used internally:

```js
if (extraConfig) {
  delete extraConfig.entryPoints;
  delete extraConfig.outfile;
  delete extraConfig.outdir;
}

await esbuild.build({
  entryPoints: [workerPath],
  bundle: true,
  minify: true,
  outfile: bundlePath,
  target: "es2017",
  format: "esm",
  ...extraConfig, // <-- your config can override almost everything
});
```
