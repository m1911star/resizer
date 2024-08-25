import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: [],
    action: {},
    default_locale: 'en',
  },
  vite: () => ({
    plugins: [react()],
  }),
});
