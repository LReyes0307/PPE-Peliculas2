// @ts-check
// Configura Vue y el renderizado SSR de Astro sobre Cloudflare Workers.
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [vue()],
  vite: {
    envPrefix: ['PUBLIC_', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'],
  },
});