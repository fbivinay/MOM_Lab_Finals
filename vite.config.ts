import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ponytail: one ~170 kB (gzip) bundle on purpose so every scene is ready offline once loaded; split per section if it grows past ~300 kB.
  build: { chunkSizeWarningLimit: 700 },
})
