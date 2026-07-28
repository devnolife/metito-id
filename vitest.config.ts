import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Unit tests live next to the code they cover.
    include: ['lib/**/*.test.ts', 'lib/**/*.spec.ts'],
    environment: 'node',
  },
})
