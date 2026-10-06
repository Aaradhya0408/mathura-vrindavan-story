import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  base: process.env.GITHUB_PAGES === "1" ? "/mathura-vrindavan-story/" : "/",
  plugins: [cesium()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  define: {
    __VITE_ENV__: JSON.stringify(process.env)
  }
});
