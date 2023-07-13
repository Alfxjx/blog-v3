/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import packageJson from './package.json';

const getPackageName = () => {
  return packageJson.name;
};

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'core',
      formats,
      fileName: format => fileName[format],
    },
  },
  test: {},
  plugins: [
    nodePolyfills({
      protocolImports: true,
    }),
  ],
});
