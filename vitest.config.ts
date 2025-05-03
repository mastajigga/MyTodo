/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import * as react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [(react as any)()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 