import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // include: ['test/**/*.test.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi']
    }
  }
})
