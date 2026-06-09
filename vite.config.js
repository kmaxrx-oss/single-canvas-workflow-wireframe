import { defineConfig } from 'vite'

export default defineConfig({
  // Tranche 0: minimal. Future versions may add single-file build target for specimen sharing.
  server: {
    port: 5173,
    strictPort: false
  }
})
