/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { createRequire } from 'module'
import tsconfigPaths from 'vite-tsconfig-paths'

const require = createRequire(import.meta.url)
const react = require('@vitejs/plugin-react')

export default defineConfig({
  plugins: [react.default(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**'
      ]
    }
  }
}) 