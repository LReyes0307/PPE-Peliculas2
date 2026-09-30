// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  vite: {
    envPrefix: ['PUBLIC_', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'],
  },
});