/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

const getPackageName = () => {
  return packageJson.name;
};

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

export default defineConfig({
  base: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'core',
      formats,
      fileName: format => fileName[format],
    },
    rollupOptions: {
      external: ['node:fs', 'node:path'],
    },
  },
  test: {},
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
