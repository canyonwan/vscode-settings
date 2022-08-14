import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
export default defineConfig({
  test: {
    globals: true,
    // include: ['test/**/*.test.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi']
    },
    transformMode: {
      web: [/\.[jt]sx$/, /\.vue$/]
    }
  }
})
