import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // include: ['test/**/*.test.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'node',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi']
    },
    transformMode: {
      web: [/\.[jt]sx$/, /\.vue$/]
    }
  }
})
