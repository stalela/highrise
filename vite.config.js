import { defineConfig } from 'vite'

export default defineConfig({
  // Plain HTML/CSS/JS — no framework plugin needed
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})
