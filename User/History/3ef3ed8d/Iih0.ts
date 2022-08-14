import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // include: ['test/**/*.test.ts'],
    include: ['*.test.ts'],
    environment: 'node',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi']
    }
  }
})
