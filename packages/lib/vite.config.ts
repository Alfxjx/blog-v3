import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';


const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolvePath("src/index.ts"),
      name: "lib",
      fileName: format => `lib.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "react",
          "react-dom": "react-dom",
        },
      },
    },
  }
})
