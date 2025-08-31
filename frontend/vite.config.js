import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: './',
    server: {
      proxy: {
        '/api': 'https://aidlink-trial.onrender.com/',
        changeOrigin: true,
        secure: false
      }
    }
  })
