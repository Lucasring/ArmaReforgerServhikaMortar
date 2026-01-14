import adapter from '@sveltejs/adapter-node'; // Change this
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // adapter-node respects the 'out' parameter
        adapter: adapter({ out: 'build' }),
    }
};

export default config;