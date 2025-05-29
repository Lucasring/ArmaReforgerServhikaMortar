// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      hot: false    // ← disable HMR entirely
    })
  ],
  server: { port: 3000, host: true },
  build: { outDir: '../deployment/build' }
});
