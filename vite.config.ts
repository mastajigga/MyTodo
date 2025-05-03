/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import * as react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [(react as any)()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}) 