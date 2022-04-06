import { defineConfig } from "tsup";

const commonConfig = {
  clean: true,
  splitting: false,
  dts: true,
  sourcemap: true,
};
export default defineConfig([
  {
    entry: ["./src/index.tsx"],
    ...commonConfig,
    format: ["esm"],
    outDir: "dist/",
  },
]);
