import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Samakan dengan alias "@/*" pada tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Unit tests live next to the code they cover.
    // Integration tests need a real database and are opt-in via RUN_DB_TESTS=1.
    include: ['src/lib/**/*.test.ts', 'src/lib/**/*.spec.ts'],
    environment: 'node',
  },
})
