import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://patilsam-001-site1.anytempurl.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
