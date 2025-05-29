import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
    host: true,
    headers: {}
  },
  optimizeDeps: {
    include: ['svelte']
  },
  build: {
    outDir: '../deployment/build'
  }
});
