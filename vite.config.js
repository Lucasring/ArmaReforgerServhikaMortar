import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte()
  ],
  server: {
    port: 3000,
    host: true, // This allows external access
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/javascript'
    }
  },
  optimizeDeps: {
    include: ['svelte']
  }
});