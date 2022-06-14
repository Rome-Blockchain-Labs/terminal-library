import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";

const packageJson = require('./package.json');

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        exclude: [
          // Storybook stories
          /\.stories.((js|jsx|ts|tsx|mdx))$/,
          // Mock files
          /\.mock.((js|ts))$/
        ],
        tsconfig: "./tsconfig.json"
      }),
      postcss(),
      json(),
      terser()
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/]
  },
];