// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.js',
      name: 'HeyGenAnalytics',
      fileName: () => 'heygen-analytics.min.js',
      formats: ['iife']
    }
  }
});