import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/zero_gravity_my_own_chartgpt/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
